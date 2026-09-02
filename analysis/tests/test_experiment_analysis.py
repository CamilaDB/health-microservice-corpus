"""
Deterministic tests for the post-experiment analysis corrections.

Covers: verified_eligible / fully_skipped derivation (Phase 1), the
mutant-weighted coverage-inclusive mutation score (Phase 2), the run-id
contamination guards on the mutation/smell loaders (Phase 2), the
diagnostic error reclassification (Phase 3), and the H2 (complexity x
model) aggregations. No test touches any file under experiments/metrics/
-- everything here runs against small, in-memory or temp-file synthetic
data.
"""
import os
import sys
import tempfile
import unittest
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import experiment_analysis as ea  # noqa: E402

# _enforce_single_run auto-selects the run_id when a CSV holds exactly one
# (see RunIdAutoSelectionTests) and raises when it holds more than one and
# EXPERIMENT_RUN_ID is unset -- it has no hardcoded fallback run_id.
# Synthetic fixtures in this file use a placeholder run_id ("run-TEST"), so
# EXPERIMENT_RUN_ID is pointed at that placeholder for the whole test module
# and restored afterward -- this does not change production behavior, only
# what these tests load. (Auto-selection would work here too since each
# fixture file has a single run_id, but pinning it explicitly keeps every
# other test in this module independent of that behavior.)
_ORIGINAL_RUN_ID_ENV = os.environ.get("EXPERIMENT_RUN_ID")


def setUpModule():
    os.environ["EXPERIMENT_RUN_ID"] = "run-TEST"


def tearDownModule():
    if _ORIGINAL_RUN_ID_ENV is None:
        os.environ.pop("EXPERIMENT_RUN_ID", None)
    else:
        os.environ["EXPERIMENT_RUN_ID"] = _ORIGINAL_RUN_ID_ENV


def _write_csv(path: Path, rows: list[dict]) -> None:
    pd.DataFrame(rows).to_csv(path, index=False)


class VerifiedEligibleTests(unittest.TestCase):
    """
    The five scenarios required by the audit: normal accepted, mixed
    active/skipped, fully-skipped, restored, generation-invalid.
    """

    def _base_row(self, **overrides) -> dict:
        row = {
            "run_id": "run-TEST", "model": "m", "strategy": "s",
            "module": "order", "function": "f", "fn_id": "FN_f_END",
            "source_file": "src/order/order.service.ts",
            "line_start": 1, "line_end": 10, "source_hash": "abc",
            "ccm": 3, "range": "low",
            "generation_success": True, "jest_success": True,
            "analysis_eligible": True, "artifact_disposition": "accepted",
            "execution_status": "jest_success",
            "total_tests": 4, "passed_tests": 4, "failed_tests": 0, "pending_tests": 0,
            "fn_statements_pct": 100.0, "fn_branches_pct": 100.0, "fn_functions_pct": 100.0,
        }
        row.update(overrides)
        return row

    def _load_single(self, row: dict) -> pd.Series:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "results.csv"
            _write_csv(path, [row])
            df = ea.load_results(path)
            return df.iloc[0]

    def test_normal_accepted_observation_with_passing_tests(self):
        row = self._load_single(self._base_row())
        self.assertTrue(row["verified_eligible"])
        self.assertFalse(row["fully_skipped"])

    def test_accepted_observation_with_mixed_active_and_skipped_tests(self):
        row = self._load_single(self._base_row(
            total_tests=5, passed_tests=3, failed_tests=0, pending_tests=2,
        ))
        self.assertTrue(row["verified_eligible"])
        self.assertFalse(row["fully_skipped"])

    def test_fully_skipped_observation_is_never_verified_success(self):
        row = self._load_single(self._base_row(
            total_tests=6, passed_tests=0, failed_tests=0, pending_tests=6,
        ))
        self.assertTrue(row["analysis_eligible"])  # stored value untouched
        self.assertFalse(row["verified_eligible"])
        self.assertTrue(row["fully_skipped"])

    def test_restored_observation(self):
        row = self._load_single(self._base_row(
            jest_success=False, analysis_eligible=False, artifact_disposition="restored",
            execution_status="jest_failed",
            total_tests=3, passed_tests=0, failed_tests=3, pending_tests=0,
        ))
        self.assertFalse(row["verified_eligible"])
        self.assertFalse(row["fully_skipped"])

    def test_generation_invalid_observation(self):
        row = self._load_single(self._base_row(
            generation_success=False, jest_success="", analysis_eligible=False,
            artifact_disposition="", execution_status="generation_invalid",
            total_tests="", passed_tests="", failed_tests="", pending_tests="",
        ))
        self.assertFalse(row["verified_eligible"])
        self.assertFalse(row["fully_skipped"])

    def test_analysis_eligible_semantics_are_preserved_unmodified(self):
        """verified_eligible/fully_skipped must be additive, not a replacement."""
        row = self._load_single(self._base_row(
            total_tests=6, passed_tests=0, failed_tests=0, pending_tests=6,
        ))
        self.assertIn("analysis_eligible", row.index)
        self.assertTrue(row["analysis_eligible"])


