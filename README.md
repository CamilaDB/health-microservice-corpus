# Health Microservice Corpus for LLM-based Unit Test Generation

This repository contains a reproducible experimental pipeline for generating and evaluating unit tests with LLMs on a NestJS/TypeScript microservice codebase.

The project is organized around a simple experimental loop:

1. Extract service metadata and method-level context from the corpus.
2. Generate test blocks for each target function.
3. Append generated tests to the service spec file.
4. Run Jest scoped to the current function.
5. Repair failing tests when needed.
6. Extract per-function metrics and coverage.
7. Aggregate valid per-function results for analysis.

## Repository structure

- `corpus/` — target NestJS application used as the evaluation corpus.
- `ast-cli/` — extraction and metadata pipeline for services, functions and bootstrap specs.
- `runner/` — orchestration, Jest execution, repair loop, coverage extraction and CSV persistence.
- `prompts/` — prompt templates and system prompts for different generation strategies.
- `experiments/` — generated specs, logs, metrics and execution artefacts.
- `analysis/` — article-ready summaries, tables and charts generated from the experimental CSVs.
- `docs/` — project-level methodological documentation.

## Experimental unit

The main experimental unit is:

- model × strategy × function

Function-level execution is isolated with `--testNamePattern=FN_<function>_END` so that each generated block is evaluated independently before aggregation.

## Core workflow

- `ast-cli` extracts function metadata and bootstrap context from the corpus.
- `runner` generates per-function tests and appends them to the corresponding service spec.
- `runner` runs Jest for the specific function and captures coverage and test metrics.
- Failed blocks may trigger runtime repair loops and TypeScript validation.
- Aggregate results are written to CSV files in `experiments/metrics/`.

## Important methodological note

The project treats function-level execution as the primary evidence source. Service-level and global-level Jest runs are used as diagnostics and integration checks, but they are not the main experimental unit because a single invalid block in an accumulated spec can break the entire suite.

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm
- Jest via project dependencies

### Setup

```bash
cd runner
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

For the TypeScript analysis tooling:

```bash
cd ast-cli
npm install
```

### Typical execution order

```bash
cd ast-cli
npm run build
# or relevant extraction command

cd ../runner
python main.py
```

See the README files in each subsystem for the exact commands and output contract.

## Reproducibility and analysis

The repository keeps both:

- source code for the pipeline
- generated experimental artefacts

The generated artefacts are stored under `experiments/` and should be interpreted as execution data, not as the source of truth for the experimental design.

## Documentation

- [corpus/README.md](./corpus/README.md)
- [ast-cli/README.md](./ast-cli/README.md)
- [runner/README.md](./runner/README.md)
- [prompts/README.md](./prompts/README.md)
- [experiments/README.md](./experiments/README.md)
- [analysis/README.md](./analysis/README.md)
- [docs/README.md](./docs/README.md)

## Notes

This repository is designed for research use and experimental validation. It is intentionally organized around function-level analysis, per-model comparisons and prompt-strategy evaluation.
