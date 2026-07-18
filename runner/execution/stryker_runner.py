"""
Stryker mutation score runner — post-processing step.

Runs AFTER the main experiment. For each (model, strategy, module) triple,
installs the final generated spec into the corpus, runs Stryker against the
corresponding source file, parses the JSON report, and saves a mutation row.

Prerequisites (run once in CORPUS_DIR):
    npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner

Usage:
    python -m mutation.stryker_runner

The runner discovers generated specs from GENERATED_DIR and pairs each with
its source file via the functions manifest (same JSON loaded by load_functions).

Mutation score formula (Jorgensen, 2014):
    MS = killed / (killed + survived + timeout)   × 100

Mutants with status CompileError, RuntimeError, Ignored, NoCoverage are
excluded from the denominator (they do not contribute to meaningful coverage).
"""

import json
import subprocess
import tempfile
import shutil
from pathlib import Path
from collections import defaultdict

from config import CORPUS_DIR, GENERATED_DIR, MODELS, PROMPT_STRATEGIES, TMP_DIR
from execution.sandbox import install_temp_spec, remove_temp_spec
from prompts.loader import load_functions
from persistence.csv_writer import save_mutation_result
from utils.logging import logger


# ─────────────────────────────────────────────────────────────────────────────
# Stryker config template
# ─────────────────────────────────────────────────────────────────────────────

def _build_stryker_config(
    *,
    source_file: str,          # relative to CORPUS_DIR, e.g. "src/patient/patient.service.ts"
    spec_file: str,            # absolute path of the installed temp spec
    report_path: Path,         # where to write mutation.json
) -> dict:
    """
    Builds a minimal Stryker config dict for a single source×spec pair.

    coverageAnalysis=perTest is critical: it runs only the tests that cover
    each mutant, cutting runtime by 5–10× compared to coverageAnalysis=all.

    timeoutMS=30000 caps runaway mutants. Adjust up if complex service
    methods have legitimate slow async chains.
    """
    return {
        "testRunner": "jest",
        "jest": {
            "projectType": "custom",
            "enableFindRelatedTests": False,
            "config": {
                # Run ONLY the installed spec
                "testMatch": [str(spec_file)],
                "testPathPattern": "",
            },
        },
        "mutate": [source_file],
        "coverageAnalysis": "perTest",
        "reporters": ["json", "clear-text"],
        "jsonReporter": {
            "fileName": str(report_path),
        },
        "thresholds": {
            "high": 80,
            "low": 60,
            "break": 0,        # never fail the process on thresholds
        },
        "timeoutMS": 30000,
        "timeoutFactor": 1.5,
        "concurrency": 1,      # local Ollama models + Jest = single thread safest
        "disableTypeChecks": True,  # tsc already validates; skip in Stryker
    }


def _run_stryker(
    *,
    stryker_config: dict,
    report_path: Path,
) -> bool:
    """
    Writes a temp stryker config file, runs `npx stryker run`, returns True
    on success (exit 0 or exit 1 due to threshold — not a crash).
    """
    if report_path.exists():
        report_path.unlink()

    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".json",
        delete=False,
        dir=CORPUS_DIR,
        prefix=".stryker-tmp-",
        encoding="utf-8",
    ) as cfg_file:
        json.dump(stryker_config, cfg_file, indent=2)
        cfg_path = Path(cfg_file.name)

    try:
        result = subprocess.run(
            [
                "cmd", "/c",
                "npx", "stryker", "run",
                cfg_path.name,          # relative to CORPUS_DIR
            ],
            cwd=CORPUS_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
            timeout=600,               # 10 min hard cap per module
        )

        logger.debug(f"Stryker stdout:\n{result.stdout[-3000:]}")
        if result.returncode not in (0, 1):
            # exit 1 = threshold breach (expected), anything else = crash
            logger.error(
                f"Stryker exited with code {result.returncode}\n"
                f"STDERR:\n{result.stderr[-2000:]}"
            )
            return False

        return True

    except subprocess.TimeoutExpired:
        logger.error("Stryker timed out (>600s)")
        return False

    finally:
        if cfg_path.exists():
            cfg_path.unlink()


# ─────────────────────────────────────────────────────────────────────────────
# Report parsing
# ─────────────────────────────────────────────────────────────────────────────

# Statuses that count in the MS denominator
_COUNTABLE = {"Killed", "Survived", "Timeout"}


