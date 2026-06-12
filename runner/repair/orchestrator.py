"""
Repair orchestrator for Jest runtime failures.

Flow:
  1. Parse individual failure blocks from stderr
  2a. If failures found: repair each block with LLM (targeted)
  2b. If no failures parsed: whole-file LLM repair (fallback)
"""

from collections import defaultdict

from prompts.builder import build_repair_prompt, build_runtime_repair_prompt
from prompts.loader import load_system_prompt
from repair.parser import parse_jest_failures, JestFailure
from execution.sandbox import normalize_content, ensure_append_marker, validate_repaired_test_block
from config import MAX_RUNTIME_REPAIRS
from utils.logging import logger

MAX_SAME_ERROR_REPAIRS = 3


def _whole_file_repair(
    *,
    client,
    generated_spec_path,
    jest_stderr: str,
) -> bool:
    """
    Sends the full spec + error to the LLM for repair.
    Used when parse_jest_failures returns an empty list.
    """
    logger.warning(
        "No individual failures parsed — falling back to whole-file repair"
    )

    try:
        full_spec_system_prompt = load_system_prompt("full_spec_repair")
        current_spec = generated_spec_path.read_text(encoding="utf-8")

        repair_prompt = build_repair_prompt(
            spec_content=current_spec,
            jest_stderr=jest_stderr,
        )

        response = client.generate(full_spec_system_prompt, repair_prompt)

        repaired = normalize_content(response.content)
        repaired = ensure_append_marker(repaired)

        generated_spec_path.write_text(repaired, encoding="utf-8")
        logger.info("Whole-file repair applied")
        return True

    except Exception as exc:
        logger.error(f"Whole-file repair failed: {exc}")
        return False


def _skip_test_block(
    *,
    generated_spec_path,
    test_name: str,
) -> bool:
    """
    Converts:

      it('name', ...)

    into:

      it.skip('name', ...)

    so the rest of the suite can continue executing.
    """
    from ts_ast.ast_extract import extract_failed_test_block
    from ts_ast.ast_patch import patch_test_block

    try:
        block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
        )

        if "it.skip(" in block:
            return True

        skipped = block.replace(
            "it(",
            "it.skip(",
            1,
        )

        patch_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
            new_block=skipped,
        )

        logger.warning(
            f"Marked failing test as skipped: {test_name}"
        )

        return True

    except Exception as exc:
        logger.exception(
            f"Failed to skip test '{test_name}': {exc}"
        )
        return False


def normalize_block(block: str) -> str:
    return "".join(block.split())

# ─────────────────────────────────────────────────────────────────────────────
# Per-block LLM repair
# ─────────────────────────────────────────────────────────────────────────────

def _repair_block(
    *,
    client,
    repair_system_prompt: str,
    repair_prompt: str,
    generated_spec_path,
    failure: JestFailure,
    method_metadata,
) -> bool:
    """
    Extracts the broken test block, sends it to the LLM, and patches it back.
    Returns True if the repair was applied (patch succeeded).
    """
    from ts_ast.ast_extract import extract_failed_test_block
    from ts_ast.ast_patch import patch_test_block

    try:
        broken_block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=failure.test_name,
        )
    except Exception as exc:
        logger.error(f"Could not extract block for '{failure.test_name}': {exc}")
        return False

    repair_prompt = build_runtime_repair_prompt(
        repair_prompt=repair_prompt,
        broken_block=broken_block,
        error_message=failure.error_message,
        context=method_metadata,
    )

    logger.info(f"Repairing test='{failure.test_name}' (error_type={failure.error_type})")

    try:
        response = client.generate(repair_system_prompt, repair_prompt)
        repaired_block = normalize_content(response.content)
        logger.debug(f"repaired_block={repaired_block}")

        if normalize_block(repaired_block) == normalize_block(broken_block):
            logger.warning(f"Repair produced identical block for '{failure.test_name}'")
            _skip_test_block(
                generated_spec_path=generated_spec_path,
                test_name=failure.test_name,
            )
            return True

        if not validate_repaired_test_block(repaired_block):
            logger.warning(f"Invalid repair generated for '{failure.test_name}'")
            return False

        patch_test_block(
            file_path=str(generated_spec_path),
            test_name=failure.test_name,
            new_block=repaired_block,
        )
        return True

    except Exception as exc:
        logger.exception(
            f"Failed to repair test '{failure.test_name}': {exc}"
        )
        return False


# ─────────────────────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────────────────────

def repair_runtime_failure(
    *,
    runtime_repairs,
    client,
    repair_system_prompt: str,
    repair_prompt: str,
    generated_spec_path,
    jest_stderr: str,
    method_metadata,
):
    """
    Attempts to repair a failing Jest spec.
    Returns True if at least one repair was applied.
    """

    if not hasattr(repair_runtime_failure, "_failure_counts"):
        repair_runtime_failure._failure_counts = defaultdict(int)

    failures = parse_jest_failures(jest_stderr)

    logger.info(
        f"Parsed {len(failures)} failure(s) from Jest stderr"
    )

    for f in failures:
        logger.debug(
            f"[{f.error_type}] {f.test_name}"
        )

    if not failures:
        return _whole_file_repair(
            client=client,
            generated_spec_path=generated_spec_path,
            jest_stderr=jest_stderr,
        )

    repaired_count = 0
    repaired_any = False

    for failure in failures:

        error_key = (
            f"{failure.test_name}"
            f"::{failure.error_type}"
        )

        repair_runtime_failure._failure_counts[
            error_key
        ] += 1

        count = repair_runtime_failure._failure_counts[
            error_key
        ]

        if count >= MAX_SAME_ERROR_REPAIRS or runtime_repairs == (MAX_RUNTIME_REPAIRS - 1):

            if count >= MAX_SAME_ERROR_REPAIRS:
                logger.warning(
                    f"Same error repeated {count} times. "
                    f"Skipping test '{failure.test_name}'."
                )

            if runtime_repairs == (MAX_RUNTIME_REPAIRS - 1):
                logger.warning(
                    f"Max attempts reached {runtime_repairs + 1}/MAX_RUNTIME_REPAIRS."
                    f"Skipping test '{failure.test_name}'."
                )
                 
            applied = _skip_test_block(
                generated_spec_path=generated_spec_path,
                test_name=failure.test_name,
            )

            repaired_any = repaired_any or applied
            continue

        applied = _repair_block(
            client=client,
            repair_system_prompt=repair_system_prompt,
            repair_prompt=repair_prompt,
            generated_spec_path=generated_spec_path,
            failure=failure,
            method_metadata=method_metadata,
        )

        if applied:
            repaired_count += 1

    return repaired_count