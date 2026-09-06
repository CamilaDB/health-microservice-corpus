# Analysis module

This directory contains the lightweight analysis layer used to inspect and summarize experimental results for the TCC.

## Purpose

The runner persists per-function execution data to CSV. This analysis module reads those files and produces the summary tables and plots used in the research article and discussion.

## Inputs

- `experiments/metrics/results.csv` — primary per-function experimental results

## Outputs

The analysis script writes the following artefacts:

- `experiments/analysis/tables/summary_by_model_strategy.csv`
- `experiments/analysis/tables/summary_by_ccm.csv`
- `experiments/analysis/tables/top_functions.csv`
- `experiments/analysis/figures/mean_tests_by_strategy.png`
- `experiments/analysis/figures/success_rate_by_strategy.png`
- `experiments/analysis/figures/coverage_boxplot.png`
- `experiments/analysis/figures/ccm_vs_tests.png`
- `experiments/analysis/article_summary.md`

## Usage

```bash
cd analysis
python experiment_analysis.py
```

The script is intentionally simple: it reads the experimental CSVs, computes defensible summary metrics and exports article-ready artefacts without modifying the original execution pipeline.

Primary coverage and test-count means include only rows marked
`analysis_eligible` (successful function-scoped Jest execution). Generation and
Jest success rates are still computed over all attempted function observations,
so failed execution is visible without allowing stale/failed metrics to distort
quality summaries. Legacy CSVs derive this flag from generation and Jest status.

If the results file contains multiple runs, set `EXPERIMENT_RUN_ID` before
running the static analysis; it deliberately refuses to combine runs. The
dashboard instead exposes an execution selector and defaults to the newest run.

## Optional complementary analyses

If the CSVs `experiments/metrics/smell_results.csv` and `experiments/metrics/mutation_results.csv` exist, the analysis module will also export smell and mutation summaries and plots.

These artefacts are not a replacement for the primary execution metrics; they are supplementary quality analyses of generated tests and mutation resilience.

## Dashboard

A lightweight Streamlit dashboard is also available for local exploration of the same dataset:

```bash
cd analysis
streamlit run dashboard.py
```

The dashboard is intended for exploratory analysis and presentation support. It reads the same CSVs as the static analysis scripts and does not replace the primary experimental evidence from per-function runs.
