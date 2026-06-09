"""
Parses Jest failures from the JSON report produced by --reporters=json.

Prefer the JSON report over stderr because:
- No ANSI codes to strip
- Stack traces are already in failureMessages (not mixed with test output)
- fullName gives the exact test title without parsing chains
- status field is unambiguous (no heuristic needed)
"""

import re
import json
from pathlib import Path

from config import JEST_REPORT_PATH
from models.jest_result import JestFailure
from utils.logging import logger

# ─────────────────────────────────────────────────────────────────────────────
# Error categorization
# ─────────────────────────────────────────────────────────────────────────────

def categorize_jest_error(error: str) -> str:
    if "toHaveBeenCalledWith" in error:
        return "mock_call_argument_mismatch"
    if "Expected:" in error and "Received:" in error:
        return "mock_call_argument_mismatch"
    if "Cannot read propert" in error:
        return "undefined_property"
    if "is not a function" in error:
        return "not_a_function"
    if "received function did not throw" in error.lower():
        return "missing_throw"
    if "expected" in error.lower() and "rejects" in error.lower():
        return "wrong_async_assertion"
    if "not a function" in error.lower():
        return "not_a_function"
    if "is not defined" in error.lower():
        return "undefined_identifier"
    if "error ts" in error.lower():
        return "typescript_error"
    return "generic"


# ─────────────────────────────────────────────────────────────────────────────
# Message normalizers
# ─────────────────────────────────────────────────────────────────────────────

_NODE_MODULES_RE = re.compile(r"\n\s+at .+node_modules.+")
_INTERNAL_STACK_RE = re.compile(r"\n\s+at (?:Object\.<anonymous>|new Promise|Promise).+")


def _strip_stack_trace(message: str) -> str:
    # message = _NODE_MODULES_RE.sub("", message)
    message = _INTERNAL_STACK_RE.sub("", message)
    message = re.sub(r"\n{3,}", "\n\n", message)
    return message.strip()


def _normalize_called_with(message: str) -> str:
    lines = message.splitlines()
    relevant = []
    capture = False
    for line in lines:
        if "Expected" in line or "Received" in line:
            capture = True
        if capture and "Number of calls" in line:
            break
        if capture:
            relevant.append(line)
    return "\n".join(relevant).strip() or message[:800]


def _normalize_undefined(message: str) -> str:
    m = re.search(
        r"Cannot read propert(?:y|ies) of undefined \(?reading '(.+?)'\)?",
        message,
    )
    prop = m.group(1) if m else "unknown"
    loc = re.search(r"at Object\.<anonymous> \((.+?\.spec\.ts:\d+:\d+)\)", message)
    loc_str = f" at {loc.group(1)}" if loc else ""
    return f"Undefined object accessed property '{prop}'{loc_str}."

_RUNTIME_ERROR_RE = re.compile(
    r"^(ReferenceError|TypeError|SyntaxError|RangeError|Error):.*",
    re.MULTILINE,
)

def _normalize_runtime_error(message: str) -> str:
    m = _RUNTIME_ERROR_RE.search(message)
    return m.group(0).strip() if m else message.splitlines()[0]

def normalize_jest_error(message: str, error_type: str) -> str:
    if error_type == "mock_call_argument_mismatch":
        return _normalize_called_with(message)

    if error_type == "undefined_property":
        return _normalize_undefined(message)

    if error_type in {
        "undefined_identifier",
        "not_a_function",
        "typescript_error",
    }:
        return _normalize_runtime_error(message)

    return _strip_stack_trace(message)[:1200]


# ─────────────────────────────────────────────────────────────────────────────
# JSON report parser (primary)
# ─────────────────────────────────────────────────────────────────────────────

def _parse_from_report(report_path: Path) -> list[JestFailure] | None:
    """
    Reads the Jest JSON report and returns failures.
    Returns None if the file doesn't exist or is unreadable.
    """
    if not report_path.exists():
        return None

    try:
        data = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception as e:
        logger.warning(f"parse_jest_failures: could not read JSON report: {e}")
        return None

    failures: list[JestFailure] = []

    for suite in data.get("testResults", []):
        for assertion in suite.get("assertionResults", []):
            if assertion.get("status") != "failed":
                continue

            title = assertion.get("title", "").strip()
            messages = assertion.get("failureMessages", [])
            raw_message = "\n".join(messages) if messages else ""

            error_type = categorize_jest_error(raw_message)
            error_message = normalize_jest_error(raw_message, error_type)

            failures.append(JestFailure(
                test_name=title,
                error_type=error_type,
                error_message=error_message,
            ))

    return failures


# ─────────────────────────────────────────────────────────────────────────────
# Stderr fallback parser
# ─────────────────────────────────────────────────────────────────────────────

_ANSI_RE = re.compile(r"\x1B\[[0-?]*[ -/]*[@-~]")
_BULLET_RE = re.compile(r"^  ● (.+)$", re.MULTILINE)


def _parse_from_stderr(stderr: str) -> list[JestFailure]:
    """
    Fallback when the JSON report is unavailable.
    Less reliable due to ANSI codes and variable formatting.
    """
    stderr = _ANSI_RE.sub("", stderr)
    bullets = list(_BULLET_RE.finditer(stderr))

    if not bullets:
        return []

    failures: list[JestFailure] = []

    for i, match in enumerate(bullets):
        test_name = match.group(1).strip()
        block_start = match.end()
        block_end = bullets[i + 1].start() if i + 1 < len(bullets) else len(stderr)
        raw_block = stderr[block_start:block_end].strip()

        error_type = categorize_jest_error(raw_block)
        error_message = normalize_jest_error(raw_block, error_type)

        failures.append(JestFailure(
            test_name=test_name,
            error_type=error_type,
            error_message=error_message,
        ))

    return failures


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

def parse_jest_failures(
    stderr: str,
    report_path: Path | None = None,
) -> list[JestFailure]:
    """
    Returns a list of JestFailure objects from a Jest run.

    Prefers the JSON report for accuracy; falls back to stderr parsing.
    """
    path = report_path or JEST_REPORT_PATH

    from_report = _parse_from_report(path)

    if from_report is not None:
        logger.debug(
            f"parse_jest_failures: {len(from_report)} failure(s) from JSON report"
        )
        for f in from_report:
            logger.debug(f"  [{f.error_type}] {f.test_name}")
        return from_report

    logger.warning(
        "parse_jest_failures: JSON report not found, falling back to stderr"
    )
    failures = _parse_from_stderr(stderr)
    logger.debug(f"parse_jest_failures: {len(failures)} failure(s) from stderr")
    return failures
