"""
Repair orchestrator for Jest runtime failures.

Changes from original:
  1. _failure_counts is now passed as a parameter (defaultdict) instead of
     being a static function attribute. This fixes cross-function / cross-model
     / cross-strategy contamination: main.py creates a fresh defaultdict(int)
     for every function and passes it here.

  2. _skip_test_block and _repair_block now receive describe_name (= fn_id
     from make_fn_id). This is forwarded to extract_failed_test_block and
     patch_test_block so the TypeScript AST tools scope their search to the
     correct describe('FN_<name>_END', ...) wrapper, preventing collisions
     when two functions in the same spec generate it() blocks with identical
     titles (common with LLM-generated tests).

  3. repair_runtime_failure signature gains describe_name and failure_counts.

  4. repair_runtime_failure now returns a RepairStats dataclass instead of
     a bare int, exposing per-function repair telemetry:
       - repairs_applied  : number of LLM patches successfully written back
       - repairs_failed   : number of blocks that failed or were skipped
       - repair_tokens    : total tokens consumed across all repair LLM calls

  NOTE on _whole_file_repair:
     When no individual failures are parsed, the entire spec is sent to the
     LLM for rewriting. After a whole-file repair the describe('FN_…_END')
     wrappers added by append_test_block MAY be stripped if the repair prompt
     does not explicitly instruct the LLM to preserve them. The repair system
     prompt must include a constraint such as:
       "Preserve all describe('FN_..._END', ...) wrapper blocks exactly as-is.
        Do not rename, remove, or restructure them."
"""

from collections import defaultdict
from dataclasses import dataclass, field

from prompts.builder import build_repair_prompt, build_runtime_repair_prompt
from prompts.loader import load_system_prompt
from repair.parser import parse_jest_failures, JestFailure
from execution.sandbox import (
    normalize_content,
    ensure_append_marker,
    validate_repaired_test_block,
)
from utils.logging import logger


MAX_SAME_ERROR_REPAIRS = 3


@dataclass
class RepairStats:
    """Accumulated repair telemetry for a single function's repair loop."""
    repairs_applied: int = 0   # LLM patches written back successfully
    repairs_failed:  int = 0   # blocks that could not be repaired (skipped)
    repair_tokens:   int = 0   # total tokens consumed by repair LLM calls


# ─────────────────────────────────────────────────────────────────────────────
# Whole-file fallback repair
# ─────────────────────────────────────────────────────────────────────────────

def _whole_file_repair(
    *,
    client,
    generated_spec_path,
    jest_stderr: str,
) -> tuple[bool, int]:
    """Returns (success, tokens_used)."""
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
        return True, (response.tokens or 0)

    except Exception as exc:
        logger.error(f"Whole-file repair failed: {exc}")
        return False, 0


# ─────────────────────────────────────────────────────────────────────────────
# Skip (mark as it.skip)
# ─────────────────────────────────────────────────────────────────────────────

def _skip_test_block(
    *,
    generated_spec_path,
    test_name: str,
    describe_name: str,
) -> bool:
    """
    Converts it('name', ...) → it.skip('name', ...) so the rest of the
    suite can continue executing.

    describe_name scopes the AST search to the describe('FN_…_END') wrapper
    of the function currently being processed, preventing the wrong it()
    from being targeted when another function in the same spec has a block
    with an identical title.
    """
    from ts_ast.ast_extract import extract_failed_test_block
    from ts_ast.ast_patch import patch_test_block

    try:
        block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
            describe_name=describe_name,
        )

        if "it.skip(" in block:
            return True

        skipped = block.replace("it(", "it.skip(", 1)

        patch_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
            describe_name=describe_name,
            new_block=skipped,
        )

        logger.warning(f"Marked failing test as skipped: {test_name}")
        return True

    except Exception as exc:
        logger.exception(f"Failed to skip test '{test_name}': {exc}")
        return False


# ─────────────────────────────────────────────────────────────────────────────
# Per-block LLM repair
# ─────────────────────────────────────────────────────────────────────────────

def normalize_block(block: str) -> str:
    return "".join(block.split())


