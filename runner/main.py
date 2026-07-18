from collections import defaultdict
from pathlib import Path

from clients.ollama_client import OllamaClient
from clients.groq_client import GroqClient
from clients.openrouter_client import OpenRouterClient

from config import (
    BOOTSTRAP_DIR,
    MAX_RUNTIME_REPAIRS,
    MAX_TS_REPAIRS,
    MODELS,
    PROMPT_STRATEGIES,
)
from execution.jest_runner import run_jest, run_jest_service, run_jest_global
from execution.sandbox import (
    append_test_block,
    create_spec_file,
    ensure_append_marker,
    install_temp_spec,
    make_fn_id,
    normalize_content,
    remove_temp_spec,
    validate_generated_block,
)
from execution.typescript_validator import validate_typescript
from metrics.coverage import (
    extract_function_coverage,
    extract_service_coverage,
    extract_global_coverage,
    extract_test_metrics,
)
from persistence.csv_writer import save_result, save_service_result, save_global_result
from prompts.builder import build_prompt, build_repair_prompt
from prompts.loader import load_functions, load_prompt_template, load_system_prompt
from models.runtime_repair_result import RuntimeRepairResult
from models.method_generated_context import MethodGenerationContext
from models.function_definition import FunctionDefinition
from repair.orchestrator import repair_runtime_failure, RepairStats
from execution.stryker_runner import run_stryker_for_module
from utils.logging import logger


# ─────────────────────────────────────────────────────────────────────────────
# Grouping
# ─────────────────────────────────────────────────────────────────────────────

def group_functions_by_spec(
    functions: list[FunctionDefinition],
) -> dict[str, list[FunctionDefinition]]:
    grouped = defaultdict(list)
    for fn in functions:
        grouped[fn.test_output_file].append(fn)
    for spec_file in grouped:
        grouped[spec_file].sort(key=lambda fn: fn.line)
    return grouped


# ─────────────────────────────────────────────────────────────────────────────
# Bootstrap loading
# ─────────────────────────────────────────────────────────────────────────────

def load_bootstrap_content(test_output_file: str) -> tuple[str, Path]:
    spec_path = BOOTSTRAP_DIR / test_output_file
    if not spec_path.exists():
        raise FileNotFoundError(
            f"Bootstrap spec not found: {spec_path}. "
            "Run `npx tsx index.ts bootstrap` in ast-cli first."
        )
    return spec_path.read_text(encoding="utf-8"), spec_path


# ─────────────────────────────────────────────────────────────────────────────
# TypeScript repair loop
# ─────────────────────────────────────────────────────────────────────────────

def validate_and_repair_typescript(
    *,
    client,
    repair_system_prompt: str,
    generated_spec_path: Path,
) -> bool:
    for ts_attempt in range(1, MAX_TS_REPAIRS + 1):
        logger.info(f"TypeScript validation attempt={ts_attempt}")
        validation = validate_typescript(generated_spec_path)

        if validation.success:
            logger.info("TypeScript validation succeeded")
            return True

        logger.error(
            f"TypeScript validation failed\n"
            f"STDOUT:\n{validation.stdout}\n"
            f"STDERR:\n{validation.stderr}\n"
            f"RETURN CODE: {validation.returncode}"
        )

        current_spec = generated_spec_path.read_text(encoding="utf-8")
        repair_prompt = build_repair_prompt(
            spec_content=current_spec,
            ts_stdout=validation.stdout,
            jest_stderr=validation.stderr,
        )

        logger.info(f"Repairing TypeScript attempt={ts_attempt}")
        repair_response = client.generate(repair_system_prompt, repair_prompt)
        repaired = normalize_content(repair_response.content)
        repaired = ensure_append_marker(repaired)
        generated_spec_path.write_text(repaired, encoding="utf-8")

    logger.error("TypeScript validation failed permanently")
    return False


# ─────────────────────────────────────────────────────────────────────────────
# Runtime repair loop
# ─────────────────────────────────────────────────────────────────────────────

def is_typescript_error(stderr: str) -> bool:
    return "error TS" in stderr


