from dataclasses import dataclass
from typing import Optional

from models.covarage_metrics import CoverageMetrics


@dataclass
class RuntimeRepairResult:
    success: bool
    requires_typescript_repair: bool
    jest_result: Optional[object]
    coverage: CoverageMetrics
    runtime_repairs: int
