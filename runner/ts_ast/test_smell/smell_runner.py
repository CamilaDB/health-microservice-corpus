"""
Test smell runner — post-processing step.

Scope: ONLY active it() blocks inside FN_..._END wrappers.
it.skip blocks are excluded — they are pipeline artifacts (repair exhausted),
already tracked as pending_tests in results.csv.

Smells detected:
  - Assertion Roulette: >1 expect() without custom message in one it()
  - Empty Test:          0 expect() calls in an active it()

Output: smell_results.csv  (one row per function per model×strategy)
"""

import json
import subprocess
from pathlib import Path

from loguru import logger

from config import CORPUS_DIR, GENERATED_DIR, MODELS, PROMPT_STRATEGIES
from execution.sandbox import make_fn_id
from persistence.csv_writer import save_smell_result
from prompts.loader import load_functions




def detect_smells_in_spec(spec_path: Path) -> list[dict]:
    result = subprocess.run(
        [
            "cmd", "/c",
            "npx", "tsx",
            "ts_ast/test_smell/smell_detector.ts",
            json.dumps({"file_path": str(spec_path)}),
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
        # cwd=CORPUS_DIR,
    )

    if result.returncode != 0:
        logger.error(
            f"smell_detector failed for {spec_path}\n"
            f"STDERR:\n{result.stderr[:1000]}"
        )
        return []

    stdout = result.stdout.strip()
    if not stdout:
        return []

    try:
        return json.loads(stdout)
    except json.JSONDecodeError as exc:
        logger.error(f"Failed to parse smell output: {exc}")
        return []


def run_smell_experiment() -> None:
    functions  = load_functions()
    fn_index   = {make_fn_id(fn.name): fn for fn in functions}

    # Unique specs (one per module)
    seen: set[str] = set()
    specs: list[tuple[str, str]] = []
    for fn in functions:
        if fn.test_output_file not in seen:
            seen.add(fn.test_output_file)
            specs.append((fn.module, fn.test_output_file))

    for model_key in MODELS:
        for strategy in PROMPT_STRATEGIES:
            for module, test_output_file in specs:
                spec_path = GENERATED_DIR / strategy / model_key / test_output_file

                if not spec_path.exists():
                    continue

                logger.info(
                    f"Smell detection: model={model_key} "
                    f"strategy={strategy} module={module}"
                )

                function_smells = detect_smells_in_spec(spec_path)

                for smell in function_smells:
                    fn_id = smell.get("fn_id", "")
                    fn    = fn_index.get(fn_id)

                    it_active = smell.get("it_active", 0)
                    ar_count  = smell.get("assertion_roulette_count", 0)
                    et_count  = smell.get("empty_test_count", 0)

                    save_smell_result({
                        "model":    model_key,
                        "strategy": strategy,
                        "module":   module,
                        "function": fn.name    if fn else fn_id,
                        "fn_id":    fn_id,
                        "ccm":      fn.ccm     if fn else "",
                        "range":    fn.range   if fn else "",

                        # Active test counts (smellable population)
                        "it_active":  it_active,
                        "it_skip":    smell.get("it_skip", 0),   # informational

                        # Assertion Roulette
                        "assertion_roulette_count": ar_count,
                        "assertion_roulette_rate":  round(
                            ar_count / it_active * 100, 1
                        ) if it_active > 0 else 0.0,
                        "assertion_roulette_tests": "|".join(
                            smell.get("assertion_roulette_tests", [])
                        ),

                        # Empty Test
                        "empty_test_count": et_count,
                        "empty_test_rate":  round(
                            et_count / it_active * 100, 1
                        ) if it_active > 0 else 0.0,
                        "empty_test_names": "|".join(
                            smell.get("empty_test_names", [])
                        ),
                    })


if __name__ == "__main__":
    run_smell_experiment()
