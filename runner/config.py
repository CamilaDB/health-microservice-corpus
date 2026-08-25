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

JEST_REPORT_PATH = TMP_DIR / "coverage" / "jest-report.json"

AST_CLI_OUTPUT_DIR = ROOT_DIR / "ast-cli" / "output"
FUNCTIONS_FILE = AST_CLI_OUTPUT_DIR / "functions" / "service_functions.json"
BOOTSTRAP_DIR = AST_CLI_OUTPUT_DIR / "bootstrap"

RESULTS_CSV = METRICS_DIR / "results.csv"
SERVICE_RESULTS_CSV = METRICS_DIR / "service_results.csv"
GLOBAL_RESULTS_CSV = METRICS_DIR / "metrics_results.csv"
MUTATION_RESULTS_CSV = METRICS_DIR / "mutation_results.csv"
SMELL_RESULTS_CSV    = METRICS_DIR / "smell_results.csv"

OLLAMA_URL = os.getenv("OLLAMA_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

TEMPERATURE = float(os.getenv("TEMPERATURE", '0.2'))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", '8192'))

MAX_RUNTIME_REPAIRS = int(os.getenv("MAX_RUNTIME_REPAIRS", '5'))
MAX_TS_REPAIRS = int(os.getenv("MAX_TS_REPAIRS", '3'))

MODELS = {
    "gemma_4": {
        "provider": "ollama",
        "model": "gemma4:e2b",
    },

    "qwen_coder_3b": {
        "provider": "ollama",
        "model": "qwen2.5-coder:3b",
    },

    "qwen_coder_7b": {
        "provider": "ollama",
        "model": "qwen2.5-coder:7b",
    },

    # "llama70b": {
    #     "provider": "groq",
    #     "model": "llama-3.3-70b-versatile",
    # },

    "gpt_oss_120b": {
        "provider": "groq",
        "model": "openai/gpt-oss-120b",
    },
}

PROMPT_STRATEGIES = [
    "zero_shot",
    "few_shot",
    "structured",
]
