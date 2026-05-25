import re


SAVE_ASSERTION_PATTERN = re.compile(
    r"expect\((.*?)\.save\)\.toHaveBeenCalledWith\((.*?)\)"
)


def repair_save_assertions(spec_content: str) -> str:
    def replacer(match):
        repository = match.group(1)

        return (
            f"expect({repository}.save)"
            ".toHaveBeenCalledWith(expect.objectContaining({}))"
        )

    return SAVE_ASSERTION_PATTERN.sub(replacer, spec_content)