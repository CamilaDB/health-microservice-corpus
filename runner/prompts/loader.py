import json

from config import DATA_DIR, PROMPTS_DIR
from models.function_definition import FunctionDefinition
from utils.files import read_file


def load_system_prompt(type: str) -> str:
    return read_file(
        PROMPTS_DIR / "system" / f"{type}_prompt.txt"
    )


def load_project_context() -> str:
    return read_file(
        PROMPTS_DIR / "project_context.txt"
    )


def load_prompt_template(
    strategy: str,
) -> str:
    return read_file(
        PROMPTS_DIR / f"{strategy}_prompt.txt"
    )


def load_functions():

    # path = DATA_DIR / "functions.json"
    path = DATA_DIR / "functions_test.json"
    # path = DATA_DIR / "functions_result.json"
    # path = DATA_DIR / "functions_order.json"

    data = json.loads(
        read_file(path)
    )

    return [
        FunctionDefinition(**item)
        for item in data
    ]
