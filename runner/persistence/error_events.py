"""
Append-only error-event log (observability only).

Isolated from results.csv by construction: separate file, separate
identity rules (never the (run_id, model, strategy, source_file,
line_start, line_end) upsert key from persistence/csv_writer.py -- every
call here is a plain append, never a match-and-replace), and a failure
here must never affect results.csv. Every public entry point catches its
own exceptions and only logs a warning; it never raises into the caller,
so a broken error-event write cannot abort or corrupt the primary
pipeline it is observing.
"""

import csv
import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path

from config import ERROR_ARTIFACTS_DIR, ERROR_EVENTS_CSV
from models.error_event import EventContext
from utils.logging import logger

FIELDNAMES = [
    "run_id",
    "timestamp",
    "model",
    "strategy",
    "module",
    "function_name",
    "fn_id",
    "source_file",
    "line_start",
    "line_end",
    "source_hash",
    "phase",
    "attempt",
    "error_category",
    "error_subcategory",
    "error_message",
    "error_hash",
    "artifact_disposition",
    "raw_artifact_path",
]

# Keep the CSV compact; the full text (when available) goes to a raw
# artifact file instead -- see _write_raw_artifact.
_MAX_MESSAGE_CHARS = 500
_RAW_ARTIFACT_THRESHOLD = 400

_WHITESPACE_RE = re.compile(r"\s+")
_STACK_LINE_RE = re.compile(r"\n\s*at .+")
_LOCATION_RE = re.compile(r":\d+:\d+")  # file:line:col varies run to run


def _normalize_for_hash(text: str) -> str:
    """
    Best-effort normalization so semantically identical errors (e.g. the
    same assertion failing on different repair attempts, where only a
    stack trace line number differs) collapse to the same error_hash,
    without requiring byte-for-byte stderr equality.
    """
    normalized = _STACK_LINE_RE.sub("", text)
    normalized = _LOCATION_RE.sub("", normalized)
    normalized = _WHITESPACE_RE.sub(" ", normalized).strip().lower()
    return normalized


def compute_error_hash(text: str) -> str:
    return hashlib.sha256(_normalize_for_hash(text or "").encode("utf-8")).hexdigest()


def _write_raw_artifact(*, run_id: str, error_hash: str, raw_text: str) -> str | None:
    try:
        run_dir = ERROR_ARTIFACTS_DIR / run_id
        run_dir.mkdir(parents=True, exist_ok=True)
        artifact_path = run_dir / f"{error_hash}.txt"
        if not artifact_path.exists():
            artifact_path.write_text(raw_text, encoding="utf-8")
        return str(artifact_path)
    except Exception as exc:
        logger.warning(f"record_error_event: failed to write raw artifact: {exc}")
        return None


def _append_row(row: dict) -> None:
    ERROR_EVENTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    file_exists = ERROR_EVENTS_CSV.exists()
    with ERROR_EVENTS_CSV.open("a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)


def record_error_event(
    ctx: EventContext | None,
    *,
    phase: str,
    error_category: str,
    error_subcategory: str,
    error_message: str,
    attempt: int | None = None,
    raw_text: str | None = None,
    artifact_disposition: str | None = None,
) -> None:
    """
    Append one row to error_events.csv for one meaningful error/failure
    event. Never raises -- see module docstring.

    ctx=None is a deliberate no-op (e.g. call sites that do not yet have a
    resolved function identity), not an error.
    """
    if ctx is None:
        return
    try:
        message = (error_message or "").strip()
        hash_source = raw_text if raw_text else message
        error_hash = compute_error_hash(hash_source)

        raw_artifact_path = None
        if raw_text and len(raw_text) > _RAW_ARTIFACT_THRESHOLD:
            raw_artifact_path = _write_raw_artifact(
                run_id=ctx.run_id, error_hash=error_hash, raw_text=raw_text
            )

        row = {
            "run_id": ctx.run_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "model": ctx.model,
            "strategy": ctx.strategy,
            "module": ctx.module,
            "function_name": ctx.function_name,
            "fn_id": ctx.fn_id,
            "source_file": ctx.source_file,
            "line_start": ctx.line_start,
            "line_end": ctx.line_end,
            "source_hash": ctx.source_hash,
            "phase": phase,
            "attempt": attempt if attempt is not None else "",
            "error_category": error_category,
            "error_subcategory": error_subcategory,
            "error_message": message[:_MAX_MESSAGE_CHARS],
            "error_hash": error_hash,
            "artifact_disposition": artifact_disposition or "",
            "raw_artifact_path": raw_artifact_path or "",
        }
        _append_row(row)
    except Exception as exc:
        # Fully swallowed by design: error-event logging must fail safe and
        # can never be allowed to interrupt or corrupt the primary pipeline.
        logger.warning(f"record_error_event: failed to record event: {exc}")
