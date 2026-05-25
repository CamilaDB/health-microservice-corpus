from dataclasses import dataclass
from typing import Optional
import re


@dataclass
class ParsedJestError:
    type: str
    test_name: Optional[str] = None
    message: Optional[str] = None
    property_name: Optional[str] = None
    variable_name: Optional[str] = None
    dependency_name: Optional[str] = None


SPYON_PATTERN = re.compile(
    r"Property `([^`]+)` does not exist"
)

UNDEFINED_PROPERTY_PATTERN = re.compile(
    r"Cannot read properties of undefined \(reading '([^']+)'\)"
)

SAVE_ASSERTION_PATTERN = re.compile(
    r"toHaveBeenCalledWith"
)

TEST_NAME_PATTERN = re.compile(
    r"●\s+(.*?)\s+›\s+(.*?)\s+›\s+(.*?)\n"
)


def extract_test_name(stderr: str) -> Optional[str]:
    match = TEST_NAME_PATTERN.search(stderr)

    if not match:
        return None

    return " > ".join(match.groups())


def parse_jest_error(stderr: str) -> ParsedJestError:
    test_name = extract_test_name(stderr)

    spy_match = SPYON_PATTERN.search(stderr)

    if spy_match:
        return ParsedJestError(
            type="invalid_spyon",
            test_name=test_name,
            dependency_name=spy_match.group(1),
            message=stderr,
        )

    undefined_match = UNDEFINED_PROPERTY_PATTERN.search(stderr)

    if undefined_match:
        return ParsedJestError(
            type="undefined_property",
            test_name=test_name,
            property_name=undefined_match.group(1),
            message=stderr,
        )

    if SAVE_ASSERTION_PATTERN.search(stderr):
        return ParsedJestError(
            type="save_assertion",
            test_name=test_name,
            message=stderr,
        )

    return ParsedJestError(
        type="unknown",
        test_name=test_name,
        message=stderr,
    )
