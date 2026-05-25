from dataclasses import dataclass
from pathlib import Path


@dataclass(slots=True)
class MethodGenerationContext:

    # =====================================
    # IDENTIFICATION
    # =====================================

    method_name: str
    source_file: str
    test_output_file: str

    # =====================================
    # SOURCE CONTEXT
    # =====================================

    focused_source: str
    full_source: str

    # =====================================
    # SPEC CONTEXT
    # =====================================

    bootstrap_content: str
    generated_spec_path: Path

    # =====================================
    # DEPENDENCY CONTEXT
    # =====================================

    available_mocks: list[str]
    available_mock_methods: dict[str, list[str]]

    # =====================================
    # PROMPT CONTEXT
    # =====================================

    generation_prompt: str
