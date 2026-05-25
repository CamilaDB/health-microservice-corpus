import re


def repair_invalid_spyon(spec_content: str) -> str:
    pattern = (
        r"jest\.spyOn\(service,\s*'([\w\.]+)'\)"
    )

    matches = re.findall(pattern, spec_content)

    repaired = spec_content

    for match in matches:
        parts = match.split('.')

        if len(parts) < 2:
            continue

        dependency = parts[-2]
        method = parts[-1]

        replacement = f"{dependency}Mock.{method}"

        repaired = repaired.replace(
            f"jest.spyOn(service, '{match}')",
            replacement,
        )

    return repaired
