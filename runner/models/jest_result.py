from dataclasses import dataclass


@dataclass
class JestResult:
    success: bool
    stdout: str
    stderr: str
    returncode: int

@dataclass
class JestFailure:
    test_name: str
    error_type: str
    error_message: str