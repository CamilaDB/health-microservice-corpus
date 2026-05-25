import subprocess
from dataclasses import dataclass
from pathlib import Path

from config import CORPUS_DIR


@dataclass
class ValidationResult:
    success: bool
    stdout: str
    stderr: str
    returncode: int


def validate_typescript(spec_file: Path) -> ValidationResult:

    result = subprocess.run(
        [
            "cmd",
            "/c",
            "npx",
            "tsc",
            "--noEmit",
            "--project",
            "tsconfig.json",
            "--pretty",
            "false",
        ],
        cwd=CORPUS_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )

    return ValidationResult(
        success=result.returncode == 0,
        stdout=result.stdout,
        stderr=result.stderr,
        returncode=result.returncode,
    )