def run_runtime_repair_loop(
    *,
    client,
    repair_system_prompt: str,
    repair_prompt: str,
    generated_spec_path: Path,
    test_output_file: str,
    target_source_file: str,
    method_metadata: MethodGenerationContext,
    # — new parameters —
    fn_id: str,
    line_start: int,
    line_end: int,
) -> RuntimeRepairResult:
    """
    Runs Jest scoped to fn_id (--testNamePattern), collects per-function
    coverage, and repairs failing it() blocks within describe(fn_id).

    failure_counts is created fresh here so it is always scoped to a
    single function, never shared across functions or loop iterations.
    """
    jest_result      = None
    fn_coverage      = {}
    test_metrics     = {}
    runtime_repairs  = 0
    failure_counts: dict[str, int] = defaultdict(int)   # ← fresh per function
    cumulative_repair = RepairStats()                   # ← accumulate across attempts

    for attempt in range(1, MAX_RUNTIME_REPAIRS + 1):
        logger.info(f"Installing temp spec attempt={attempt} {generated_spec_path}")

        temp_spec_path = install_temp_spec(
            generated_file=generated_spec_path,
            relative_output_path=test_output_file,
        )

        try:
            logger.info(
                f"Running Jest attempt={attempt} "
                f"pattern={fn_id} spec={temp_spec_path}"
            )

            jest_result = run_jest(
                temp_spec_path,
                target_source_file,
                test_name_pattern=fn_id,
            )

            # Collect coverage after every run; last successful or final
            # failed run is what gets persisted.
            fn_coverage  = extract_function_coverage(
                target_source_file, line_start, line_end
            )
            test_metrics = extract_test_metrics()

            logger.info(
                f"Jest attempt={attempt} success={jest_result.success}"
            )
            if jest_result.stderr:
                logger.debug(jest_result.stderr[:4000])

            if is_typescript_error(jest_result.stderr):
                logger.error("Runtime loop received TypeScript error")
                return RuntimeRepairResult(
                    success=False,
                    requires_typescript_repair=True,
                    jest_result=jest_result,
                    fn_coverage=fn_coverage,
                    test_metrics=test_metrics,
                    runtime_repairs=runtime_repairs,
                    repair_tokens=cumulative_repair.repair_tokens,
                    repair_success_count=cumulative_repair.repairs_applied,
                    repair_fail_count=cumulative_repair.repairs_failed,
                )

            if jest_result.success:
                break

            if attempt < MAX_RUNTIME_REPAIRS:
                runtime_repairs += 1
                logger.info(f"Runtime repair attempt={attempt}")

                repair_stats = repair_runtime_failure(
                    runtime_repairs=runtime_repairs,
                    client=client,
                    repair_system_prompt=repair_system_prompt,
                    repair_prompt=repair_prompt,
                    generated_spec_path=generated_spec_path,
                    jest_stderr=jest_result.stderr,
                    method_metadata=method_metadata,
                    describe_name=fn_id,
                    failure_counts=failure_counts,
                )

                cumulative_repair.repair_tokens   += repair_stats.repair_tokens
                cumulative_repair.repairs_applied += repair_stats.repairs_applied
                cumulative_repair.repairs_failed  += repair_stats.repairs_failed

                logger.info(
                    f"attempt={attempt} "
                    f"repairs_applied={repair_stats.repairs_applied} "
                    f"repairs_failed={repair_stats.repairs_failed} "
                    f"tokens={repair_stats.repair_tokens}"
                )

        finally:
            logger.info(f"Removing temp spec {temp_spec_path}")
            remove_temp_spec(temp_spec_path)

    return RuntimeRepairResult(
        success=jest_result.success if jest_result else False,
        requires_typescript_repair=False,
        jest_result=jest_result,
        fn_coverage=fn_coverage,
        test_metrics=test_metrics,
        runtime_repairs=runtime_repairs,
        repair_tokens=cumulative_repair.repair_tokens,
        repair_success_count=cumulative_repair.repairs_applied,
        repair_fail_count=cumulative_repair.repairs_failed,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Context builder
# ─────────────────────────────────────────────────────────────────────────────

def build_method_generation_context(
    *,
    function_data: FunctionDefinition,
    bootstrap_content: str,
    generated_spec_path: Path,
) -> MethodGenerationContext:
    return MethodGenerationContext(
        method_name=function_data.name,
        source_file=function_data.source_file,
        test_output_file=function_data.test_output_file,
        focused_source=function_data.context.methodSource,
        relevant_dtos=function_data.context.relevantDtos,
        relevant_enums=function_data.context.relevantEnums,
        bootstrap_content=bootstrap_content,
        generated_spec_path=generated_spec_path,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Experiment
# ─────────────────────────────────────────────────────────────────────────────

def run_experiment() -> None:
    functions = load_functions()
    grouped_functions = group_functions_by_spec(functions)

    for model_key, config in MODELS.items():
        provider   = config["provider"]
        model_name = config["model"]

        if provider == "groq":
            client = GroqClient(model_name)
        elif provider == "openrouter":
            client = OpenRouterClient(model_name)
        elif provider == "ollama":
            client = OllamaClient(model_name)
        else:
            raise ValueError(f"Unknown provider: {provider}")

        incremental_system_prompt       = load_system_prompt("incremental")
        typescript_repair_system_prompt = load_system_prompt("full_spec_repair")
        runtime_repair_system_prompt    = load_system_prompt("repair")
 
        for strategy in PROMPT_STRATEGIES:
            logger.info(f"Running model={model_key} strategy={strategy}")

            runtime_repair_prompt              = load_prompt_template("repair", strategy)

            # Track all generated specs for the global run at end of strategy
            all_generated_specs: list[tuple[Path, str, str]] = []
            # (generated_spec_path, source_file, test_output_file)

            for test_output_file, file_functions in grouped_functions.items():
                logger.info(f"Generating spec file={test_output_file}")

                # Derive module-level source file (same for all fns in group)
                source_file = file_functions[0].source_file

                try:
                    # ──────────────────────────────────────────────────────────
                    # STEP 1 — LOAD BOOTSTRAP
                    # ──────────────────────────────────────────────────────────
                    bootstrap_content, b_generated_spec_path = load_bootstrap_content(
                        test_output_file
                    )

                    generated_spec_path = create_spec_file(
                        model=model_key,
                        strategy=strategy,
                        test_output_file=test_output_file,
                        content=bootstrap_content,
                    )

                    context = None

                    for function_data in file_functions:
                        logger.info(
                            f"Generating tests function={function_data.name}"
                        )

                        # Deterministic wrapper identifier for this function
                        fn_id = make_fn_id(function_data.name)

                        try:
                            # ──────────────────────────────────────────────────
                            # STEP 2 — BUILD PROMPT
                            # ──────────────────────────────────────────────────
                            prompt = build_prompt(
                                strategy=strategy,
                                function_data=function_data,
                                existing_spec_file=b_generated_spec_path,
                            )

                            context = build_method_generation_context(
                                function_data=function_data,
                                bootstrap_content=bootstrap_content,
                                generated_spec_path=generated_spec_path,
                            )

                            # ──────────────────────────────────────────────────
                            # STEP 3 — GENERATE
                            # ──────────────────────────────────────────────────
                            response = client.generate(
                                incremental_system_prompt, prompt
                            )

                            logger.debug(
                                f"build prompt response in "
                                f"{response.duration_ns}s = {response.content}"
                            )

                            test_block = response.content

                            if test_block is None:
                                logger.warning(
                                    f"test_block is empty function={function_data.name}"
                                )
                                save_result({
                                    "model":              model_key,
                                    "strategy":           strategy,
                                    "module":             function_data.module,
                                    "function":           function_data.name,
                                    "ccm":                function_data.ccm,
                                    "range":              function_data.range,
                                    "duration_ns":   response.duration_ns,
                                    "tokens":             response.tokens,
                                    "generation_success": False,
                                    "error":              "test_block_is_empty",
                                })
                                continue

                            if not validate_generated_block(test_block):
                                logger.warning(
                                    f"Invalid block function={function_data.name}"
                                )
                                save_result({
                                    "model":              model_key,
                                    "strategy":           strategy,
                                    "module":             function_data.module,
                                    "function":           function_data.name,
                                    "ccm":                function_data.ccm,
                                    "range":              function_data.range,
                                    "duration_ns":   response.duration_ns,
                                    "tokens":             response.tokens,
                                    "generation_success": False,
                                    "error":              "invalid_block",
                                })
                                continue

                            # ──────────────────────────────────────────────────
                            # STEP 4 — APPEND  (wrapped in describe(fn_id))
                            # ──────────────────────────────────────────────────
                            append_test_block(
                                spec_file=generated_spec_path,
                                content=test_block,
                                fn_id=fn_id,
                            )

                            # ──────────────────────────────────────────────────
                            # STEP 5 — RUNTIME LOOP  (scoped to fn_id)
                            # ──────────────────────────────────────────────────
                            runtime_result = run_runtime_repair_loop(
                                client=client,
                                repair_system_prompt=runtime_repair_system_prompt,
                                repair_prompt=runtime_repair_prompt,
                                generated_spec_path=generated_spec_path,
                                test_output_file=test_output_file,
                                target_source_file=source_file,
                                method_metadata=context,
                                fn_id=fn_id,
                                line_start=function_data.line,
                                line_end=function_data.end_line,
                            )

                            # ──────────────────────────────────────────────────
                            # STEP 6 — TS REPAIR FROM RUNTIME (if needed)
                            # ──────────────────────────────────────────────────
                            if runtime_result.requires_typescript_repair:
                                ts_success = validate_and_repair_typescript(
                                    client=client,
                                    repair_system_prompt=typescript_repair_system_prompt,
                                    generated_spec_path=generated_spec_path,
                                )

                                if ts_success:
                                    runtime_result = run_runtime_repair_loop(
                                        client=client,
                                        repair_system_prompt=runtime_repair_system_prompt,
                                        repair_prompt=runtime_repair_prompt,
                                        generated_spec_path=generated_spec_path,
                                        test_output_file=test_output_file,
                                        target_source_file=source_file,
                                        method_metadata=context,
                                        fn_id=fn_id,
                                        line_start=function_data.line,
                                        line_end=function_data.end_line,
                                    )

                            # ──────────────────────────────────────────────────
                            # STEP 7 — SAVE PER-FUNCTION METRICS  (Level 1)
                            # ──────────────────────────────────────────────────
                            save_result({
                                "model":                       model_key,
                                "strategy":                    strategy,
                                "module":                      function_data.module,
                                "function":                    function_data.name,
                                "fn_id":                       fn_id,
                                "source_file":                 source_file,
                                "test_output_file":            test_output_file,
                                "ccm":                         function_data.ccm,
                                "range":                       function_data.range,
                                "line_start":                  function_data.line,
                                "line_end":                    function_data.end_line,
                                "duration_ns":            response.duration_ns,
                                "tokens":                      response.tokens,
                                "generation_success":          True,
                                "jest_success":                (
                                    runtime_result.jest_result.success
                                    if runtime_result.jest_result else False
                                ),
                                "runtime_repairs":             runtime_result.runtime_repairs,
                                "repair_tokens":               runtime_result.repair_tokens,
                                "repair_success_count":        runtime_result.repair_success_count,
                                "repair_fail_count":           runtime_result.repair_fail_count,
                                "requires_typescript_repair":  runtime_result.requires_typescript_repair,
                                **(runtime_result.test_metrics or {}),
                                **(runtime_result.fn_coverage or {}),
                            })

                        except Exception as exc:
                            logger.exception(exc)
                            save_result({
                                "model":    model_key,
                                "strategy": strategy,
                                "module":   function_data.module,
                                "function": function_data.name,
                                "ccm":      function_data.ccm,
                                "range":    function_data.range,
                                "fatal_error": str(exc),
                            })

                    # ──────────────────────────────────────────────────────────
                    # STEP 8 — SERVICE-LEVEL COVERAGE  (Level 2)
                    # Run full spec (all functions, no pattern) once per module.
                    # ──────────────────────────────────────────────────────────
                    all_generated_specs.append(
                        (generated_spec_path, source_file, test_output_file)
                    )

                    temp_spec = install_temp_spec(
                        generated_file=generated_spec_path,
                        relative_output_path=test_output_file,
                    )
                    try:
                        logger.info(
                            f"Service-level Jest run: module={file_functions[0].module}"
                        )
                        run_jest_service(temp_spec, source_file)
                        svc_coverage = extract_service_coverage(source_file)
                        svc_metrics  = extract_test_metrics()

                        save_service_result({
                            "model":            model_key,
                            "strategy":         strategy,
                            "module":           file_functions[0].module,
                            "source_file":      source_file,
                            "test_output_file": test_output_file,
                            **svc_metrics,
                            **svc_coverage,
                        })
                    except Exception as exc:
                        logger.exception(
                            f"Service coverage failed for {test_output_file}: {exc}"
                        )
                    finally:
                        remove_temp_spec(temp_spec)

                except Exception as exc:
                    logger.exception(exc)
                    save_result({
                        "model":            model_key,
                        "strategy":         strategy,
                        "module":           file_functions[0].module if file_functions else "",
                        "test_output_file": test_output_file,
                        "fatal_error":      str(exc),
                    })

            # ──────────────────────────────────────────────────────────────────
            # STEP 9 — GLOBAL COVERAGE  (Level 3)
            # Run all specs together once per model × strategy.
            # ──────────────────────────────────────────────────────────────────
            temp_specs: list[Path] = []
            try:
                logger.info(
                    f"Global Jest run: model={model_key} strategy={strategy}"
                )
                for gen_path, _src, out_path in all_generated_specs:
                    temp_specs.append(
                        install_temp_spec(
                            generated_file=gen_path,
                            relative_output_path=out_path,
                        )
                    )

                run_jest_global(temp_specs)
                global_coverage = extract_global_coverage()
                global_metrics  = extract_test_metrics()

                save_global_result({
                    "model":    model_key,
                    "strategy": strategy,
                    **global_metrics,
                    **global_coverage,
                })

            except Exception as exc:
                logger.exception(
                    f"Global coverage failed model={model_key} "
                    f"strategy={strategy}: {exc}"
                )
            finally:
                for tp in temp_specs:
                    remove_temp_spec(tp)


if __name__ == "__main__":
    run_experiment()