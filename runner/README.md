# Runner

The runner is the orchestration layer for the experimental pipeline.

It is responsible for:

- loading function metadata
- generating test blocks for each target method
- appending generated blocks to the corresponding spec file
- running Jest in function-scoped mode
- repairing failing tests
- extracting function-level metrics and coverage
- persisting results to CSV
- producing service-level and global diagnostics

## Main responsibilities

- `main.py` — experiment loop and orchestration
- `config.py` — paths, model config, prompt strategy config and environment settings
- `execution/` — Jest invocation, temp spec installation and TypeScript validation
- `repair/` — runtime failure repair orchestration
- `metrics/` — coverage and test extraction
- `models/` — DTOs and result containers
- `persistence/` — CSV writers
- `prompts/` — prompt assembly and loader utilities
- `ts_ast/` — AST-based block extraction and patching
- `utils/` — logging and sanitization helpers

## Execution flow

The high-level flow is:

1. Load target functions and group them by service spec file.
2. Build a prompt for each function.
3. Generate a test block.
4. Validate the generated block.
5. Append the block to the active service spec file.
6. Run Jest with `--testNamePattern=FN_<function>_END`.
7. Extract function-level test metrics and coverage.
8. Repair failing tests if needed.
9. Save per-function result rows.
10. Run service-level and global diagnostics after the function loop.

## Important design rule

The main evidence for the study is per-function execution. Service-level and global-level runs should be interpreted as contextual diagnostics, because a single malformed block can invalidate the entire accumulated spec.

## Relevant files

- [main.py](./main.py)
- [config.py](./config.py)
- [execution/jest_runner.py](./execution/jest_runner.py)
- [execution/sandbox.py](./execution/sandbox.py)
- [repair/orchestrator.py](./repair/orchestrator.py)
- [metrics/coverage.py](./metrics/coverage.py)
- [persistence/csv_writer.py](./persistence/csv_writer.py)

## Output

The runner stores generated and aggregated results under:

- `experiments/generated/`
- `experiments/logs/`
- `experiments/metrics/`
- `experiments/tmp/`

## Run identity and reproducibility

Every execution receives a `run_id` and records its immutable configuration,
target source hashes, AST timestamp and prompt hashes in
`experiments/runs/<run_id>.json`. Set `EXPERIMENT_RUN_ID` before running the
generator when mutation or smell post-processing will be launched separately;
use that same value for every command in the experiment.

CSV writers upsert observations by run identity and experimental unit, so a
restarted run updates its own row rather than silently appending a duplicate.
The manifest also contains a corpus-wide SHA-256 fingerprint over all
TypeScript source files, migrations and build-defining corpus configuration;
repository or DTO changes therefore invalidate a run even if a service hash is
unchanged.
The runner clears Jest reports and coverage before every invocation and restores
any pre-existing corpus spec after temporary test installation.

## Notes

This module is intentionally organized around experimental reproducibility. It should be read as the execution layer of the research pipeline rather than as an application runtime.
