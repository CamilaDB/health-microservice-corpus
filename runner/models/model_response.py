from dataclasses import dataclass


@dataclass
class ModelResponse:
    content: str
    duration_ns: float
    tokens: float | None = None
