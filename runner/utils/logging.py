from loguru import logger

from config import LOGS_DIR

logger.add(
    f"{LOGS_DIR}/runner.log",
    rotation="10 MB",
)
