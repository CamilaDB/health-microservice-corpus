"""
Stryker mutation score runner — post-processing step.
"""
import json, os, subprocess, tempfile
from pathlib import Path
from collections import defaultdict
from config import CORPUS_DIR, GENERATED_DIR, MODELS, PROMPT_STRATEGIES, TMP_DIR
from execution.sandbox import install_temp_spec, remove_temp_spec
from persistence.csv_writer import save_mutation_result
from prompts.loader import load_functions
from utils.logging import logger

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

def _parse_mutation_report(report_path, source_file):
    empty = {"mutants_total":0,"mutants_killed":0,"mutants_survived":0,
             "mutants_timeout":0,"mutants_no_coverage":0,"mutants_compile_error":0,"mutation_score":0.0}
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
            import shutil
            shutil.copy2(default_report, report_path)
        else:
            logger.error(
                f"Stryker report not found at {report_path} "
                f"or default {default_report}"
            )
            return empty
    try:
        data = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error(f"Failed to parse Stryker report: {exc}")
        return empty
    files = data.get("files", {})
    norm  = Path(source_file).as_posix()
    target_data = next(
        (v for k, v in files.items() if norm in Path(k).as_posix()), None
    )
    if target_data is None:
        logger.warning(f"'{source_file}' not in Stryker report. Keys: {list(files)[:5]}")
        return empty
    counts = defaultdict(int)
    mutants = target_data.get("mutants", [])
    for m in mutants:
        counts[m.get("status","Unknown")] += 1
    killed, survived, timeout = counts["Killed"], counts["Survived"], counts["Timeout"]
    denom = killed + survived + timeout
    return {
        "mutants_total":         len(mutants),
        "mutants_killed":        killed,
        "mutants_survived":      survived,
        "mutants_timeout":       timeout,
        "mutants_no_coverage":   counts["NoCoverage"],
        "mutants_compile_error": counts["CompileError"],
        "mutation_score":        round(100.0*killed/denom, 2) if denom > 0 else 0.0,
    }

def run_stryker_for_module(*, model, strategy, module, source_file, test_output_file):
    gen_path = GENERATED_DIR / strategy / model / test_output_file
    if not gen_path.exists():
        logger.warning(f"Generated spec not found: {gen_path}")
        return {"mutation_score": None, "error": "spec_not_found"}
    report_path = TMP_DIR / "stryker" / model / strategy / f"{module}-mutation.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    temp_spec = install_temp_spec(generated_file=gen_path, relative_output_path=test_output_file)
    try:
        config  = _build_stryker_config(source_file=source_file, spec_path=temp_spec, report_path=report_path)
        success = _run_stryker(stryker_config=config, report_path=report_path)
        if not success:
            return {"mutation_score": None, "error": "stryker_failed"}
        return _parse_mutation_report(report_path, source_file)
    finally:
        remove_temp_spec(temp_spec)

def run_mutation_experiment():
    functions    = load_functions()
    module_index = {}
    for fn in functions:
        if fn.module not in module_index:
            module_index[fn.module] = {"source_file": fn.source_file, "test_output_file": fn.test_output_file}
    for model_key in MODELS:
        for strategy in PROMPT_STRATEGIES:
            for module, paths in module_index.items():
                try:
                    metrics = run_stryker_for_module(
                        model=model_key, strategy=strategy, module=module,
                        source_file=paths["source_file"], test_output_file=paths["test_output_file"],
                    )
                    save_mutation_result({"model":model_key,"strategy":strategy,"module":module,
                                          "source_file":paths["source_file"],
                                          "test_output_file":paths["test_output_file"],**metrics})
                except Exception as exc:
                    logger.exception(f"Mutation failed: model={model_key} strategy={strategy} module={module}: {exc}")
                    save_mutation_result({"model":model_key,"strategy":strategy,"module":module,"fatal_error":str(exc)})

if __name__ == "__main__":
    run_mutation_experiment()
