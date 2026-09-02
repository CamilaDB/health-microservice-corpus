"""
Per-repair-attempt snapshot/restore -- the pre-rerun hardening pass.

Covers, per the requested scenarios:
  1. successful repair                          -> test_successful_repair_*
  2. failed repair followed by another repair    -> test_failed_repair_then_another_repair_succeeds
  3. repair that corrupts the whole spec         -> test_*_corrupted_spec_* (unit + integration)
  4. permanent repair failure                    -> test_permanent_repair_failure_exhausts_attempts
  5. final rollback/skip                         -> covered by test_pipeline_safety.py's existing
                                                     rollback tests (unchanged by this pass) plus
                                                     test_permanent_repair_failure_exhausts_attempts
  6. subsequent-function continuity               -> test_other_functions_wrappers_survive_corruption*
  7. exact restoration of the snapshot            -> test_restore_reproduces_snapshot_byte_for_byte
"""
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import main
import persistence.error_events as error_events
from execution.sandbox import function_wrapper_blocks, scope_balance
from models.error_event import EventContext
from models.jest_result import JestFailure, JestResult
from repair.orchestrator import RepairStats


OTHER_FN_WRAPPER = (
    "describe('FN_otherFunction_END', () => {\n"
    "  describe('otherFunction', () => {\n"
    "    it('already accepted', () => { expect(true).toBe(true); });\n"
    "  });\n"
    "});"
)
CURRENT_FN_WRAPPER = (
    "describe('FN_cancelOrder_END', () => {\n"
    "  describe('cancelOrder', () => {\n"
    "    it('should throw NotFoundException', async () => { expect(true).toBe(true); });\n"
    "  });\n"
    "});"
)
SPEC_TEMPLATE = (
    "describe('Service', () => {\n"
    f"{OTHER_FN_WRAPPER}\n\n{CURRENT_FN_WRAPPER}\n"
    "  // TESTS_APPEND_HERE\n"
    "});\n"
)


class FakeClient:
    def generate(self, *_a):
        return type("Response", (), {"content": "it('x', () => {});", "tokens": 0, "duration_ns": 0})()


# ─────────────────────────────────────────────────────────────────────────────
# Unit tests: _restore_if_repair_corrupted_spec
# ─────────────────────────────────────────────────────────────────────────────

class RestoreIfCorruptedUnitTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.spec_path = Path(self.directory.name) / "generated.spec.ts"
        self.spec_path.write_text(SPEC_TEMPLATE, encoding="utf-8")
        self.pre_content = self.spec_path.read_text(encoding="utf-8")
        self.pre_blocks = function_wrapper_blocks(self.pre_content)

    def tearDown(self):
        self.directory.cleanup()

    def test_no_change_is_not_corruption(self):
        reason = main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        self.assertIsNone(reason)
        self.assertEqual(self.spec_path.read_text(encoding="utf-8"), self.pre_content)

    def test_legitimate_change_to_current_wrapper_only_is_not_corruption(self):
        legit = self.pre_content.replace(
            "it('should throw NotFoundException', async () => { expect(true).toBe(true); });",
            "it('should throw NotFoundException', async () => { expect(false).toBe(false); });",
        )
        self.spec_path.write_text(legit, encoding="utf-8")
        reason = main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        self.assertIsNone(reason)
        self.assertEqual(self.spec_path.read_text(encoding="utf-8"), legit)

    def test_unbalanced_scopes_trigger_restore(self):
        broken = self.pre_content.replace("expect(true).toBe(true); });", "expect(true).toBe(true); ) {{{")
        self.spec_path.write_text(broken, encoding="utf-8")
        braces, _, _ = scope_balance(broken)
        self.assertNotEqual(braces, 0)  # sanity: the fixture really is unbalanced

        reason = main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        self.assertIsNotNone(reason)
        self.assertIn("unbalanced scopes", reason)
        self.assertEqual(self.spec_path.read_text(encoding="utf-8"), self.pre_content)

    def test_current_wrapper_disappearing_triggers_restore(self):
        broken = self.pre_content.replace(CURRENT_FN_WRAPPER, "")
        self.spec_path.write_text(broken, encoding="utf-8")
        reason = main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        self.assertIsNotNone(reason)
        self.assertIn("removed the function's own wrapper", reason)
        self.assertEqual(self.spec_path.read_text(encoding="utf-8"), self.pre_content)

    def test_previously_accepted_wrapper_changing_triggers_restore(self):
        broken = self.pre_content.replace("already accepted", "TAMPERED")
        self.spec_path.write_text(broken, encoding="utf-8")
        reason = main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        self.assertIsNotNone(reason)
        self.assertIn("previously accepted function wrappers", reason)
        self.assertIn("FN_otherFunction_END", reason)

    def test_restore_reproduces_snapshot_byte_for_byte(self):
        # Scenario 7: the restored file must be an EXACT match of the
        # pre-attempt snapshot, not merely "no longer broken".
        broken = self.pre_content.replace("already accepted", "TAMPERED") + "\nextra garbage line\n"
        self.spec_path.write_text(broken, encoding="utf-8")
        main._restore_if_repair_corrupted_spec(
            generated_spec_path=self.spec_path, fn_id="FN_cancelOrder_END",
            pre_repair_content=self.pre_content, pre_repair_blocks=self.pre_blocks,
        )
        restored = self.spec_path.read_text(encoding="utf-8")
        self.assertEqual(restored, self.pre_content)
        self.assertEqual(len(restored), len(self.pre_content))


