import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

import persistence.csv_writer as csv_writer
import persistence.error_events as error_events
import utils.error_classification as clf
from models.error_event import EventContext


def _ctx(**overrides) -> EventContext:
    defaults = dict(
        run_id="run-TEST",
        model="gemma_4",
        strategy="zero_shot",
        module="order",
        function_name="updateResult",
        fn_id="FN_updateResult_END",
        source_file="src/result/result.service.ts",
        line_start=10,
        line_end=40,
        source_hash="abc123",
    )
    defaults.update(overrides)
    return EventContext(**defaults)


class ErrorEventPersistenceTests(unittest.TestCase):
    """Covers scenarios 1, 2, 3, 4, 5, 7 from the runbook."""

    def test_multiple_errors_for_same_identity_are_preserved_as_separate_events(self):
        # Scenario 1
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "error_events.csv"
            with patch.object(error_events, "ERROR_EVENTS_CSV", csv_path), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"):
                ctx = _ctx()
                error_events.record_error_event(
                    ctx, phase="jest", error_category="jest",
                    error_subcategory="assertion_failure", error_message="first failure",
                    attempt=1,
                )
                error_events.record_error_event(
                    ctx, phase="jest", error_category="jest",
                    error_subcategory="runtime_error", error_message="second failure",
                    attempt=2,
                )

            saved = pd.read_csv(csv_path)
            self.assertEqual(len(saved), 2)
            self.assertEqual(
                sorted(saved["error_message"].tolist()),
                ["first failure", "second failure"],
            )
            # Same model/strategy/fn_id identity on both rows -- proves
            # this is an event log, not one-row-per-function upsert.
            self.assertEqual(saved["fn_id"].nunique(), 1)

    def test_error_events_never_trigger_results_upsert_or_data_loss(self):
        # Scenario 2
        with tempfile.TemporaryDirectory() as directory:
            results_csv = Path(directory) / "results.csv"
            error_csv = Path(directory) / "error_events.csv"

            with patch.object(csv_writer, "RESULTS_CSV", results_csv), \
                 patch.object(csv_writer, "RUN_ID", "run-TEST"):
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 10, "line_end": 40,
                    "function": "createOrder", "jest_success": True,
                })
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 50, "line_end": 80,
                    "function": "cancelOrder", "jest_success": True,
                })

            with patch.object(error_events, "ERROR_EVENTS_CSV", error_csv), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"):
                # Many error events for many identities, including ones that
                # collide with results.csv rows -- must never touch results.csv.
                for i in range(10):
                    error_events.record_error_event(
                        _ctx(function_name=f"fn{i}", fn_id=f"FN_fn{i}_END"),
                        phase="jest", error_category="jest",
                        error_subcategory="assertion_failure",
                        error_message=f"failure {i}",
                        attempt=1,
                    )

            results_after = pd.read_csv(results_csv)
            self.assertEqual(
                sorted(results_after["function"].tolist()),
                ["cancelOrder", "createOrder"],
            )
            self.assertEqual(len(pd.read_csv(error_csv)), 10)

    def test_typescript_failure_and_rollback_are_distinct_events(self):
        # Scenario 3
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "error_events.csv"
            with patch.object(error_events, "ERROR_EVENTS_CSV", csv_path), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"):
                ctx = _ctx()
                ts_category, ts_subcategory = clf.classify_typescript_failure(
                    "src/x.spec.ts(3,5): error TS2345: Argument of type 'string' is not assignable."
                )
                error_events.record_error_event(
                    ctx, phase="typescript", error_category=ts_category,
                    error_subcategory=ts_subcategory,
                    error_message="TS2345 argument type mismatch", attempt=1,
                )
                rollback_category, rollback_subcategory = clf.classify_pipeline_rollback()
                error_events.record_error_event(
                    ctx, phase="pipeline", error_category=rollback_category,
                    error_subcategory=rollback_subcategory,
                    error_message="rolled back to last known-good snapshot",
                    artifact_disposition="restored",
                )

            saved = pd.read_csv(csv_path)
            self.assertEqual(len(saved), 2)
            self.assertEqual(sorted(saved["phase"].tolist()), ["pipeline", "typescript"])
            ts_row = saved[saved["phase"] == "typescript"].iloc[0]
            pipeline_row = saved[saved["phase"] == "pipeline"].iloc[0]
            self.assertEqual(ts_row["error_subcategory"], "type_mismatch")
            self.assertEqual(pipeline_row["error_subcategory"], "rollback")
            self.assertEqual(pipeline_row["artifact_disposition"], "restored")
            # Both events share the same underlying identity (same primary
            # failure), but are recorded as two separate rows.
            self.assertEqual(ts_row["fn_id"], pipeline_row["fn_id"])

    def test_multiple_repair_attempts_preserve_attempt_numbers(self):
        # Scenario 4
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "error_events.csv"
            with patch.object(error_events, "ERROR_EVENTS_CSV", csv_path), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"):
                ctx = _ctx()
                for attempt in (1, 2, 3):
                    error_events.record_error_event(
                        ctx, phase="jest", error_category="jest",
                        error_subcategory="assertion_failure",
                        error_message=f"attempt {attempt} failed", attempt=attempt,
                    )
                category, subcategory = clf.classify_repair_max_exceeded()
                error_events.record_error_event(
                    ctx, phase="repair", error_category=category,
                    error_subcategory=subcategory,
                    error_message="exhausted repairs", attempt=3,
                )

            saved = pd.read_csv(csv_path)
            self.assertEqual(sorted(saved["attempt"].tolist()), [1, 2, 3, 3])
            jest_attempts = sorted(saved[saved["phase"] == "jest"]["attempt"].tolist())
            self.assertEqual(jest_attempts, [1, 2, 3])

    def test_failed_event_persistence_never_touches_results_csv(self):
        # Scenario 5
        with tempfile.TemporaryDirectory() as directory:
            results_csv = Path(directory) / "results.csv"
            error_csv = Path(directory) / "error_events.csv"

            with patch.object(csv_writer, "RESULTS_CSV", results_csv), \
                 patch.object(csv_writer, "RUN_ID", "run-TEST"):
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 10, "line_end": 40,
                    "function": "createOrder", "jest_success": True,
                })

            with patch.object(error_events, "ERROR_EVENTS_CSV", error_csv), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", Path(directory) / "errors"), \
                 patch.object(error_events, "_append_row", side_effect=OSError("disk full")):
                # Must not raise, must not touch results.csv.
                error_events.record_error_event(
                    _ctx(), phase="jest", error_category="jest",
                    error_subcategory="assertion_failure",
                    error_message="this write will fail", attempt=1,
                )

            results_after = pd.read_csv(results_csv)
            self.assertEqual(results_after["function"].tolist(), ["createOrder"])
            # The failed write produced no error_events.csv at all -- that is
            # an acceptable, fail-safe outcome (nothing was corrupted).
            self.assertFalse(error_csv.exists())

    def test_raw_artifact_written_without_large_blob_in_csv(self):
        # Scenario 7
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "error_events.csv"
            artifacts_dir = Path(directory) / "errors"
            large_stderr = "FAIL src/x.spec.ts\n" + ("  at SomeModule.method (file.ts:1:1)\n" * 200)
            self.assertGreater(len(large_stderr), 400)

            with patch.object(error_events, "ERROR_EVENTS_CSV", csv_path), \
                 patch.object(error_events, "ERROR_ARTIFACTS_DIR", artifacts_dir):
                error_events.record_error_event(
                    _ctx(), phase="jest", error_category="jest",
                    error_subcategory="runtime_error",
                    error_message="TypeError: cannot read property 'x' of undefined",
                    attempt=1,
                    raw_text=large_stderr,
                )

            saved = pd.read_csv(csv_path)
            self.assertEqual(len(saved), 1)
            row = saved.iloc[0]
            self.assertLess(len(str(row["error_message"])), len(large_stderr))
            self.assertTrue(str(row["raw_artifact_path"]))
            artifact_path = Path(row["raw_artifact_path"])
            self.assertTrue(artifact_path.exists())
            self.assertEqual(artifact_path.read_text(encoding="utf-8"), large_stderr)


