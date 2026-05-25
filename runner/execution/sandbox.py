from pathlib import Path
import re
import shutil

from config import GENERATED_DIR, CORPUS_DIR, TMP_DIR
from utils.logging import logger


def create_bootstrap_file(
    model: str,
    strategy: str,
    test_output_file: str,
    content: str,
) -> tuple[Path, Path]:

    output_dir = GENERATED_DIR / strategy / model

    file_path = output_dir / test_output_file

    file_path.parent.mkdir(parents=True, exist_ok=True)

    file_path.write_text(
        normalize_content(content),
        encoding="utf-8",
    )

    # Cópia do bootstrap em TMP — usada como referência
    # imutável no prompt incremental (EXISTING_SPEC_FILE).
    # Não é alterada durante a geração incremental.
    b_output_dir = TMP_DIR / strategy / model

    b_file_path = b_output_dir / test_output_file

    b_file_path.parent.mkdir(parents=True, exist_ok=True)

    b_file_path.write_text(
        normalize_content(content),
        encoding="utf-8",
    )

    return file_path, b_file_path


def append_test_block(
    *,
    spec_file: Path,
    content: str,
) -> None:

    # Limpar o bloco antes de qualquer outra operação
    cleaned = clean_generated_block(content)

    if not cleaned.strip():
        logger.warning("append_test_block: empty block after cleaning, skipping")
        return

    current = spec_file.read_text(encoding="utf-8")

    updated = current.replace(
        "// TESTS_APPEND_HERE",
        f"\n        {cleaned}\n\n        // TESTS_APPEND_HERE\n        ",
    )

    spec_file.write_text(updated, encoding="utf-8")


def normalize_content(content: str) -> str:

    content = content.strip()

    # Remove markdown fences
    for fence in ("```typescript", "```ts", "```"):
        if content.startswith(fence):
            content = content[len(fence):]
            break

    if content.endswith("```"):
        content = content[:-3]

    return content.strip() + "\n"


# Padrões que indicam que o modelo gerou estrutura proibida
# fora do describe da função — cada padrão tem uma descrição
# para o log e uma flag que indica se deve descartar o bloco inteiro
FORBIDDEN_BLOCK_PATTERNS: list[tuple[str, str, bool]] = [
    # (regex, descrição, descartar_bloco_inteiro)
    (r"from\s+'chai'",               "chai import",                True),
    (r"from\s+'sinon'",              "sinon import",               True),
    (r"from\s+'mocha'",              "mocha import",               True),
    (r"require\(['\"]sinon['\"]",    "sinon require",              True),
    (r"require\(['\"]chai['\"]",     "chai require",               True),
    (r"import\s+\{[^}]+\}\s+from\s", "import statement in block",  True),
    (r"import\s+\w+\s+from\s",       "import statement in block",  True),
    # (r"\bbeforeEach\s*\(",           "beforeEach in block",        True),
    (r"\bbeforeAll\s*\(",            "beforeAll in block",         True),
    # (r"\bafterEach\s*\(",            "afterEach in block",         True),
    (r"\bafterAll\s*\(",             "afterAll in block",          True),
    (r"\bcreateTestingModule\b",     "TestingModule setup",        True),
    (r"\blet\s+service\b",           "service re-declaration",     True),
    # (r"\bconst\s+\w+Mock\s*=",       "mock re-declaration",        True),
]


def validate_generated_block(block: str) -> bool:
    """
    Valida o bloco incremental gerado pelo modelo.
    Retorna True se o bloco é válido, False se deve ser descartado.
    Loga o motivo em caso de rejeição.
    """
    for pattern, description, discard in FORBIDDEN_BLOCK_PATTERNS:
        if re.search(pattern, block):
            logger.warning(
                f"validate_generated_block: "
                f"forbidden pattern '{description}' found — "
                f"{'discarding block' if discard else 'warning only'}"
            )
            if discard:
                return False

    if "describe(" not in block:
        logger.warning(
            "validate_generated_block: missing describe() block"
        )
        return False

    return True


def clean_generated_block(content: str) -> str:
    """
    Limpa o bloco incremental gerado pelo modelo:
    - Remove fences de markdown
    - Remove describes externos que duplicam o describe raiz do service
    - Remove linhas de import que escaparam do filtro
    """
    content = normalize_content(content)

    lines = content.splitlines()
    filtered = []

    for line in lines:
        stripped = line.strip()

        # Remove imports que o modelo inseriu indevidamente
        if stripped.startswith("import ") and " from " in stripped:
            logger.warning(
                f"clean_generated_block: removed import line: {stripped[:80]}"
            )
            continue

        # Remove describe externo que duplica o describe raiz do service
        # Padrão: describe('XxxService', ...) ou describe("XxxService", ...)
        if re.match(r"describe\s*\(\s*['\"].*Service['\"]", stripped):
            logger.warning(
                f"clean_generated_block: removed outer service describe: {stripped[:80]}"
            )
            continue

        filtered.append(line)

    return "\n".join(filtered).strip()


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


APPEND_MARKER = "// TESTS_APPEND_HERE"


def ensure_append_marker(spec_content: str) -> str:

    if APPEND_MARKER in spec_content:
        return spec_content

    # tenta recolocar antes do último fechamento
    last_closing = spec_content.rfind("});")

    if last_closing == -1:
        logger.warning(
            "Could not restore append marker"
        )
        return spec_content + f"\n\n{APPEND_MARKER}"

    return (
        spec_content[:last_closing]
        + f"\n\n{APPEND_MARKER}\n\n"
        + spec_content[last_closing:]
    )