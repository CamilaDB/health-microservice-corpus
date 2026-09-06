# Prompt Library

This directory defines the generation strategies used by the experimental pipeline.

## Strategies

- `zero-shot/` — direct generation with function context and minimal guidance.
- `few-shot/` — generation with a few examples or patterns.
- `structured/` — generation with stronger schema and formatting constraints.
- `system/` — reusable system prompts used by the runner for generation and repair.

## Structure

Each strategy directory contains:

- a prompt template for test generation
- repair prompts when needed
- system instructions used by the LLM

## Runner integration

The runner loads prompt templates through the logic in `runner/prompts/` and the prompt directories under this top-level structure.

## Important note

Prompt templates are part of the experimental design. They should be treated as configuration for the study, not as unrelated project files.
