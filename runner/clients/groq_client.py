import time
import requests

from clients.base import BaseClient
from clients.ollama_client import ModelResponse
from config import GROQ_API_KEY, TEMPERATURE
from utils.sanitization import sanitize_response
from utils.logging import logger

# Groq free tier: 12 000 TPM for llama-3.3-70b-versatile.
# Average call is ~1 500 tokens (prompt + completion + repair context).
# Safe ceiling: 8 calls/min → 1 call per 7.5 s.
# We use 8 s to stay comfortably under the limit even when repair calls
# happen concurrently within the same function loop.
_GROQ_INTER_CALL_SLEEP = 8.0   # seconds between any two calls

_MAX_RETRIES = 5


class GroqClient(BaseClient):
    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(self, system_prompt: str, prompt: str) -> ModelResponse:
        if not GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is not set in your environment or .env file."
            )

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": float(TEMPERATURE),
        }

        logger.info(f"Groq request (model={self.model_name})")

        for attempt in range(1, _MAX_RETRIES + 1):
            response = requests.post(
                url, json=payload, headers=headers, timeout=120
            )

            if response.status_code == 429:
                # Parse retry-after from the error body when available
                wait = self._parse_retry_after(response)
                logger.warning(
                    f"Groq 429 (attempt {attempt}/{_MAX_RETRIES}). "
                    f"Sleeping {wait:.0f}s before retry."
                )
                time.sleep(wait)
                continue

            if not response.ok:
                logger.error(
                    f"Groq API error: {response.status_code} — {response.text}"
                )
                response.raise_for_status()

            # ── Success path ──────────────────────────────────────────────────
            data = response.json()

            try:
                generated_text = data["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as exc:
                logger.error(
                    f"Failed to parse Groq response: {data}. Error: {exc}"
                )
                raise RuntimeError("Invalid response structure from Groq API.")

            duration_ns = int(
                data["usage"].get("total_time", 0) * 1e9
            )  # Groq returns seconds; convert to ns to match other clients
            tokens = data["usage"].get("total_tokens", 0)

            # Preventive sleep AFTER a successful call so the next call
            # (repair loop, next function) doesn't immediately hit TPM.
            time.sleep(_GROQ_INTER_CALL_SLEEP)

            return ModelResponse(
                content=sanitize_response(generated_text),
                duration_ns=duration_ns,
                tokens=tokens,
            )

        raise RuntimeError(
            f"Groq API rate limit not resolved after {_MAX_RETRIES} retries "
            f"for model {self.model_name}."
        )

    @staticmethod
    def _parse_retry_after(response: requests.Response) -> float:
        """
        Extracts the recommended wait time from a 429 response.

        Groq embeds it in the JSON error body:
          {"error": {"message": "... retry after X.XXXs ..."}}

        Falls back to exponential backoff starting at 30s if not found.
        """
        try:
            msg = response.json()["error"]["message"]
            # "Please try again in 7.085s"
            import re
            m = re.search(r"in\s+([\d.]+)s", msg)
            if m:
                return float(m.group(1)) + 2.0   # small buffer
        except Exception:
            pass

        # Fallback: 30 s, 60 s, 120 s, …
        return 300.0
