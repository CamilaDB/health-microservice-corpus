import re
import time
import requests

from clients.base import BaseClient
from clients.ollama_client import ModelResponse
from config import OPENROUTER_API_KEY, TEMPERATURE
from utils.logging import logger
from utils.sanitization import sanitize_response

# OpenRouter free models share a global rate limit that varies by model.
# Nemotron Ultra free tier is generous but responses are slow (~2 s/token).
# A conservative 5 s inter-call sleep prevents most 429s without wasting
# too much wall time. Retries with backoff handle the rest.
_OPENROUTER_INTER_CALL_SLEEP = 5.0
_MAX_RETRIES = 5


class OpenRouterClient(BaseClient):

    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(self, system_prompt: str, prompt: str) -> ModelResponse:
        if not OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY is not set.")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
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

        logger.info(f"OpenRouter request (model={self.model_name})")

        for attempt in range(1, _MAX_RETRIES + 1):
            t_start = time.time_ns()

            response = requests.post(
                url, json=payload, headers=headers, timeout=300
            )  # 300 s: large models on free tier can be slow

            duration_ns = time.time_ns() - t_start

            # ── Rate limit ────────────────────────────────────────────────────
            if response.status_code == 429:
                wait = self._parse_retry_after(response)
                logger.warning(
                    f"OpenRouter 429 (attempt {attempt}/{_MAX_RETRIES}). "
                    f"Sleeping {wait:.0f}s."
                )
                time.sleep(wait)
                continue

            # ── Upstream / gateway errors — retry with backoff ────────────────
            if response.status_code in (502, 503, 524):
                wait = 30.0 * attempt
                logger.warning(
                    f"OpenRouter {response.status_code} (attempt {attempt}). "
                    f"Sleeping {wait:.0f}s."
                )
                time.sleep(wait)
                continue

            if not response.ok:
                logger.error(
                    f"OpenRouter error: {response.status_code} — {response.text}"
                )
                response.raise_for_status()

            # ── Success path ──────────────────────────────────────────────────
            data = response.json()

            # OpenRouter wraps upstream errors in a 200 with an "error" key
            if "error" in data:
                err = data["error"]
                code = err.get("code", 0)
                msg  = err.get("message", str(err))

                if code == 429 or "rate" in msg.lower():
                    wait = self._parse_retry_after(response, msg)
                    logger.warning(
                        f"OpenRouter upstream 429 in body (attempt {attempt}). "
                        f"Sleeping {wait:.0f}s."
                    )
                    time.sleep(wait)
                    continue

                logger.error(f"OpenRouter error in body: {err}")
                raise RuntimeError(f"OpenRouter API error: {msg}")

            try:
                generated_text = data["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as exc:
                logger.error(f"Failed to parse OpenRouter response: {data}. Error: {exc}")
                raise RuntimeError("Invalid response structure from OpenRouter.")

            usage  = data.get("usage", {})
            tokens = usage.get("total_tokens", 0)

            # Preventive sleep before next call
            time.sleep(_OPENROUTER_INTER_CALL_SLEEP)

            return ModelResponse(
                content=sanitize_response(generated_text),
                duration_ns=duration_ns,   # wall-clock, consistent with other clients
                tokens=tokens,
            )

        raise RuntimeError(
            f"OpenRouter rate limit not resolved after {_MAX_RETRIES} retries "
            f"for model {self.model_name}."
        )

    @staticmethod
    def _parse_retry_after(
        response: requests.Response,
        body_message: str = "",
    ) -> float:
        """
        Extracts recommended wait time from:
          1. Retry-After header (seconds or HTTP-date)
          2. X-RateLimit-Reset-Requests header
          3. 'retry after Xs' pattern in body/error message
          4. Exponential fallback: 30s
        """
        # Header: Retry-After
        retry_after = response.headers.get("Retry-After", "")
        if retry_after:
            try:
                return float(retry_after) + 2.0
            except ValueError:
                pass

        # Header: X-RateLimit-Reset-Requests (epoch ms on some providers)
        reset = response.headers.get("X-RateLimit-Reset-Requests", "")
        if reset:
            try:
                reset_ms = float(reset)
                wait = (reset_ms - time.time() * 1000) / 1000
                if 0 < wait < 300:
                    return wait + 2.0
            except ValueError:
                pass

        # Body message pattern
        for text in (body_message, response.text):
            m = re.search(r"(?:retry|wait|after)[^\d]*([\d.]+)\s*s", text, re.I)
            if m:
                return float(m.group(1)) + 2.0

        return 30.0
