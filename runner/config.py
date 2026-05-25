import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parent.parent

CORPUS_DIR = ROOT_DIR / "corpus"

PROMPTS_DIR = ROOT_DIR / "prompts"

EXPERIMENTS_DIR = ROOT_DIR / "experiments"

# BOOTSTRAP_DIR = EXPERIMENTS_DIR / "bootstrap"
GENERATED_DIR = EXPERIMENTS_DIR / "generated"

METRICS_DIR = EXPERIMENTS_DIR / "metrics"

LOGS_DIR = EXPERIMENTS_DIR / "logs"

TMP_DIR = EXPERIMENTS_DIR / "tmp"

DATA_DIR = ROOT_DIR / "runner" / "data"

RESULTS_CSV = METRICS_DIR / "results.csv"

OLLAMA_URL = os.getenv("OLLAMA_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

TEMPERATURE = float(os.getenv("TEMPERATURE", '0.2'))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", '2048'))

MAX_RUNTIME_REPAIRS = int(os.getenv("MAX_RUNTIME_REPAIRS", '2'))
MAX_TS_REPAIRS = int(os.getenv("MAX_TS_REPAIRS", '3'))

MODELS = {
    "qwen": "qwen2.5-coder:3b", 
    # "qwen": "qwen3.5:4b", 
}
    # "deepseek": "deepseek-coder-v2:lite",

PROMPT_STRATEGIES = [
    "zero_shot",
    # "few_shot",
    # "structured",
]
