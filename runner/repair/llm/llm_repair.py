from repair.llm.repair_prompt import build_runtime_repair_prompt


def run_llm_repair(
    *,
    client,
    repair_system_prompt: str,
    spec_content: str,
    jest_stderr: str,
    method_metadata: str,
    previous_attempts: list[str],
):

    prompt = build_runtime_repair_prompt(
        spec_content=spec_content,
        jest_stderr=jest_stderr,
        method_metadata=method_metadata,
        previous_attempts=previous_attempts,
    )

    print(f"prompt repair llm {prompt}")

    response = client.generate(
        repair_system_prompt,
        prompt,
    )

    return response.content
