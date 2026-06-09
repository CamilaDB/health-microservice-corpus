import json
from pathlib import Path

from config import FUNCTIONS_FILE, PROMPTS_DIR, PROMPT_STRATEGIES
from models.function_definition import FunctionDefinition
from utils.files import read_file


DEFAULT_STRATEGY = PROMPT_STRATEGIES[0] if PROMPT_STRATEGIES else "zero_shot"


def _normalize_strategy(strategy: str) -> str:
    return strategy.replace("_", "-")


def _resolve_prompt_path(strategy: str, relative_path: Path | str) -> Path:
    strategy_dir = _normalize_strategy(strategy)
    candidate = PROMPTS_DIR / strategy_dir / relative_path
    if candidate.exists():
        return candidate
    fallback = PROMPTS_DIR / relative_path
    if fallback.exists():
        return fallback
    return candidate


def load_system_prompt(type: str, strategy: str | None = None) -> str:
    selected_strategy = strategy or DEFAULT_STRATEGY
    system_prompt_path = _resolve_prompt_path(
        selected_strategy,
        Path("system") / f"{type}_prompt.txt",
    )
    return read_file(system_prompt_path)


def load_prompt_template(type: str, strategy: str) -> str:
    selected_strategy = strategy or DEFAULT_STRATEGY
    prompt_path = _resolve_prompt_path(
        selected_strategy,
        f"{type}_prompt.txt",
    )
    return read_file(prompt_path)


def load_functions() -> list[FunctionDefinition]:
    """
    Loads functions from the ast-cli service_functions.json.

    The file has the shape:
        { "generated_at": "...", "total": N, "functions": [...] }

    Only public methods are returned — private/protected methods are not
    valid test targets and were included in the JSON only for completeness.
    """
    raw = json.loads(read_file(FUNCTIONS_FILE))

    # Unwrap the envelope produced by generate-functions.ts
    items = raw["functions"] if isinstance(raw, dict) and "functions" in raw else raw

    functions = [FunctionDefinition(**item) for item in items]

    # Filter to public methods only
    public = [f for f in functions if f.visibility == "public"]

    return public