import re


def sanitize_response(
    content: str,
) -> str:

    content = re.sub(
        r"```typescript",
        "",
        content,
    )

    content = re.sub(
        r"```ts",
        "",
        content,
    )

    content = re.sub(
        r"```",
        "",
        content,
    )

    return content.strip()