def _parse_mutation_report(report_path: Path, source_file: str) -> dict:
    """
    Parses the Stryker JSON report and returns per-file mutation metrics.

    Only mutants from `source_file` are counted (Stryker may include
    transitive files; we isolate to the target).

    Returns a flat dict ready for save_mutation_result().
    """
    empty = {
        "mutants_total":     0,
        "mutants_killed":    0,
        "mutants_survived":  0,
        "mutants_timeout":   0,
        "mutants_no_coverage": 0,
        "mutants_compile_error": 0,
        "mutation_score":    0.0,
    }

    if not report_path.exists():
        logger.error(f"Stryker report not found: {report_path}")
        return empty

    try:
        data = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error(f"Failed to parse Stryker report: {exc}")
        return empty

    # Locate the target file entry (path separators vary by OS)
    files = data.get("files", {})
    target_data = None
    normalized_target = Path(source_file).as_posix()
    for key, value in files.items():
        if normalized_target in Path(key).as_posix():
            target_data = value
            break

    if target_data is None:
        logger.warning(
            f"Source file '{source_file}' not found in Stryker report. "
            f"Available keys: {list(files.keys())[:5]}"
        )
        return empty

    mutants = target_data.get("mutants", [])

    counts = defaultdict(int)
    for m in mutants:
        counts[m.get("status", "Unknown")] += 1

    killed    = counts["Killed"]
    survived  = counts["Survived"]
    timeout   = counts["Timeout"]
    denominator = killed + survived + timeout

    mutation_score = round(100.0 * killed / denominator, 2) if denominator > 0 else 0.0

    return {
        "mutants_total":       len(mutants),
        "mutants_killed":      killed,
        "mutants_survived":    survived,
        "mutants_timeout":     timeout,
        "mutants_no_coverage": counts["NoCoverage"],
        "mutants_compile_error": counts["CompileError"],
        "mutation_score":      mutation_score,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Per-module runner
# ─────────────────────────────────────────────────────────────────────────────

def run_stryker_for_module(
    *,
    model: str,
    strategy: str,
    module: str,
    source_file: str,
    test_output_file: str,
) -> dict:
    """
    Installs the generated spec, runs Stryker, returns mutation metrics.
    Cleans up the temp spec regardless of success.
    """
    generated_spec_path = GENERATED_DIR / strategy / model / test_output_file

    if not generated_spec_path.exists():
        logger.warning(f"Generated spec not found: {generated_spec_path}")
        return {"mutation_score": None, "error": "spec_not_found"}

    report_path = (
        TMP_DIR / "stryker" / model / strategy / f"{module}-mutation.json"
    )
    report_path.parent.mkdir(parents=True, exist_ok=True)

    temp_spec = install_temp_spec(
        generated_file=generated_spec_path,
        relative_output_path=test_output_file,
    )

    try:
        stryker_config = _build_stryker_config(
            source_file=source_file,
            spec_file=temp_spec,
            report_path=report_path,
        )

        logger.info(
            f"Running Stryker: model={model} strategy={strategy} module={module}"
        )
        success = _run_stryker(
            stryker_config=stryker_config,
            report_path=report_path,
        )

        if not success:
            return {"mutation_score": None, "error": "stryker_failed"}

        return _parse_mutation_report(report_path, source_file)

    finally:
        remove_temp_spec(temp_spec)


# ─────────────────────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────────────────────

def run_mutation_experiment() -> None:
    """
    Iterates all model × strategy × module combinations and runs Stryker.
    Skips combinations where the generated spec does not exist (e.g. model
    not yet run).
    """
    # Build module → (source_file, test_output_file) index from function manifest
    functions = load_functions()
    module_index: dict[str, dict] = {}
    for fn in functions:
        if fn.module not in module_index:
            module_index[fn.module] = {
                "source_file":      fn.source_file,
                "test_output_file": fn.test_output_file,
            }

    for model_key in MODELS:
        for strategy in PROMPT_STRATEGIES:
            for module, paths in module_index.items():
                try:
                    metrics = run_stryker_for_module(
                        model=model_key,
                        strategy=strategy,
                        module=module,
                        source_file=paths["source_file"],
                        test_output_file=paths["test_output_file"],
                    )

                    save_mutation_result({
                        "model":            model_key,
                        "strategy":         strategy,
                        "module":           module,
                        "source_file":      paths["source_file"],
                        "test_output_file": paths["test_output_file"],
                        **metrics,
                    })

                except Exception as exc:
                    logger.exception(
                        f"Mutation run failed: model={model_key} "
                        f"strategy={strategy} module={module}: {exc}"
                    )
                    save_mutation_result({
                        "model":       model_key,
                        "strategy":    strategy,
                        "module":      module,
                        "fatal_error": str(exc),
                    })


if __name__ == "__main__":
    run_mutation_experiment()
