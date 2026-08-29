"""Deterministic provenance for the complete executable corpus contract."""

from __future__ import annotations

import hashlib
from pathlib import Path


_ROOT_FILES = ("package.json", "tsconfig.json", "tsconfig.build.json")


def corpus_fingerprint(corpus_dir: Path) -> dict:
    """Hash all corpus TypeScript sources and build-defining root files.

    Repositories, DTOs, entities, modules and migrations are included alongside
    service files so dependency-only behavioural changes invalidate a run.
    """
    files = sorted(
        [path for path in (corpus_dir / "src").rglob("*.ts") if path.is_file()]
        + [corpus_dir / name for name in _ROOT_FILES if (corpus_dir / name).is_file()],
        key=lambda path: path.relative_to(corpus_dir).as_posix(),
    )
    digest = hashlib.sha256()
    entries = []
    for path in files:
        relative = path.relative_to(corpus_dir).as_posix()
        content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update(content_hash.encode("ascii"))
        digest.update(b"\n")
        entries.append({"path": relative, "sha256": content_hash})
    return {
        "algorithm": "sha256(path_nul_file_sha256_newline)",
        "file_count": len(entries),
        "fingerprint": digest.hexdigest(),
        "files": entries,
    }