class SummaryByModelStrategyTests(unittest.TestCase):
    def test_verified_success_rate_excludes_fully_skipped(self):
        rows = []
        base = VerifiedEligibleTests()._base_row
        # 2 verified, 1 fully-skipped, 1 restored -> 4 attempted, verified rate 50%
        rows.append(base(function="a", fn_id="FN_a_END"))
        rows.append(base(function="b", fn_id="FN_b_END"))
        rows.append(base(function="c", fn_id="FN_c_END",
                          total_tests=2, passed_tests=0, failed_tests=0, pending_tests=2))
        rows.append(base(function="d", fn_id="FN_d_END",
                          jest_success=False, analysis_eligible=False,
                          artifact_disposition="restored", execution_status="jest_failed",
                          total_tests=1, passed_tests=0, failed_tests=1, pending_tests=0))

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "results.csv"
            _write_csv(path, rows)
            df = ea.load_results(path)

        summary = ea.build_summary_by_model_strategy(df)
        self.assertEqual(len(summary), 1)
        row = summary.iloc[0]
        self.assertEqual(row["observations_attempted"], 4)
        self.assertEqual(row["verified_eligible_count"], 2)
        self.assertEqual(row["fully_skipped_count"], 1)
        self.assertEqual(row["verified_success_rate"], 50.0)
        self.assertEqual(row["raw_jest_success_rate"], 75.0)  # 3/4 report jest_success True


class MutationCorrectionTests(unittest.TestCase):
    def _load(self, rows: list[dict]) -> pd.DataFrame:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            return ea.load_mutation_results(path)

    def test_extreme_case_100pct_original_score_mostly_no_coverage(self):
        """
        The exact real-world extreme case found in the audit:
        qwen_coder_3b/zero_shot/result -- killed=1, survived=0,
        no_coverage=207, total=208 -- stored mutation_score is 100.0
        (1/(1+0)*100) yet 99.5% of mutants were never covered.
        """
        df = self._load([{
            "run_id": "run-TEST", "model": "qwen_coder_3b", "strategy": "zero_shot",
            "module": "result", "source_file": "src/result/result.service.ts",
            "test_output_file": "src/result/result.service.spec.ts",
            "mutants_total": 208, "mutants_killed": 1, "mutants_survived": 0,
            "mutants_timeout": 0, "mutants_no_coverage": 207, "mutants_compile_error": 0,
            "mutation_score": 100.0,
        }])
        row = df.iloc[0]
        self.assertEqual(row["mutation_score"], 100.0)  # original, untouched
        self.assertAlmostEqual(row["mutation_score_corrected"], 1 / 208 * 100, places=2)
        self.assertAlmostEqual(row["no_coverage_share"], 207 / 208 * 100, places=2)
        self.assertLess(row["mutation_score_corrected"], 1.0)

    def test_corrected_formula_matches_manual_calculation(self):
        df = self._load([{
            "run_id": "run-TEST", "model": "m", "strategy": "s", "module": "mod",
            "source_file": "x.ts", "test_output_file": "x.spec.ts",
            "mutants_total": 100, "mutants_killed": 40, "mutants_survived": 10,
            "mutants_timeout": 5, "mutants_no_coverage": 45, "mutants_compile_error": 0,
            "mutation_score": 80.0,  # original: 40/(40+10)
        }])
        row = df.iloc[0]
        self.assertEqual(row["mutation_score"], 80.0)
        # corrected: 40 / (40+10+45+5) = 40/100 = 40.0
        self.assertAlmostEqual(row["mutation_score_corrected"], 40.0, places=2)


