import subprocess
from pathlib import Path

from config import CORPUS_DIR, JEST_REPORT_PATH, TMP_DIR
from models.jest_result import JestResult


def run_jest(spec_path: Path, source_file: str) -> JestResult:
    if JEST_REPORT_PATH.exists():
        JEST_REPORT_PATH.unlink()

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
        check=False
    )

    return JestResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
        returncode=result.returncode,
    )
