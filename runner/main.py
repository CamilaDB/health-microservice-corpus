from collections import defaultdict

from clients.ollama_client import OllamaClient
from config import (
    CORPUS_DIR,
    MAX_RUNTIME_REPAIRS,
    MAX_TS_REPAIRS,
    MODELS,
    PROMPT_STRATEGIES,
)
from execution.jest_runner import run_jest
from execution.sandbox import (
    append_test_block,
    create_bootstrap_file,
    ensure_append_marker,
    install_temp_spec,
    normalize_content,
    remove_temp_spec,
    validate_generated_block
)
from execution.typescript_validator import validate_typescript
from metrics.coverage import extract_coverage
from persistence.csv_writer import save_result
from prompts.builder import (
    build_prompt,
    build_repair_prompt,
)
from prompts.loader import (
    load_functions,
    load_system_prompt,
)
from models.runtime_repair_result import RuntimeRepairResult
from repair.orchestrator import repair_runtime_failure
from ts_ast.bootstrap import generate_bootstrap_spec
from utils.logging import logger


def group_functions_by_spec(functions):

    grouped = defaultdict(list)

    for function_data in functions:
        grouped[function_data.test_output_file].append(function_data)

    for spec_file in grouped:
        grouped[spec_file].sort(key=lambda fn: fn.line)

    return grouped


def validate_and_repair_typescript(
    *,
    client,
    repair_system_prompt: str,
    generated_spec_path,
) -> bool:

    for ts_attempt in range(1, MAX_TS_REPAIRS + 1):

        logger.info(
            f"TypeScript validation attempt={ts_attempt}"
        )

        validation = validate_typescript(
            generated_spec_path
        )

        if validation.success:

            logger.info(
                "TypeScript validation succeeded"
            )

            return True

        logger.error(
        f"""
            TypeScript validation failed

            STDOUT:
            {validation.stdout}

            STDERR:
            {validation.stderr}

            RETURN CODE:
            {validation.returncode}
        """
        )

        current_spec = generated_spec_path.read_text(
            encoding="utf-8",
        )

        repair_prompt = build_repair_prompt(
            spec_content=current_spec,
            jest_stderr=validation.stderr,
        )

        logger.info(
            f"Repairing TypeScript attempt={ts_attempt}"
        )

        repair_response = client.generate(
            repair_system_prompt,
            repair_prompt,
        )

        repaired = normalize_content(
            repair_response.content
        )

        repaired = ensure_append_marker(
            repaired
        )


        generated_spec_path.write_text(
            repaired,
            encoding="utf-8",
        )

    logger.error(
        "TypeScript validation failed permanently"
    )

    return False


def is_typescript_error(stderr: str) -> bool:
    return "error TS" in stderr


def run_runtime_repair_loop(
  *,
    client,
    repair_system_prompt,
    generated_spec_path,
    test_output_file,
    target_source_file,
    method_metadata,
):

    jest_result = None
    coverage = {}
    runtime_repairs = 0

    for attempt in range(
        1,
        MAX_RUNTIME_REPAIRS + 1,
    ):

        logger.info(
            f"Installing temp spec "
            f"attempt={attempt} "
            f"{generated_spec_path}"
        )

        temp_spec_path = install_temp_spec(
            generated_file=generated_spec_path,
            relative_output_path=test_output_file,
        )

        try:

            logger.info(
                f"Running Jest attempt={attempt} "
                f"for {temp_spec_path}"
            )

            jest_result = run_jest(
                temp_spec_path
            )

            coverage = extract_coverage(
                target_source_file=target_source_file,
            )
 
            logger.info(
                f"Jest attempt={attempt} "
                f"success={jest_result.success}"
                f"stout={jest_result.stdout}"
            )

            if jest_result.stderr:

                logger.error(
                    jest_result.stderr[:4000]
                )

            if is_typescript_error(jest_result.stderr):
                logger.error(
                    "Runtime loop received TypeScript error"
                )
                return RuntimeRepairResult(
                    success=False,
                    requires_typescript_repair=True,
                    jest_result=jest_result,
                    coverage=coverage,
                    runtime_repairs=runtime_repairs,
                )

            if jest_result.success:
                break

            if attempt < MAX_RUNTIME_REPAIRS:

                runtime_repairs += 1

                logger.info(
                    f"Runtime repair attempt={attempt}"
                )

                repair_strategy = repair_runtime_failure(
                    client=client,
                    repair_system_prompt=repair_system_prompt,
                    generated_spec_path=generated_spec_path,
                    jest_stderr=jest_result.stderr,
                    method_metadata=method_metadata,
                )

                logger.info(f"attempt={attempt} strategy={repair_strategy}")

        finally:

            logger.info(
                f"Removing temp spec "
                f"{temp_spec_path}"
            )

            remove_temp_spec(
                temp_spec_path
            )

    return RuntimeRepairResult(
        success=jest_result.success,
        requires_typescript_repair=False,
        jest_result=jest_result,
        coverage=coverage,
        runtime_repairs=runtime_repairs,
    )

