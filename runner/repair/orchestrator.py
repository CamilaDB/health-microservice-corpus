# from pathlib import Path

# from repair.deterministic.jest_error_parser import (
#     parse_jest_error,
# )
# from repair.deterministic.jest_repairs import (
#     apply_deterministic_repairs,
# )
# from repair.llm.llm_repair import (
#     run_llm_repair,
# )

# def auto_fix_unclosed_blocks(spec_content: str) -> str:

#     open_braces = spec_content.count("{")
#     close_braces = spec_content.count("}")

#     missing = open_braces - close_braces

#     if missing <= 0:
#         return spec_content

#     fixed = spec_content.rstrip()

#     fixed += "\n" + ("\n}" * missing)

#     return fixed

# def repair_runtime_failure(
#     *,
#     client,
#     repair_system_prompt: str,
#     generated_spec_path: Path,
#     jest_stderr: str,
#     method_metadata: str,
#     previous_attempts: list[str],
# ):

#     current_spec = generated_spec_path.read_text(
#         encoding="utf-8"
#     )

#     parsed_error = parse_jest_error(
#         jest_stderr
#     )

#     deterministic_result = apply_deterministic_repairs(
#         spec_content=current_spec,
#         parsed_error=parsed_error,
#     )

#     if deterministic_result.repaired:
#         generated_spec_path.write_text(
#             deterministic_result.content,
#             encoding="utf-8",
#         )

#         return "deterministic"

#     repaired = run_llm_repair(
#         client=client,
#         repair_system_prompt=repair_system_prompt,
#         spec_content=current_spec,
#         jest_stderr=jest_stderr,
#         method_metadata=method_metadata,
#         previous_attempts=previous_attempts,
#     )

#     generated_spec_path.write_text(
#         repaired,
#         encoding="utf-8",
#     )

#     current_spec = generated_spec_path.read_text(
#         encoding="utf-8"
#     )

#     current_spec = auto_fix_unclosed_blocks(
#         current_spec
#     )

#     generated_spec_path.write_text(
#         current_spec,
#         encoding="utf-8",
#     )

#     return "llm"


from repair.parser import (
    parse_jest_failures,
)

from prompts.builder import (
    build_runtime_repair_prompt,
)

from execution.sandbox import (
    normalize_content,
)
from repair.deterministic.jest_error_parser import parse_jest_error
from repair.deterministic.jest_repairs import apply_deterministic_repairs
from ts_ast.ast_patch import patch_test_block
from ts_ast.ast_extract import extract_failed_test_block
from utils.logging import logger


def repair_runtime_failure(
    *,
    client,
    repair_system_prompt,
    generated_spec_path,
    jest_stderr,
    method_metadata,
):
    failures = parse_jest_failures(
        jest_stderr
    )

    if not failures:
        return False

    repaired_any = False

    for failure in failures:

        try:

            broken_block = extract_failed_test_block(
                file_path=str(generated_spec_path),
                test_name=failure.test_name,
            )

            repair_prompt = build_runtime_repair_prompt(
                broken_block=broken_block,
                error_message=failure.error_message,
                method_metadata=method_metadata,
            )

            logger.debug(f"repair_prompt={repair_prompt}")

            logger.info(
                f"Repairing test={failure.test_name}"
            )

            response = client.generate(
                repair_system_prompt,
                repair_prompt,
            )

            repaired_block = normalize_content(
                response.content
            )

            logger.debug(f"repaired_block = {repaired_block}")

            patch_test_block(
                file_path=str(generated_spec_path),
                test_name=failure.test_name,
                new_block=repaired_block,
            )

            repaired_any = True

        except Exception as exc:

            logger.exception(
                f"""
Failed repairing test

TEST:
{failure.test_name}

ERROR:
{exc}
"""
            )

    return repaired_any