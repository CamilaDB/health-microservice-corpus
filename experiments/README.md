# Experiments

This directory contains the material generated during the experimental runs.

## Contents

- `generated/` — generated Jest specs for each service and model/strategy combination.
- `logs/` — execution logs and operational traces.
- `metrics/` — per-function, service-level and global metric tables in CSV format.
- `analysis/` — derived summaries, charts and article-ready tables produced by the analysis module.
- `prompts/` — per-target x strategy prompt fingerprints (SHA-256 of the fully rendered prompt), for reproducibility and drift detection.
- `tmp/` — temporary execution artefacts such as coverage files and Jest JSON output.

## Purpose

The directory is intentionally separated from the source code to make explicit the difference between:

- the algorithmic implementation
- the experimental data
- the generated outputs

## Interpretation

Results in `metrics/` are the primary analysis inputs. Temporary files under `tmp/` and generated specs under `generated/` are execution artefacts that support reproducibility and debugging.

## Error-event log

`metrics/error_events.csv` is an **event log**, not a function-level result table: multiple rows may (and normally do) exist for the same model × strategy × function — one per failed attempt, phase, and recovery action. It is supplementary diagnostic evidence about *why* a model/strategy failed, never a primary outcome metric, and it never shares `results.csv`'s upsert identity or matching logic. Full details, the phase/taxonomy definitions, and how raw diagnostics are preserved are in `docs/experimental-workflow.md`. Large raw stderr/stdout text referenced from that CSV (`raw_artifact_path`) lives under `logs/errors/<run_id>/`.

Error-event summaries produced by `analysis/experiment_analysis.py` (`errors/error_summary_by_*.csv`, `errors/top_failure_modes.csv`, under `analysis/`) report two denominators side by side rather than a single implicit "error rate," so raw event counts are never compared across models/strategies alone:

- **`events_per_function`** — total events divided by `functions_observed` (distinct functions with at least one recorded event in the group).
- **`events_per_attempt`** — total events divided by `distinct_attempts_logged` (distinct `(fn_id, phase, attempt)` combinations in the group) — this is the fairer comparison when models differ in how many repair attempts they typically use, since a model that retries more will naturally log more raw events for the same underlying number of failing functions.

## Notes

These are research artefacts, not application code. They should be treated as derived data.
