import { ClassDeclaration, MethodDeclaration, SyntaxKind } from "ts-morph";
import { cleanType, cleanText } from "../utils";

// ─────────────────────────────────────────────────────────────────────────────
// Method signature
// ─────────────────────────────────────────────────────────────────────────────

export function methodSignatureText(m: MethodDeclaration): string {
  const params = m
    .getParameters()
    .map((p) => `${p.getName()}: ${cleanType(p.getType().getText())}`)
    .join(", ");
  return `${m.getName()}(${params}): ${cleanType(m.getReturnType().getText())}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JSDoc
// Kept as a separate field so prompt templates can decide whether to include it.
// ─────────────────────────────────────────────────────────────────────────────

export function extractJsDoc(m: MethodDeclaration): string | undefined {
  const docs = m.getJsDocs();
  if (!docs.length) return undefined;
  return (
    docs
      .map((d) => d.getText())
      .join("\n")
      .trim() || undefined
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Business rules
// Extracts human-readable messages from throw statements.
// Covers: single-quoted, double-quoted, and template literals.
// ─────────────────────────────────────────────────────────────────────────────

export function extractBusinessRules(m: MethodDeclaration): string[] {
  const rules = new Set<string>();

  m.getDescendantsOfKind(SyntaxKind.ThrowStatement).forEach((throwStmt) => {
    const text = throwStmt.getText();

    const quoted = text.match(/['"]([^'"]{3,})['"]/);
    if (quoted?.[1]) {
      rules.add(cleanText(quoted[1]));
      return;
    }

    const template = text.match(/`([^`]+)`/);
    if (template?.[1]) {
      const cleaned = template[1].replace(/\$\{[^}]+\}/g, "<value>").trim();
      rules.add(cleanText(cleaned));
    }
  });

  return Array.from(rules);
}

// ─────────────────────────────────────────────────────────────────────────────
// Related methods
// Only methods called via `this.methodName()` on the same class — avoids
// false positives from external dependencies that share a method name.
// ─────────────────────────────────────────────────────────────────────────────

export function extractRelatedMethods(
  m: MethodDeclaration,
  classDecl: ClassDeclaration,
  calledMethods: Set<string>,
): string[] {
  const related = new Set<string>();

  calledMethods.forEach((call) => {
    const parts = call.split(".");
    if (parts[0] !== "this") return;

    const methodName = parts[parts.length - 1];
    const internal = classDecl.getMethod(methodName);

    if (internal && internal.getName() !== m.getName()) {
      related.add(methodSignatureText(internal));
    }
  });

  return Array.from(related);
}