class MutationSummaryWeightingTests(unittest.TestCase):
    def test_summary_is_mutant_weighted_not_unweighted_mean_of_percentages(self):
        """
        Two modules of very different sizes for the same model x strategy.
        Module A: 900 mutants, 900 killed, 0 survived/no_coverage -> 100%.
        Module B: 100 mutants, 0 killed, 100 no_coverage -> corrected 0%.
        Unweighted mean of per-module corrected scores would be 50%.
        Mutant-weighted (summed counts) must be 90% (900/(900+100)).
        """
        rows = [
            {
                "run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
                "source_file": "a.ts", "test_output_file": "a.spec.ts",
                "mutants_total": 900, "mutants_killed": 900, "mutants_survived": 0,
                "mutants_timeout": 0, "mutants_no_coverage": 0, "mutants_compile_error": 0,
                "mutation_score": 100.0,
            },
            {
                "run_id": "run-TEST", "model": "m", "strategy": "s", "module": "b",
                "source_file": "b.ts", "test_output_file": "b.spec.ts",
                "mutants_total": 100, "mutants_killed": 0, "mutants_survived": 0,
                "mutants_timeout": 0, "mutants_no_coverage": 100, "mutants_compile_error": 0,
                "mutation_score": 0.0,
            },
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            df = ea.load_mutation_results(path)

        summary = ea.build_mutation_summary_by_model_strategy(df)
        self.assertEqual(len(summary), 1)
        row = summary.iloc[0]
        self.assertEqual(row["mutants_total"], 1000)
        self.assertEqual(row["mutants_killed"], 900)
        # weighted, corrected: 900 / (900+0+100+0) = 90.0
        self.assertAlmostEqual(row["mutation_score_corrected"], 90.0, places=2)
        # old unweighted-mean-of-percentages behaviour, preserved for
        # traceability, must NOT equal the corrected value here.
        self.assertAlmostEqual(row["mutation_score_stryker_unweighted_mean"], 50.0, places=2)
        self.assertNotAlmostEqual(row["mutation_score_corrected"],
                                   row["mutation_score_stryker_unweighted_mean"], places=2)


class FunctionMutationH2Tests(unittest.TestCase):
    """
    Analysis-layer consumption of mutation_function_results.csv (the real
    per-mutant re-slice from execution/stryker_runner.py:
    map_mutants_to_functions -- see runner/tests/test_stryker_function_
    mapping.py for the mapping logic itself). Never a fabricated/
    proportional split: these rows are exactly what stryker_runner.py
    would persist.
    """

    def _rows(self):
        return [
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "fn_id": "FN_low_END", "function": "low", "ccm": 3, "range": "low",
             "mutants_total": 10, "mutants_killed": 9, "mutants_killed_by_own_tests": 9,
             "mutants_killed_by_other_function_tests": 0, "mutants_survived": 1,
             "mutants_no_coverage": 0, "mutants_timeout": 0, "mutants_compile_error": 0,
             "mutants_unmapped_in_module": 0},
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "fn_id": "FN_high_END", "function": "high", "ccm": 25, "range": "high",
             "mutants_total": 10, "mutants_killed": 1, "mutants_killed_by_own_tests": 1,
             "mutants_killed_by_other_function_tests": 0, "mutants_survived": 0,
             "mutants_no_coverage": 9, "mutants_timeout": 0, "mutants_compile_error": 0,
             "mutants_unmapped_in_module": 0},
        ]

    def test_load_adds_corrected_score_and_no_coverage_share(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_function_results.csv"
            _write_csv(path, self._rows())
            df = ea.load_function_mutation_results(path)

        low = df[df["fn_id"] == "FN_low_END"].iloc[0]
        # corrected: 9 / (9+1+0+0) = 90.0
        self.assertAlmostEqual(low["mutation_score_corrected"], 90.0, places=2)
        self.assertAlmostEqual(low["no_coverage_share"], 0.0, places=2)

        high = df[df["fn_id"] == "FN_high_END"].iloc[0]
        # corrected: 1 / (1+0+9+0) = 10.0 -- dominated by no_coverage.
        self.assertAlmostEqual(high["mutation_score_corrected"], 10.0, places=2)
        self.assertAlmostEqual(high["no_coverage_share"], 90.0, places=2)

    def test_missing_file_returns_empty_frame_not_an_error(self):
        df = ea.load_function_mutation_results(Path("does/not/exist.csv"))
        self.assertTrue(df.empty)

    def test_h2_mutation_by_ccm_model_is_weighted_not_averaged(self):
        # Two functions in the SAME model x ccm_band, very different sizes
        # -- must be summed then scored, not averaged as percentages.
        rows = [
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "fn_id": "FN_a_END", "function": "a", "ccm": 3, "range": "low",
             "mutants_total": 900, "mutants_killed": 900, "mutants_killed_by_own_tests": 900,
             "mutants_killed_by_other_function_tests": 0, "mutants_survived": 0,
             "mutants_no_coverage": 0, "mutants_timeout": 0, "mutants_compile_error": 0,
             "mutants_unmapped_in_module": 0},
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "fn_id": "FN_b_END", "function": "b", "ccm": 4, "range": "low",
             "mutants_total": 100, "mutants_killed": 0, "mutants_killed_by_own_tests": 0,
             "mutants_killed_by_other_function_tests": 0, "mutants_survived": 0,
             "mutants_no_coverage": 100, "mutants_timeout": 0, "mutants_compile_error": 0,
             "mutants_unmapped_in_module": 0},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_function_results.csv"
            _write_csv(path, rows)
            df = ea.load_function_mutation_results(path)

        # Mirrors build_h2_coverage_by_model_ccm's own established
        # behavior: observed=False on the categorical CCM-band groupby
        # yields a row for every band, not just populated ones -- an
        # empty band's mutants_total is legitimately 0, not fabricated.
        summary = ea.build_h2_mutation_by_ccm_model(df)
        row = summary[summary["ccm_band"] == "1-5"].iloc[0]
        self.assertEqual(row["distinct_functions"], 2)
        self.assertEqual(row["mutants_total"], 1000)
        # weighted: 900 / (900+0+100+0) = 90.0, NOT the (100+0)/2 = 50 average
        self.assertAlmostEqual(row["mutation_score_corrected"], 90.0, places=2)

    def test_empty_input_returns_empty_frame(self):
        summary = ea.build_h2_mutation_by_ccm_model(pd.DataFrame())
        self.assertTrue(summary.empty)


