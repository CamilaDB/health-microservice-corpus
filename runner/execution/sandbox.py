from pathlib import Path
import re
import shutil

from config import GENERATED_DIR, CORPUS_DIR
from utils.logging import logger

# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────

APPEND_MARKER = "// TESTS_APPEND_HERE"


# ─────────────────────────────────────────────────────────────────────────────
# Function ID — deterministic describe wrapper name
# ─────────────────────────────────────────────────────────────────────────────

def make_fn_id(function_name: str) -> str:
    """
    Generates a deterministic, collision-free identifier for a function's
    outer describe wrapper.

    Format: FN_{function_name}_END

    The _END suffix prevents substring ambiguity when used as a Jest
    --testNamePattern: "FN_searchOrders_END" does not match
    "FN_searchOrdersAdvanced_END", unlike a bare "FN_searchOrders".
    The same token is used as the describe() title for AST-based
    repair/skip scoping.
    """
    return f"FN_{function_name}_END"


# ─────────────────────────────────────────────────────────────────────────────
# Spec file creation
# ─────────────────────────────────────────────────────────────────────────────

def create_spec_file(
    model: str,
    strategy: str,
    test_output_file: str,
    content: str,
) -> Path:
    normalized = normalize_content(content)

    generated_path = GENERATED_DIR / strategy / model / test_output_file
    generated_path.parent.mkdir(parents=True, exist_ok=True)
    generated_path.write_text(normalized, encoding="utf-8")

    return generated_path


# ─────────────────────────────────────────────────────────────────────────────
# Test block appending
# ─────────────────────────────────────────────────────────────────────────────

