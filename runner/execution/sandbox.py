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
# Spec file creation
# ─────────────────────────────────────────────────────────────────────────────

def create_spec_file(
    model: str,
    strategy: str,
    test_output_file: str,
    content: str,
) -> tuple[Path, Path]:
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
) -> None:
    cleaned = clean_generated_block(content)

    if not cleaned.strip():
        logger.warning("append_test_block: empty block after cleaning, skipping")
        return

    current = spec_file.read_text(encoding="utf-8")

    if APPEND_MARKER not in current:
        logger.warning("append_test_block: marker not found, appending at end")
        spec_file.write_text(current.rstrip() + f"\n\n{cleaned}\n", encoding="utf-8")
        return

    updated = current.replace(
        APPEND_MARKER,
        f"{cleaned}\n\n  {APPEND_MARKER}",
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

    braces = 0
    parens = 0
    brackets = 0

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

    return (
        max(0, braces),
        max(0, parens),
        max(0, brackets),
    )

def _remove_last_incomplete_test(block: str) -> str:
    """
    Removes trailing incomplete it() blocks (those with unbalanced braces).
    Iterates from last to first so multiple truncated tests are all stripped.
    """
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


# def _repair_truncated_test_block(block: str) -> str:
#     """
#     Closes any unclosed describe() scopes after incomplete tests have been
#     removed.  Uses a string-aware depth counter to avoid false positives from
#     brace characters inside string literals.
#     """
#     block = block.rstrip()

#     if not block or "describe(" not in block:
#         return block

#     unclosed = _count_unclosed_scopes(block)

#     if unclosed > 1:
#         logger.warning(
#             f"_repair_truncated_test_block: closing {unclosed} unclosed scope(s)"
#         )
#         block += "\n" + "\n".join("});" for _ in range(unclosed))

#     return block.strip()


# ─────────────────────────────────────────────────────────────────────────────
# Block validation and cleaning
# ─────────────────────────────────────────────────────────────────────────────

FORBIDDEN_BLOCK_PATTERNS: list[tuple[str, str, bool]] = [
    (r"import\s+\{[^}]+\}\s+from\s", "import statement in block", True),
    (r"import\s+\w+\s+from\s",       "import statement in block", True),
    (r"\bbeforeAll\s*\(",            "beforeAll in block",        True),
    (r"\bafterAll\s*\(",             "afterAll in block",         True),
]

# _TEST_OUTPUT_RE = re.compile(
#     r"<TEST_OUTPUT>\s*(.*?)\s*</TEST_OUTPUT>",
#     re.DOTALL,
# )

# _TEST_OUTPUT_OPEN_RE = re.compile(
#     r"<TEST_OUTPUT>\s*(.*)",
#     re.DOTALL,
# )

# _OUTER_SERVICE_DESCRIBE_RE = re.compile(
#     r"^\s*describe\s*\(\s*['\"][^'\"]*Service['\"]",
# )


# def extract_test_output(content: str) -> str | None:
#     """
#     Extracts the TypeScript block from <TEST_OUTPUT>...</TEST_OUTPUT>.

#     If the closing tag is missing (truncated response), attempts to repair
#     the block by removing the last incomplete it() and closing open scopes.
#     """
#     if not content:
#         return None

#     # Happy path
#     match = _TEST_OUTPUT_RE.search(content)
#     if match:
#         extracted = match.group(1).strip()
#         return extracted or None

#     # Truncated response — opening tag present but no closing tag
#     open_match = _TEST_OUTPUT_OPEN_RE.search(content)
#     if open_match:
#         extracted = open_match.group(1).strip()
#         if not extracted:
#             return None

#         logger.warning(
#             "extract_test_output: response truncated — attempting repair"
#         )

#         # Step 1: remove any trailing incomplete it() block
#         repaired = _remove_last_incomplete_test(extracted)

#         # Step 2: close any unclosed describe() scopes
#         # repaired = _repair_truncated_test_block(cleaned)

#         if repaired:
#             logger.warning(
#                 f"extract_test_output: recovered {len(repaired)} chars after repair"
#             )
#             return repaired

#     return None


def validate_generated_block(block: str) -> bool:
    """
    Returns True if the block is valid and safe to append.
    """
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

    # Brace balance check using the same string-aware counter
    b, p, a = count_unclosed_scopes(block)
    if b or p or a:
        logger.warning(
            f"validate_generated_block: "
            f"unclosed scopes "
            f"{{={b} (={p} [={a}"
        )
        return False

    return True


def clean_generated_block(content: str) -> str:
    """
    Cleans an incremental test block:
    - Strips markdown fences
    - Removes import lines that escaped validation
    - Removes the outer describe('XxxService') wrapper when present
    """
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

    result = "\n".join(filtered).strip()

    return result


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



FORBIDDEN_IT_PATTERNS = [
    (
        r"^\s*import\s+",
        "import statement",
        True,
    ),
    (
        r"^\s*describe\s*\(",
        "nested describe block",
        True,
    ),
    (
        r"^\s*export\s+",
        "export statement",
        True,
    ),
]

def validate_repaired_test_block(block: str) -> bool:
    """
    Validates a repaired Jest it() block before patching.

    Expected shape:

        it('...', () => {
            ...
        })

    Returns True if safe to patch.
    """

    if not block or not block.strip():
        logger.warning(
            "validate_repaired_test_block: empty block"
        )
        return False

    for pattern, description, discard in FORBIDDEN_IT_PATTERNS:
        if re.search(pattern, block, re.MULTILINE):
            logger.warning(
                f"validate_repaired_test_block: "
                f"forbidden pattern '{description}' found"
                + (
                    " — discarding block"
                    if discard
                    else " — warning only"
                )
            )

            if discard:
                return False

    # must contain exactly one test block
    it_count = len(
        re.findall(
            r"\bit(?:\.only|\.skip)?\s*\(",
            block,
        )
    )

    if it_count != 1:
        logger.warning(
            f"validate_repaired_test_block: "
            f"expected exactly 1 it() block, got {it_count}"
        )
        return False

    # repaired block should not contain multiple tests
    test_count = len(
        re.findall(
            r"\bit(?:\.only|\.skip)?\s*\(",
            block,
        )
    )

    if test_count > 1:
        logger.warning(
            "validate_repaired_test_block: "
            "multiple test blocks detected"
        )
        return False

    # ensure block starts with it(...)
    if not re.search(
        r"^\s*it(?:\.only|\.skip)?\s*\(",
        block,
        re.MULTILINE,
    ):
        logger.warning(
            "validate_repaired_test_block: "
            "missing root it() block"
        )
        return False

    # brace / parenthesis / bracket balance
    b, p, a = count_unclosed_scopes(block)

    if b or p or a:
        logger.warning(
            "validate_repaired_test_block: "
            f"unclosed scopes {{={b} (={p} [={a}"
        )
        return False

    return True