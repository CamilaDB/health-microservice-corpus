import {
  ClassDeclaration,
  MethodDeclaration,
  Project,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import { cleanType, cleanText } from "../utils";
import { FunctionContext, RelevantImport } from "./types";
import {
  methodSignatureText,
  extractJsDoc,
  extractBusinessRules,
  extractRelatedMethods,
} from "./signatures";
import { extractBranches } from "./branches";
import {
  extractDependencyCalls,
  extractDependencyUsagesFromNode,
} from "./dependencies";
import { extractTransformations } from "./transformations";
import { collectDtosAndEnums } from "./dtos";

export * from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Identifier collection
// Collects type-level identifiers only — named import names and constructor
// parameter type names. This avoids matching local variable names against
// import names, which caused false positives in the original script.
// ─────────────────────────────────────────────────────────────────────────────

function collectTypeIdentifiers(
  m: MethodDeclaration,
  constructorDecl:
    | ReturnType<ClassDeclaration["getConstructors"]>[0]
    | undefined,
): Set<string> {
  const ids = new Set<string>();

  // Parameter types of the target method
  m.getParameters().forEach((p) => {
    ids.add(cleanType(p.getType().getText()));
  });

  // Return type
  ids.add(cleanType(m.getReturnType().getText()));

  // Constructor parameter types (dependency injection tokens)
  constructorDecl?.getParameters().forEach((p) => {
    ids.add(p.getName());
    ids.add(cleanType(p.getType().getText()));
  });

  // All identifiers in the method body — needed to resolve DTO names used as
  // `new Dto()` or `dto instanceof Dto` patterns.
  m.getDescendantsOfKind(SyntaxKind.Identifier).forEach((id) => {
    ids.add(id.getText());
  });

  return ids;
}

// ─────────────────────────────────────────────────────────────────────────────
// Relevant imports
// Filters to imports whose named bindings appear in identifiers.
// ─────────────────────────────────────────────────────────────────────────────

function collectRelevantImports(
  identifiers: Set<string>,
  sourceFile: SourceFile,
): {
  imports: RelevantImport[];
  paths: Set<string>;
} {
  const imports: RelevantImport[] = [];
  const paths = new Set<string>();

  for (const imp of sourceFile.getImportDeclarations()) {
    const usedSymbols = imp
      .getNamedImports()
      .map((n) => n.getName())
      .filter((name) => identifiers.has(name));

    if (usedSymbols.length === 0) continue;

    imports.push(
      ...usedSymbols.map((symbol) => ({
        symbol,
        importPath: imp.getModuleSpecifierValue(),
      })),
    );

    paths.add(imp.getModuleSpecifierValue());
  }

  return { imports, paths };
}

// ─────────────────────────────────────────────────────────────────────────────
// All property-access call chains in the method
// ─────────────────────────────────────────────────────────────────────────────

function collectCalledMethods(m: MethodDeclaration): Set<string> {
  const methods = new Set<string>();

  m.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expr = call.getExpression();
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
      methods.add(expr.getText());
    }
  });

  return methods;
}

// ─────────────────────────────────────────────────────────────────────────────
// Method source
// Strips inline comments and collapses excess blank lines.
// JSDoc is preserved separately (see extractJsDoc).
// ─────────────────────────────────────────────────────────────────────────────

function cleanMethodSource(m: MethodDeclaration): string {
  return cleanText(m.getText())
    .replace(/\/\/.*$/gm, "") // inline comments
    .replace(/\n\s*\n/g, "\n"); // excess blank lines
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts a rich structural context from a single method declaration.
 * All sub-analyses (branches, deps, DTOs, …) are performed in-memory against
 * the already-parsed ts-morph nodes — no file I/O, no subprocess.
 */
export function extractFunctionContext(
  method: MethodDeclaration,
  classDecl: ClassDeclaration,
  sourceFile: SourceFile,
  project: Project,
): FunctionContext {
  const constructorDecl = classDecl.getConstructors()[0];

  // Phase 1 — identifiers & imports
  const identifiers = collectTypeIdentifiers(method, constructorDecl);
  const { imports: relevantImports, paths: relevantImportPaths } =
    collectRelevantImports(identifiers, sourceFile);

  // Phase 2 — call graph
  const calledMethods = collectCalledMethods(method);

  // Phase 3 — dependency calls & full-method usages
  const dependencyCalls = extractDependencyCalls(method);
  const dependencyUsages = extractDependencyUsagesFromNode(method);

  // Phase 4 — branches (uses branch-level dependency usages internally)
  const branches = extractBranches(method);

  // Phase 5 — transformations (aware of repo calls to filter noise)
  const transformations = extractTransformations(method, dependencyCalls);

  // Phase 6 — DTOs, interfaces, enums
  const { dtos: relevantDtos, enums: relevantEnums } = collectDtosAndEnums(
    relevantImportPaths,
    identifiers,
    sourceFile,
    project,
  );

  // Phase 7 — signatures, rules, related methods
  const relatedMethods = extractRelatedMethods(
    method,
    classDecl,
    calledMethods,
  );
  const businessRules = extractBusinessRules(method);
  const jsDoc = extractJsDoc(method);

  return {
    functionName: method.getName(),
    isAsync: method.isAsync(),
    methodSignature: methodSignatureText(method),
    methodSource: cleanMethodSource(method),
    ...(jsDoc ? { jsDoc } : {}),
    constructorDependencies:
      constructorDecl?.getParameters().map((p) => ({
        name: p.getName(),
        type: cleanType(p.getType().getText()),
      })) ?? [],
    dependencyCalls,
    transformations,
    calledMethods: Array.from(calledMethods),
    relatedMethods,
    businessRules,
    branches,
    dependencyUsages,
    relevantImports,
    relevantDtos,
    relevantEnums,
  };
}
