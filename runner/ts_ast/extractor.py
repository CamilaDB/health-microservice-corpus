import json
import subprocess

def extract_focused_source(
    file_path: str,
    function_name: str,
):
    result = subprocess.run(
        [
            "cmd",
            "/c",
            "npx",
            "tsx",
            "ts_ast/extract-focused-source.ts",
            json.dumps(
                {
                    "filePath": file_path,
                    "functionName": function_name,
                }
            ),
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    # print("STDOUT:")
    # print(result.stdout)

    # print("STDERR:")
    # print(result.stderr)

    # print("RETURN CODE:")
    # print(result.returncode)

    result.check_returncode()

    return json.loads(result.stdout.encode("utf-8").decode("utf-8"))
