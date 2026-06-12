import json
# from pathlib import Path
from typing import Optional

from config import TMP_DIR
from models.coverage_metrics import CoverageMetrics
from utils.logging import logger


def extract_coverage(
    target_source_file: Optional[str] = None,
) -> CoverageMetrics:

    metrics = CoverageMetrics()

    coverage_path = TMP_DIR / "coverage" / "coverage-summary.json"
    jest_report_path = TMP_DIR / "coverage" / "jest-report.json"

    #
    # TEST METRICS
    #

    if jest_report_path.exists():
        try:
            jest_data = json.loads(
                jest_report_path.read_text(encoding="utf-8")
            )

            metrics.total_tests = jest_data.get("numTotalTests", 0)
            metrics.passed_tests = jest_data.get("numPassedTests", 0)
            metrics.failed_tests = jest_data.get("numFailedTests", 0)
            metrics.pending_tests = jest_data.get("numPendingTests", 0)

        except Exception as exc:
            logger.error(f"Failed to parse jest-report.json: {exc}")

    #
    # COVERAGE METRICS
    #

    if not coverage_path.exists():
        logger.error(f"coverage-summary not found: {coverage_path}")
        return metrics

    try:
        coverage_data = json.loads(
            coverage_path.read_text(encoding="utf-8")
        )

    except Exception as exc:
        logger.error(f"Failed to parse coverage-summary.json: {exc}")
        return metrics

    #
    # GLOBAL COVERAGE
    #

    total = coverage_data.get("total", {})

    total_lines = total.get("lines", {})
    total_statements = total.get("statements", {})
    total_functions = total.get("functions", {})
    total_branches = total.get("branches", {})

    metrics.lines_total = total_lines.get("total", 0)
    metrics.lines_covered = total_lines.get("covered", 0)
    metrics.lines_pct = total_lines.get("pct", 0)

    metrics.statements_total = total_statements.get("total", 0)
    metrics.statements_covered = total_statements.get("covered", 0)
    metrics.statements_pct = total_statements.get("pct", 0)

    metrics.functions_total = total_functions.get("total", 0)
    metrics.functions_covered = total_functions.get("covered", 0)
    metrics.functions_pct = total_functions.get("pct", 0)

    metrics.branches_total = total_branches.get("total", 0)
    metrics.branches_covered = total_branches.get("covered", 0)
    metrics.branches_pct = total_branches.get("pct", 0)

    #
    # TARGET FILE COVERAGE
    #

    # if target_source_file:
    #     normalized_target = (
    #         Path(target_source_file)
    #         .as_posix()
    #     )

    #     for file_path, file_metrics in coverage_data.items():

    #         if file_path == "total":
    #             continue

    #         normalized_file = Path(file_path).as_posix()

    #         if normalized_target in normalized_file:

    #             metrics.target_file = file_path

    #             metrics.target_statements_pct = (
    #                 file_metrics.get("statements", {})
    #                 .get("pct", 0)
    #             )

    #             metrics.target_branches_pct = (
    #                 file_metrics.get("branches", {})
    #                 .get("pct", 0)
    #             )

    #             metrics.target_functions_pct = (
    #                 file_metrics.get("functions", {})
    #                 .get("pct", 0)
    #             )

    #             metrics.target_lines_pct = (
    #                 file_metrics.get("lines", {})
    #                 .get("pct", 0)
    #             )

    #             break

    return metrics
