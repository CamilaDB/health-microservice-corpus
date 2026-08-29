import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import execution.jest_runner as jest_runner
import execution.sandbox as sandbox
from execution.sandbox import APPEND_MARKER, append_test_block, function_wrapper_blocks, install_temp_spec, remove_temp_spec, snapshot_spec_file


BOOTSTRAP = "describe('Service', () => {\n  // TESTS_APPEND_HERE\n});\n"
BLOCK = "describe('method', () => { it('works', () => expect(true).toBe(true)); });"


class FakeClient:
    """Deterministic client fixture reserved for runner orchestration tests."""

    def __init__(self, content: str):
        self.content = content

    def generate(self, *_args):
        return type("Response", (), {"content": self.content, "tokens": 0, "duration_ns": 0})()


class PipelineSafetyTests(unittest.TestCase):
    def test_restore_failed_block_preserves_prior_and_later_function(self):
        with tempfile.TemporaryDirectory() as directory:
            spec = Path(directory) / "service.spec.ts"
            spec.write_text(BOOTSTRAP, encoding="utf-8")

            append_test_block(spec_file=spec, content=BLOCK, fn_id="FN_prior_END")
            snapshot = snapshot_spec_file(
                generated_spec_path=spec, fn_id="FN_broken_END"
            )
            append_test_block(spec_file=spec, content="describe('broken', () => {", fn_id="FN_broken_END")

            # This is the same fallback used when Jest cannot attribute a
            # compile/runtime failure to a single it() block.
            spec.write_text(snapshot.read_text(encoding="utf-8"), encoding="utf-8")
            append_test_block(spec_file=spec, content=BLOCK, fn_id="FN_later_END")
            content = spec.read_text(encoding="utf-8")

            self.assertIn("FN_prior_END", content)
            self.assertIn("FN_later_END", content)
            self.assertNotIn("FN_broken_END", content)
            self.assertIn(APPEND_MARKER, content)
            before = function_wrapper_blocks(content)
            malicious_repair = content.replace("FN_prior_END", "FN_rewritten_END")
            self.assertNotEqual(before.get("FN_prior_END"), function_wrapper_blocks(malicious_repair).get("FN_prior_END"))

    def test_temp_spec_restores_a_preexisting_corpus_spec(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            generated = root / "generated.spec.ts"
            generated.write_text("generated", encoding="utf-8")
            target = root / "src" / "service.spec.ts"
            target.parent.mkdir(parents=True)
            target.write_text("manual baseline", encoding="utf-8")

            with patch.object(sandbox, "CORPUS_DIR", root):
                installed = install_temp_spec(generated, "src/service.spec.ts")
                self.assertEqual(installed.read_text(encoding="utf-8"), "generated")
                remove_temp_spec(installed)

            self.assertEqual(target.read_text(encoding="utf-8"), "manual baseline")

    def test_temp_spec_removes_only_files_created_by_runner(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            generated = root / "generated.spec.ts"
            generated.write_text("generated", encoding="utf-8")

            with patch.object(sandbox, "CORPUS_DIR", root):
                installed = install_temp_spec(generated, "src/service.spec.ts")
                remove_temp_spec(installed)

            self.assertFalse((root / "src" / "service.spec.ts").exists())

    def test_clear_execution_artifacts_removes_stale_coverage_and_report(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            coverage = root / "coverage"
            coverage.mkdir()
            (coverage / "coverage-final.json").write_text("stale", encoding="utf-8")
            (coverage / "jest-report.json").write_text("stale", encoding="utf-8")

            with patch.object(jest_runner, "TMP_DIR", root), patch.object(
                jest_runner, "JEST_REPORT_PATH", coverage / "jest-report.json"
            ):
                jest_runner.clear_execution_artifacts()

            self.assertTrue(coverage.exists())
            self.assertEqual(list(coverage.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
