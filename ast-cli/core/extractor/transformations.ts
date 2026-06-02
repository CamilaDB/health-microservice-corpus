import { MethodDeclaration, SyntaxKind } from "ts-morph";
import { cleanText } from "../utils";
import { DependencyCall, Transformation, TransformationKind } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Kind detection
// ─────────────────────────────────────────────────────────────────────────────

function detectTransformationKind(expression: string): TransformationKind {
  if (expression.includes("new Date")) return "date_conversion";
  if (expression.includes("??")) return "nullish_default";
  if (expression.includes("Number(")) return "number_cast";
  if (expression.includes("Boolean(")) return "boolean_cast";
  return "mapping";
}

// ─────────────────────────────────────────────────────────────────────────────
// Extraction
// Scans ObjectLiteralExpressions inside the method for non-trivial property
// assignments (i.e., where the RHS differs from the field name).
//
// Noise filter: ignores objects that are direct arguments to repository calls
// (find options, where clauses, etc.) — these are query configs, not data
// transformations.
// ─────────────────────────────────────────────────────────────────────────────

const REPO_CALL_PATTERN =
  /\b(findOne|findMany|findAndCount|find|save|create|update|delete|count)\b/;

export function extractTransformations(
  m: MethodDeclaration,
  dependencyCalls: DependencyCall[],
): Transformation[] {
  // Build a set of call-chain texts classified as repository queries/saves
  // so we can skip their argument objects.
  const repoCalls = new Set(
    dependencyCalls
      .filter(
        (c) =>
          c.kind === "query" ||
          c.kind === "repository_save" ||
          c.kind === "repository_create",
      )
      .map((c) => c.method),
  );

  const transformations: Transformation[] = [];

  m.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression).forEach((obj) => {
    // Skip if the object literal is a direct argument to a repo call.
    const parentCall = obj.getFirstAncestorByKind(SyntaxKind.CallExpression);
    if (parentCall) {
      const callText = parentCall.getExpression().getText();
      if (repoCalls.has(callText) || REPO_CALL_PATTERN.test(callText)) return;
    }

    obj.getProperties().forEach((prop) => {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) return;

      const assignment = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
      const init = assignment.getInitializer();
      if (!init) return;

      const expressionText = cleanText(init.getText());

      // Skip trivial identity assignments (field: field)
      if (expressionText === assignment.getName()) return;

      const kind = detectTransformationKind(expressionText);

      transformations.push({
        targetField: assignment.getName(),
        sourceExpression: expressionText,
        kind,
      });
    });
  });

  return transformations;
}
