import requests
import time
from clients.base import BaseClient
from clients.ollama_client import ModelResponse
from config import GROQ_API_KEY, TEMPERATURE
from utils.sanitization import sanitize_response
from utils.logging import logger

class GroqClient(BaseClient):
    def __init__(self, model_name: str):
        self.model_name = model_name

    def generate(self, system_prompt: str, prompt: str) -> ModelResponse:
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set in your environment or .env file.")
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        messages.append({
            "role": "user",
            "content": prompt
        })
        
        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": float(TEMPERATURE)
        }
        
        logger.info(f"Sending request to Groq API (model: {self.model_name})...")
        response = requests.post(url, json=payload, headers=headers, timeout=120)

        if response.status_code == 429:
            logger.warning(
                f"Rate limit reached for {self.model_name}. Sleeping 35s and retrying."
            )

            time.sleep(35)
            response = requests.post(url, json=payload, headers=headers, timeout=120)
        
        if not response.ok:
            logger.error(f"Groq API error: {response.status_code} - {response.text}")
            response.raise_for_status()
            
        data = response.json()
        
        try:
            generated_text = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            logger.error(f"Failed to parse Groq API response structure: {data}. Error: {e}")
            raise RuntimeError("Invalid response structure from Groq API.")
            
        duration = data["usage"]["total_time"]
        tokens = data["usage"]["total_tokens"]

        return ModelResponse(
            content=sanitize_response(generated_text),
            duration_seconds=duration,
            tokens=tokens
        )
