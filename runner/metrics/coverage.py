import json
from typing import Optional

from config import ROOT_DIR
from models.covarage_metrics import CoverageMetrics
from utils.logging import logger



def extract_coverage(target_source_file: Optional[str] = None) -> CoverageMetrics:
    metrics = CoverageMetrics()

    coverage_path = ROOT_DIR / "coverage" / "coverage-summary.json"

    if not coverage_path.exists():
        logger.error(f"coverage-summary not found: {coverage_path}")
        return metrics

    try:
        data = json.loads(coverage_path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error(f"Failed to parse coverage-summary: {exc}")
        return metrics

    total = data.get("total", {})

    metrics.statements_pct = total.get("statements", {}).get("pct", 0.0)
    metrics.branches_pct = total.get("branches", {}).get("pct", 0.0)
    metrics.functions_pct = total.get("functions", {}).get("pct", 0.0)
    metrics.lines_pct = total.get("lines", {}).get("pct", 0.0)

    metrics.total_tests = data.get("numTotalTests", 0)
    metrics.passed_tests = data.get("numPassedTests", 0)
    metrics.failed_tests = data.get("numFailedTests", 0)
    metrics.pending_tests = data.get("numPendingTests", 0)

    if target_source_file:
        normalized = target_source_file.replace("\\", "/")

        for key, value in data.items():
            if key == "total":
                continue

            if normalized in key.replace("\\", "/"):
                metrics.target_file = key
                metrics.target_statements_pct = value.get("statements", {}).get("pct", 0.0)
                metrics.target_branches_pct = value.get("branches", {}).get("pct", 0.0)
                metrics.target_functions_pct = value.get("functions", {}).get("pct", 0.0)
                metrics.target_lines_pct = value.get("lines", {}).get("pct", 0.0)
                break

    return metrics