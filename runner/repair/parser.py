"""
Parses Jest failures from the JSON report produced by --reporters=json.

Prefer the JSON report over stderr because:
- No ANSI codes to strip
- Stack traces are already in failureMessages (not mixed with test output)
- fullName gives the exact test title without parsing chains
- status field is unambiguous (no heuristic needed)

Parse priority:
  1. JSON report  (Jest ran to completion, produced --outputFile)
  2. Node.js crash  (unhandled promise rejection crashed the process before
                     Jest could write the report — detected from stderr pattern)
  3. Jest stderr bullets  (last resort, ANSI-stripped, heuristic)
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
    if "unhandled" in error.lower() and "rejection" in error.lower():
        return "unhandled_rejection"
    return "generic"


# ─────────────────────────────────────────────────────────────────────────────
# Message normalizers
# ─────────────────────────────────────────────────────────────────────────────

_NODE_MODULES_RE = re.compile(r"\n\s+at .+node_modules.+")
_INTERNAL_STACK_RE = re.compile(r"\n\s+at .+")


def _strip_stack_trace(message: str) -> str:
    message = _INTERNAL_STACK_RE.sub("", message)
    message = re.sub(r"\n{3,}", "\n\n", message)
    return message.strip()


def normalize_jest_error(message: str, error_type: str) -> str:
    message = _strip_stack_trace(message)
    return message[:1200]


# ─────────────────────────────────────────────────────────────────────────────
# JSON report parser  (primary path)
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
# Node.js crash parser  (second path)
# ─────────────────────────────────────────────────────────────────────────────

# Matches the Node.js process crash pattern produced by an unhandled promise
# rejection or uncaught exception BEFORE Jest can write its JSON report:
#
#   /path/to/spec.ts:154
#       orderRepositoryMock.search.mockRejectedValue(new Error('Unexpected error'));
#                                                    ^
#   [Error: Unexpected error]
#   Node.js v18.16.0
#
# Groups: (1) file path  (2) line number  (3) Error class  (4) message
_NODE_CRASH_RE = re.compile(
    r"(.+\.spec\.ts):(\d+)\r?\n"           # file:line
    r"(?:.*\r?\n){0,3}"                    # 0-3 lines of context/caret
    r"\[(\w*Error): ([^\]]+)\]"            # [ErrorClass: message]
    r"(?:\r?\nNode\.js)",                  # "Node.js" line confirms it's a crash
    re.MULTILINE,
)

# Matches an it() / test() call with its title in the first string argument.
# Works on a single source line — used when scanning backwards by line number.
_IT_TITLE_RE = re.compile(
    r"""\bit(?:\.skip|\.only)?\s*\(\s*['"`](.+?)['"`]"""
)


def _find_test_name_by_line(spec_file: str, crash_line: int) -> str | None:
    """
    Reads the spec file and scans backwards from crash_line to find the
    nearest it() / test() title — i.e. the test block that contains the
    crashing code.

    Returns the test title string, or None if not found.
    """
    try:
        lines = Path(spec_file).read_text(encoding="utf-8", errors="replace").splitlines()
    except Exception as exc:
        logger.warning(f"_find_test_name_by_line: could not read {spec_file}: {exc}")
        return None

    # Clamp to valid range (line numbers are 1-based in the crash output)
    start = min(crash_line - 1, len(lines) - 1)

    for i in range(start, -1, -1):
        m = _IT_TITLE_RE.search(lines[i])
        if m:
            return m.group(1)

    return None


def _parse_node_crash(stderr: str) -> list[JestFailure]:
    """
    Detects an unhandled promise rejection / Node.js process crash in stderr
    and converts it into a single JestFailure so that _repair_block() is
    triggered instead of _whole_file_repair().

    The crash happens when a test calls mockRejectedValue() (or similar async
    mock) but the test body doesn't properly await / catch the rejection —
    the unhandled rejection propagates and kills the Node process before Jest
    can write the JSON report.

    Repair strategy for the LLM:
      Replace:  mockRejectedValue(new Error('...'))
      With:     mockResolvedValueOnce(null)   (or the appropriate success value)
      Or wrap:  await expect(...).rejects.toThrow(...)  if an exception IS expected.
    """
    match = _NODE_CRASH_RE.search(stderr)
    if not match:
        return []

    spec_file  = match.group(1)
    crash_line = int(match.group(2))
    error_cls  = match.group(3)   # e.g. "Error"
    error_msg  = match.group(4)   # e.g. "Unexpected error"

    logger.warning(
        f"Node.js crash detected at {spec_file}:{crash_line} — "
        f"[{error_cls}: {error_msg}]"
    )

    test_name = _find_test_name_by_line(spec_file, crash_line)

    if not test_name:
        logger.warning(
            f"_parse_node_crash: could not resolve test name for line {crash_line}"
        )
        return []

    logger.info(
        f"_parse_node_crash: attributed crash to test '{test_name}'"
    )

    error_message = (
        f"Unhandled promise rejection at line {crash_line}: "
        f"[{error_cls}: {error_msg}]\n"
        f"The test likely calls mockRejectedValue() without a corresponding "
        f"'await expect(...).rejects.toThrow()' assertion, "
        f"causing the rejection to crash the Node process. "
        f"Fix: either assert the rejection with rejects.toThrow(), "
        f"or replace mockRejectedValue with mockResolvedValueOnce."
    )

    return [JestFailure(
        test_name=test_name,
        error_type="unhandled_rejection",
        error_message=error_message,
    )]


# ─────────────────────────────────────────────────────────────────────────────
# Stderr bullet parser  (last resort)
# ─────────────────────────────────────────────────────────────────────────────

_ANSI_RE   = re.compile(r"\x1B\[[0-?]*[ -/]*[@-~]")
_BULLET_RE = re.compile(r"^  ● (.+)$", re.MULTILINE)


def _parse_from_stderr(stderr: str) -> list[JestFailure]:
    """
    Fallback when the JSON report is unavailable and no Node.js crash was
    detected.  Less reliable due to ANSI codes and variable formatting.
    """
    stderr  = _ANSI_RE.sub("", stderr)
    bullets = list(_BULLET_RE.finditer(stderr))

    if not bullets:
        return []

    failures: list[JestFailure] = []

    for i, match in enumerate(bullets):
        test_name   = match.group(1).strip()
        block_start = match.end()
        block_end   = bullets[i + 1].start() if i + 1 < len(bullets) else len(stderr)
        raw_block   = stderr[block_start:block_end].strip()

        error_type    = categorize_jest_error(raw_block)
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

    Parse priority:
      1. JSON report          — Jest completed, report written
      2. Node.js crash        — process crashed before report; recover from stderr
      3. Jest stderr bullets  — heuristic fallback
    """
    path = report_path or JEST_REPORT_PATH

    # ── Path 1: JSON report ───────────────────────────────────────────────────
    from_report = _parse_from_report(path)
    if from_report is not None:
        logger.debug(
            f"parse_jest_failures: {len(from_report)} failure(s) from JSON report"
        )
        for f in from_report:
            logger.debug(f"  [{f.error_type}] {f.test_name}")
        return from_report

    logger.warning(
        "parse_jest_failures: JSON report not found, trying crash detection"
    )

    # ── Path 2: Node.js crash ─────────────────────────────────────────────────
    from_crash = _parse_node_crash(stderr)
    if from_crash:
        logger.info(
            f"parse_jest_failures: {len(from_crash)} failure(s) from crash detection"
        )
        for f in from_crash:
            logger.info(f"  [{f.error_type}] {f.test_name}")
        return from_crash

    # ── Path 3: Stderr bullets ────────────────────────────────────────────────
    logger.warning("parse_jest_failures: falling back to stderr bullet parsing")
    failures = _parse_from_stderr(stderr)
    logger.debug(f"parse_jest_failures: {len(failures)} failure(s) from stderr")
    return failures
