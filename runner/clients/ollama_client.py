import time
from dataclasses import dataclass

import requests

from clients.base import BaseClient
from config import (
    MAX_TOKENS,
    OLLAMA_URL,
    TEMPERATURE,
)
from utils.sanitization import sanitize_response
from utils.logging import logger



@dataclass
class ModelResponse:
    content: str
    duration_seconds: float


class OllamaClient(BaseClient):

    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(self, system_prompt, prompt: str) -> ModelResponse:

        started_at = time.time()

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": self.model_name,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False,
                "options": {
                    "temperature": float(TEMPERATURE),
                    # "num_predict": int(MAX_TOKENS),
                },
            },
            timeout=600,
        )

        if not response.ok:
            logger.error(
                f"Ollama error: {response.text}"
            )

            response.raise_for_status()

        data = response.json()

        duration = time.time() - started_at

        return ModelResponse(
            content=sanitize_response(
                data["response"]
            ),
            duration_seconds=duration,
        )
