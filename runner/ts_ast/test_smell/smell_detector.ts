/**
 * Static test smell detector for generated Jest spec files.
 *
 * Analysis scope: ONLY active it() / test() blocks inside describe('FN_..._END')
 * wrappers. it.skip() / xit() blocks are EXCLUDED — they are pipeline artifacts
 * produced by _skip_test_block() when repair is exhausted, not LLM-generated
 * smells. Their count is already captured as pending_tests in results.csv.
 *
 * Detected smells (Van Deursen et al., 2001 / adapted for LLM-generated tests):
 *
 *   1. Assertion Roulette
 *      An active it() contains more than one expect() call and at least one
 *      of them has no custom failure message.  Multiple unexplained assertions
 *      make it impossible to identify which one failed from the output alone.
 *      LLMs commonly produce this when they cannot isolate a single behaviour
 *      per test case.
 *
 *   2. Empty Test
 *      An active it() contains zero expect() calls.  The test always passes
 *      regardless of the implementation — a silent false positive.
 *      LLMs produce this when they generate the test scaffold but fail to
 *      formulate a valid assertion.
 *
 * NOT detected here (tracked elsewhere):
 *   - Ignored Test (it.skip) → pending_tests column in results.csv
 *
 * Output (stdout, one JSON array):
 *   [
 *     {
 *       "fn_id": "FN_searchOrders_END",
 *       "it_active":                  4,   // it() blocks that actually run
 *       "it_skip":                    3,   // it.skip — pipeline metric, informational only
 *       "assertion_roulette_count":   1,
 *       "assertion_roulette_tests":   ["should return filtered results"],
 *       "empty_test_count":           1,
 *       "empty_test_names":           ["should handle edge case"]
 *     },
 *     ...
 *   ]
 *
 * Usage:
 *   npx tsx ts_ast/smell_detector.ts '{"file_path": "path/to/spec.ts"}'
 */

import { Project, SyntaxKind, Node } from "ts-morph";

const payload = JSON.parse(process.argv[2]);
const filePath: string = payload.file_path;

const project = new Project({ skipAddingFilesFromTsConfig: true });
const sourceFile = project.addSourceFileAtPath(filePath);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getLiteralString(node: Node): string {
  return node
    .getText()
    .replace(/^['"`]/, "")
    .replace(/['"`]$/, "");
}

function countExpectCalls(body: Node): number {
  return body.getDescendantsOfKind(SyntaxKind.CallExpression).filter((c) => {
    const expr = c.getExpression().getText();
    // Match expect( at the start of a chain: expect(x).toBe(...)
    return expr === "expect";
  }).length;
}

/**
 * Returns true if the body has >1 expect() and at least one lacks a
 * custom message argument.
 *
 * Jest 27+ supports: expect(value, 'custom message').toXxx()
 * Earlier versions:  no per-expect message (message goes on the matcher).
 * We check the expect() call's argument count — if it has only 1 argument
 * (the value), it has no custom message.
 */
function hasAssertionRoulette(body: Node): boolean {
  const expectCalls = body
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((c) => c.getExpression().getText() === "expect");

  if (expectCalls.length <= 1) return false;

  // At least one expect() with only 1 argument (no custom message) → roulette
  return expectCalls.some((c) => c.getArguments().length < 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Locate FN_..._END wrappers and analyse active it() blocks
// ─────────────────────────────────────────────────────────────────────────────

const FN_WRAPPER_RE = /^FN_.+_END$/;

const ACTIVE_IT = new Set(["it", "test"]);
const SKIPPED_IT = new Set([
  "it.skip",
  "xit",
  "test.skip",
  "it.only",
  "test.only",
]);

const results: object[] = [];

for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
  if (call.getExpression().getText() !== "describe") continue;

  const args = call.getArguments();
  if (args.length < 2) continue;

  const title = getLiteralString(args[0]);
  if (!FN_WRAPPER_RE.test(title)) continue;

  const wrapperBody = args[1];

  const assertionRouletteTests: string[] = [];
  const emptyTestNames: string[] = [];
  let itActive = 0;
  let itSkip = 0;

  for (const itCall of wrapperBody.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  )) {
    const expr = itCall.getExpression().getText();
    const itArgs = itCall.getArguments();
    if (itArgs.length < 1) continue;

    const testTitle = getLiteralString(itArgs[0]);

    if (SKIPPED_IT.has(expr)) {
      // it.skip — pipeline artifact, count for reference only, skip smell checks
      itSkip++;
      continue;
    }

    if (!ACTIVE_IT.has(expr)) continue;

    itActive++;

    if (itArgs.length < 2) {
      // it('name') with no body — treat as empty
      emptyTestNames.push(testTitle);
      continue;
    }

    const itBody = itArgs[1];
    const expectCount = countExpectCalls(itBody);

    // ── Empty Test ────────────────────────────────────────────────────────────
    if (expectCount === 0) {
      emptyTestNames.push(testTitle);
      continue; // empty test cannot also have roulette
    }

    // ── Assertion Roulette ────────────────────────────────────────────────────
    if (hasAssertionRoulette(itBody)) {
      assertionRouletteTests.push(testTitle);
    }
  }

  results.push({
    fn_id: title,
    it_active: itActive,
    it_skip: itSkip, // informational — already in results.csv as pending_tests
    assertion_roulette_count: assertionRouletteTests.length,
    assertion_roulette_tests: assertionRouletteTests,
    empty_test_count: emptyTestNames.length,
    empty_test_names: emptyTestNames,
  });
}

process.stdout.write(JSON.stringify(results) + "\n");
process.exit(0);
