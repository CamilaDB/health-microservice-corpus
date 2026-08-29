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

## Summary

The research design is centered on function-level evidence, with service-level and global-level results used as supplemental diagnostics rather than primary findings.
