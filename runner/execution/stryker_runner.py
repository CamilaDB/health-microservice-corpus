"""
Stryker mutation score runner — post-processing step.

Runs Stryker once per (model, strategy, module) -- unchanged from before --
and, from that SAME already-collected report, additionally re-slices the
per-mutant results by target function (map_mutants_to_functions). This is
not a second mutation run and not a proportional/fabricated split of the
module score: every mutant already carries its own `location` (source
line range) in Stryker's standard report schema, and every test's name
already carries the `FN_<name>_END` marker this pipeline appends
(execution/sandbox.py:append_test_block), so both a mutant's owning
function and (for Killed mutants) which function's own tests actually
killed it are real, already-measured facts -- just not previously
persisted at that grain. See docs/experimental-workflow.md.
"""
import json, os, re, shutil, subprocess, tempfile
from pathlib import Path
from collections import defaultdict
from config import CORPUS_DIR, GENERATED_DIR, MODELS, PROMPT_STRATEGIES, TMP_DIR
from execution.sandbox import install_temp_spec, make_fn_id, remove_temp_spec
from persistence.csv_writer import save_function_mutation_result, save_mutation_result
from prompts.loader import load_functions
from utils.logging import logger

_EMPTY_MODULE_METRICS = {
    "mutants_total": 0, "mutants_killed": 0, "mutants_survived": 0,
    "mutants_timeout": 0, "mutants_no_coverage": 0, "mutants_compile_error": 0,
    "mutation_score": 0.0,
}

_FN_ID_IN_TEST_NAME_RE = re.compile(r"FN_\w+?_END")


def _build_stryker_config(*, source_file, spec_path, report_path):
    report_relative  = Path(os.path.relpath(report_path,               CORPUS_DIR)).as_posix()
    sandbox_relative = Path(os.path.relpath(TMP_DIR / "stryker-sandbox", CORPUS_DIR)).as_posix()
    return {
        "testRunner": "jest",
        "jest": {
            "projectType": "custom",
            "enableFindRelatedTests": False,
        },
        "mutate": [source_file],
        "coverageAnalysis": "perTest",
        "reporters": ["json", "clear-text"],
        "jsonReporter": {"fileName": report_relative},   # ← relative
        "thresholds": {"high": 80, "low": 60, "break": 0},
        "timeoutMS": 30000,
        "timeoutFactor": 1.5,
        "concurrency": 1,
        "disableTypeChecks": True,
        "tempDirName": sandbox_relative,                 # ← relative
    }

def _run_stryker(*, stryker_config, report_path):
    if report_path.exists():
        report_path.unlink()
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".json", delete=False,
        dir=CORPUS_DIR, prefix=".stryker-tmp-", encoding="utf-8",
    ) as f:
        json.dump(stryker_config, f, indent=2)
        cfg_path = Path(f.name)
    try:
        result = subprocess.run(
            ["cmd", "/c", "npx", "stryker", "run", cfg_path.name],
            cwd=CORPUS_DIR, capture_output=True, text=True,
            encoding="utf-8", errors="replace", check=False, timeout=600,
        )
        # Always log at INFO so diagnosis doesn't require DEBUG mode
        logger.info(f"Stryker exit={result.returncode}")
        logger.info(f"Stryker stdout (tail):\n{result.stdout[-4000:]}")
        if result.stderr.strip():
            logger.warning(f"Stryker stderr:\n{result.stderr[-2000:]}")
        if result.returncode not in (0, 1):
            logger.error(f"Stryker crashed (exit {result.returncode})")
            return False
        return True
    except subprocess.TimeoutExpired:
        logger.error("Stryker timed out (>600s)")
        return False
    finally:
        if cfg_path.exists():
            cfg_path.unlink()