def append_test_block(
    *,
    spec_file: Path,
    content: str,
    fn_id: str,
) -> None:
    """
    Appends the generated test block wrapped in a deterministic outer
    describe(fn_id, ...) so that:

      1. Jest --testNamePattern=<fn_id> isolates execution to this function.
      2. extract_failed_test_block / patch_test_block can scope AST searches
         to this describe, avoiding collisions when different functions
         generate it() blocks with identical titles.

    The resulting spec structure for a service with two functions:

        describe('PatientService', () => {          ← bootstrap root
          // ... shared setup ...

          describe('FN_getPatientById_END', () => { ← our wrapper (fn_id)
            describe('getPatientById', () => {      ← LLM's describe
              it('should return a patient', ...)
            });
          });

          describe('FN_listPatients_END', () => {
            describe('listPatients', () => {
              it('should return all patients', ...)
            });
          });
        });

    NOTE: _whole_file_repair sends the complete spec to the LLM for repair.
    The repair system prompt MUST instruct the model to preserve
    describe('FN_..._END', ...) wrappers unchanged. Failing to do so will
    silently break testNamePattern isolation for subsequent iterations.
    """
    cleaned = clean_generated_block(content)

    if not cleaned.strip():
        logger.warning("append_test_block: empty block after cleaning, skipping")
        return

    # Wrap in deterministic outer describe
    wrapped = f"describe('{fn_id}', () => {{\n{cleaned}\n}});"

    current = spec_file.read_text(encoding="utf-8")

    if APPEND_MARKER not in current:
        logger.warning("append_test_block: marker not found, appending at end")
        spec_file.write_text(current.rstrip() + f"\n\n{wrapped}\n", encoding="utf-8")
        return

    updated = current.replace(
        APPEND_MARKER,
        f"{wrapped}\n\n  {APPEND_MARKER}",
    )

    spec_file.write_text(updated, encoding="utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# Content normalization
# ─────────────────────────────────────────────────────────────────────────────

def normalize_content(content: str) -> str:
    """Strips markdown fences and ensures a single trailing newline."""
    content = content.strip()

    for fence in ("```typescript", "```ts", "```"):
        if content.startswith(fence):
            content = content[len(fence):]
            break

    if content.endswith("```"):
        content = content[:-3]

    return content.strip() + "\n"


# ─────────────────────────────────────────────────────────────────────────────
# Truncation repair helpers
# ─────────────────────────────────────────────────────────────────────────────

def count_unclosed_scopes(block: str) -> tuple[int, int, int]:
    """
    Returns:
      (unclosed_braces, unclosed_parens, unclosed_brackets)
    """
    braces = parens = brackets = 0
    in_string = False
    string_char = None
    escape = False

    for c in block:
        if in_string:
            if escape:
                escape = False
                continue
            if c == "\\":
                escape = True
                continue
            if c == string_char:
                in_string = False
            continue

        if c in ("'", '"', "`"):
            in_string = True
            string_char = c
            continue

        if c == "{":
            braces += 1
        elif c == "}":
            braces -= 1
        elif c == "(":
            parens += 1
        elif c == ")":
            parens -= 1
        elif c == "[":
            brackets += 1
        elif c == "]":
            brackets -= 1

    return (max(0, braces), max(0, parens), max(0, brackets))


def _remove_last_incomplete_test(block: str) -> str:
    matches = list(re.finditer(r"^\s*it\s*\(", block, re.MULTILINE))
    if not matches:
        return block
    for i in reversed(range(len(matches))):
        start = matches[i].start()
        tail = block[start:]
        if tail.count("{") > tail.count("}"):
            trimmed = block[:start].rstrip()
            logger.warning(
                f"_remove_last_incomplete_test: dropped incomplete it() at offset {start}"
            )
            return trimmed
    return block


# ─────────────────────────────────────────────────────────────────────────────
# Block validation and cleaning
# ─────────────────────────────────────────────────────────────────────────────

FORBIDDEN_BLOCK_PATTERNS: list[tuple[str, str, bool]] = [
    (r"import\s+\{[^}]+\}\s+from\s", "import statement in block", True),
    (r"import\s+\w+\s+from\s",       "import statement in block", True),
    (r"\bbeforeAll\s*\(",            "beforeAll in block",        True),
    (r"\bafterAll\s*\(",             "afterAll in block",         True),
]


def validate_generated_block(block: str) -> bool:
    if not block or not block.strip():
        logger.warning("validate_generated_block: empty block")
        return False

    for pattern, description, discard in FORBIDDEN_BLOCK_PATTERNS:
        if re.search(pattern, block):
            logger.warning(
                f"validate_generated_block: forbidden pattern '{description}' found"
                + (" — discarding block" if discard else " — warning only")
            )
            if discard:
                return False

    if "describe(" not in block:
        logger.warning("validate_generated_block: missing describe() block")
        return False

    b, p, a = count_unclosed_scopes(block)
    if b or p or a:
        logger.warning(
            f"validate_generated_block: unclosed scopes {{={b} (={p} [={a}"
        )
        return False

    return True


def clean_generated_block(content: str) -> str:
    content = content.strip()
    for fence in ("```typescript", "```ts", "```"):
        if content.startswith(fence):
            content = content[len(fence):]
            break
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    lines = content.splitlines()
    filtered: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("import ") and " from " in stripped:
            logger.warning(f"clean_generated_block: removed import: {stripped[:80]}")
            continue
        filtered.append(line)

    return "\n".join(filtered).strip()


# ─────────────────────────────────────────────────────────────────────────────
# Temp spec install / remove
# ─────────────────────────────────────────────────────────────────────────────

def install_temp_spec(
    generated_file: Path,
    relative_output_path: str,
) -> Path:
    target = CORPUS_DIR / relative_output_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(generated_file, target)
    return target


def remove_temp_spec(target: Path) -> None:
    if target.exists():
        target.unlink()


# ─────────────────────────────────────────────────────────────────────────────
# Append marker
# ─────────────────────────────────────────────────────────────────────────────

def ensure_append_marker(spec_content: str) -> str:
    if APPEND_MARKER in spec_content:
        return spec_content

    bootstrap_end = "// AUTO-GENERATED-BOOTSTRAP-END"
    if bootstrap_end in spec_content:
        return spec_content.replace(
            bootstrap_end,
            f"{bootstrap_end}\n\n  {APPEND_MARKER}",
            1,
        )

    lines = spec_content.splitlines()
    for i in reversed(range(len(lines))):
        stripped = lines[i].strip()
        leading = len(lines[i]) - len(lines[i].lstrip())
        if stripped == "});" and leading == 0:
            lines.insert(i, f"\n  {APPEND_MARKER}\n")
            return "\n".join(lines)

    logger.warning("ensure_append_marker: could not locate root describe closing")
    return spec_content.rstrip() + f"\n\n  {APPEND_MARKER}\n"


# ─────────────────────────────────────────────────────────────────────────────
# Repaired it() block validation
# ─────────────────────────────────────────────────────────────────────────────

FORBIDDEN_IT_PATTERNS = [
    (r"^\s*import\s+",      "import statement",    True),
    (r"^\s*describe\s*\(",  "nested describe block", True),
    (r"^\s*export\s+",      "export statement",    True),
]


def validate_repaired_test_block(block: str) -> bool:
    if not block or not block.strip():
        logger.warning("validate_repaired_test_block: empty block")
        return False

    for pattern, description, discard in FORBIDDEN_IT_PATTERNS:
        if re.search(pattern, block, re.MULTILINE):
            logger.warning(
                f"validate_repaired_test_block: forbidden pattern '{description}' found"
                + (" — discarding block" if discard else " — warning only")
            )
            if discard:
                return False

    it_count = len(re.findall(r"\bit(?:\.only|\.skip)?\s*\(", block))
    if it_count != 1:
        logger.warning(
            f"validate_repaired_test_block: expected exactly 1 it() block, got {it_count}"
        )
        return False

    if not re.search(r"^\s*it(?:\.only|\.skip)?\s*\(", block, re.MULTILINE):
        logger.warning("validate_repaired_test_block: missing root it() block")
        return False

    b, p, a = count_unclosed_scopes(block)
    if b or p or a:
        logger.warning(
            f"validate_repaired_test_block: unclosed scopes {{={b} (={p} [={a}"
        )
        return False

    return True
