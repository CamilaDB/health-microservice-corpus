"""
Function-level mutation mapping (map_mutants_to_functions) -- pre-rerun
hardening pass.

Uses small, synthetic, Stryker-report-shaped JSON only (never the real
experiments/tmp/stryker/*.json files), so these tests are fast,
deterministic, and independent of any completed/frozen experiment run.
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from execution.stryker_runner import (
    _aggregate_module_metrics,
    map_mutants_to_functions,
)


def _loc(start_line, end_line):
    return {"start": {"line": start_line, "column": 1}, "end": {"line": end_line, "column": 1}}


def _module_functions():
    # Mirrors the real corpus shape: two target functions with disjoint,
    # non-overlapping line ranges, and a gap (11-19) belonging to neither
    # (e.g. a constructor) to exercise the "unmapped" path deliberately.
    return [
        {"fn_id": "FN_low_END", "name": "low", "line": 1, "end_line": 10, "ccm": 2, "range": "low"},
        {"fn_id": "FN_high_END", "name": "high", "line": 20, "end_line": 40, "ccm": 15, "range": "high"},
    ]


def _report(mutants, tests):
    return {
        "files": {
            "src/module/thing.service.ts": {"mutants": mutants},
        },
        "testFiles": {
            "src/module/thing.service.spec.ts": {"tests": tests},
        },
    }


class MutantToFunctionMappingTests(unittest.TestCase):
    def test_clean_mapping_every_mutant_belongs_to_exactly_one_function(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t0"]},
            {"id": "1", "status": "Survived", "location": _loc(25, 30)},
        ]
        tests = [{"id": "t0", "name": "Service FN_low_END low should work"}]
        data = _report(mutants, tests)

        results = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())
        by_id = {r["fn_id"]: r for r in results}

        self.assertEqual(by_id["FN_low_END"]["mutants_total"], 1)
        self.assertEqual(by_id["FN_low_END"]["mutants_killed"], 1)
        self.assertEqual(by_id["FN_high_END"]["mutants_total"], 1)
        self.assertEqual(by_id["FN_high_END"]["mutants_survived"], 1)
        self.assertEqual(by_id["FN_low_END"]["mutants_unmapped_in_module"], 0)

    def test_mutant_outside_every_target_function_is_unmapped_not_fabricated(self):
        # location 12-15 falls in the gap between the two functions
        # (constructor/shared code) -- must not be attributed to either.
        mutants = [{"id": "0", "status": "Survived", "location": _loc(12, 15)}]
        data = _report(mutants, tests=[])

        results = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())
        for r in results:
            self.assertEqual(r["mutants_total"], 0)
            self.assertEqual(r["mutants_unmapped_in_module"], 1)

    def test_killed_by_own_tests_vs_other_function_tests_distinguished(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t_low"]},
            {"id": "1", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t_high"]},
        ]
        tests = [
            {"id": "t_low", "name": "Service FN_low_END low should work"},
            {"id": "t_high", "name": "Service FN_high_END high calls low internally"},
        ]
        data = _report(mutants, tests)

        results = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())
        low = next(r for r in results if r["fn_id"] == "FN_low_END")

        self.assertEqual(low["mutants_killed"], 2)
        self.assertEqual(low["mutants_killed_by_own_tests"], 1)
        self.assertEqual(low["mutants_killed_by_other_function_tests"], 1)

    def test_killed_by_multiple_tests_counts_as_own_if_any_test_is_own(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t_high", "t_low"]},
        ]
        tests = [
            {"id": "t_low", "name": "Service FN_low_END low should work"},
            {"id": "t_high", "name": "Service FN_high_END high calls low internally"},
        ]
        results = map_mutants_to_functions(_report(mutants, tests), "src/module/thing.service.ts", _module_functions())
        low = next(r for r in results if r["fn_id"] == "FN_low_END")
        self.assertEqual(low["mutants_killed_by_own_tests"], 1)
        self.assertEqual(low["mutants_killed_by_other_function_tests"], 0)

    def test_all_stryker_statuses_are_bucketed(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t0"]},
            {"id": "1", "status": "Survived", "location": _loc(3, 5)},
            {"id": "2", "status": "NoCoverage", "location": _loc(3, 5)},
            {"id": "3", "status": "Timeout", "location": _loc(3, 5)},
            {"id": "4", "status": "CompileError", "location": _loc(3, 5)},
        ]
        tests = [{"id": "t0", "name": "Service FN_low_END low should work"}]
        results = map_mutants_to_functions(_report(mutants, tests), "src/module/thing.service.ts", _module_functions())
        low = next(r for r in results if r["fn_id"] == "FN_low_END")
        self.assertEqual(low["mutants_total"], 5)
        self.assertEqual(low["mutants_killed"], 1)
        self.assertEqual(low["mutants_survived"], 1)
        self.assertEqual(low["mutants_no_coverage"], 1)
        self.assertEqual(low["mutants_timeout"], 1)
        self.assertEqual(low["mutants_compile_error"], 1)

    def test_sum_of_function_level_totals_equals_module_level_total(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t0"]},
            {"id": "1", "status": "Survived", "location": _loc(25, 30)},
            {"id": "2", "status": "NoCoverage", "location": _loc(12, 15)},  # unmapped
        ]
        tests = [{"id": "t0", "name": "Service FN_low_END low should work"}]
        data = _report(mutants, tests)

        module_metrics = _aggregate_module_metrics(data, "src/module/thing.service.ts")
        function_results = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())

        mapped_total = sum(r["mutants_total"] for r in function_results)
        unmapped = function_results[0]["mutants_unmapped_in_module"]
        self.assertEqual(mapped_total + unmapped, module_metrics["mutants_total"])
        self.assertEqual(
            sum(r["mutants_killed"] for r in function_results),
            module_metrics["mutants_killed"],
        )

    def test_function_with_zero_mutants_is_not_fabricated(self):
        # Only the "high" function's range has any mutants at all.
        mutants = [{"id": "0", "status": "Survived", "location": _loc(25, 30)}]
        results = map_mutants_to_functions(_report(mutants, tests=[]), "src/module/thing.service.ts", _module_functions())
        low = next(r for r in results if r["fn_id"] == "FN_low_END")
        self.assertEqual(low["mutants_total"], 0)
        self.assertEqual(low["mutants_killed"], 0)
        self.assertEqual(low["mutants_survived"], 0)

    def test_missing_report_data_returns_empty_list_not_a_crash(self):
        self.assertEqual(map_mutants_to_functions(None, "src/module/thing.service.ts", _module_functions()), [])

    def test_no_target_functions_returns_empty_list(self):
        mutants = [{"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": []}]
        self.assertEqual(map_mutants_to_functions(_report(mutants, []), "src/module/thing.service.ts", []), [])

    def test_deterministic(self):
        mutants = [
            {"id": "0", "status": "Killed", "location": _loc(3, 5), "killedBy": ["t0"]},
            {"id": "1", "status": "Survived", "location": _loc(25, 30)},
        ]
        tests = [{"id": "t0", "name": "Service FN_low_END low should work"}]
        data = _report(mutants, tests)
        first = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())
        second = map_mutants_to_functions(data, "src/module/thing.service.ts", _module_functions())
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
