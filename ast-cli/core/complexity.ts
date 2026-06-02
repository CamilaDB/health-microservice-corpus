import { SyntaxKind, Node } from "ts-morph";

const BRANCH_KINDS = new Set([
  SyntaxKind.IfStatement,
  SyntaxKind.ConditionalExpression,
  SyntaxKind.CaseClause,
  SyntaxKind.CatchClause,
  SyntaxKind.WhileStatement,
  SyntaxKind.ForStatement,
  SyntaxKind.ForInStatement,
  SyntaxKind.ForOfStatement,
  SyntaxKind.DoStatement,
  SyntaxKind.AmpersandAmpersandToken,
  SyntaxKind.BarBarToken,
  SyntaxKind.QuestionQuestionToken,
]);

export function calcCCM(node: Node): number {
  let ccm = 1;

  node.forEachDescendant((child) => {
    if (BRANCH_KINDS.has(child.getKind())) {
      ccm++;
    }
  });

  return ccm;
}
