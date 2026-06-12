from dataclasses import dataclass
from pathlib import Path

from models.function_context import ExtractedDto, ExtractedEnum

@dataclass(slots=True)
class MethodGenerationContext:
    method_name: str
    source_file: str
    test_output_file: str
    focused_source: str
    relevant_dtos: list[ExtractedDto]
    relevant_enums:  list[ExtractedEnum]
    bootstrap_content: str
    generated_spec_path: Path
