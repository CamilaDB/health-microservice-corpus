import pandas as pd

from config import (
    FUNCTION_MUTATION_RESULTS_CSV,
    GLOBAL_RESULTS_CSV,
    MUTATION_RESULTS_CSV,
    RESULTS_CSV,
    SERVICE_RESULTS_CSV,
    SMELL_RESULTS_CSV,
    RUN_ID,
)
from utils.logging import logger


_RESULT_ID = ["run_id", "model", "strategy", "source_file", "line_start", "line_end"]
_SERVICE_ID = ["run_id", "model", "strategy", "source_file", "test_output_file"]
_GLOBAL_ID = ["run_id", "model", "strategy"]
_MODULE_ID = ["run_id", "model", "strategy", "source_file", "test_output_file"]
_SMELL_ID = ["run_id", "model", "strategy", "module", "fn_id"]
_FUNCTION_MUTATION_ID = ["run_id", "model", "strategy", "module", "fn_id"]


def _save_upsert(path, row, key_columns):
    """Persist one observation per experimental identity, never append duplicates."""
    path.parent.mkdir(parents=True, exist_ok=True)
    record = {"run_id": RUN_ID, **row}
    df = pd.read_csv(path) if path.exists() else pd.DataFrame()
    incoming = pd.DataFrame([record])

    # Old committed artefacts predate run_id. Keep them explicitly separate
    # instead of accidentally treating them as part of the active run.
    if not df.empty and "run_id" not in df.columns:
        df.insert(0, "run_id", "legacy")

    missing_keys = [key for key in key_columns if key not in incoming.columns]
    if missing_keys:
        # A partial identity would fall back to matching on whatever subset
        # of key_columns IS present (e.g. just run_id/model/strategy),
        # which matches every other row sharing that subset and silently
        # deletes them. Never dedup on a partial identity — append-only is
        # the safe direction here, an extra row is recoverable, a mass
        # deletion of prior observations is not.
        logger.error(
            f"_save_upsert: row for {path.name} is missing identity "
            f"column(s) {missing_keys}; skipping de-duplication and "
            "appending as-is to avoid corrupting unrelated rows."
        )
    elif not df.empty:
        for key in key_columns:
            if key not in df.columns:
                df[key] = pd.NA
        match = pd.Series(True, index=df.index)
        for key in key_columns:
            match &= df[key].astype("string").eq(incoming.iloc[0][key])
        df = df.loc[~match]

    pd.concat([df, incoming], ignore_index=True).to_csv(path, index=False)


def save_result(row):
    _save_upsert(RESULTS_CSV, row, _RESULT_ID)


def save_service_result(row):
    _save_upsert(SERVICE_RESULTS_CSV, row, _SERVICE_ID)


def save_global_result(row):
    _save_upsert(GLOBAL_RESULTS_CSV, row, _GLOBAL_ID)


def save_mutation_result(row):
    _save_upsert(MUTATION_RESULTS_CSV, row, _MODULE_ID)


def save_function_mutation_result(row):
    _save_upsert(FUNCTION_MUTATION_RESULTS_CSV, row, _FUNCTION_MUTATION_ID)


def save_smell_result(row):
    _save_upsert(SMELL_RESULTS_CSV, row, _SMELL_ID)
