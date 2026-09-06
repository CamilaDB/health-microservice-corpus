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

## Post-experiment analysis corrections (generation run frozen, analysis layer only)

Once the generation run completes, `results.csv`/`error_events.csv`/`mutation_results.csv`/`smell_results.csv` are frozen and never modified again. Two corrections were subsequently applied **downstream**, in `analysis/experiment_analysis.py` only, using columns already present in those frozen files:

- **`verified_eligible`** (vs. the stored `analysis_eligible`): a function whose entire generated test block was skip-repaired away still reports `jest_success == True` / `artifact_disposition == "accepted"`, because Jest exits 0 when nothing *fails* — including a block where every remaining test is `it.skip()`. `verified_eligible = analysis_eligible AND passed_tests > 0` closes that gap using the already-stored `passed_tests` column. `fully_skipped` flags the complementary case explicitly (`analysis_eligible` true, `passed_tests == 0`, every generated test pending). Final success-rate reporting (`verified_success_rate`) uses `verified_eligible`; the original `raw_jest_success_rate` is preserved alongside it for traceability, not deleted.
- **`mutation_score_corrected`** (vs. the stored `mutation_score`): the stored score (`runner/execution/stryker_runner.py`) excludes `no_coverage` mutants from its denominator, which silently inflates the score wherever coverage is weakest. The corrected score is `killed / (killed + survived + no_coverage + timeout) * 100`, computed from the raw per-status counts already stored in `mutation_results.csv`; `compile_error` is excluded from both the original and corrected denominators (a mutant that never compiled tests nothing). Model×strategy summaries are aggregated from **summed raw counts across modules** (mutant-weighted), not an unweighted mean of each module's percentage.

Both corrections are purely additive columns/summaries — no raw CSV row is ever edited, and `analysis/dashboard.py` imports the same `load_*`/`build_*` functions so the two never diverge. See the docstring at the top of `analysis/experiment_analysis.py` for the full rationale, and `analysis/tests/test_experiment_analysis.py` for the regression tests (including the extreme real case where the original mutation score was 100% with 99.5% of mutants uncovered).

A third, purely diagnostic addition reclassifies a subset of `error_events.csv` rows whose original `error_subcategory` was `unknown` (deep-equality `toEqual` diffs, and async "resolved instead of rejected" missing-throw failures), using the preserved `error_message`/raw diagnostic artifacts. The original `error_category`/`error_subcategory` values are never overwritten in the source file — reclassified values live in separate `*_reclassified` columns (and `error_category_original`/`error_subcategory_original` once merged into the analysis-layer working copy), so the on-disk `error_events.csv` remains exactly as the experiment produced it.

## H2 (complexity × model) evidence

H2 — "test quality decreases as cyclomatic complexity increases, more strongly for smaller models" — splits into two independent claims: **(A)** does quality fall as CCM rises, and **(B)** is that fall steeper for smaller models. The final run's evidence supports (A) clearly and does **not** support (B); see the technical report for the full reading, summarized here.

Primary evidence is **statement/branch coverage** (`build_h2_coverage_table`, `build_h2_coverage_by_model_ccm` in `analysis/experiment_analysis.py`), computed over `verified_eligible` observations and broken down by model × strategy × CCM band, with every cell's `attempted_observations` / `fully_skipped_observations` / `verified_observations` reported explicitly (a cell with zero verified observations is `NaN`, never a fabricated `0`). All 5 models show lower mean statement coverage in the `11-20` band than in `1-5`; the `>20` band partially recovers for some models, on 3-5 distinct functions per band -- read with that small-N caveat.

**Mutation score by CCM band is now supported as complementary H2 evidence** (`mutation_function_results.csv`, `build_h2_mutation_by_ccm_model`), since each mutant is mapped to its containing target function via Stryker's own per-mutant `location` (`runner/execution/stryker_runner.py::map_mutants_to_functions`) rather than being split from the module-level score. This was previously rejected because the module-level `mutation_results.csv` (one row per model × strategy × module) cannot be CCM-banded on its own -- a module routinely spans multiple bands -- but the function-level mapping sidesteps that entirely. It corroborates (A): mutation score also falls from `1-5` to `11-20` for every model.

`assertion_roulette_rate` (test-smell data) is also function-level and legitimately CCM-bandable (`build_h2_smell_table`), but shows **no clear complexity-associated trend** in this dataset — reported as a table, not promoted to a figure, rather than forced into a chart it doesn't support.

**(B) is not supported**: ranking each model's coverage and mutation-score drop from the `1-5` to the `11-20` band does not track `MODEL_SIZE_ORDER`. The single largest coverage drop (~61 points) and one of the largest mutation-score drops belong to `falcon_7b` (`falcon3:7b`, one of the two largest-tagged models), while the smallest-tagged model (`gemma_4`, `gemma4:e2b`) shows one of the *mildest* drops on both metrics. Complexity clearly degrades test quality in this dataset; the documented model-size tags do not predict which model degrades most.

Model "size" ordering (`MODEL_SIZE_ORDER`) uses exactly the model tags already recorded in the frozen run manifest and `runner/config.py` for the final 5-model run — `gemma4:e2b` < `qwen2.5-coder:3b` < `qwen3.5:4b` < `falcon3:7b` ≈ `qwen2.5-coder:7b` (the last two share the same declared tag and are tied, ordered alphabetically by model key as an explicit, documented tie-break) — not an invented parameter count.

## Summary

The research design is centered on function-level evidence, with service-level and global-level results used as supplemental diagnostics rather than primary findings. The error-event log adds a third, even more granular diagnostic layer beneath that — useful for understanding *why* a model/strategy failed, never for measuring *whether* it succeeded.
