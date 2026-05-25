from pathlib import Path

def read_file(path: str | Path) -> str:

    path = Path(path)

    if not path.exists():
        return ""

    return path.read_text(
        encoding="utf-8"
    )