def _load_report_data(report_path: Path) -> dict | None:
    """
    Reads and parses the Stryker JSON report, handling the fallback to
    Stryker's own default output location. Returns None (never raises) if
    the report is missing or unparseable, so callers can distinguish
    "nothing to aggregate" from a real result.
    """
    if not report_path.exists():
        # Stryker may have written to the default location if the configured
        # path was not honoured. Check the default before giving up.
        default_report = CORPUS_DIR / "reports" / "mutation" / "mutation.json"
        if default_report.exists():
            logger.warning(
                f"Report not at configured path {report_path}; "
                f"found at default {default_report} — copying."
            )
            report_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(default_report, report_path)
        else:
            logger.error(
                f"Stryker report not found at {report_path} "
                f"or default {default_report}"
            )
            return None
    try:
        return json.loads(report_path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error(f"Failed to parse Stryker report: {exc}")
        return None


def _find_target_file_entry(data: dict, source_file: str) -> dict | None:
    files = data.get("files", {})
    norm = Path(source_file).as_posix()
    return next((v for k, v in files.items() if norm in Path(k).as_posix()), None)


def _aggregate_module_metrics(data: dict | None, source_file: str) -> dict:
    if data is None:
        return dict(_EMPTY_MODULE_METRICS)
    target_data = _find_target_file_entry(data, source_file)
    if target_data is None:
        logger.warning(f"'{source_file}' not in Stryker report.")
        return dict(_EMPTY_MODULE_METRICS)

    counts = defaultdict(int)
    mutants = target_data.get("mutants", [])
    for m in mutants:
        counts[m.get("status", "Unknown")] += 1
    killed, survived, timeout = counts["Killed"], counts["Survived"], counts["Timeout"]
    denom = killed + survived + timeout
    return {
        "mutants_total":         len(mutants),
        "mutants_killed":        killed,
        "mutants_survived":      survived,
        "mutants_timeout":       timeout,
        "mutants_no_coverage":   counts["NoCoverage"],
        "mutants_compile_error": counts["CompileError"],
        "mutation_score":        round(100.0 * killed / denom, 2) if denom > 0 else 0.0,
    }


def _parse_mutation_report(report_path: Path, source_file: str) -> dict:
    """Preserved for backward compatibility / direct use: load + aggregate in one call."""
    return _aggregate_module_metrics(_load_report_data(report_path), source_file)


def _build_test_id_to_fn_id(data: dict) -> dict[str, str | None]:
    """
    Maps each Stryker test id to the fn_id (FN_<name>_END) embedded in its
    test name. A test whose name carries no such marker (e.g. a leftover
    entry from an unrelated spec file swept into the same Stryker run)
    maps to None and is simply never counted as an "own test" killer.
    """
    mapping: dict[str, str | None] = {}
    for _path, info in (data.get("testFiles") or {}).items():
        for test in info.get("tests", []):
            match = _FN_ID_IN_TEST_NAME_RE.search(test.get("name", ""))
            mapping[test["id"]] = match.group(0) if match else None
    return mapping


def _owner_fn_id(location: dict, module_functions: list[dict]) -> str | None:
    """
    Returns the fn_id whose [line, end_line] range fully contains the
    mutant's location, or None if it falls outside every target function
    in this module (constructor, imports, a non-public helper -- never
    guessed at) or -- checked defensively, not assumed -- spans more than
    one. Verified empirically on the frozen corpus: every mutant in every
    module maps to exactly one target function, since these 4 services
    have no non-target public method bodies; this function does not rely
    on that holding and reports "unmapped" honestly if it ever doesn't.
    """
    start = location["start"]["line"]
    end = location["end"]["line"]
    owners = [f for f in module_functions if f["line"] <= start and end <= f["end_line"]]
    if len(owners) != 1:
        return None
    return owners[0]["fn_id"]


def map_mutants_to_functions(
    data: dict | None, source_file: str, module_functions: list[dict]
) -> list[dict]:
    """
    Re-slices an already-parsed Stryker report's per-mutant results by
    target function. Returns one dict per entry in module_functions
    (mutants_total may legitimately be 0 -- never fabricated to look
    non-zero), each with:

      - mutants_total / mutants_survived / mutants_no_coverage /
        mutants_timeout / mutants_compile_error: counts of mutants whose
        `location` falls inside this function's line range.
      - mutants_killed: of those, how many Stryker marked Killed by ANY
        test in the accumulated spec (the module-level convention,
        extended to this finer grain).
      - mutants_killed_by_own_tests: the stricter, function-scoped subset
        of mutants_killed where at least one of `killedBy`'s test ids
        belongs to THIS function's own FN_<name>_END wrapper (cross-
        referenced via test name, not inferred).
      - mutants_killed_by_other_function_tests: mutants_killed minus
        mutants_killed_by_own_tests -- kills attributable to a sibling
        function's tests (e.g. via a self-call), made visible rather than
        silently folded into either count.
      - mutants_unmapped_in_module: same figure on every row -- how many
        of the module's mutants fell outside every target function's
        range (e.g. constructor code), for transparency.

    module_functions: list of dicts with at least fn_id/name/line/
    end_line/ccm/range for every target function in this module.
    """
    if data is None or not module_functions:
        return []
    target_data = _find_target_file_entry(data, source_file)
    if target_data is None:
        return []

    test_id_to_fn_id = _build_test_id_to_fn_id(data)
    mutants = target_data.get("mutants", [])

    per_function = {
        f["fn_id"]: {
            "fn_id": f["fn_id"], "function": f["name"], "ccm": f.get("ccm"), "range": f.get("range"),
            "mutants_total": 0, "mutants_killed": 0, "mutants_killed_by_own_tests": 0,
            "mutants_killed_by_other_function_tests": 0, "mutants_survived": 0,
            "mutants_no_coverage": 0, "mutants_timeout": 0, "mutants_compile_error": 0,
        }
        for f in module_functions
    }
    unmapped = 0

    for m in mutants:
        owner = _owner_fn_id(m.get("location", {}), module_functions)
        if owner is None or owner not in per_function:
            unmapped += 1
            continue
        bucket = per_function[owner]
        bucket["mutants_total"] += 1
        status = m.get("status", "Unknown")
        if status == "Killed":
            bucket["mutants_killed"] += 1
            killer_fn_ids = {test_id_to_fn_id.get(tid) for tid in (m.get("killedBy") or [])}
            if owner in killer_fn_ids:
                bucket["mutants_killed_by_own_tests"] += 1
            else:
                bucket["mutants_killed_by_other_function_tests"] += 1
        elif status == "Survived":
            bucket["mutants_survived"] += 1
        elif status == "NoCoverage":
            bucket["mutants_no_coverage"] += 1
        elif status == "Timeout":
            bucket["mutants_timeout"] += 1
        elif status == "CompileError":
            bucket["mutants_compile_error"] += 1

    results = list(per_function.values())
    for r in results:
        r["mutants_unmapped_in_module"] = unmapped
    return results


def run_stryker_for_module(*, model, strategy, module, source_file, test_output_file, module_functions=None):
    gen_path = GENERATED_DIR / strategy / model / test_output_file
    if not gen_path.exists():
        logger.warning(f"Generated spec not found: {gen_path}")
        return {"mutation_score": None, "error": "spec_not_found"}, []
    report_path = TMP_DIR / "stryker" / model / strategy / f"{module}-mutation.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    temp_spec = install_temp_spec(generated_file=gen_path, relative_output_path=test_output_file)
    try:
        config  = _build_stryker_config(source_file=source_file, spec_path=temp_spec, report_path=report_path)
        success = _run_stryker(stryker_config=config, report_path=report_path)
        if not success:
            return {"mutation_score": None, "error": "stryker_failed"}, []
        data = _load_report_data(report_path)
        module_metrics = _aggregate_module_metrics(data, source_file)
        function_metrics = map_mutants_to_functions(data, source_file, module_functions or [])
        return module_metrics, function_metrics
    finally:
        remove_temp_spec(temp_spec)

def run_mutation_experiment():
    functions    = load_functions()
    module_index = {}
    module_functions_index: dict[str, list[dict]] = defaultdict(list)
    for fn in functions:
        if fn.module not in module_index:
            module_index[fn.module] = {"source_file": fn.source_file, "test_output_file": fn.test_output_file}
        module_functions_index[fn.module].append({
            "fn_id": make_fn_id(fn.name), "name": fn.name,
            "line": fn.line, "end_line": fn.end_line,
            "ccm": fn.ccm, "range": fn.range,
        })

    for model_key in MODELS:
        for strategy in PROMPT_STRATEGIES:
            for module, paths in module_index.items():
                try:
                    module_metrics, function_metrics = run_stryker_for_module(
                        model=model_key, strategy=strategy, module=module,
                        source_file=paths["source_file"], test_output_file=paths["test_output_file"],
                        module_functions=module_functions_index[module],
                    )
                    save_mutation_result({"model":model_key,"strategy":strategy,"module":module,
                                          "source_file":paths["source_file"],
                                          "test_output_file":paths["test_output_file"],**module_metrics})
                    for row in function_metrics:
                        save_function_mutation_result({
                            "model": model_key, "strategy": strategy, "module": module,
                            "source_file": paths["source_file"],
                            "test_output_file": paths["test_output_file"],
                            **row,
                        })
                except Exception as exc:
                    logger.exception(f"Mutation failed: model={model_key} strategy={strategy} module={module}: {exc}")
                    save_mutation_result({"model":model_key,"strategy":strategy,"module":module,"fatal_error":str(exc)})

if __name__ == "__main__":
    run_mutation_experiment()
