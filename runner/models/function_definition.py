from dataclasses import dataclass


@dataclass
class FunctionDefinition:
    name: str
    module: str
    layer: str
    source_file: str
    line: int
    ccm: int
    range: str
    dto_files: list[str]
    enum_files: list[str]
    test_output_file: str
