from dataclasses import dataclass


@dataclass
class ModelResponse:
    content: str
    duration_seconds: float
    tokens: float | None = None
