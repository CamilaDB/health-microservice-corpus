"""
Mirrors the per-function object produced by ast-cli/commands/generate-functions.ts.
"""

from dataclasses import dataclass, field
from models.function_context import FunctionContext


@dataclass
class ParameterInfo:
    name: str = ""
    type: str = ""


@dataclass
class FunctionDefinition:
    # ── identity ──────────────────────────────────────────────────────────────
    name: str = ""
    class_name: str = ""

    # ── location ──────────────────────────────────────────────────────────────
    module: str = ""
    layer: str = ""
    source_file: str = ""
    test_output_file: str = ""

    # ── source metadata ───────────────────────────────────────────────────────
    line: int = 0
    end_line: int = 0
    loc: int = 0
    source_hash: str = ""

    # ── method shape ──────────────────────────────────────────────────────────
    is_async: bool = False
    visibility: str = "public"
    parameters: list[ParameterInfo] = field(default_factory=list)
    return_type: str = ""

    # ── complexity ────────────────────────────────────────────────────────────
    ccm: int = 1
    range: str = "low"

    # ── deep context (from extractor) ─────────────────────────────────────────
    context: FunctionContext = field(default_factory=FunctionContext)

    def __post_init__(self):
        self.parameters = [
            ParameterInfo(**p) if isinstance(p, dict) else p
            for p in self.parameters
        ]
        if isinstance(self.context, dict):
            self.context = FunctionContext(**self.context)
