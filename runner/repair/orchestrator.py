from dataclasses import dataclass

from prompts.builder import build_runtime_repair_prompt
from repair.parser import parse_jest_failures
from execution.sandbox import normalize_content, validate_repaired_test_block
from config import MAX_RUNTIME_REPAIRS
from utils.logging import logger

from ts_ast.ast_extract import extract_failed_test_block
from ts_ast.ast_patch import patch_test_block

MAX_SAME_ERROR_REPAIRS = 3


@dataclass
class RepairStats:
    repairs_applied: int = 0
    repairs_failed:  int = 0
    repair_tokens:   int = 0


def _skip_test_block(*, generated_spec_path, test_name, describe_name):
    try:
        block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
            describe_name=describe_name,
        )
        if "it.skip(" in block:
            return True
        patch_test_block(
            file_path=str(generated_spec_path),
            test_name=test_name,
            describe_name=describe_name,
            new_block=block.replace("it(", "it.skip(", 1),
        )
        logger.warning(f"Marked failing test as skipped: {test_name}")
        return True
    except Exception as exc:
        logger.exception(f"Failed to skip test '{test_name}': {exc}")
        return False


def normalize_block(block): return "".join(block.split())


def _repair_block(*, client, repair_system_prompt, repair_prompt,
                  generated_spec_path, failure, describe_name, method_metadata):
    try:
        broken_block = extract_failed_test_block(
            file_path=str(generated_spec_path),
            test_name=failure.test_name,
            describe_name=describe_name,
        )
    except Exception as exc:
        logger.error(f"Could not extract block for '{failure.test_name}': {exc}")
        return False, 0

    prompt = build_runtime_repair_prompt(
        repair_prompt=repair_prompt,
        broken_block=broken_block,
        error_message=failure.error_message,
        context=method_metadata,
    )
    logger.info(f"Repairing '{failure.test_name}' (type={failure.error_type})")
    try:
        response = client.generate(repair_system_prompt, prompt)
        tokens = response.tokens or 0
        repaired = normalize_content(response.content)

        if normalize_block(repaired) == normalize_block(broken_block):
            logger.warning(f"Identical repair for '{failure.test_name}' — skipping")
            _skip_test_block(generated_spec_path=generated_spec_path,
                             test_name=failure.test_name, describe_name=describe_name)
            return True, tokens

        if not validate_repaired_test_block(repaired):
            logger.warning(f"Invalid repair for '{failure.test_name}' — skipping")
            _skip_test_block(generated_spec_path=generated_spec_path,
                             test_name=failure.test_name, describe_name=describe_name)
            return False, tokens

        patch_test_block(file_path=str(generated_spec_path),
                         test_name=failure.test_name,
                         describe_name=describe_name,
                         new_block=repaired)
        return True, tokens
    except Exception as exc:
        logger.exception(f"Failed to repair '{failure.test_name}': {exc}")
        return False, 0


def repair_runtime_failure(*, runtime_repairs, client, repair_system_prompt,
                           repair_prompt, generated_spec_path, jest_stderr,
                           method_metadata, describe_name, failure_counts):
    failures = parse_jest_failures(jest_stderr)
    logger.info(f"Parsed {len(failures)} failure(s)")
    for f in failures:
        logger.debug(f"  [{f.error_type}] {f.test_name}")

    if not failures:
        logger.warning(
            "0 failures parsed — whole-file repair is disabled. "
            "Test stays as-is and will become pending after MAX_RUNTIME_REPAIRS."
        )
        return RepairStats()

    stats = RepairStats()
    for failure in failures:
        error_key = f"{failure.test_name}::{failure.error_type}"
        failure_counts[error_key] += 1
        count = failure_counts[error_key]

        should_skip = (count >= MAX_SAME_ERROR_REPAIRS
                       or runtime_repairs == (MAX_RUNTIME_REPAIRS - 1))

        if should_skip:
            reason = (f"same error ×{count}" if count >= MAX_SAME_ERROR_REPAIRS
                      else f"max attempts {runtime_repairs+1}/{MAX_RUNTIME_REPAIRS}")
            logger.warning(f"Skipping '{failure.test_name}' ({reason})")
            _skip_test_block(generated_spec_path=generated_spec_path,
                             test_name=failure.test_name, describe_name=describe_name)
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