class ErrorClassificationTests(unittest.TestCase):
    """Scenario 6: classification is deterministic for representative inputs."""

    def test_typescript_classification_is_deterministic(self):
        cases = [
            ("error TS2304: Cannot find name 'foo'.", "missing_identifier"),
            ("error TS2339: Property 'bar' does not exist on type 'Foo'.", "missing_identifier"),
            ("error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.", "type_mismatch"),
            ("error TS2322: Type 'string' is not assignable to type 'number'.", "type_mismatch"),
            ("error TS1005: ';' expected.", "syntax_error"),
            ("error TS9999: some unmapped diagnostic.", "compile_error"),
            ("no ts error markers here at all", "unknown"),
        ]
        for text, expected in cases:
            with self.subTest(text=text):
                category, subcategory = clf.classify_typescript_failure(text)
                self.assertEqual(category, "typescript")
                self.assertEqual(subcategory, expected)
                # Deterministic: calling twice gives the same result.
                self.assertEqual(clf.classify_typescript_failure(text), (category, subcategory))

    def test_jest_classification_maps_existing_parser_categories(self):
        cases = [
            ("mock_call_argument_mismatch", "assertion_failure"),
            ("wrong_async_assertion", "assertion_failure"),
            ("missing_throw", "assertion_failure"),
            ("undefined_property", "runtime_error"),
            ("not_a_function", "runtime_error"),
            ("undefined_identifier", "runtime_error"),
            ("unhandled_rejection", "unhandled_rejection"),
            ("generic", "unknown"),
        ]
        for error_type, expected in cases:
            with self.subTest(error_type=error_type):
                category, subcategory = clf.classify_jest_failure(
                    test_discovery_failed=False, error_type=error_type,
                )
                self.assertEqual(category, "jest")
                self.assertEqual(subcategory, expected)

    def test_jest_test_discovery_failure_takes_priority(self):
        category, subcategory = clf.classify_jest_failure(
            test_discovery_failed=True, error_type="mock_call_argument_mismatch",
        )
        self.assertEqual((category, subcategory), ("jest", "test_discovery_failure"))

    def test_jest_timeout_heuristic(self):
        category, subcategory = clf.classify_jest_failure(
            test_discovery_failed=False, error_type=None,
            raw_text="thrown: Exceeded timeout of 5000 ms for a test.",
        )
        self.assertEqual((category, subcategory), ("jest", "timeout"))

    def test_jest_classification_falls_back_to_unknown(self):
        category, subcategory = clf.classify_jest_failure(
            test_discovery_failed=False, error_type=None, raw_text="",
        )
        self.assertEqual((category, subcategory), ("jest", "unknown"))

    def test_error_hash_is_deterministic_and_normalizes_stack_lines(self):
        a = "Error: boom\n    at foo (file.ts:12:5)\n    at bar (file.ts:99:1)"
        b = "Error: boom\n    at foo (file.ts:999:5)\n    at bar (file.ts:4:1)"
        self.assertEqual(
            error_events.compute_error_hash(a),
            error_events.compute_error_hash(b),
        )
        self.assertEqual(
            error_events.compute_error_hash(a),
            error_events.compute_error_hash(a),
        )


if __name__ == "__main__":
    unittest.main()
