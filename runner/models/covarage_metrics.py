from dataclasses import dataclass
from typing import Dict, Optional


@dataclass
class CoverageMetrics:
    total_tests: int = 0
    passed_tests: int = 0
    failed_tests: int = 0
    pending_tests: int = 0

    statements_pct: float = 0.0
    branches_pct: float = 0.0
    functions_pct: float = 0.0
    lines_pct: float = 0.0

    target_file: Optional[str] = None
    target_statements_pct: float = 0.0
    target_branches_pct: float = 0.0
    target_functions_pct: float = 0.0
    target_lines_pct: float = 0.0

    def to_csv_row(self) -> Dict:
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "pending_tests": self.pending_tests,
            "statements_pct": self.statements_pct,
            "branches_pct": self.branches_pct,
            "functions_pct": self.functions_pct,
            "lines_pct": self.lines_pct,
            "target_file": self.target_file or "",
            "target_statements_pct": self.target_statements_pct,
            "target_branches_pct": self.target_branches_pct,
            "target_functions_pct": self.target_functions_pct,
            "target_lines_pct": self.target_lines_pct,
        }
