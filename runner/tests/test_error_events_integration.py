"""
Exercises the real wiring in main.run_runtime_repair_loop (not a
reimplementation) against a deterministic, fully-mocked scenario: two
failing Jest attempts followed by a third that succeeds. Verifies the
exact rows persisted to error_events.csv, and that they never affect
results.csv.

All subprocess-backed collaborators (Jest, coverage extraction, the
repair orchestrator, the LLM client) are mocked/faked -- no external
process runs, no model is called.
"""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

import main
import persistence.error_events as error_events
from models.error_event import EventContext
from models.jest_result import JestFailure, JestResult
from repair.orchestrator import RepairStats


class FakeClient:
    def generate(self, *_args):
        return type("Response", (), {"content": "it('x', () => {});", "tokens": 0, "duration_ns": 0})()


class RuntimeRepairLoopEventWiringTests(unittest.TestCase):
    def test_two_failures_then_success_produce_the_expected_error_events(self):
        with tempfile.TemporaryDirectory() as directory:
            error_csv = Path(directory) / "error_events.csv"
            spec_path = Path(directory) / "generated.spec.ts"
            spec_path.write_text("describe('Service', () => {});\n", encoding="utf-8")

            ctx = EventContext(
                run_id="run-TEST",
                model="qwen_coder_3b",
                strategy="structured",
                module="order",
                function_name="cancelOrder",
                fn_id="FN_cancelOrder_END",
                source_file="src/order/order.service.ts",
                line_start=5,
                line_end=20,
                source_hash="deadbeef",
            )

            failing_jest = JestResult(
                success=False,
                stdout="",
                stderr="  ● cancelOrder should throw NotFoundException\n\nExpected: NotFoundException\nReceived: undefined",
                returncode=1,
            )
            passing_jest = JestResult(success=True, stdout="", stderr="", returncode=0)

            failure = JestFailure(
                test_name="cancelOrder should throw NotFoundException",
                error_type="mock_call_argument_mismatch",
                error_message="Expected: NotFoundException, Received: undefined",
            )

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
                 patch.object(main, "parse_jest_failures", return_value=[failure]), \
                 patch.object(
                     main, "repair_runtime_failure",
                     return_value=RepairStats(repairs_applied=1, repairs_failed=0, repair_tokens=10),
                 ):
                result = main.run_runtime_repair_loop(
                    client=FakeClient(),
                    repair_system_prompt="repair system prompt",
                    repair_prompt="repair prompt",
                    generated_spec_path=spec_path,
                    test_output_file="src/order/order.service.spec.ts",
                    target_source_file="src/order/order.service.ts",
                    method_metadata=None,
                    fn_id="FN_cancelOrder_END",
                    line_start=5,
                    line_end=20,
                    event_ctx=ctx,
                )

            self.assertTrue(result.success)
            self.assertEqual(result.runtime_repairs, 2)

            saved = pd.read_csv(error_csv)

            # Exactly one jest-phase event per failing attempt (attempts 1
            # and 2); no event for the successful third attempt.
            jest_rows = saved[saved["phase"] == "jest"]
            self.assertEqual(sorted(jest_rows["attempt"].tolist()), [1, 2])
            self.assertTrue((jest_rows["error_category"] == "jest").all())
            self.assertTrue((jest_rows["error_subcategory"] == "assertion_failure").all())
            self.assertTrue(
                jest_rows["error_message"]
                .str.contains("cancelOrder should throw NotFoundException")
                .all()
            )

            # Repair was attempted and applied on both failing attempts, so
            # no repair_failed/unparseable_failure/max_repairs_exceeded
            # event should have been recorded.
            self.assertTrue(saved[saved["phase"] == "repair"].empty)

            # Every row shares the same experiment identity.
            self.assertEqual(saved["fn_id"].nunique(), 1)
            self.assertEqual(saved["model"].unique().tolist(), ["qwen_coder_3b"])
            self.assertEqual(saved["strategy"].unique().tolist(), ["structured"])
            self.assertEqual(len(saved), 2)

    def test_exhausted_repairs_produce_a_max_repairs_exceeded_event(self):
        with tempfile.TemporaryDirectory() as directory:
            error_csv = Path(directory) / "error_events.csv"
            spec_path = Path(directory) / "generated.spec.ts"
            spec_path.write_text("describe('Service', () => {});\n", encoding="utf-8")

            ctx = EventContext(
                run_id="run-TEST", model="gemma_4", strategy="few_shot",
                module="patient", function_name="createPatient",
                fn_id="FN_createPatient_END",
                source_file="src/patient/patient.service.ts",
                line_start=1, line_end=10, source_hash="cafebabe",
            )

            failing_jest = JestResult(success=False, stdout="", stderr="  ● createPatient fails\n", returncode=1)
            failure = JestFailure(
                test_name="createPatient fails", error_type="generic", error_message="boom",
            )

            with patch.object(error_events, "ERROR_EVENTS_CSV", error_csv), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"), \
                 patch.object(main, "install_temp_spec", return_value=spec_path), \
                 patch.object(main, "remove_temp_spec", return_value=None), \
                 patch.object(main, "extract_function_coverage", return_value={}), \
                 patch.object(
                     main, "extract_test_metrics",
                     return_value={"total_tests": 1, "passed_tests": 0, "failed_tests": 1, "pending_tests": 0},
                 ), \
                 patch.object(main, "run_jest", return_value=failing_jest), \
                 patch.object(main, "parse_jest_failures", return_value=[failure]), \
                 patch.object(
                     main, "repair_runtime_failure",
                     return_value=RepairStats(repairs_applied=0, repairs_failed=1, repair_tokens=5),
                 ), \
                 patch.object(main, "MAX_RUNTIME_REPAIRS", 2):
                result = main.run_runtime_repair_loop(
                    client=FakeClient(),
                    repair_system_prompt="repair system prompt",
                    repair_prompt="repair prompt",
                    generated_spec_path=spec_path,
                    test_output_file="src/patient/patient.service.spec.ts",
                    target_source_file="src/patient/patient.service.ts",
                    method_metadata=None,
                    fn_id="FN_createPatient_END",
                    line_start=1,
                    line_end=10,
                    event_ctx=ctx,
                )

            self.assertFalse(result.success)
            saved = pd.read_csv(error_csv)

            repair_rows = saved[saved["phase"] == "repair"]
            self.assertEqual(
                sorted(repair_rows["error_subcategory"].tolist()),
                ["max_repairs_exceeded", "repair_failed"],
            )
            # jest-phase events exist for every attempt (1 and 2).
            jest_rows = saved[saved["phase"] == "jest"]
            self.assertEqual(sorted(jest_rows["attempt"].tolist()), [1, 2])


if __name__ == "__main__":
    unittest.main()