class RunIdContaminationGuardTests(unittest.TestCase):
    """
    Phase 2: mutation/smell loaders must not silently mix two runs.

    These two tests explicitly clear EXPERIMENT_RUN_ID (the module-level
    setUpModule pins it to "run-TEST") to exercise the "multiple run_ids,
    none requested" branch of _enforce_single_run directly.
    """

    def setUp(self):
        self._prior_env = os.environ.pop("EXPERIMENT_RUN_ID", None)

    def tearDown(self):
        if self._prior_env is not None:
            os.environ["EXPERIMENT_RUN_ID"] = self._prior_env

    def test_mutation_loader_rejects_multiple_run_ids(self):
        rows = [
            {"run_id": "run-A", "model": "m", "strategy": "s", "module": "a",
             "source_file": "a.ts", "test_output_file": "a.spec.ts",
             "mutants_total": 10, "mutants_killed": 5, "mutants_survived": 5,
             "mutants_timeout": 0, "mutants_no_coverage": 0, "mutants_compile_error": 0,
             "mutation_score": 50.0},
            {"run_id": "run-B", "model": "m", "strategy": "s", "module": "a",
             "source_file": "a.ts", "test_output_file": "a.spec.ts",
             "mutants_total": 10, "mutants_killed": 5, "mutants_survived": 5,
             "mutants_timeout": 0, "mutants_no_coverage": 0, "mutants_compile_error": 0,
             "mutation_score": 50.0},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            with self.assertRaises(ValueError):
                ea.load_mutation_results(path)

    def test_smell_loader_rejects_multiple_run_ids(self):
        rows = [
            {"run_id": "run-A", "model": "m", "strategy": "s", "module": "a",
             "function": "f", "fn_id": "FN_f_END", "ccm": 1, "range": "low",
             "it_active": 1, "it_skip": 0, "assertion_roulette_count": 0,
             "assertion_roulette_rate": 0.0, "assertion_roulette_tests": "",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
            {"run_id": "run-B", "model": "m", "strategy": "s", "module": "a",
             "function": "f", "fn_id": "FN_f_END", "ccm": 1, "range": "low",
             "it_active": 1, "it_skip": 0, "assertion_roulette_count": 0,
             "assertion_roulette_rate": 0.0, "assertion_roulette_tests": "",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "smell_results.csv"
            _write_csv(path, rows)
            with self.assertRaises(ValueError):
                ea.load_smell_results(path)


class RunIdAutoSelectionTests(unittest.TestCase):
    """
    _enforce_single_run must have no hardcoded fallback run_id: a single
    run_id in the CSV is safe to auto-select when EXPERIMENT_RUN_ID is
    unset, but two or more must fail loudly rather than silently pick one
    -- see analysis/experiment_analysis.py::_enforce_single_run.
    """

    def setUp(self):
        self._prior_env = os.environ.pop("EXPERIMENT_RUN_ID", None)

    def tearDown(self):
        if self._prior_env is not None:
            os.environ["EXPERIMENT_RUN_ID"] = self._prior_env

    def _mutation_row(self, run_id):
        return {
            "run_id": run_id, "model": "m", "strategy": "s", "module": "a",
            "source_file": "a.ts", "test_output_file": "a.spec.ts",
            "mutants_total": 10, "mutants_killed": 5, "mutants_survived": 5,
            "mutants_timeout": 0, "mutants_no_coverage": 0, "mutants_compile_error": 0,
            "mutation_score": 50.0,
        }

    def test_single_run_id_auto_selected_when_env_unset(self):
        rows = [self._mutation_row("run-ONLY")]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            df = ea.load_mutation_results(path)
            self.assertEqual(set(df["run_id"]), {"run-ONLY"})

    def test_frozen_run_id_is_not_a_hidden_default(self):
        # A CSV that does NOT contain the historically-hardcoded default
        # run_id must still auto-select cleanly on its own single run_id --
        # proves there is no leftover fallback constant filtering it out.
        rows = [self._mutation_row("run-SOME-OTHER-RUN")]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            df = ea.load_mutation_results(path)
            self.assertEqual(set(df["run_id"]), {"run-SOME-OTHER-RUN"})

    def test_multiple_run_ids_without_env_var_raises(self):
        rows = [self._mutation_row("run-A"), self._mutation_row("run-B")]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            with self.assertRaises(ValueError):
                ea.load_mutation_results(path)

    def test_explicit_env_var_selects_only_that_run_among_several(self):
        rows = [self._mutation_row("run-A"), self._mutation_row("run-B")]
        os.environ["EXPERIMENT_RUN_ID"] = "run-B"
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            df = ea.load_mutation_results(path)
            self.assertEqual(set(df["run_id"]), {"run-B"})

    def test_enforce_single_run_false_returns_every_run_unfiltered(self):
        # The dashboard's own run selector (analysis/dashboard.py) needs
        # the full multi-run frame to populate its dropdown -- it must not
        # be raised out of before it gets a chance to filter by run_id
        # itself. See dashboard.py's get_results/get_mutation/get_smell/
        # get_errors_raw, which all pass enforce_single_run=False.
        rows = [self._mutation_row("run-A"), self._mutation_row("run-B")]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "mutation_results.csv"
            _write_csv(path, rows)
            df = ea.load_mutation_results(path, enforce_single_run=False)
            self.assertEqual(set(df["run_id"]), {"run-A", "run-B"})

    def test_enforce_single_run_false_on_results_csv_does_not_raise(self):
        rows = [
            {"model": "m", "strategy": "s", "module": "a", "function": "f",
             "fn_id": "FN_f_END", "run_id": "run-A", "analysis_eligible": True,
             "passed_tests": 1, "failed_tests": 0, "pending_tests": 0, "total_tests": 1},
            {"model": "m", "strategy": "s", "module": "a", "function": "f",
             "fn_id": "FN_f_END", "run_id": "run-B", "analysis_eligible": True,
             "passed_tests": 1, "failed_tests": 0, "pending_tests": 0, "total_tests": 1},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "results.csv"
            _write_csv(path, rows)
            df = ea.load_results(path, enforce_single_run=False)
            self.assertEqual(set(df["run_id"]), {"run-A", "run-B"})


class SmellMeasurableTests(unittest.TestCase):
    def test_fully_skipped_function_is_excluded_from_smell_rate_not_zero_filled(self):
        rows = [
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "function": "measured", "fn_id": "FN_measured_END", "ccm": 1, "range": "low",
             "it_active": 3, "it_skip": 0, "assertion_roulette_count": 3,
             "assertion_roulette_rate": 100.0, "assertion_roulette_tests": "x",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
            {"run_id": "run-TEST", "model": "m", "strategy": "s", "module": "a",
             "function": "all_skipped", "fn_id": "FN_all_skipped_END", "ccm": 1, "range": "low",
             "it_active": 0, "it_skip": 4, "assertion_roulette_count": 0,
             "assertion_roulette_rate": 0.0, "assertion_roulette_tests": "",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "smell_results.csv"
            _write_csv(path, rows)
            df = ea.load_smell_results(path)

        self.assertEqual(df[df["function"] == "all_skipped"]["measurable"].iloc[0], False)
        self.assertEqual(df[df["function"] == "measured"]["measurable"].iloc[0], True)

        summary = ea.build_smell_summary_by_model_strategy(df)
        row = summary.iloc[0]
        self.assertEqual(row["functions"], 2)
        self.assertEqual(row["measurable_functions"], 1)
        self.assertEqual(row["unmeasurable_functions"], 1)
        # The rate must come only from the measurable function (100%), not
        # be diluted toward 0 by averaging in the unmeasurable one.
        self.assertEqual(row["assertion_roulette_rate"], 100.0)


class ReclassificationTests(unittest.TestCase):
    def _row(self, message: str, raw_text: str | None = None, subcategory: str = "unknown") -> pd.Series:
        with tempfile.TemporaryDirectory() as directory:
            raw_path = ""
            if raw_text is not None:
                raw_path = str(Path(directory) / "artifact.txt")
                Path(raw_path).write_text(raw_text, encoding="utf-8")
            df = pd.DataFrame([{
                "error_category": "jest", "error_subcategory": subcategory,
                "error_message": message, "raw_artifact_path": raw_path,
            }])
            reclassified = ea.reclassify_error_events(df)
            return reclassified.iloc[0]

    def test_toEqual_deep_equality_diff_is_reclassified_as_assertion_failure(self):
        row = self._row(
            "should do X: Error: expect(received).toEqual(expected) // deep equality\n"
            "- Expected  - 3\n+ Received  + 3"
        )
        self.assertEqual(row["error_category_reclassified"], "jest")
        self.assertEqual(row["error_subcategory_reclassified"], "assertion_failure")
        self.assertEqual(row["reclassification_reason"], "toEqual_deep_equality_diff")

    def test_async_resolved_instead_of_rejected_is_reclassified_as_unexpected_throw(self):
        row = self._row(
            "should throw: Error: expect(received).rejects.toThrow()\n"
            "Received promise resolved instead of rejected"
        )
        self.assertEqual(row["error_subcategory_reclassified"], "unexpected_throw")
        self.assertEqual(row["reclassification_reason"], "async_resolved_instead_of_rejected")

    def test_non_unknown_rows_pass_through_unchanged(self):
        row = self._row("some assertion failure text", subcategory="assertion_failure")
        self.assertEqual(row["error_subcategory_reclassified"], "assertion_failure")
        self.assertEqual(row["reclassification_reason"], "unchanged")

    def test_unmatched_unknown_rows_stay_unknown(self):
        row = self._row("Cannot use spyOn on a primitive value; undefined given")
        self.assertEqual(row["error_subcategory_reclassified"], "unknown")
        self.assertEqual(row["reclassification_reason"], "unchanged")

    def test_reclassification_prefers_raw_artifact_over_truncated_message(self):
        # The identifying text is only in the raw artifact, not the (short,
        # unrelated) stored error_message -- simulating truncation.
        row = self._row(
            message="truncated, no useful signal here",
            raw_text="FAIL x.spec.ts\nError: expect(received).toEqual(expected)\n- Expected  - 1\n+ Received  + 1",
        )
        self.assertEqual(row["error_subcategory_reclassified"], "assertion_failure")

    def test_build_reclassified_error_events_preserves_originals(self):
        df = pd.DataFrame([{
            "error_category": "jest", "error_subcategory": "unknown",
            "error_message": "expect(received).toEqual(expected)\n- Expected  - 1\n+ Received  + 1",
            "raw_artifact_path": "",
        }])
        out = ea.build_reclassified_error_events(df)
        row = out.iloc[0]
        self.assertEqual(row["error_category_original"], "jest")
        self.assertEqual(row["error_subcategory_original"], "unknown")
        self.assertEqual(row["error_subcategory"], "assertion_failure")  # overwritten for analysis
        self.assertEqual(ea.count_reclassified_events(out), 1)


class H2AggregationTests(unittest.TestCase):
    """
    H2 (complexity x model) regression tests: each function belongs to
    exactly one CCM band, model x strategy groups retain the expected
    function set, denominators distinguish attempted/skipped/verified
    explicitly (never silently zero-filled), and results are deterministic.
    """

    def _rows(self) -> list[dict]:
        base = VerifiedEligibleTests()._base_row
        rows = []
        # Two functions per model, one low-CCM (verified) and one
        # high-CCM (one verified, one fully-skipped) -- deliberately
        # unbalanced so denominators must be computed per cell, not assumed.
        for model in ("gemma_4", "qwen_coder_3b"):
            rows.append(base(
                model=model, strategy="zero_shot", function="low", fn_id=f"FN_low_{model}_END",
                ccm=3, fn_statements_pct=90.0, fn_branches_pct=80.0,
            ))
            rows.append(base(
                model=model, strategy="zero_shot", function="high", fn_id=f"FN_high_{model}_END",
                ccm=25, fn_statements_pct=40.0, fn_branches_pct=30.0,
            ))
        # One fully-skipped high-CCM observation for qwen_coder_3b only --
        # must show up as fully_skipped_observations, not as a 0%-coverage
        # verified observation.
        rows.append(base(
            model="qwen_coder_3b", strategy="few_shot", function="high", fn_id="FN_high_qwen_coder_3b_END",
            ccm=25, total_tests=3, passed_tests=0, failed_tests=0, pending_tests=3,
        ))
        return rows

    def _load(self) -> pd.DataFrame:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "results.csv"
            _write_csv(path, self._rows())
            return ea.load_results(path)

    def test_each_function_belongs_to_exactly_one_ccm_band(self):
        df = self._load()
        banded = ea._add_ccm_band(df)
        # ccm=3 -> "1-5" only; ccm=25 -> ">20" only; never both, never NaN.
        for fn_id, group in banded.groupby("fn_id"):
            bands = group["ccm_band"].unique()
            self.assertEqual(len(bands), 1, f"{fn_id} spans more than one band: {bands}")
            self.assertFalse(pd.isna(bands[0]))

    def test_model_strategy_groups_retain_expected_function_set(self):
        df = self._load()
        table = ea.build_h2_coverage_table(df)
        gemma_low = table[(table["model"] == "gemma_4") & (table["ccm_band"] == "1-5")].iloc[0]
        self.assertEqual(gemma_low["attempted_observations"], 1)
        self.assertEqual(gemma_low["verified_observations"], 1)
        self.assertEqual(gemma_low["distinct_functions"], 1)

    def test_fully_skipped_is_never_silently_zero_filled(self):
        df = self._load()
        table = ea.build_h2_coverage_table(df)
        cell = table[(table["model"] == "qwen_coder_3b") & (table["strategy"] == "few_shot") & (table["ccm_band"] == ">20")]
        self.assertEqual(len(cell), 1)
        row = cell.iloc[0]
        self.assertEqual(row["attempted_observations"], 1)
        self.assertEqual(row["fully_skipped_observations"], 1)
        self.assertEqual(row["verified_observations"], 0)
        # Not measured -> NaN, not 0.0.
        self.assertTrue(pd.isna(row["mean_statement_coverage"]))

    def test_no_observations_cell_is_absent_or_zero_not_fabricated(self):
        df = self._load()
        table = ea.build_h2_coverage_table(df)
        # gemma_4/structured was never attempted at all in this synthetic
        # dataset -- if present, must show zero attempted, not a fabricated
        # coverage value.
        cell = table[(table["model"] == "gemma_4") & (table["strategy"] == "structured")]
        if not cell.empty:
            self.assertTrue((cell["attempted_observations"] == 0).all())
            self.assertTrue(cell["mean_statement_coverage"].isna().all())

    def test_aggregation_denominators_are_correct(self):
        df = self._load()
        table = ea.build_h2_coverage_by_model_ccm(df)
        # qwen_coder_3b/>20: 1 verified (zero_shot) + 1 fully-skipped
        # (few_shot, excluded) -- mean must come from the single verified
        # observation only (40.0), not be diluted by the skipped one.
        row = table[(table["model"] == "qwen_coder_3b") & (table["ccm_band"] == ">20")].iloc[0]
        self.assertEqual(row["verified_observations"], 1)
        self.assertAlmostEqual(row["mean_statement_coverage"], 40.0, places=2)

    def test_results_are_deterministic(self):
        df = self._load()
        first = ea.build_h2_coverage_table(df)
        second = ea.build_h2_coverage_table(df)
        pd.testing.assert_frame_equal(first, second)


class H2SmellAggregationTests(unittest.TestCase):
    def test_unmeasurable_observations_excluded_from_rate_not_zero_filled(self):
        rows = [
            {"run_id": "run-TEST", "model": "gemma_4", "strategy": "zero_shot", "module": "a",
             "function": "measured_low", "fn_id": "FN_measured_low_END", "ccm": 2, "range": "low",
             "it_active": 2, "it_skip": 0, "assertion_roulette_count": 2,
             "assertion_roulette_rate": 100.0, "assertion_roulette_tests": "x",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
            {"run_id": "run-TEST", "model": "gemma_4", "strategy": "zero_shot", "module": "a",
             "function": "skipped_high", "fn_id": "FN_skipped_high_END", "ccm": 25, "range": "high",
             "it_active": 0, "it_skip": 3, "assertion_roulette_count": 0,
             "assertion_roulette_rate": 0.0, "assertion_roulette_tests": "",
             "empty_test_count": 0, "empty_test_rate": 0.0, "empty_test_names": ""},
        ]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "smell_results.csv"
            _write_csv(path, rows)
            smell = ea.load_smell_results(path)

        table = ea.build_h2_smell_table(smell)
        low_cell = table[table["ccm_band"] == "1-5"].iloc[0]
        high_cell = table[table["ccm_band"] == ">20"].iloc[0]

        self.assertEqual(low_cell["measurable_observations"], 1)
        self.assertAlmostEqual(low_cell["mean_assertion_roulette_rate"], 100.0, places=2)

        self.assertEqual(high_cell["total_observations"], 1)
        self.assertEqual(high_cell["unmeasurable_observations"], 1)
        self.assertEqual(high_cell["measurable_observations"], 0)
        self.assertTrue(pd.isna(high_cell["mean_assertion_roulette_rate"]))


if __name__ == "__main__":
    unittest.main()
