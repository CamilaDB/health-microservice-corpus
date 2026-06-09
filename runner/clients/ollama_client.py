import requests

from clients.base import BaseClient
from config import (
    MAX_TOKENS,
    OLLAMA_URL,
    TEMPERATURE,
)
from models.model_response import ModelResponse
from utils.sanitization import sanitize_response
from utils.logging import logger

class OllamaClient(BaseClient):

    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(self, system_prompt, prompt: str) -> ModelResponse:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": self.model_name,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False,
                "think": True,
                "keep_alive": "30m",
                "options": {
                    "temperature": float(TEMPERATURE),
                    "num_predict": int(MAX_TOKENS),
                },
            },
            timeout=900,
        )

        if not response.ok:
            logger.error(f"Ollama error: {response.text}")
            response.raise_for_status()

        data = response.json()

        total_duration = data["total_duration"]
        prompt_eval_count = data["prompt_eval_count"]
        eval_count = data["eval_count"]
        tokens = prompt_eval_count + eval_count
        done_reason = data.get("done_reason", "unknown")

        if done_reason == "length":
            logger.warning(
                f"ollama done_reason=length — response was cut at num_predict={MAX_TOKENS}. "
                "Consider increasing MAX_TOKENS."
            )

        logger.info(
            f"ollama done_reason={done_reason} "
            f"total_duration={total_duration / 60_000_000_000:.2f}min"
        )
        logger.info(
            f"ollama tokens — prompt: {prompt_eval_count} "
            f"| completion: {eval_count} | total: {tokens}"
        )

        return ModelResponse(
            content=sanitize_response(data["response"]),
            duration_seconds=total_duration,
            tokens=tokens,
        )
