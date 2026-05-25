import json
import subprocess
import tempfile
from pathlib import Path


def patch_test_block(
    *,
    file_path: str,
    test_name: str,
    new_block: str,
) -> None:

    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".ts",
        delete=False,
        encoding="utf-8",
    ) as temp:

        temp.write(new_block)

        temp_path = Path(temp.name)

    try:

        result = subprocess.run(
            [
                "cmd",
                "/c",
                "npx",
                "tsx",
                "ts_ast/patch_test_block.ts",
                json.dumps({
                    "file_path": file_path,
                    "test_name": test_name,
                    "temp_path": str(temp_path),
                }),
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )

        if result.returncode != 0:

            raise RuntimeError(
                f"""
Failed to patch test block

TEST:
{test_name}

STDERR:
{result.stderr}
"""
            )

    finally:

        if temp_path.exists():
            temp_path.unlink()
