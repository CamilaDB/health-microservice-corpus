# AST CLI

The AST CLI is the extraction layer of the project. It prepares the corpus and function metadata used by the LLM-based testing pipeline.

## Goal

This module extracts:

- service files and their associated test spec files
- function locations and source ranges
- method source bodies
- relevant DTOs and enums
- bootstrap content used by generated specs

## Main outputs

The extraction pipeline writes structured metadata under `ast-cli/output/`:

- `bootstrap/` — bootstrap spec content per test file
- `complexity/` — complexity metadata
- `functions/` — service function descriptors and metadata

## Why it exists

The runner depends on structured metadata to:

- know which functions are targets
- build prompts with method context
- generate deterministic `FN_<function>_END` wrappers
- select the correct service and spec file for each function

## Typical flow

1. Inspect the NestJS application in `corpus/`.
2. Extract service and function metadata.
3. Save metadata and bootstrap content to `ast-cli/output/`.
4. Feed the extracted data into the runner.

## Relevant paths

- `ast-cli/output/`
- `ast-cli/index.ts`
- `ast-cli/core/`
- `ast-cli/commands/`

## Notes

This component is not the experimental runner itself. It prepares the inputs that the runner consumes.
