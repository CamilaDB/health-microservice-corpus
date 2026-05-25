import json
import subprocess

from loguru import logger


def generate_bootstrap_spec(
    file_path: str,
) -> str:
    logger.info(
        f"Generating bootstrap spec for {file_path}"
    )

    result = subprocess.run(
        [
            "cmd",
            "/c",
            "npx",
            "tsx",
            "ts_ast/bootstrap-ast-generator.ts",
            json.dumps(
                {
                    "filePath": file_path,
                }
            ),
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    if result.returncode != 0:

        logger.error(
            "Bootstrap generation failed"
        )

        logger.error(
            f"STDOUT:\n{result.stdout}"
        )

        logger.error(
            f"STDERR:\n{result.stderr}"
        )

        result.check_returncode()

    logger.info(
        "Bootstrap generation finished\n"
        "STDOUT:\n{}\n"
        "STDERR:\n{}",
        result.stdout,
        result.stderr,
    )

    return result.stdout.strip()
