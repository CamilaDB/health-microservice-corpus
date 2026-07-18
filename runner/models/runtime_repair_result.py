from dataclasses import dataclass, field
from typing import Optional

from execution.jest_runner import JestResult


@dataclass
class RuntimeRepairResult:
    success: bool
    requires_typescript_repair: bool
    jest_result: Optional[JestResult]
    runtime_repairs: int
    fn_coverage: dict
    test_metrics: Optional[dict]
    # Repair telemetry (accumulated across all repair attempts for the function)
    repair_tokens: int = 0
    repair_success_count: int = 0
    repair_fail_count: int = 0
