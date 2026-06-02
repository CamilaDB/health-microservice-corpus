import { MethodDeclaration, Node, SyntaxKind } from "ts-morph";
import { cleanText } from "../utils";
import { ExtractedBranch } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — work on any Node so they can be reused for sub-trees (branches)
// ─────────────────────────────────────────────────────────────────────────────

export function extractCalledMethodsFromNode(node: Node): string[] {
  const methods = new Set<string>();

  node.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expr = call.getExpression();
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
      methods.add(expr.getText());
    }
  });

  return Array.from(methods);
}

// ─────────────────────────────────────────────────────────────────────────────
// Branch extraction
// For each if/else, records condition, called methods, throws, and returns.
// ─────────────────────────────────────────────────────────────────────────────

export function extractBranches(m: MethodDeclaration): ExtractedBranch[] {
  const branches: ExtractedBranch[] = [];

  m.getDescendantsOfKind(SyntaxKind.IfStatement).forEach((ifStmt) => {
    const condition = cleanText(ifStmt.getExpression().getText());
    const then = ifStmt.getThenStatement();

    const branch: ExtractedBranch = {
      condition,
      calledMethods: extractCalledMethodsFromNode(then),
    };

    // throw
    const throwStmt = then.getFirstDescendantByKind(SyntaxKind.ThrowStatement);
    if (throwStmt) {
      const match = throwStmt.getText().match(/new\s+(\w+(?:Exception|Error))/);
      if (match?.[1]) branch.throws = match[1];
    }

    // return
    const returnStmt = then.getFirstDescendantByKind(
      SyntaxKind.ReturnStatement,
    );
    if (returnStmt) branch.returns = cleanText(returnStmt.getText());

    branches.push(branch);

    // else / else-if — use the node directly (not cast to Block) so that
    // else-if chains are traversed correctly regardless of shape.
    const elseStmt = ifStmt.getElseStatement();
    if (elseStmt) {
      branches.push({
        condition: `else of (${condition})`,
        calledMethods: extractCalledMethodsFromNode(elseStmt),
      });
    }
  });

  return branches;
}