def run_experiment() -> None:

    functions = load_functions()

    grouped_functions = group_functions_by_spec(
        functions
    )

    for model_key, model_name in MODELS.items():

        logger.info(
            f"model_name={model_name}"
        )

        client = OllamaClient(
            model_name
        )

        incremental_system_prompt = load_system_prompt(
            "incremental"
        )

        repair_system_prompt = load_system_prompt(
            "repair"
        )

        for strategy in PROMPT_STRATEGIES:

            logger.info(
                f"Running "
                f"model={model_key} "
                f"strategy={strategy}"
            )

            for (
                test_output_file,
                file_functions,
            ) in grouped_functions.items():

                logger.info(
                    f"Generating spec "
                    f"file={test_output_file}"
                )

                try:

                    # ==================================================
                    # STEP 1 — GENERATE BOOTSTRAP
                    # ==================================================

                    bootstrap_response = (
                        generate_bootstrap_spec(
                            str(
                                CORPUS_DIR
                                / file_functions[0].source_file
                            )
                        )
                    )

                    logger.info(
                        "Bootstrap generated"
                    )

                    generated_spec_path, b_generated_spec_path = (
                        create_bootstrap_file(
                            model=model_key,
                            strategy=strategy,
                            test_output_file=test_output_file,
                            content=bootstrap_response,
                        )
                    )

                    for function_data in file_functions:

                        logger.info(
                            f"Generating tests "
                            f"function={function_data.name}"
                        )

                        try:

                            # ==========================================
                            # STEP 1 — GENERATE
                            # ==========================================

                            prompt = build_prompt(
                                strategy=strategy,
                                function_data=function_data,
                                existing_spec_file=b_generated_spec_path,
                            )

                            response = client.generate(
                                incremental_system_prompt,
                                prompt,
                            )

                            validate_ok = validate_generated_block(
                                response.content
                            )

                            if not validate_ok:

                                logger.warning(
                                    f"Invalid block "
                                    f"function={function_data.name}"
                                )

                                save_result({
                                    "model": model_key,
                                    "strategy": strategy,
                                    "function": function_data.name,
                                    "generation_success": False,
                                    "error": "invalid_block",
                                })

                                continue

                            # ==========================================
                            # STEP 2 — APPEND
                            # ==========================================

                            append_test_block(
                                spec_file=generated_spec_path,
                                content=response.content,
                            )

                            # ==========================================
                            # STEP 3 — TS VALIDATION
                            # ==========================================

                            ts_success = validate_and_repair_typescript(
                                client=client,
                                repair_system_prompt=repair_system_prompt,
                                generated_spec_path=generated_spec_path,
                            )

                            if not ts_success:

                                logger.error(
                                    f"TypeScript failed "
                                    f"function={function_data.name}"
                                )

                                save_result({
                                    "model": model_key,
                                    "strategy": strategy,
                                    "function": function_data.name,
                                    "generation_success": False,
                                    "typescript_success": False,
                                })

                                continue

                            # ==========================================
                            # STEP 4 — RUNTIME LOOP
                            # ==========================================

                            runtime_result = run_runtime_repair_loop(
                                client=client,
                                repair_system_prompt=repair_system_prompt,
                                generated_spec_path=generated_spec_path,
                                test_output_file=test_output_file,
                                target_source_file=function_data.source_file,
                                method_metadata=function_data,
                            )

                            # ==========================================
                            # STEP 5 — TS REPAIR FROM RUNTIME
                            # ==========================================

                            if runtime_result.requires_typescript_repair:

                                ts_success = validate_and_repair_typescript(
                                    client=client,
                                    repair_system_prompt=repair_system_prompt,
                                    generated_spec_path=generated_spec_path,
                                )

                                if ts_success:

                                    runtime_result = run_runtime_repair_loop(
                                        client=client,
                                        repair_system_prompt=repair_system_prompt,
                                        generated_spec_path=generated_spec_path,
                                        test_output_file=test_output_file,
                                        target_source_file=function_data.source_file,
                                        method_metadata=function_data,
                                    )

                            # ==========================================
                            # STEP 6 — SAVE METRICS
                            # ==========================================

                            jest_result = runtime_result.jest_result
                            coverage = runtime_result.coverage

                            save_result({
                                "model": model_key,
                                "strategy": strategy,
                                "function": function_data.name,
                                "source_file": function_data.source_file,
                                "test_output_file": function_data.test_output_file,
                                "ccm": function_data.ccm,

                                "generation_success": True,

                                "jest_success": (
                                    jest_result.success
                                    if jest_result else False
                                ),

                                "runtime_repairs":
                                    runtime_result.runtime_repairs,

                                "requires_typescript_repair":
                                    runtime_result.requires_typescript_repair,

                                "generation_seconds":
                                    response.duration_seconds,

                                **coverage.to_csv_row(),
                            })

                        except Exception as exc:

                            logger.exception(exc)

                            save_result({
                                "model": model_key,
                                "strategy": strategy,
                                "function": function_data.name,
                                "fatal_error": str(exc),
                            })
                    # ==================================================
                    # STEP 3 — JEST RUNTIME LOOP
                    # ==================================================

                    runtime_result = (
                        run_runtime_repair_loop(
                            client=client,
                            repair_system_prompt=repair_system_prompt,
                            generated_spec_path=generated_spec_path,
                            test_output_file=test_output_file,
                            target_source_file=file_functions[0].source_file,
                            method_metadata=function_data
                        )
                    )

                    if runtime_result.requires_typescript_repair:

                        logger.warning(
                            "Runtime loop detected TypeScript error. "
                            "Returning to TypeScript validation pipeline."
                        )

                        ts_success = (
                            validate_and_repair_typescript(
                                client=client,
                                repair_system_prompt=repair_system_prompt,
                                generated_spec_path=generated_spec_path,
                            )
                        )

                        if ts_success:

                            logger.info(
                                "TypeScript repaired successfully. "
                                "Re-running runtime loop."
                            )

                            runtime_result = (
                                run_runtime_repair_loop(
                                    client=client,
                                    repair_system_prompt=repair_system_prompt,
                                    generated_spec_path=generated_spec_path,
                                    test_output_file=test_output_file,
                                    target_source_file=file_functions[0].source_file,
                                    method_metadata=function_data
                                )
                            )

                        else:

                            logger.error(
                                "TypeScript repair failed permanently "
                                "after runtime detection."
                            )

                    jest_result = runtime_result.jest_result

                    coverage = runtime_result.coverage

                    runtime_repairs = (
                        runtime_result.runtime_repairs
                    )

                    save_result({
                        "model": model_key,
                        "strategy": strategy,
                        "test_output_file": test_output_file,
                        "jest_success": (
                            jest_result.success if jest_result else False
                        ),
                        "runtime_repairs": runtime_repairs,
                        "requires_typescript_repair": (
                            runtime_result.requires_typescript_repair
                        ),
                        **coverage.to_csv_row(),   # expande todas as métricas
                    })

                except Exception as exc:

                    logger.exception(exc)

                    save_result({
                        "model": model_key,
                        "strategy": strategy,
                        "test_output_file": test_output_file,
                        "fatal_error": str(exc),
                    })


if __name__ == "__main__":

    run_experiment()
