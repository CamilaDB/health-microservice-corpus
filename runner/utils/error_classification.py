"""
Deterministic error classification for the error-event log.

No model calls. Every classifier here is a pure function over already-
computed pipeline state (exit status, stdout/stderr text, parsed Jest
failures) -- same input always produces the same category/subcategory, so
the log is reproducible. Where the existing pipeline already classifies a
failure (repair.parser.categorize_jest_error, extract_test_metrics'
test-discovery sentinel), this module maps that existing signal onto the
stable error-event taxonomy instead of re-deriving it.
"""

import re

CATEGORIES = ("generation", "typescript", "jest", "repair", "pipeline")

# ─────────────────────────────────────────────────────────────────────────────
# generation
# ─────────────────────────────────────────────────────────────────────────────


def classify_generation_empty() -> tuple[str, str]:
    return "generation", "empty_response"


def classify_generation_invalid() -> tuple[str, str]:
    return "generation", "invalid_output"


def classify_generation_exception() -> tuple[str, str]:
    return "generation", "generation_exception"


# ─────────────────────────────────────────────────────────────────────────────
# typescript
# TS error codes are stable across compiler versions in the ranges used here:
#   1xxx  -- syntax/parser diagnostics
#   2304, 2339, 2551, 2552 -- cannot find name/module, unknown property
#   2322, 2345, 2367, 2416, 2769 -- assignability / argument / overload mismatches
# Anything else with "error TS" is bucketed as a generic compile_error rather
# than guessed at.
# ─────────────────────────────────────────────────────────────────────────────

_TS_MISSING_IDENTIFIER = re.compile(r"error TS(2304|2339|2551|2552)\b")
_TS_TYPE_MISMATCH = re.compile(r"error TS(2322|2345|2367|2416|2769)\b")
_TS_SYNTAX = re.compile(r"error TS1\d{3}\b")
_TS_ANY_ERROR = re.compile(r"error TS\d+")


def classify_typescript_failure(diagnostic_text: str | None) -> tuple[str, str]:
    """
    diagnostic_text is whichever of stdout/stderr actually carries the
    `error TSxxxx:` lines (tsc writes to stdout; ts-jest surfaces them via
    Jest's own stderr).
    """
    text = diagnostic_text or ""
    if _TS_MISSING_IDENTIFIER.search(text):
        return "typescript", "missing_identifier"
    if _TS_TYPE_MISMATCH.search(text):
        return "typescript", "type_mismatch"
    if _TS_SYNTAX.search(text):
        return "typescript", "syntax_error"
    if _TS_ANY_ERROR.search(text):
        return "typescript", "compile_error"
    return "typescript", "unknown"


# ─────────────────────────────────────────────────────────────────────────────
# jest
# ─────────────────────────────────────────────────────────────────────────────

_TIMEOUT_RE = re.compile(r"Exceeded timeout|Timeout - Async callback", re.IGNORECASE)

# Maps repair.parser.categorize_jest_error()'s finer-grained, repair-oriented
# buckets onto the coarser, stable error-event taxonomy. Reused, not
# reimplemented.
_JEST_ERROR_TYPE_TO_SUBCATEGORY = {
    "mock_call_argument_mismatch": "assertion_failure",
    "wrong_async_assertion": "assertion_failure",
    "missing_throw": "assertion_failure",
    "undefined_property": "runtime_error",
    "not_a_function": "runtime_error",
    "undefined_identifier": "runtime_error",
    "unhandled_rejection": "unhandled_rejection",
    # A TS error surfacing through Jest is reported under the typescript
    # phase (see is_typescript_error in main.py), never here.
    "typescript_error": None,
    "generic": None,
}


def classify_jest_failure(
    *,
    test_discovery_failed: bool,
    error_type: str | None = None,
    raw_text: str | None = None,
) -> tuple[str, str]:
    """
    test_discovery_failed: True when extract_test_metrics() returned the
        existing total_tests == -1 sentinel (Jest failed before discovering
        the test tree -- see docs/experimental-workflow.md).
    error_type: the error_type of one parsed JestFailure (from
        repair.parser.categorize_jest_error), when a failure was
        attributable to a specific test.
    raw_text: raw stderr, consulted only for the timeout heuristic when no
        error_type is available.
    """
    if test_discovery_failed:
        return "jest", "test_discovery_failure"

    if error_type:
        subcategory = _JEST_ERROR_TYPE_TO_SUBCATEGORY.get(error_type)
        if subcategory:
            return "jest", subcategory

    if raw_text and _TIMEOUT_RE.search(raw_text):
        return "jest", "timeout"

    return "jest", "unknown"


# ─────────────────────────────────────────────────────────────────────────────
# repair
# ─────────────────────────────────────────────────────────────────────────────


def classify_repair_unparseable() -> tuple[str, str]:
    return "repair", "unparseable_failure"


def classify_repair_failed() -> tuple[str, str]:
    return "repair", "repair_failed"


def classify_repair_max_exceeded() -> tuple[str, str]:
    return "repair", "max_repairs_exceeded"


# ─────────────────────────────────────────────────────────────────────────────
# pipeline
# ─────────────────────────────────────────────────────────────────────────────


def classify_pipeline_exception() -> tuple[str, str]:
    return "pipeline", "runner_exception"


def classify_pipeline_rollback() -> tuple[str, str]:
    return "pipeline", "rollback"


def classify_pipeline_artifact_corruption() -> tuple[str, str]:
    return "pipeline", "artifact_corruption_detected"