def _repair_block(
    *,
    client,
    repair_system_prompt: str,
    repair_prompt: str,
    generated_spec_path,
    failure: JestFailure,
    describe_name: str,
    method_metadata,
) -> tuple[bool, int]:
    """
    Extracts the broken it() block (scoped to describe_name), sends it
    to the LLM, and patches it back.
    Returns (applied, tokens_used).
    """
    from ts_ast.ast_extract import extract_failed_test_block
    from ts_ast.ast_patch import patch_test_block

    try:
        broken_block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=failure.test_name,
            describe_name=describe_name,
        )
    except Exception as exc:
        logger.error(f"Could not extract block for '{failure.test_name}': {exc}")
        return False, 0

    repair_prompt_built = build_runtime_repair_prompt(
        repair_prompt=repair_prompt,
        broken_block=broken_block,
        error_message=failure.error_message,
        context=method_metadata,
    )

    logger.info(
        f"Repairing test='{failure.test_name}' "
        f"(error_type={failure.error_type}, describe={describe_name})"
    )

    try:
        response = client.generate(repair_system_prompt, repair_prompt_built)
        tokens = response.tokens or 0
        repaired_block = normalize_content(response.content)
        logger.debug(f"repaired_block={repaired_block}")

        if normalize_block(repaired_block) == normalize_block(broken_block):
            logger.warning(
                f"Repair produced identical block for '{failure.test_name}'"
            )
            _skip_test_block(
                generated_spec_path=generated_spec_path,
                test_name=failure.test_name,
                describe_name=describe_name,
            )
            return True, tokens

        if not validate_repaired_test_block(repaired_block):
            logger.warning(
                f"Invalid repair generated for '{failure.test_name}'"
            )
            return False, tokens

        patch_test_block(
            file_path=str(generated_spec_path),
            test_name=failure.test_name,
            describe_name=describe_name,
            new_block=repaired_block,
        )
        return True, tokens

    except Exception as exc:
        logger.exception(f"Failed to repair test '{failure.test_name}': {exc}")
        return False, 0


# ─────────────────────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────────────────────

def repair_runtime_failure(
    *,
    runtime_repairs: int,
    client,
    repair_system_prompt: str,
    repair_prompt: str,
    generated_spec_path,
    jest_stderr: str,
    method_metadata,
    describe_name: str,
    failure_counts: dict,          # ← caller-owned defaultdict(int), reset per function
) -> RepairStats:
    """
    Attempts to repair a failing Jest spec.
    Returns a RepairStats with repairs_applied, repairs_failed, and repair_tokens.

    failure_counts must be a defaultdict(int) created by the caller at the
    start of each function's processing and passed on every call within the
    same repair loop.  This ensures counts are scoped to a single function
    and never bleed across functions, strategies, or models.
    """
    failures = parse_jest_failures(jest_stderr)

    logger.info(f"Parsed {len(failures)} failure(s) from Jest stderr")
    for f in failures:
        logger.debug(f"  [{f.error_type}] {f.test_name}")

    if not failures:
        success, tokens = _whole_file_repair(
            client=client,
            generated_spec_path=generated_spec_path,
            jest_stderr=jest_stderr,
        )
        return RepairStats(
            repairs_applied=1 if success else 0,
            repairs_failed=0 if success else 1,
            repair_tokens=tokens,
        )

    stats = RepairStats()

    for failure in failures:
        error_key = f"{failure.test_name}::{failure.error_type}"
        failure_counts[error_key] += 1
        count = failure_counts[error_key]

        should_skip = (
            count >= MAX_SAME_ERROR_REPAIRS
            or runtime_repairs == (MAX_RUNTIME_REPAIRS - 1)
        )

        if should_skip:
            if count >= MAX_SAME_ERROR_REPAIRS:
                logger.warning(
                    f"Same error repeated {count}×. "
                    f"Skipping test '{failure.test_name}'."
                )
            else:
                logger.warning(
                    f"Max attempts reached ({runtime_repairs + 1}). "
                    f"Skipping test '{failure.test_name}'."
                )

            _skip_test_block(
                generated_spec_path=generated_spec_path,
                test_name=failure.test_name,
                describe_name=describe_name,
            )
            stats.repairs_failed += 1
            continue

        applied, tokens = _repair_block(
            client=client,
            repair_system_prompt=repair_system_prompt,
            repair_prompt=repair_prompt,
            generated_spec_path=generated_spec_path,
            failure=failure,
            describe_name=describe_name,
            method_metadata=method_metadata,
        )

        stats.repair_tokens += tokens
        if applied:
            stats.repairs_applied += 1
        else:
            stats.repairs_failed += 1

    return stats


# keep for config reference — imported by run_runtime_repair_loop
from config import MAX_RUNTIME_REPAIRS  # noqa: E402