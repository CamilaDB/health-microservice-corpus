import requests
import time

from clients.base import BaseClient
from clients.ollama_client import ModelResponse

from config import OPENROUTER_API_KEY, TEMPERATURE

from utils.logging import logger
from utils.sanitization import sanitize_response


class OpenRouterClient(BaseClient):

    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(
        self,
        system_prompt: str,
        prompt: str,
    ) -> ModelResponse:

        if not OPENROUTER_API_KEY:
            raise ValueError(
                "OPENROUTER_API_KEY is not set."
            )

        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",

            # opcionais
            # "HTTP-Referer": "https://github.com/seu-projeto",
            # "X-Title": "jest-test-generator",
        }

        messages = []

        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt,
            })

        messages.append({
            "role": "user",
            "content": prompt,
        })

        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": float(TEMPERATURE),
        }

        logger.info(
            f"Sending request to OpenRouter "
            f"(model: {self.model_name})..."
        )

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=120,
        )

        if response.status_code == 429:

            logger.warning(
                f"Rate limit reached for {self.model_name}. "
                f"Sleeping 35s and retrying."
            )

            time.sleep(35)

            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=120,
            )

        if not response.ok:
            logger.error(
                f"OpenRouter API error: "
                f"{response.status_code} - {response.text}"
            )
            response.raise_for_status()

        data = response.json()

        try:
            generated_text = data["choices"][0]["message"]["content"]

        except (KeyError, IndexError) as exc:
            logger.error(
                f"Failed to parse OpenRouter response: "
                f"{data}. Error: {exc}"
            )
            raise RuntimeError(
                "Invalid response structure from OpenRouter."
            )

        usage = data.get("usage", {})

        tokens = usage.get(
            "total_tokens",
            0,
        )

        return ModelResponse(
            content=sanitize_response(generated_text),

            # OpenRouter não retorna total_time
            duration_seconds=0,

            tokens=tokens,
        )
