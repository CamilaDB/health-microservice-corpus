import { CallExpression, MethodDeclaration, Node, SyntaxKind } from "ts-morph";
import {
  DependencyCall,
  DependencyCallKind,
  MethodDependencyUsage,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Classification
// Operates only on the last segment of the call chain to avoid false matches
// like "this.notSaveable.ensureSaved" → repository_save.
// ─────────────────────────────────────────────────────────────────────────────

export function classifyDependencyCall(
  fullMethodName: string,
): DependencyCallKind {
  const last = (
    fullMethodName.split(".").pop() ?? fullMethodName
  ).toLowerCase();

  if (
    last.includes("validate") ||
    last.includes("verify") ||
    last.includes("ensure")
  )
    return "validation";
  if (last === "save" || last === "update") return "repository_save";
  if (last === "create" || last === "insert") return "repository_create";
  if (
    last.startsWith("find") ||
    last.startsWith("search") ||
    last.startsWith("get") ||
    last.startsWith("list")
  )
    return "query";
  if (
    last.startsWith("map") ||
    last.startsWith("transform") ||
    last.startsWith("build")
  )
    return "mapper";
  if (last.startsWith("calculate") || last.startsWith("compute"))
    return "calculation";

  return "external_service";
}

// ─────────────────────────────────────────────────────────────────────────────
// Dependency calls
// Records every external call (property-access) in the method, excluding
// console.* and logger.* noise.
// ─────────────────────────────────────────────────────────────────────────────

export function extractDependencyCalls(m: MethodDeclaration): DependencyCall[] {
  const calls: DependencyCall[] = [];

  m.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expr = call.getExpression();
    if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) return;

    const methodName = expr.getText();
    if (
      methodName.startsWith("console.") ||
      methodName.startsWith("this.logger.")
    )
      return;

    // Only calls rooted at `this` are candidate dependency/self calls (a
    // constructor-injected dependency, or another method on the class under
    // test). A call on a local variable, DTO parameter, or a JS builtin
    // (e.g. `Object.assign(...)`, `dto.email.toLowerCase()`,
    // `validTransitions[status].includes(...)`, `Math.floor(...)`) is not a
    // dependency by any definition used elsewhere in this codebase
    // (_fmt_available_mocks and extractRelatedMethods both filter to
    // `this.`-rooted chains) and must not be surfaced as one — the prompt's
    // DEPENDENCY_CALLS section instructs the model to mock every entry here,
    // which is only valid for genuine dependency/self calls.
    if (!methodName.startsWith("this.")) return;

    const isAwaited =
      call.getParent()?.getKind() === SyntaxKind.AwaitExpression;
    // Calls returned directly from an async service method are still
    // asynchronous even without an `await` expression (for example,
    // `return repository.save(entity)`).  Prompt guidance uses this flag to
    // select mockResolvedValueOnce versus mockReturnValueOnce.
    const returnsPromise = call.getReturnType().getText().includes("Promise<");

    let assignedTo: string | undefined;
    let returnUsed = false;

    const varDecl = call.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
    if (varDecl) {
      assignedTo = varDecl.getName();
      returnUsed = true;
    }

    if (call.getFirstAncestorByKind(SyntaxKind.ReturnStatement)) {
      returnUsed = true;
    }

    calls.push({
      method: methodName,
      kind: classifyDependencyCall(methodName),
      isAsync: isAwaited || returnsPromise,
      returnUsed,
      assignedTo,
    });
  });

  return calls;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dependency usages
// Shared helper that works on any Node — used for both full-method analysis
// and per-branch analysis. Builds a map:
//   "origin call chain" → "properties accessed on its return value"
//
// Note: calling this for the full method and for each branch is intentionally
// redundant for the full-method view but gives branch-level granularity.
// ─────────────────────────────────────────────────────────────────────────────

export function extractDependencyUsagesFromNode(
  node: Node,
): MethodDependencyUsage[] {
  const usages = new Map<string, Set<string>>();

  // variable name → call chain that produced it (e.g. "patient" → "this.patientRepo.findOne")
  const variableOrigins = new Map<string, string>();

  node.getDescendantsOfKind(SyntaxKind.VariableDeclaration).forEach((decl) => {
    const init = decl.getInitializer();
    if (!init) return;

    let callExpr: CallExpression | undefined;

    if (init.getKind() === SyntaxKind.AwaitExpression) {
      const inner = init
        .asKindOrThrow(SyntaxKind.AwaitExpression)
        .getExpression();
      if (inner.getKind() === SyntaxKind.CallExpression)
        callExpr = inner as CallExpression;
    } else if (init.getKind() === SyntaxKind.CallExpression) {
      callExpr = init as CallExpression;
    }

    if (!callExpr) return;
    const expr = callExpr.getExpression();
    if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) return;

    variableOrigins.set(decl.getName(), expr.getText());
  });

  node
    .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .forEach((propAccess) => {
      const origin = variableOrigins.get(propAccess.getExpression().getText());
      if (!origin) return;

      if (!usages.has(origin)) usages.set(origin, new Set());
      usages.get(origin)!.add(propAccess.getName());
    });

  return Array.from(usages.entries()).map(([method, props]) => ({
    method,
    accessedProperties: Array.from(props),
  }));
}
