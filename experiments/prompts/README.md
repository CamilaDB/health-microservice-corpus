# Prompt fingerprints

`prompt_fingerprints.csv` is a reproducibility artifact: one row per
`(target function x prompt strategy)` combination, produced by rendering
every frozen target through the real prompt builder
(`runner/prompts/builder.py:build_prompt`) against the committed
`ast-cli/output/functions/service_functions.json` metadata and
`ast-cli/output/bootstrap/` spec files — the same code path the runner uses
at generation time, run offline with no model calls.

## What each row identifies

| Column | Meaning |
|---|---|
| `module` | Service module (`encounter`, `order`, `patient`, `result`) |
| `function` | Target function name |
| `source_file` | Corpus source file the function was extracted from |
| `line_start` / `line_end` | Line range of the function in `source_file` |
| `ccm` | McCabe cyclomatic complexity (`calcCCM`), for cross-reference with `range` in `service_functions.json` |
| `strategy` | `zero_shot`, `few_shot`, or `structured` |
| `char_length` | Character length of the fully rendered prompt |
| `sha256` | SHA-256 of the fully rendered prompt text (UTF-8) |

`sha256` is the fingerprint of the exact text a model would receive for that
target x strategy pair. It is **not** a hash of the template file alone (the
run manifest's `prompt_hashes` already covers that) — it captures the fully
substituted output, so it changes if *any* upstream input changes: the
template wording, the function's extracted metadata (branches, dependency
calls, DTOs, …), or the bootstrap spec content injected as
`CURRENT_SPEC_FILE`.

## How to use it

To confirm which frozen target x strategy prompt was in effect for a given
result row, or to detect drift after any template/extractor change: re-render
the 75 prompts with the current repo state and diff the resulting hashes
against this file. An unchanged hash means the model input for that pair is
byte-identical to what is recorded here; a changed hash pinpoints exactly
which target x strategy combinations were affected and by how much
(`char_length` gives a quick magnitude check before diffing the full text).

## Regenerating

This file is derived data, not hand-maintained. Regenerate it whenever
`service_functions.json`, the bootstrap output, or a prompt template under
`prompts/` changes, by rendering all 25 targets through all 3 strategies via
`build_prompt` and re-hashing. It should be committed alongside the change
that caused it to differ, so the diff of this CSV documents exactly what
changed for reviewers.
