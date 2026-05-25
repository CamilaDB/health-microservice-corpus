import re
from dataclasses import dataclass


@dataclass
class JestFailure:
    test_name: str
    error_message: str


def parse_jest_failures(stderr: str) -> list[JestFailure]:

    failures = []

    pattern = re.compile(
        r"● (.*?)\n\n(.*?)(?=\n\n  ●|\Z)",
        re.DOTALL,
    )

    matches = pattern.findall(stderr)

    for test_name, error in matches:

        failures.append(
            JestFailure(
                test_name=test_name.strip(),
                error_message=error.strip(),
            )
        )

    return failures
