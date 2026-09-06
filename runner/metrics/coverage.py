"""
Three-level coverage extraction.

Level 1 — per function  : reads coverage-final.json (Istanbul detail),
                           filters by [line_start, line_end] from function_data.
                           Keys prefixed with "fn_".

Level 2 — per service   : reads coverage-summary.json, target file section.
                           Keys prefixed with "svc_".

Level 3 — global        : reads coverage-summary.json, "total" section.
                           Keys prefixed with "global_".

Test metrics (total / passed / failed / pending) are shared by all levels
and come from the Jest JSON report written to JEST_REPORT_PATH.
"""

import json
from pathlib import Path

from config import JEST_REPORT_PATH, TMP_DIR
from utils.logging import logger


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────

def _pct(covered: int, total: int) -> float:
    return round(100.0 * covered / total, 2) if total > 0 else 0.0


def _load_json(path: Path, label: str) -> dict | None:
    if not path.exists():
        logger.error(f"{label} not found: {path}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error(f"Failed to parse {label}: {exc}")
        return None


def _load_coverage_final() -> dict | None:
    return _load_json(TMP_DIR / "coverage" / "coverage-final.json", "coverage-final.json")


def _load_coverage_summary() -> dict | None:
    return _load_json(TMP_DIR / "coverage" / "coverage-summary.json", "coverage-summary.json")


def _find_file_entry(coverage_data: dict, target_source_file: str) -> dict | None:
    """Locates a file's entry in coverage-final.json or coverage-summary.json."""
    normalized_target = Path(target_source_file).as_posix()
    for key, value in coverage_data.items():
        if key == "total":
            continue
        if normalized_target in Path(key).as_posix():
            return value
    logger.warning(f"Source file not found in coverage data: {target_source_file}")
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Test metrics  (common across all three levels)
# ─────────────────────────────────────────────────────────────────────────────

def extract_test_metrics(fn_id: str | None = None) -> dict:
    """
    Reads the Jest JSON report and returns test-case metrics.

    When fn_id is provided, counts only assertionResults belonging
    to the target function identified by fn_id.

    Without fn_id, returns the global Jest counters.
    """

    _empty = {
        "total_tests": 0,
        "passed_tests": 0,
        "failed_tests": 0,
        "pending_tests": 0,
    }

    data = _load_json(JEST_REPORT_PATH, "jest-report.json")
    if data is None:
        return _empty

    if not fn_id:
        total = data.get("numTotalTests", 0)
        if total == 0 and (data.get("numRuntimeErrorTestSuites", 0) > 0 or data.get("numFailedTestSuites", 0) > 0):
            return {
                "total_tests": -1,
                "passed_tests": 0,
                "failed_tests": 0,
                "pending_tests": 0,
            }
        return {
            "total_tests": total,
            "passed_tests": data.get("numPassedTests", 0),
            "failed_tests": data.get("numFailedTests", 0),
            "pending_tests": data.get("numPendingTests", 0),
        }

    total = passed = failed = pending = 0

    for suite in data.get("testResults", []):
        for assertion in suite.get("assertionResults", []):
            ancestor_titles = assertion.get("ancestorTitles") or []
            title = assertion.get("title") or ""
            full_name = assertion.get("fullName") or ""

            belongs_to_function = (
                fn_id in ancestor_titles
                or fn_id in title
                or fn_id in full_name
            )

            if not belongs_to_function:
                continue

            total += 1
            status = assertion.get("status")

            if status == "passed":
                passed += 1
            elif status == "failed":
                failed += 1
            elif status in {"pending", "skipped", "todo"}:
                pending += 1

    if total == 0 and (data.get("numRuntimeErrorTestSuites", 0) > 0 or data.get("numFailedTestSuites", 0) > 0):
        return {
            "total_tests": -1,
            "passed_tests": 0,
            "failed_tests": 0,
            "pending_tests": 0,
        }

    return {
        "total_tests": total,
        "passed_tests": passed,
        "failed_tests": failed,
        "pending_tests": pending,
    }

# ─────────────────────────────────────────────────────────────────────────────
# Level 1 — per-function coverage  (coverage-final.json + line range filter)
# ─────────────────────────────────────────────────────────────────────────────

def extract_function_coverage(
    target_source_file: str,
    line_start: int,
    line_end: int,
) -> dict:
    """
    Computes statement / branch / function coverage restricted to the lines
    [line_start, line_end] of the target source file.

    Uses coverage-final.json produced by Jest's 'json' reporter, which
    contains Istanbul's raw statementMap / branchMap / fnMap with per-entry
    loc (start.line / end.line).

    A statement is in-scope when both its start and end lines fall within
    [line_start, line_end].
    A branch is in-scope when its loc.start.line is within the range.
    A function is in-scope when both its loc.start.line and loc.end.line
    fall within the range.
    """
    _empty = {
        "fn_statements_total":   0,
        "fn_statements_covered": 0,
        "fn_statements_pct":     0.0,
        "fn_branches_total":     0,
        "fn_branches_covered":   0,
        "fn_branches_pct":       0.0,
        "fn_functions_total":    0,
        "fn_functions_covered":  0,
        "fn_functions_pct":      0.0,
    }

    data = _load_coverage_final()
    if data is None:
        return _empty

    file_data = _find_file_entry(data, target_source_file)
    if file_data is None:
        return _empty

    # ── Statements ────────────────────────────────────────────────────────────
    stmt_map  = file_data.get("statementMap", {})
    stmt_hits = file_data.get("s", {})
    s_total = s_covered = 0

    for k, loc in stmt_map.items():
        sl = loc["start"]["line"]
        el = loc["end"]["line"]
        if sl >= line_start and el <= line_end:
            s_total += 1
            if stmt_hits.get(k, 0) > 0:
                s_covered += 1

    # ── Branches ──────────────────────────────────────────────────────────────
    # branchMap entries have a top-level "loc" key for the whole branch
    # and a "locations" list for each arm.  We scope on the branch loc.
    branch_map  = file_data.get("branchMap", {})
    branch_hits = file_data.get("b", {})
    b_total = b_covered = 0

    for k, branch in branch_map.items():
        loc = branch.get("loc", {})
        # "loc" may be absent on very old Istanbul versions; fall back to
        # first element of "locations".
        if not loc:
            locations = branch.get("locations", [])
            loc = locations[0] if locations else {}
        sl = loc.get("start", {}).get("line", 0) if isinstance(loc, dict) else 0
        if line_start <= sl <= line_end:
            hits = branch_hits.get(k, [])
            b_total   += len(hits)
            b_covered += sum(1 for h in hits if h > 0)

    # ── Functions ─────────────────────────────────────────────────────────────
    fn_map  = file_data.get("fnMap", {})
    fn_hits = file_data.get("f", {})
    f_total = f_covered = 0

    for k, fn in fn_map.items():
        loc = fn.get("loc", {})
        sl = loc.get("start", {}).get("line", 0)
        el = loc.get("end",   {}).get("line", 0)
        if sl >= line_start and el <= line_end:
            f_total += 1
            if fn_hits.get(k, 0) > 0:
                f_covered += 1

    return {
        "fn_statements_total":   s_total,
        "fn_statements_covered": s_covered,
        "fn_statements_pct":     _pct(s_covered, s_total),
        "fn_branches_total":     b_total,
        "fn_branches_covered":   b_covered,
        "fn_branches_pct":       _pct(b_covered, b_total),
        "fn_functions_total":    f_total,
        "fn_functions_covered":  f_covered,
        "fn_functions_pct":      _pct(f_covered, f_total),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Level 2 — per-service coverage  (coverage-summary.json, target file entry)
# ─────────────────────────────────────────────────────────────────────────────

def extract_service_coverage(target_source_file: str) -> dict:
    """
    Coverage for the complete service file as exercised by all of its
    generated tests together.

    Reads the target file's section from coverage-summary.json.
    Produced by run_jest_service() (no testNamePattern, json-summary reporter).
    Keys are prefixed with "svc_".
    """
    _empty = {
        "svc_statements_total":   0,
        "svc_statements_covered": 0,
        "svc_statements_pct":     0.0,
        "svc_branches_total":     0,
        "svc_branches_covered":   0,
        "svc_branches_pct":       0.0,
        "svc_functions_total":    0,
        "svc_functions_covered":  0,
        "svc_functions_pct":      0.0,
        "svc_lines_total":        0,
        "svc_lines_covered":      0,
        "svc_lines_pct":          0.0,
    }

    data = _load_coverage_summary()
    if data is None:
        return _empty

    fd = _find_file_entry(data, target_source_file)
    if fd is None:
        return _empty

    def _g(metric: str) -> dict:
        return fd.get(metric, {})

    return {
        "svc_statements_total":   _g("statements").get("total",   0),
        "svc_statements_covered": _g("statements").get("covered", 0),
        "svc_statements_pct":     _g("statements").get("pct",     0.0),
        "svc_branches_total":     _g("branches").get("total",     0),
        "svc_branches_covered":   _g("branches").get("covered",   0),
        "svc_branches_pct":       _g("branches").get("pct",       0.0),
        "svc_functions_total":    _g("functions").get("total",    0),
        "svc_functions_covered":  _g("functions").get("covered",  0),
        "svc_functions_pct":      _g("functions").get("pct",      0.0),
        "svc_lines_total":        _g("lines").get("total",        0),
        "svc_lines_covered":      _g("lines").get("covered",      0),
        "svc_lines_pct":          _g("lines").get("pct",          0.0),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Level 3 — global coverage  (coverage-summary.json, "total" section)
# ─────────────────────────────────────────────────────────────────────────────

def extract_global_coverage() -> dict:
    """
    Aggregate coverage across all service files for a model × strategy pair.

    Reads the "total" section from coverage-summary.json.
    Produced by run_jest_global() (all specs, src/**/*.service.ts glob).
    Keys are prefixed with "global_".
    """
    _empty = {
        "global_statements_total":   0,
        "global_statements_covered": 0,
        "global_statements_pct":     0.0,
        "global_branches_total":     0,
        "global_branches_covered":   0,
        "global_branches_pct":       0.0,
        "global_functions_total":    0,
        "global_functions_covered":  0,
        "global_functions_pct":      0.0,
        "global_lines_total":        0,
        "global_lines_covered":      0,
        "global_lines_pct":          0.0,
    }

    data = _load_coverage_summary()
    if data is None:
        return _empty

    total = data.get("total", {})
    if not total:
        logger.warning("extract_global_coverage: no 'total' key in coverage-summary.json")
        return _empty

    def _g(metric: str) -> dict:
        return total.get(metric, {})

    return {
        "global_statements_total":   _g("statements").get("total",   0),
        "global_statements_covered": _g("statements").get("covered", 0),
        "global_statements_pct":     _g("statements").get("pct",     0.0),
        "global_branches_total":     _g("branches").get("total",     0),
        "global_branches_covered":   _g("branches").get("covered",   0),
        "global_branches_pct":       _g("branches").get("pct",       0.0),
        "global_functions_total":    _g("functions").get("total",    0),
        "global_functions_covered":  _g("functions").get("covered",  0),
        "global_functions_pct":      _g("functions").get("pct",      0.0),
        "global_lines_total":        _g("lines").get("total",        0),
        "global_lines_covered":      _g("lines").get("covered",      0),
        "global_lines_pct":          _g("lines").get("pct",          0.0),
    }
