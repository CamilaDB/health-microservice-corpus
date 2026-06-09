from dataclasses import dataclass
from typing import Optional

from models.coverage_metrics import CoverageMetrics
from execution.jest_runner import JestResult


@dataclass
class RuntimeRepairResult:
    success: bool
    requires_typescript_repair: bool
    jest_result: Optional[JestResult]
    coverage: CoverageMetrics
    runtime_repairs: int
