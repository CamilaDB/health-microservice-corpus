from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class EventContext:
    """
    Stable identity for one function-processing iteration, built once per
    function and threaded read-only into the generation/typescript/jest/
    repair helpers purely so error events can be attributed correctly.

    Mirrors the identity fields already used by results.csv (run_id, model,
    strategy, module, function/fn_id, source_file, line range, source_hash)
    -- intentionally the same vocabulary, not a parallel one, so error
    events can be joined against results.csv by (model, strategy,
    source_file, line_start, line_end) or by fn_id.
    """
    run_id: str
    model: str
    strategy: str
    module: str
    function_name: str
    fn_id: str
    source_file: str
    line_start: int
    line_end: int
    source_hash: str
