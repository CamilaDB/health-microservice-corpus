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

## Notes

These are research artefacts, not application code. They should be treated as derived data.
