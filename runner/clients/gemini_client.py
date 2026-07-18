import time
import requests
from clients.base import BaseClient
from clients.ollama_client import ModelResponse
from config import GEMINI_API_KEY, TEMPERATURE
from utils.sanitization import sanitize_response
from utils.logging import logger

class GeminiClient(BaseClient):
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name

    def generate(self, system_prompt: str, prompt: str) -> ModelResponse:
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in your environment or .env file.")
        
        started_at = time.time()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": float(TEMPERATURE)
            }
        }
        
        if system_prompt:
            payload["systemInstruction"] = {
                "parts": [
                    {
                        "text": system_prompt
                    }
                ]
            }
            
        logger.info(f"Sending request to Gemini API (model: {self.model_name})...")
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=120)
        
        if not response.ok:
            logger.error(f"Gemini API error: {response.status_code} - {response.text}")
            response.raise_for_status()
            
        data = response.json()
        
        try:
            generated_text = data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            logger.error(f"Failed to parse Gemini API response structure: {data}. Error: {e}")
            raise RuntimeError("Invalid response structure from Gemini API.")
            
        duration = time.time() - started_at
        return ModelResponse(
            content=sanitize_response(generated_text),
            duration_ns=duration
        )
