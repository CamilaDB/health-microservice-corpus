# Experimental workflow

This document summarizes how the research pipeline operates and what each stage contributes.

## Units of analysis

The main unit of analysis is the function-level run.

For each model × strategy × function pair, the project:

1. generates a test block
2. appends it to the active spec file
3. runs Jest only for the specific function via `--testNamePattern=FN_<function>_END`
4. extracts per-function metrics and coverage
5. stores the observation

This design isolates the method under evaluation and avoids cumulative contamination from previous functions.

## Service-level and global diagnostics

After per-function processing, the project may also run a full service spec or a global spec. These runs are useful for diagnostics, but they are not the primary unit of analysis.

A single malformed or syntactically invalid block can break the accumulated spec and make a service-level or global run fail even when many earlier function runs succeeded. For that reason, service/global aggregates must be interpreted with care.

## Why function-level data is primary

The function is the natural evaluation unit because:

- different functions have different complexity levels
- the experiment evaluates model and prompt performance by function
- generated tests are appended incrementally to the same spec
- per-function results remain comparable across services and models

## Interpretation of failures

A result of zero tests is not automatically equivalent to “function has no tests”. In the current pipeline, it may also indicate that Jest failed before discovering the test tree.

Therefore, the project distinguishes between:

- valid test metrics
- failed Jest execution
- test discovery failure
- TypeScript or syntax failure

## Error-event log (observability)

Alongside `results.csv`, the runner writes `experiments/metrics/error_events.csv` — an append-only **event log**, not a function-level result. Where `results.csv` holds exactly one row per (model, strategy, function) observation, `error_events.csv` holds one row per *meaningful error or recovery event* observed while producing that observation: an empty/invalid generation, a TypeScript diagnostic, a failing Jest assertion, a repair attempt that didn't apply, a rollback. A single function observation can therefore have zero rows (nothing went wrong) or many (one per failed attempt, one per repair outcome, one for a final rollback, etc.).

This is supplementary diagnostic evidence about *why* things failed, not a primary outcome metric — it does not participate in `generation_success`, `jest_success`, `analysis_eligible`, or any success-rate calculation, and a failure to write to it can never affect `results.csv` (see below).

### Event phases

Each row is tagged with the pipeline stage it occurred in:

- `generation` — model call / output validation, before anything is appended to the spec
- `typescript` — `tsc`/ts-jest compilation diagnostics
- `jest` — a Jest test run that failed (assertion, runtime error, timeout, crash, or discovery failure)
- `repair` — the repair mechanism's own outcome (couldn't parse a failure to repair, a repair attempt didn't produce a valid fix, or the repair budget was exhausted) — distinct from the underlying `jest`/`typescript` failure that triggered the repair attempt
- `pipeline` — outside any of the above: an unhandled exception, a rollback to the last known-good snapshot, or a rejected repair that would have corrupted a previously accepted function's wrapper

A **primary failure** (e.g. a Jest assertion failure) and a **subsequent recovery action** (e.g. the rollback that follows it) are always recorded as separate rows, never merged into one.

### Error taxonomy

Classification is fully deterministic — string/regex matching over already-computed pipeline state (exit codes, stdout/stderr, parsed Jest failures), never a model call. It reuses the pipeline's own existing signals wherever one exists (the `total_tests == -1` test-discovery-failure sentinel described above, `repair.parser.categorize_jest_error`'s failure typing) rather than re-deriving them. See `runner/utils/error_classification.py` for the exact category/subcategory taxonomy and the mapping from existing pipeline signals; cases with insufficient evidence fall back to `unknown` rather than being forced into a specific bucket.

### Raw diagnostics

`error_events.csv` never stores large stderr/stdout blobs. `error_message` is a short, truncated summary; a deterministic `error_hash` (SHA-256 of a normalized error string) identifies the underlying error for grouping and future reclassification; and when the original diagnostic text is large, the full, untruncated text is written once to `experiments/logs/errors/<run_id>/<error_hash>.txt`, referenced from the CSV by `raw_artifact_path`.

### Isolation from results.csv

`error_events.csv` uses none of `results.csv`'s upsert identity or matching logic — every call is a plain append, isolated by `run_id`, and a persistence failure while writing an error event is caught and logged, never raised, so it can never delete, corrupt, or block a `results.csv` write.

### Analysis

`analysis/experiment_analysis.py` summarizes the log by model, strategy, model × strategy, phase, and error category/subcategory, and ranks the most common failure modes per model × strategy (`top_failure_modes.csv`) — see `experiments/README.md` for the two rate denominators used and why raw event counts are not compared directly.

## Summary

The research design is centered on function-level evidence, with service-level and global-level results used as supplemental diagnostics rather than primary findings. The error-event log adds a third, even more granular diagnostic layer beneath that — useful for understanding *why* a model/strategy failed, never for measuring *whether* it succeeded.
