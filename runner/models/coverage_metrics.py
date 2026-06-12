from dataclasses import dataclass
from typing import Dict

@dataclass
class CoverageMetrics:
    total_tests: int = 0
    passed_tests: int = 0
    failed_tests: int = 0
    pending_tests: int = 0

    lines_total: int = 0
    lines_covered: int = 0
    lines_pct: float = 0.0

    statements_total: int = 0
    statements_covered: int = 0
    statements_pct: float = 0.0

    functions_total: int = 0
    functions_covered: int = 0
    functions_pct: float = 0.0

    branches_total: int = 0
    branches_covered: int = 0
    branches_pct: float = 0.0

    # target_file: Optional[str] = None
    # target_statements_pct: float = 0.0
    # target_branches_pct: float = 0.0
    # target_functions_pct: float = 0.0
    # target_lines_pct: float = 0.0

    def to_csv_row(self) -> Dict:
        return {
            "total_tests": self.total_tests,
            "passed_tests": self.passed_tests,
            "failed_tests": self.failed_tests,
            "pending_tests": self.pending_tests,
            "lines_total": self.lines_total,
            "lines_covered": self.lines_covered,
            "lines_pct": self.lines_pct,
            "statements_total": self.statements_total,
            "statements_covered": self.statements_covered,
            "statements_pct": self.statements_pct,
            "functions_total": self.functions_total,
            "functions_covered": self.functions_covered,
            "functions_pct": self.functions_pct,
            "branches_total": self.branches_total,
            "branches_covered": self.branches_covered,
            "branches_pct": self.branches_pct,
            # "target_file": self.target_file or "",
            # "target_statements_pct": self.target_statements_pct,
            # "target_branches_pct": self.target_branches_pct,
            # "target_functions_pct": self.target_functions_pct,
            # "target_lines_pct": self.target_lines_pct,
        }
