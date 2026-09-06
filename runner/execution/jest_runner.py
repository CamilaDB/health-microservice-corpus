import shutil
import subprocess
from pathlib import Path

from config import CORPUS_DIR, JEST_REPORT_PATH, TMP_DIR
from models.jest_result import JestResult


def clear_execution_artifacts() -> None:
    """Remove every report from the prior Jest invocation before a new run."""
    coverage_dir = TMP_DIR / "coverage"
    if coverage_dir.exists():
        shutil.rmtree(coverage_dir)
    coverage_dir.mkdir(parents=True, exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# Per-function run  (called inside the repair loop)
# ─────────────────────────────────────────────────────────────────────────────

def run_jest(
    spec_path: Path,
    source_file: str,
    test_name_pattern: str | None = None,
) -> JestResult:
    """
    Runs Jest on a single spec file, scoped to one function when
    test_name_pattern is provided.

    Reporters:
      json         → coverage-final.json  (Istanbul line-level data,
                     used by extract_function_coverage to filter by line range)
      json-summary → coverage-summary.json (used by extract_service_coverage
                     and extract_global_coverage)

    Both files land in TMP_DIR/coverage/.
    """
    clear_execution_artifacts()

    relative_spec = spec_path.relative_to(CORPUS_DIR)

    cmd = [
        "cmd", "/c",
        "npx", "jest",
        str(relative_spec),
        "--coverage",
        f"--collectCoverageFrom={source_file}",
        "--coverageReporters=json",
        "--coverageReporters=json-summary",
        f"--coverageDirectory={TMP_DIR / 'coverage'}",
        "--json",
        f"--outputFile={JEST_REPORT_PATH}",
        "--runInBand",
        "--forceExit",
    ]

    if test_name_pattern:
        # NOTE: on Windows cmd.exe the caret (^) is an escape character,
        # so regex anchors in the pattern are intentionally avoided here.
        # Collision-free naming via make_fn_id (FN_<name>_END suffix) removes
        # the need for ^ anchoring.
        cmd.append(f"--testNamePattern={test_name_pattern}")

    result = subprocess.run(
        cmd,
        cwd=CORPUS_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )

    return JestResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
        returncode=result.returncode,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Per-service run  (called once per spec file, after all functions are done)
# ─────────────────────────────────────────────────────────────────────────────

def run_jest_service(
    spec_path: Path,
    source_file: str,
) -> JestResult:
    """
    Runs the complete spec file (no testNamePattern) to collect
    service-level coverage — i.e. what fraction of the entire service
    is exercised by all generated tests together.

    Only json-summary is needed here: no line-range filtering is done
    at this level, so the heavy coverage-final.json is skipped.
    """
    clear_execution_artifacts()

    relative_spec = spec_path.relative_to(CORPUS_DIR)

    result = subprocess.run(
        [
            "cmd", "/c",
            "npx", "jest",
            str(relative_spec),
            "--coverage",
            f"--collectCoverageFrom={source_file}",
            "--coverageReporters=json-summary",
            f"--coverageDirectory={TMP_DIR / 'coverage'}",
            "--json",
            f"--outputFile={JEST_REPORT_PATH}",
            "--runInBand",
            "--forceExit",
        ],
        cwd=CORPUS_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )

    return JestResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
        returncode=result.returncode,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Global run  (called once per model × strategy, after all services are done)
# ─────────────────────────────────────────────────────────────────────────────

def run_jest_global(spec_paths: list[Path]) -> JestResult:
    """
    Runs all spec files together to collect aggregate coverage across
    the entire corpus for a given model × strategy combination.

    Collects from all service files via glob; no per-file filtering.
    Only json-summary is needed.
    """
    clear_execution_artifacts()

    relative_specs = [str(p.relative_to(CORPUS_DIR)) for p in spec_paths]

    result = subprocess.run(
        [
            "cmd", "/c",
            "npx", "jest",
            *relative_specs,
            "--coverage",
            "--collectCoverageFrom=src/**/*.service.ts",
            "--coverageReporters=json-summary",
            f"--coverageDirectory={TMP_DIR / 'coverage'}",
            "--json",
            f"--outputFile={JEST_REPORT_PATH}",
            "--runInBand",
            "--forceExit",
        ],
        cwd=CORPUS_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )

    return JestResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
        returncode=result.returncode,
    )
