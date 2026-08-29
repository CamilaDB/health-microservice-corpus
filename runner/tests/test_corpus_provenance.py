import tempfile
import unittest
from pathlib import Path

from corpus_provenance import corpus_fingerprint


class CorpusProvenanceTests(unittest.TestCase):
    def test_dependency_only_change_alters_corpus_fingerprint(self):
        with tempfile.TemporaryDirectory() as directory:
            corpus = Path(directory)
            source = corpus / "src" / "service.ts"
            repository = corpus / "src" / "repository.ts"
            source.parent.mkdir(parents=True)
            source.write_text("export const service = 1;", encoding="utf-8")
            repository.write_text("export const repository = 1;", encoding="utf-8")
            (corpus / "package.json").write_text("{}", encoding="utf-8")

            before = corpus_fingerprint(corpus)
            repository.write_text("export const repository = 2;", encoding="utf-8")
            after = corpus_fingerprint(corpus)

            self.assertEqual(before["file_count"], 3)
            self.assertNotEqual(before["fingerprint"], after["fingerprint"])


if __name__ == "__main__":
    unittest.main()
