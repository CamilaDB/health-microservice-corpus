from repair.deterministic.jest_error_parser import (
    ParsedJestError,
)
from repair.deterministic.mock_repairs import (
    repair_invalid_spyon,
)
from repair.deterministic.assertion_repairs import (
    repair_save_assertions,
)


class DeterministicRepairResult:
    def __init__(
        self,
        repaired: bool,
        content: str,
    ):
        self.repaired = repaired
        self.content = content



def apply_deterministic_repairs(
    *,
    spec_content: str,
    parsed_error: ParsedJestError,
) -> DeterministicRepairResult:

    repaired = spec_content
    changed = False

    if parsed_error.type == "invalid_spyon":
        updated = repair_invalid_spyon(repaired)

        if updated != repaired:
            repaired = updated
            changed = True

    if parsed_error.type == "save_assertion":
        updated = repair_save_assertions(repaired)

        if updated != repaired:
            repaired = updated
            changed = True

    print(f"parsedErrorType: {parsed_error.type}")

    return DeterministicRepairResult(
        repaired=changed,
        content=repaired,
    )