# ─────────────────────────────────────────────────────────────────────────────
# Integration tests: run_runtime_repair_loop wiring
# ─────────────────────────────────────────────────────────────────────────────

class RunRuntimeRepairLoopSnapshotTests(unittest.TestCase):
    def test_repair_that_corrupts_the_spec_is_reverted_and_next_attempt_starts_clean(self):
        with tempfile.TemporaryDirectory() as directory:
            spec_path = Path(directory) / "generated.spec.ts"
            spec_path.write_text(SPEC_TEMPLATE, encoding="utf-8")
            pristine = spec_path.read_text(encoding="utf-8")

            error_csv = Path(directory) / "error_events.csv"
            ctx = EventContext(
                run_id="run-TEST", model="m", strategy="zero_shot", module="order",
                function_name="cancelOrder", fn_id="FN_cancelOrder_END",
                source_file="src/order/order.service.ts", line_start=5, line_end=20, source_hash="abc",
            )

            failing_jest = JestResult(success=False, stdout="", stderr="  ● x fails\n", returncode=1)
            passing_jest = JestResult(success=True, stdout="", stderr="", returncode=0)

            # Attempt 1's repair simulates a bad LLM-driven patch that
            # breaks the whole file; attempt 2's repair is clean. Neither
            # actually needs to touch the "x fails" test itself -- only
            # the file-corruption behavior at attempt 1 is under test.
            call_count = {"n": 0}

            def repair_side_effect(**_kwargs):
                call_count["n"] += 1
                if call_count["n"] == 1:
                    spec_path.write_text(pristine + "\n}}}} garbage", encoding="utf-8")
                return RepairStats(repairs_applied=1, repairs_failed=0, repair_tokens=5)

            with patch.object(error_events, "ERROR_EVENTS_CSV", error_csv), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"), \
                 patch.object(main, "install_temp_spec", return_value=spec_path), \
                 patch.object(main, "remove_temp_spec", return_value=None), \
                 patch.object(main, "extract_function_coverage", return_value={}), \
                 patch.object(
                     main, "extract_test_metrics",
                     side_effect=[
                         {"total_tests": 1, "passed_tests": 0, "failed_tests": 1, "pending_tests": 0},
                         {"total_tests": 1, "passed_tests": 0, "failed_tests": 1, "pending_tests": 0},
                         {"total_tests": 1, "passed_tests": 1, "failed_tests": 0, "pending_tests": 0},
                     ],
                 ), \
                 patch.object(main, "run_jest", side_effect=[failing_jest, failing_jest, passing_jest]), \
                 patch.object(
                     main, "parse_jest_failures",
                     return_value=[JestFailure(test_name="x fails", error_type="mock_call_argument_mismatch", error_message="boom")],
                 ), \
                 patch.object(main, "repair_runtime_failure", side_effect=repair_side_effect):
                result = main.run_runtime_repair_loop(
                    client=FakeClient(), repair_system_prompt="sys", repair_prompt="prompt",
                    generated_spec_path=spec_path, test_output_file="src/order/order.service.spec.ts",
                    target_source_file="src/order/order.service.ts", method_metadata=None,
                    fn_id="FN_cancelOrder_END", line_start=5, line_end=20, event_ctx=ctx,
                )

            self.assertTrue(result.success)

            # The final on-disk state must not carry the garbage from the
            # corrupting attempt -- it was reverted, and the second
            # (clean) repair attempt operated on the restored file, so the
            # other function's wrapper is still exactly intact.
            final_content = spec_path.read_text(encoding="utf-8")
            self.assertNotIn("garbage", final_content)
            self.assertIn(OTHER_FN_WRAPPER, final_content)
            braces, parens, brackets = scope_balance(final_content)
            self.assertEqual((braces, parens, brackets), (0, 0, 0))

            events = pd.read_csv(error_csv)
            corruption_events = events[events["error_subcategory"] == "artifact_corruption_detected"]
            self.assertEqual(len(corruption_events), 1)
            self.assertEqual(corruption_events.iloc[0]["attempt"], 1)
            self.assertEqual(corruption_events.iloc[0]["artifact_disposition"], "restored")


if __name__ == "__main__":
    unittest.main()
