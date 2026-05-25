def build_runtime_repair_prompt(
    *,
    spec_content: str,
    jest_stderr: str,
    method_metadata: str,
    previous_attempts: list[str],
) -> str:
    stderr = jest_stderr[-4000:]

    return f"""
YOUR LAST OUTPUT FAILED.

RETURN ONLY THE FULL CORRECTED SPEC FILE.

METHOD METADATA:
{method_metadata}

CURRENT SPEC FILE:
{spec_content}

JEST FAILURE OUTPUT:
{stderr}
"""