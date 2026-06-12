import json
import subprocess


def extract_failed_test_block(
    *,
    file_path: str,
    test_name: str,
) -> str:

    result = subprocess.run(
        [
            "cmd",
            "/c",
            "npx",
            "tsx",
            "ts_ast/extract_test_block.ts",
            json.dumps({
                "file_path": file_path,
                "test_name": test_name,
            }),
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False
    )

    if result.returncode != 0:

        raise RuntimeError(
            f"""
Failed to extract test block

TEST:
{test_name}

STDOUT: {result.stdout}

STDERR:
{result.stderr}
"""
        )

    block = result.stdout.strip()

    if not block:

        raise RuntimeError(
            f"Empty extracted block for {test_name}"
        )

    return block