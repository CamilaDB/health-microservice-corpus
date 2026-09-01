import hashlib
import json
from datetime import datetime, timezone
from collections import defaultdict
from pathlib import Path

from clients.ollama_client import OllamaClient
from clients.groq_client import GroqClient
from clients.openrouter_client import OpenRouterClient
from corpus_provenance import corpus_fingerprint

from config import (
    BOOTSTRAP_DIR,
    CORPUS_DIR,
    ERROR_EVENT_SCHEMA_VERSION,
    MAX_RUNTIME_REPAIRS,
    MAX_TS_REPAIRS,
    MODELS,
    PROMPT_STRATEGIES,
    FUNCTIONS_FILE,
    RUN_ID,
    RUNS_DIR,
    TEMPERATURE,
    MAX_TOKENS,
)
from execution.jest_runner import run_jest, run_jest_service, run_jest_global
from execution.sandbox import (
    append_test_block,
    create_spec_file,
    ensure_append_marker,
    function_wrapper_blocks,
    install_temp_spec,
    make_fn_id,
    normalize_content,
    remove_temp_spec,
    snapshot_spec_file,
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
from persistence.error_events import record_error_event
from prompts.builder import build_prompt, build_repair_prompt
from prompts.loader import load_functions, load_prompt_template, load_system_prompt
from models.error_event import EventContext
from models.runtime_repair_result import RuntimeRepairResult
from models.method_generated_context import MethodGenerationContext
from models.function_definition import FunctionDefinition
from repair.orchestrator import repair_runtime_failure, RepairStats, skip_failed_tests_for_function
from repair.parser import parse_jest_failures
from utils.error_classification import (
    classify_generation_empty,
    classify_generation_invalid,
    classify_generation_exception,
    classify_typescript_failure,
    classify_jest_failure,
    classify_repair_unparseable,
    classify_repair_failed,
    classify_repair_max_exceeded,
    classify_pipeline_exception,
    classify_pipeline_rollback,
    classify_pipeline_artifact_corruption,
)
from utils.logging import logger


def group_functions_by_spec(
    functions: list[FunctionDefinition],
) -> dict[str, list[FunctionDefinition]]:
    grouped = defaultdict(list)
    for fn in functions:
        grouped[fn.test_output_file].append(fn)
    for spec_file in grouped:
        grouped[spec_file].sort(key=lambda fn: fn.line)
    return grouped


def _empty_test_aggregate() -> dict:
    return {
        "total_tests": 0,
        "passed_tests": 0,
        "failed_tests": 0,
        "pending_tests": 0,
        "functions_total": 0,
        "functions_generation_success": 0,
        "functions_jest_success": 0,
        "functions_jest_failed": 0,
    }


def _update_function_aggregate(aggregate: dict, result_row: dict) -> None:
    """
    Feeds only the supplemental service/global "sum_of_valid_functions"
    diagnostics (module_aggregate / strategy_aggregates) -- never the
    primary function-level results.csv rows, which are written directly
    from result_row regardless of this function.

    Restricted to artifact_disposition == "accepted": that is the set of
    functions whose test block is actually present in the merged spec
    file that run_jest_service / run_jest_global go on to execute, so the
    "sum_of_valid_functions" label reflects only functions genuinely
    contributing to that run.
    """
    if result_row.get("artifact_disposition") != "accepted":
        return

    aggregate["functions_total"] += 1

    if result_row.get("generation_success") is True:
        aggregate["functions_generation_success"] += 1

    jest_success = result_row.get("jest_success")
    if jest_success is True:
        aggregate["functions_jest_success"] += 1
    elif jest_success is False:
        aggregate["functions_jest_failed"] += 1

    for key in ("total_tests", "passed_tests", "failed_tests", "pending_tests"):
        value = result_row.get(key)
        if value is None:
            continue
        if isinstance(value, (int, float)) and value >= 0:
            aggregate[key] += int(value)


def _build_aggregate_metrics(aggregate: dict) -> dict:
    return {
        "total_tests": aggregate["total_tests"],
        "passed_tests": aggregate["passed_tests"],
        "failed_tests": aggregate["failed_tests"],
        "pending_tests": aggregate["pending_tests"],
        "functions_total": aggregate["functions_total"],
        "functions_generation_success": aggregate["functions_generation_success"],
        "functions_jest_success": aggregate["functions_jest_success"],
        "functions_jest_failed": aggregate["functions_jest_failed"],
    }


def write_run_manifest(functions: list[FunctionDefinition]) -> None:
    """Record immutable inputs/configuration needed to reproduce a run."""
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    ast_envelope = json.loads(FUNCTIONS_FILE.read_text(encoding="utf-8"))
    prompt_hashes = {}
    for strategy in PROMPT_STRATEGIES:
        prompt = load_prompt_template(strategy, strategy)
        repair = load_prompt_template("repair", strategy)
        prompt_hashes[strategy] = {
            "generation_sha256": hashlib.sha256(prompt.encode()).hexdigest(),
            "repair_sha256": hashlib.sha256(repair.encode()).hexdigest(),
        }
    manifest = {
        "run_id": RUN_ID,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "unit_of_analysis": "model_x_strategy_x_target_function",
        "models": MODELS,
        "strategies": PROMPT_STRATEGIES,
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
        "max_runtime_repairs": MAX_RUNTIME_REPAIRS,
        "max_typescript_repairs": MAX_TS_REPAIRS,
        "ast_generated_at": ast_envelope.get("generated_at"),
        "target_count": len(functions),
        "targets": [
            {
                "source_file": fn.source_file,
                "function": fn.name,
                "line_start": fn.line,
                "line_end": fn.end_line,
                "source_hash": fn.source_hash,
            }
            for fn in functions
        ],
        "corpus_provenance": corpus_fingerprint(CORPUS_DIR),
        "prompt_hashes": prompt_hashes,
        "error_event_schema_version": ERROR_EVENT_SCHEMA_VERSION,
    }
    (RUNS_DIR / f"{RUN_ID}.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8"
    )


def load_bootstrap_content(test_output_file: str) -> tuple[str, Path]:
    spec_path = BOOTSTRAP_DIR / test_output_file
    if not spec_path.exists():
        raise FileNotFoundError(
            f"Bootstrap spec not found: {spec_path}. "
            "Run `npx tsx index.ts bootstrap` in ast-cli first."
        )
    return spec_path.read_text(encoding="utf-8"), spec_path


def ensure_function_block_is_skipped(*, generated_spec_path: Path, fn_id: str, jest_stderr: str | None) -> bool:
    if not jest_stderr:
        logger.warning(f"Skipping function '{fn_id}' without stderr; no safe fallback available.")
        return False
    return skip_failed_tests_for_function(
        generated_spec_path=generated_spec_path,
        describe_name=fn_id,
        jest_stderr=jest_stderr,
    )


def validate_and_repair_typescript(
    *,
    client,
    repair_system_prompt: str,
    generated_spec_path: Path,
    test_output_file: str,
    protected_spec_path: Path,
    event_ctx: EventContext | None = None,
) -> bool:
    protected_blocks = function_wrapper_blocks(
        protected_spec_path.read_text(encoding="utf-8")
    )
    for ts_attempt in range(1, MAX_TS_REPAIRS + 1):
        logger.info(f"TypeScript validation attempt={ts_attempt}")
        installed_spec = install_temp_spec(
            generated_file=generated_spec_path,
            relative_output_path=test_output_file,
        )
        try:
            validation = validate_typescript(installed_spec)
        finally:
            remove_temp_spec(installed_spec)

        if validation.success:
            logger.info("TypeScript validation succeeded")
            return True

        logger.error(
            f"TypeScript validation failed\n"
            f"STDOUT:\n{validation.stdout}\n"
            f"STDERR:\n{validation.stderr}\n"
            f"RETURN CODE: {validation.returncode}"
        )

        # tsc writes diagnostics to stdout; prefer it, fall back to stderr.
        diagnostic_text = validation.stdout.strip() or validation.stderr.strip()
        ts_category, ts_subcategory = classify_typescript_failure(diagnostic_text)
        record_error_event(
            event_ctx,
            phase="typescript",
            error_category=ts_category,
            error_subcategory=ts_subcategory,
            error_message=diagnostic_text[:500],
            attempt=ts_attempt,
            raw_text=f"STDOUT:\n{validation.stdout}\n\nSTDERR:\n{validation.stderr}",
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
        repaired_blocks = function_wrapper_blocks(repaired)
        changed = [
            fn_id for fn_id, block in protected_blocks.items()
            if repaired_blocks.get(fn_id) != block
        ]
        if changed:
            logger.error(
                "Rejecting TypeScript repair because it modified previously "
                f"accepted function wrappers: {', '.join(changed)}"
            )
            corruption_category, corruption_subcategory = classify_pipeline_artifact_corruption()
            record_error_event(
                event_ctx,
                phase="pipeline",
                error_category=corruption_category,
                error_subcategory=corruption_subcategory,
                error_message=(
                    "TypeScript repair modified previously accepted function "
                    f"wrappers: {', '.join(changed)}"
                ),
                attempt=ts_attempt,
            )
            return False
        generated_spec_path.write_text(repaired, encoding="utf-8")

    logger.error("TypeScript validation failed permanently")
    ts_exhausted_category, ts_exhausted_subcategory = classify_repair_max_exceeded()
    record_error_event(
        event_ctx,
        phase="repair",
        error_category=ts_exhausted_category,
        error_subcategory=ts_exhausted_subcategory,
        error_message=f"TypeScript repair exhausted MAX_TS_REPAIRS={MAX_TS_REPAIRS} attempts",
        attempt=MAX_TS_REPAIRS,
    )
    return False


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
    event_ctx: EventContext | None = None,
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
            test_metrics = extract_test_metrics(fn_id=fn_id)

            logger.info(
                f"Jest attempt={attempt} success={jest_result.success}"
            )
            if jest_result.stderr:
                logger.debug(jest_result.stderr[:4000])

            if is_typescript_error(jest_result.stderr):
                logger.error("Runtime loop received TypeScript error")
                ts_category, ts_subcategory = classify_typescript_failure(jest_result.stderr)
                record_error_event(
                    event_ctx,
                    phase="typescript",
                    error_category=ts_category,
                    error_subcategory=ts_subcategory,
                    error_message=jest_result.stderr[:500],
                    attempt=attempt,
                    raw_text=jest_result.stderr,
                )
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

            # ── Primary failure events (jest phase) ─────────────────────
            # One event per attributable failing test; a single fallback
            # event when Jest failed but no individual test could be
            # attributed (e.g. a crash before any assertion ran).
            test_discovery_failed = test_metrics.get("total_tests") == -1
            failures = parse_jest_failures(jest_result.stderr)
            if failures:
                for failure in failures:
                    jest_category, jest_subcategory = classify_jest_failure(
                        test_discovery_failed=test_discovery_failed,
                        error_type=failure.error_type,
                        raw_text=jest_result.stderr,
                    )
                    record_error_event(
                        event_ctx,
                        phase="jest",
                        error_category=jest_category,
                        error_subcategory=jest_subcategory,
                        error_message=f"{failure.test_name}: {failure.error_message}",
                        attempt=attempt,
                        raw_text=jest_result.stderr,
                    )
            else:
                jest_category, jest_subcategory = classify_jest_failure(
                    test_discovery_failed=test_discovery_failed,
                    error_type=None,
                    raw_text=jest_result.stderr,
                )
                record_error_event(
                    event_ctx,
                    phase="jest",
                    error_category=jest_category,
                    error_subcategory=jest_subcategory,
                    error_message=(jest_result.stderr or "")[:500],
                    attempt=attempt,
                    raw_text=jest_result.stderr,
                )

            if attempt < MAX_RUNTIME_REPAIRS:
                runtime_repairs += 1
                logger.info(f"Runtime repair attempt={attempt}")

                # ── Recovery-action classification (repair phase) ───────
                # A separate event from the primary jest-phase failure(s)
                # above: this describes whether the repair mechanism itself
                # could act on the failure, not the failure itself.
                if not failures:
                    unparseable_category, unparseable_subcategory = classify_repair_unparseable()
                    record_error_event(
                        event_ctx,
                        phase="repair",
                        error_category=unparseable_category,
                        error_subcategory=unparseable_subcategory,
                        error_message=(
                            "0 failures parsed from Jest output; whole-file "
                            "repair is disabled for this attempt."
                        ),
                        attempt=attempt,
                    )

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

                if failures and repair_stats.repairs_applied == 0 and repair_stats.repairs_failed > 0:
                    failed_category, failed_subcategory = classify_repair_failed()
                    record_error_event(
                        event_ctx,
                        phase="repair",
                        error_category=failed_category,
                        error_subcategory=failed_subcategory,
                        error_message=(
                            f"{repair_stats.repairs_failed} repair attempt(s) "
                            "did not produce a valid fix"
                        ),
                        attempt=attempt,
                    )

        finally:
            logger.info(f"Removing temp spec {temp_spec_path}")
            remove_temp_spec(temp_spec_path)

    if jest_result is not None and not jest_result.success:
        exhausted_category, exhausted_subcategory = classify_repair_max_exceeded()
        record_error_event(
            event_ctx,
            phase="repair",
            error_category=exhausted_category,
            error_subcategory=exhausted_subcategory,
            error_message=f"Runtime repair exhausted MAX_RUNTIME_REPAIRS={MAX_RUNTIME_REPAIRS} attempts",
            attempt=MAX_RUNTIME_REPAIRS,
        )

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
    write_run_manifest(functions)
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

        strategy_aggregates: dict[tuple[str, str], dict] = {}

        for strategy in PROMPT_STRATEGIES:
            logger.info(f"Running model={model_key} strategy={strategy}")

            runtime_repair_prompt              = load_prompt_template("repair", strategy)
            strategy_aggregates[(model_key, strategy)] = _empty_test_aggregate()

            # Track all generated specs for the global run at end of strategy
            all_generated_specs: list[tuple[Path, str, str]] = []
            # (generated_spec_path, source_file, test_output_file)

            for test_output_file, file_functions in grouped_functions.items():
                logger.info(f"Generating spec file={test_output_file}")

                module_aggregate = _empty_test_aggregate()

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

                        # Identity for error-event logging only -- read-only,
                        # never influences generation/repair/result behavior.
                        event_ctx = EventContext(
                            run_id=RUN_ID,
                            model=model_key,
                            strategy=strategy,
                            module=function_data.module,
                            function_name=function_data.name,
                            fn_id=fn_id,
                            source_file=source_file,
                            line_start=function_data.line,
                            line_end=function_data.end_line,
                            source_hash=function_data.source_hash,
                        )

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
                            try:
                                response = client.generate(
                                    incremental_system_prompt, prompt
                                )
                            except Exception as gen_exc:
                                # Logged at the finer generation-phase
                                # granularity, then re-raised unchanged so
                                # the outer except below still handles it
                                # exactly as before (runner_exception).
                                gen_category, gen_subcategory = classify_generation_exception()
                                record_error_event(
                                    event_ctx,
                                    phase="generation",
                                    error_category=gen_category,
                                    error_subcategory=gen_subcategory,
                                    error_message=str(gen_exc)[:500],
                                )
                                raise

                            logger.debug(
                                f"build prompt response in "
                                f"{response.duration_ns}s = {response.content}"
                            )

                            test_block = response.content

                            if test_block is None:
                                logger.warning(
                                    f"test_block is empty function={function_data.name}"
                                )
                                result_row = {
                                    "model":              model_key,
                                    "strategy":           strategy,
                                    "module":             function_data.module,
                                    "function":           function_data.name,
                                    "fn_id":              fn_id,
                                    "source_file":        source_file,
                                    "test_output_file":   test_output_file,
                                    "line_start":         function_data.line,
                                    "line_end":           function_data.end_line,
                                    "source_hash":        function_data.source_hash,
                                    "ccm":                function_data.ccm,
                                    "range":              function_data.range,
                                    "duration_ns":   response.duration_ns,
                                    "tokens":             response.tokens,
                                    "generation_success": False,
                                    "analysis_eligible":  False,
                                    "execution_status":   "generation_empty",
                                    "error":              "test_block_is_empty",
                                }
                                empty_category, empty_subcategory = classify_generation_empty()
                                record_error_event(
                                    event_ctx,
                                    phase="generation",
                                    error_category=empty_category,
                                    error_subcategory=empty_subcategory,
                                    error_message="test_block_is_empty",
                                )
                                save_result(result_row)
                                _update_function_aggregate(
                                    strategy_aggregates[(model_key, strategy)],
                                    result_row,
                                )
                                _update_function_aggregate(
                                    module_aggregate,
                                    result_row,
                                )
                                continue

                            if not validate_generated_block(test_block):
                                logger.warning(
                                    f"Invalid block function={function_data.name}"
                                )
                                result_row = {
                                    "model":              model_key,
                                    "strategy":           strategy,
                                    "module":             function_data.module,
                                    "function":           function_data.name,
                                    "fn_id":              fn_id,
                                    "source_file":        source_file,
                                    "test_output_file":   test_output_file,
                                    "line_start":         function_data.line,
                                    "line_end":           function_data.end_line,
                                    "source_hash":        function_data.source_hash,
                                    "ccm":                function_data.ccm,
                                    "range":              function_data.range,
                                    "duration_ns":   response.duration_ns,
                                    "tokens":             response.tokens,
                                    "generation_success": False,
                                    "analysis_eligible":  False,
                                    "execution_status":   "generation_invalid",
                                    "error":              "invalid_block",
                                }
                                invalid_category, invalid_subcategory = classify_generation_invalid()
                                record_error_event(
                                    event_ctx,
                                    phase="generation",
                                    error_category=invalid_category,
                                    error_subcategory=invalid_subcategory,
                                    error_message="invalid_block: forbidden pattern or unclosed scopes",
                                    raw_text=test_block,
                                )
                                save_result(result_row)
                                _update_function_aggregate(
                                    strategy_aggregates[(model_key, strategy)],
                                    result_row,
                                )
                                _update_function_aggregate(
                                    module_aggregate,
                                    result_row,
                                )
                                continue

                            # ──────────────────────────────────────────────────
                            # STEP 4 — APPEND  (wrapped in describe(fn_id))
                            # Keep a safety snapshot before mutating the cumulative spec.
                            # If the function later fails irrecoverably, we restore this
                            # backup instead of leaving a broken block in the shared file.
                            # ──────────────────────────────────────────────────
                            backup_path = snapshot_spec_file(
                                generated_spec_path=generated_spec_path,
                                fn_id=fn_id,
                            )
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
                                event_ctx=event_ctx,
                            )

                            # ──────────────────────────────────────────────────
                            # STEP 6 — TS REPAIR FROM RUNTIME (if needed)
                            # ──────────────────────────────────────────────────
                            ts_repair_failed = False
                            if runtime_result.requires_typescript_repair:
                                ts_success = validate_and_repair_typescript(
                                    client=client,
                                    repair_system_prompt=typescript_repair_system_prompt,
                                    generated_spec_path=generated_spec_path,
                                    test_output_file=test_output_file,
                                    protected_spec_path=backup_path,
                                    event_ctx=event_ctx,
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
                                        event_ctx=event_ctx,
                                    )
                                else:
                                    ts_repair_failed = True

                            artifact_disposition = "accepted"
                            if (
                                runtime_result.jest_result is not None
                                and not runtime_result.jest_result.success
                            ):
                                if ts_repair_failed:
                                    # it.skip() only stops the test from running; the
                                    # skipped body is still type-checked by tsc. A
                                    # permanent TypeScript failure survives the skip,
                                    # leaving a non-compiling shared spec file that
                                    # would fail Jest for every function appended
                                    # afterward. Always roll back instead of skipping.
                                    logger.warning(
                                        f"Function '{function_data.name}' left the spec "
                                        "file in a non-compiling state after exhausting "
                                        "TypeScript repairs; skip is not a valid recovery "
                                        "here — forcing full rollback."
                                    )
                                    skipped = False
                                else:
                                    skipped = ensure_function_block_is_skipped(
                                        generated_spec_path=generated_spec_path,
                                        fn_id=fn_id,
                                        jest_stderr=runtime_result.jest_result.stderr,
                                    )
                                artifact_disposition = "skipped" if skipped else "restored"
                                if not skipped and backup_path.exists():
                                    logger.warning(
                                        f"Function '{function_data.name}' failed irrecoverably; "
                                        f"restoring snapshot before fn_id={fn_id}"
                                    )
                                    generated_spec_path.write_text(
                                        backup_path.read_text(encoding="utf-8"),
                                        encoding="utf-8",
                                    )
                                    # A distinct recovery-action event, separate
                                    # from the primary jest/typescript failure
                                    # event(s) already recorded above for this
                                    # attempt.
                                    rollback_category, rollback_subcategory = classify_pipeline_rollback()
                                    record_error_event(
                                        event_ctx,
                                        phase="pipeline",
                                        error_category=rollback_category,
                                        error_subcategory=rollback_subcategory,
                                        error_message=(
                                            f"Function '{function_data.name}' failed "
                                            "irrecoverably; rolled back to the last "
                                            "known-good snapshot."
                                        ),
                                        artifact_disposition=artifact_disposition,
                                    )

                            # ──────────────────────────────────────────────────
                            # STEP 7 — SAVE PER-FUNCTION METRICS  (Level 1)
                            # ──────────────────────────────────────────────────
                            result_row = {
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
                                "source_hash":                 function_data.source_hash,
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
                                "analysis_eligible":           bool(
                                    runtime_result.jest_result
                                    and runtime_result.jest_result.success
                                ),
                                "execution_status":             (
                                    "jest_success"
                                    if runtime_result.jest_result
                                    and runtime_result.jest_result.success
                                    else "jest_failed"
                                ),
                                "artifact_disposition":         artifact_disposition,
                                **(runtime_result.test_metrics or {}),
                                **(runtime_result.fn_coverage or {}),
                            }
                            save_result(result_row)
                            _update_function_aggregate(
                                strategy_aggregates[(model_key, strategy)],
                                result_row,
                            )
                            _update_function_aggregate(
                                module_aggregate,
                                result_row,
                            )
                            if backup_path.exists():
                                backup_path.unlink()

                        except Exception as exc:
                            logger.exception(exc)
                            result_row = {
                                "model":    model_key,
                                "strategy": strategy,
                                "module":   function_data.module,
                                "function": function_data.name,
                                "fn_id":    fn_id,
                                "source_file":      source_file,
                                "test_output_file": test_output_file,
                                "line_start": function_data.line,
                                "line_end":   function_data.end_line,
                                "ccm":      function_data.ccm,
                                "range":    function_data.range,
                                "source_hash": function_data.source_hash,
                                "analysis_eligible": False,
                                "execution_status": "runner_exception",
                                "fatal_error": str(exc),
                            }
                            exc_category, exc_subcategory = classify_pipeline_exception()
                            record_error_event(
                                event_ctx,
                                phase="pipeline",
                                error_category=exc_category,
                                error_subcategory=exc_subcategory,
                                error_message=str(exc)[:500],
                            )
                            save_result(result_row)
                            _update_function_aggregate(
                                strategy_aggregates[(model_key, strategy)],
                                result_row,
                            )
                            _update_function_aggregate(
                                module_aggregate,
                                result_row,
                            )

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
                        service_jest_result = run_jest_service(temp_spec, source_file)
                        svc_coverage = (
                            extract_service_coverage(source_file)
                            if service_jest_result.success
                            else {
                                "svc_statements_total": None,
                                "svc_statements_covered": None,
                                "svc_statements_pct": None,
                                "svc_branches_total": None,
                                "svc_branches_covered": None,
                                "svc_branches_pct": None,
                                "svc_functions_total": None,
                                "svc_functions_covered": None,
                                "svc_functions_pct": None,
                                "svc_lines_total": None,
                                "svc_lines_covered": None,
                                "svc_lines_pct": None,
                            }
                        )
                        svc_metrics = _build_aggregate_metrics(module_aggregate)

                        save_service_result({
                            "model":            model_key,
                            "strategy":         strategy,
                            "module":           file_functions[0].module,
                            "source_file":      source_file,
                            "test_output_file": test_output_file,
                            "execution_failed": not service_jest_result.success,
                            "test_metrics_source": "sum_of_valid_functions",
                            **svc_metrics,
                            **svc_coverage,
                        })
                    except Exception as exc:
                        logger.exception(
                            f"Service coverage failed for {test_output_file}: {exc}"
                        )
                        save_service_result({
                            "model":            model_key,
                            "strategy":         strategy,
                            "module":           file_functions[0].module,
                            "source_file":      source_file,
                            "test_output_file": test_output_file,
                            "execution_failed": True,
                            "test_metrics_source": "sum_of_valid_functions",
                            **_build_aggregate_metrics(module_aggregate),
                            "svc_statements_total": None,
                            "svc_statements_covered": None,
                            "svc_statements_pct": None,
                            "svc_branches_total": None,
                            "svc_branches_covered": None,
                            "svc_branches_pct": None,
                            "svc_functions_total": None,
                            "svc_functions_covered": None,
                            "svc_functions_pct": None,
                            "svc_lines_total": None,
                            "svc_lines_covered": None,
                            "svc_lines_pct": None,
                        })
                    finally:
                        remove_temp_spec(temp_spec)

                except Exception as exc:
                    logger.exception(exc)
                    # A single malformed row here (missing source_file/line_start/
                    # line_end) would degrade the upsert identity down to just
                    # (run_id, model, strategy) and silently wipe out every
                    # already-saved row for this model x strategy. This failure
                    # is group-wide (e.g. the bootstrap spec could not be loaded),
                    # so attribute it explicitly to every function in the group
                    # instead, each with a fully-qualified identity.
                    for function_data in file_functions:
                        save_result({
                            "model":            model_key,
                            "strategy":         strategy,
                            "module":           function_data.module,
                            "function":         function_data.name,
                            "fn_id":            make_fn_id(function_data.name),
                            "source_file":      function_data.source_file,
                            "test_output_file": test_output_file,
                            "line_start":       function_data.line,
                            "line_end":         function_data.end_line,
                            "source_hash":      function_data.source_hash,
                            "analysis_eligible": False,
                            "execution_status": "spec_group_fatal_error",
                            "fatal_error":      str(exc),
                        })
                        group_exc_category, group_exc_subcategory = classify_pipeline_exception()
                        record_error_event(
                            EventContext(
                                run_id=RUN_ID,
                                model=model_key,
                                strategy=strategy,
                                module=function_data.module,
                                function_name=function_data.name,
                                fn_id=make_fn_id(function_data.name),
                                source_file=function_data.source_file,
                                line_start=function_data.line,
                                line_end=function_data.end_line,
                                source_hash=function_data.source_hash,
                            ),
                            phase="pipeline",
                            error_category=group_exc_category,
                            error_subcategory=group_exc_subcategory,
                            error_message=str(exc)[:500],
                        )

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

                global_jest_result = run_jest_global(temp_specs)
                global_coverage = (
                    extract_global_coverage()
                    if global_jest_result.success
                    else {
                        "global_statements_total": None,
                        "global_statements_covered": None,
                        "global_statements_pct": None,
                        "global_branches_total": None,
                        "global_branches_covered": None,
                        "global_branches_pct": None,
                        "global_functions_total": None,
                        "global_functions_covered": None,
                        "global_functions_pct": None,
                        "global_lines_total": None,
                        "global_lines_covered": None,
                        "global_lines_pct": None,
                    }
                )
                global_metrics = _build_aggregate_metrics(
                    strategy_aggregates[(model_key, strategy)]
                )

                save_global_result({
                    "model":    model_key,
                    "strategy": strategy,
                    "execution_failed": not global_jest_result.success,
                    "test_metrics_source": "sum_of_valid_functions",
                    **global_metrics,
                    **global_coverage,
                })

            except Exception as exc:
                logger.exception(
                    f"Global coverage failed model={model_key} "
                    f"strategy={strategy}: {exc}"
                )
                save_global_result({
                    "model":    model_key,
                    "strategy": strategy,
                    "execution_failed": True,
                    "test_metrics_source": "sum_of_valid_functions",
                    **_build_aggregate_metrics(strategy_aggregates[(model_key, strategy)]),
                    "global_statements_total": None,
                    "global_statements_covered": None,
                    "global_statements_pct": None,
                    "global_branches_total": None,
                    "global_branches_covered": None,
                    "global_branches_pct": None,
                    "global_functions_total": None,
                    "global_functions_covered": None,
                    "global_functions_pct": None,
                    "global_lines_total": None,
                    "global_lines_covered": None,
                    "global_lines_pct": None,
                })
            finally:
                for tp in temp_specs:
                    remove_temp_spec(tp)


if __name__ == "__main__":
    run_experiment()
