import subprocess
from dataclasses import dataclass
from pathlib import Path

from config import CORPUS_DIR, TMP_DIR
from utils.logging import logger


@dataclass
class JestResult:
    success: bool
    stdout: str
    stderr: str


def run_jest(spec_path: Path) -> JestResult:
    relative_spec = spec_path.relative_to(CORPUS_DIR)

    result = subprocess.run(
        [
            "cmd", "/c",
            "npx", "jest",
            str(relative_spec),
            "--coverage",
            "--coverageReporters=json-summary",
            # "--json",
            "--detectOpenHandles",
            "--runInBand",
            "--forceExit",
        ],
        cwd=CORPUS_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    return JestResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
    )

