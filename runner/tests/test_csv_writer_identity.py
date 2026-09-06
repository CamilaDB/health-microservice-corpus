import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

import persistence.csv_writer as csv_writer


class CsvWriterIdentityTests(unittest.TestCase):
    """
    _save_upsert's match key degrades to whatever identity columns are
    actually present on the incoming row. A fallback row that omits
    source_file/line_start/line_end (as failure-path rows in main.py used
    to) collapses the match key down to (run_id, model, strategy) alone,
    which matches -- and silently deletes -- every other function's row
    for that model x strategy. Every row saved through save_result must
    carry the full identity so one function's failure can never delete
    another function's already-persisted result.
    """

    def test_incomplete_identity_row_does_not_delete_other_functions(self):
        with tempfile.TemporaryDirectory() as directory:
            results_csv = Path(directory) / "results.csv"

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

                # A later function in the same model x strategy hits a
                # failure path. Its row must still carry source_file/
                # line_start/line_end so it cannot collide with the rows
                # already saved above.
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 90, "line_end": 95,
                    "function": "searchOrders",
                    "generation_success": False,
                    "execution_status": "generation_empty",
                })

            saved = pd.read_csv(results_csv)
            self.assertEqual(
                sorted(saved["function"].tolist()),
                ["cancelOrder", "createOrder", "searchOrders"],
            )

    def test_partial_identity_row_appends_instead_of_wiping_everything(self):
        """
        Guards _save_upsert itself: even if a future caller forgets an
        identity column (the exact shape of the bug main.py used to have
        in its generation_empty/generation_invalid/runner_exception/
        spec_group_fatal_error fallback rows), it must never fall back to
        matching on a partial key -- that would delete every other row
        sharing only (run_id, model, strategy).
        """
        with tempfile.TemporaryDirectory() as directory:
            results_csv = Path(directory) / "results.csv"

            with patch.object(csv_writer, "RESULTS_CSV", results_csv), \
                 patch.object(csv_writer, "RUN_ID", "run-TEST"):
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 10, "line_end": 40,
                    "function": "createOrder",
                })
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "source_file": "src/order/order.service.ts",
                    "line_start": 50, "line_end": 80,
                    "function": "cancelOrder",
                })

                # Deliberately incomplete: no source_file/line_start/line_end.
                csv_writer.save_result({
                    "model": "gemma_4", "strategy": "zero_shot",
                    "function": "searchOrders",
                    "execution_status": "generation_empty",
                })

            saved = pd.read_csv(results_csv)
            self.assertEqual(
                sorted(saved["function"].tolist()),
                ["cancelOrder", "createOrder", "searchOrders"],
            )


if __name__ == "__main__":
    unittest.main()
