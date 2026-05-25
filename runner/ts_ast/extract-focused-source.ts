import {
  Project,
  SyntaxKind,
  MethodDeclaration,
  ClassDeclaration,
  EnumDeclaration,
  PropertyDeclaration,
  IfStatement,
  Block,
  SourceFile,
  CallExpression,
  Node,
} from "ts-morph";

interface Input {
  filePath: string;
  functionName: string;
}

interface DtoField {
  name: string;
  type: string;
  optional: boolean;
}

interface ExtractedDto {
  name: string;
  fields: DtoField[];
}

interface ExtractedEnum {
  name: string;
  values: string[];
}

interface MethodDependencyUsage {
  method: string;
  accessedProperties: string[];
}

interface ExtractedBranch {
  condition: string;
  calledMethods: string[];
  dependencyUsages?: MethodDependencyUsage[];
  throws?: string;
  returns?: string;
}

interface DependencyCall {
  method: string;

  kind:
    | "validation"
    | "repository_save"
    | "repository_create"
    | "query"
    | "external_service"
    | "mapper"
    | "calculation";

  isAsync: boolean;

  returnUsed: boolean;

  assignedTo?: string;
}

interface Transformation {
  targetField: string;

  sourceExpression: string;

  kind:
    | "date_conversion"
    | "nullish_default"
    | "number_cast"
    | "boolean_cast"
    | "mapping";
}

const input: Input = JSON.parse(process.argv[2]);

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipFileDependencyResolution: true,
});

const sourceFile = project.addSourceFileAtPath(input.filePath);

const classDecl = sourceFile.getClasses()[0];

if (!classDecl) {
  throw new Error("Class not found");
}

const method = classDecl.getMethodOrThrow(input.functionName);

const constructorDecl = classDecl.getConstructors()[0];

// =====================================================
// TYPE CLEANUP
// =====================================================

function cleanType(typeText: string): string {
  return typeText
    .replace(/import\([^)]+\)\./g, "")
    .replace(/"[^"]+"/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// =====================================================
// STRING CLEANUP
// =====================================================

function cleanText(text: string): string {
  return text
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

// =====================================================
// IDENTIFIERS
// =====================================================

const identifiers = new Set<string>();

method.getDescendantsOfKind(SyntaxKind.Identifier).forEach((identifier) => {
  identifiers.add(identifier.getText());
});

constructorDecl?.getParameters().forEach((p) => {
  identifiers.add(p.getName());

  const typeName = cleanType(p.getType().getText());

  identifiers.add(typeName);
});

// =====================================================
// DEPENDENCY METHODS
// =====================================================

const calledMethods = new Set<string>();

method.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
  const expression = call.getExpression();

  if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
    calledMethods.add(expression.getText());
  }
});

// =====================================================
// RELEVANT IMPORTS
// =====================================================

const relevantImports: string[] = [];

const relevantImportPaths = new Set<string>();

for (const imp of sourceFile.getImportDeclarations()) {
  const namedImports = imp.getNamedImports();

  const used = namedImports.some((n) => identifiers.has(n.getName()));

  if (!used) {
    continue;
  }

  relevantImports.push(imp.getText());

  relevantImportPaths.add(imp.getModuleSpecifierValue());
}

// =====================================================
// ENUM EXTRACTION
// =====================================================

function extractEnum(en: EnumDeclaration): ExtractedEnum {
  return {
    name: en.getName(),

    values: en.getMembers().map((m) => m.getName()),
  };
}

const enumMap = new Map<string, ExtractedEnum>();

function registerEnum(en: EnumDeclaration) {
  const extracted = extractEnum(en);

  enumMap.set(extracted.name, extracted);
}

// =====================================================
// DTO EXTRACTION
// =====================================================

function extractDto(cls: ClassDeclaration): ExtractedDto {
  const fields: DtoField[] = [];

  cls.getProperties().forEach((property: PropertyDeclaration) => {
    const typeText = cleanType(property.getType().getText());

    fields.push({
      name: property.getName(),

      type: typeText,

      optional: property.hasQuestionToken(),
    });

    const typeSymbol = property.getType().getSymbol();

    if (typeSymbol) {
      const declarations = typeSymbol.getDeclarations();

      declarations.forEach((decl) => {
        if (decl.getKind() === SyntaxKind.EnumDeclaration) {
          registerEnum(decl as EnumDeclaration);
        }
      });
    }
  });

  return {
    name: cls.getName() ?? "UnknownDto",
    fields,
  };
}

// =====================================================
// METHOD SIGNATURE
// =====================================================

function methodSignature(method: MethodDeclaration): string {
  const params = method
    .getParameters()
    .map((p) => {
      return `${p.getName()}: ${cleanType(p.getType().getText())}`;
    })
    .join(", ");

  return `${method.getName()}(${params}): ${cleanType(
    method.getReturnType().getText(),
  )}`;
}

// =====================================================
// RELATED METHODS
// =====================================================

const relatedMethods = new Set<string>();

calledMethods.forEach((call) => {
  const parts = call.split(".");

  const methodName = parts[parts.length - 1];

  const internalMethod = classDecl.getMethod(methodName);

  if (internalMethod && internalMethod.getName() !== method.getName()) {
    relatedMethods.add(methodSignature(internalMethod));
  }
});

// =====================================================
// DTO / ENUM COLLECTION
// =====================================================

const relevantDtos: ExtractedDto[] = [];

function resolveImportSourceFile(
  moduleSpecifier: string,
  sourceFile: SourceFile,
): SourceFile | undefined {
  const direct = sourceFile
    .getImportDeclarations()
    .find((i) => i.getModuleSpecifierValue() === moduleSpecifier)
    ?.getModuleSpecifierSourceFile();

  if (direct) {
    return direct;
  }

  const normalized = moduleSpecifier.replace(/\\/g, "/");

  const candidates = [normalized + ".ts", normalized + "/index.ts"];

  for (const candidate of candidates) {
    const found = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().replace(/\\/g, "/").endsWith(candidate));

    if (found) {
      return found;
    }
  }

  return undefined;
}

for (const importPath of relevantImportPaths) {
  if (!importPath.includes("dto") && !importPath.includes("enum")) {
    continue;
  }

  try {
    const importedFile = resolveImportSourceFile(importPath, sourceFile);

    if (!importedFile) {
      continue;
    }

    importedFile.getClasses().forEach((cls) => {
      const name = cls.getName();

      if (name && identifiers.has(name)) {
        relevantDtos.push(extractDto(cls));
      }
    });

    importedFile.getEnums().forEach((en) => {
      const name = en.getName();

      if (name && (identifiers.has(name) || importPath.includes("enum"))) {
        registerEnum(en);
      }
    });
  } catch {}
}

const relevantEnums = Array.from(enumMap.values());

// =====================================================
// BUSINESS RULES
// =====================================================

const businessRules = new Set<string>();

method.getDescendantsOfKind(SyntaxKind.ThrowStatement).forEach((throwStmt) => {
  const text = throwStmt.getText();

  const match = text.match(/['"`](.*?)['"`]/);

  if (match?.[1]) {
    businessRules.add(cleanText(match[1]));
  }
});

// =====================================================
// BRANCH EXTRACTION
// =====================================================

function extractCalledMethodsFromNode(node: Block | IfStatement): string[] {
  const methods = new Set<string>();

  node.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expression = call.getExpression();

    if (expression.getKind() === SyntaxKind.PropertyAccessExpression) {
      methods.add(expression.getText());
    }
  });

  return Array.from(methods);
}

const branches: ExtractedBranch[] = [];

method.getDescendantsOfKind(SyntaxKind.IfStatement).forEach((ifStmt) => {
  const condition = cleanText(ifStmt.getExpression().getText());

  const thenStatement = ifStmt.getThenStatement();

  const branch: ExtractedBranch = {
    condition,

    calledMethods: extractCalledMethodsFromNode(thenStatement as Block),

    dependencyUsages: extractDependencyUsagesFromNode(thenStatement),
  };

  const throwStmt = thenStatement.getFirstDescendantByKind(
    SyntaxKind.ThrowStatement,
  );

  if (throwStmt) {
    const throwText = throwStmt.getText();

    const throwMatch = throwText.match(/new\s+(\w+Exception)/);

    if (throwMatch?.[1]) {
      branch.throws = throwMatch[1];
    }
  }

  const returnStmt = thenStatement.getFirstDescendantByKind(
    SyntaxKind.ReturnStatement,
  );

  if (returnStmt) {
    branch.returns = cleanText(returnStmt.getText());
  }

  branches.push(branch);

  // ==========================================
  // ELSE BRANCH
  // ==========================================

  const elseStatement = ifStmt.getElseStatement();

  if (elseStatement) {
    branches.push({
      condition: `else of (${condition})`,

      calledMethods: extractCalledMethodsFromNode(elseStatement as Block),

      dependencyUsages: extractDependencyUsagesFromNode(elseStatement),
    });
  }
});

// =====================================================
// DEPENDENCY USAGES
// =====================================================

function extractDependencyUsages(
  method: MethodDeclaration,
): MethodDependencyUsage[] {
  const usages = new Map<string, Set<string>>();

  const variableOrigins = new Map<string, string>();

  method
    .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
    .forEach((decl) => {
      const initializer = decl.getInitializer();

      if (!initializer) {
        return;
      }

      let callExpr: CallExpression | undefined;

      if (initializer.getKind() === SyntaxKind.AwaitExpression) {
        const awaitExpr = initializer.asKindOrThrow(SyntaxKind.AwaitExpression);

        const expr = awaitExpr.getExpression();

        if (expr.getKind() === SyntaxKind.CallExpression) {
          callExpr = expr as CallExpression;
        }
      }

      if (initializer.getKind() === SyntaxKind.CallExpression) {
        callExpr = initializer as CallExpression;
      }

      if (!callExpr) {
        return;
      }

      const expr = callExpr.getExpression();

      if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) {
        return;
      }

      variableOrigins.set(decl.getName(), expr.getText());
    });

  method
    .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
    .forEach((propAccess) => {
      const expr = propAccess.getExpression();

      const variableName = expr.getText();

      const origin = variableOrigins.get(variableName);

      if (!origin) {
        return;
      }

      if (!usages.has(origin)) {
        usages.set(origin, new Set());
      }

      usages.get(origin)!.add(propAccess.getName());
    });

  return Array.from(usages.entries()).map(([method, props]) => ({
    method,
    accessedProperties: Array.from(props),
  }));
}

function extractDependencyUsagesFromNode(node: Node): MethodDependencyUsage[] {
  const fakeMethod = node.asKind(SyntaxKind.Block);

  if (!fakeMethod) {
    return [];
  }

  const usages = new Map<string, Set<string>>();

  fakeMethod
    .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
    .forEach((decl) => {
      const initializer = decl.getInitializer();

      if (!initializer) return;

      let callExpr: CallExpression | undefined;

      if (initializer.getKind() === SyntaxKind.AwaitExpression) {
        const awaitExpr = initializer.asKindOrThrow(SyntaxKind.AwaitExpression);

        const expr = awaitExpr.getExpression();

        if (expr.getKind() === SyntaxKind.CallExpression) {
          callExpr = expr as CallExpression;
        }
      }

      if (initializer.getKind() === SyntaxKind.CallExpression) {
        callExpr = initializer as CallExpression;
      }

      if (!callExpr) return;

      const expr = callExpr.getExpression();

      if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) {
        return;
      }

      const methodName = expr.getText();

      fakeMethod
        .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
        .forEach((prop) => {
          if (prop.getExpression().getText() === decl.getName()) {
            if (!usages.has(methodName)) {
              usages.set(methodName, new Set());
            }

            usages.get(methodName)!.add(prop.getName());
          }
        });
    });

  return Array.from(usages.entries()).map(([method, props]) => ({
    method,
    accessedProperties: Array.from(props),
  }));
}

const dependencyUsages = extractDependencyUsages(method);

// =====================================================
// DEPENDENCY CALLS
// =====================================================

function classifyDependencyCall(methodName: string): DependencyCall["kind"] {
  const lower = methodName.toLowerCase();

  if (
    lower.includes("validate") ||
    lower.includes("verify") ||
    lower.includes("ensure")
  ) {
    return "validation";
  }

  if (lower.includes(".save") || lower.includes(".update")) {
    return "repository_save";
  }

  if (lower.includes(".create") || lower.includes(".insert")) {
    return "repository_create";
  }

  if (
    lower.includes("find") ||
    lower.includes("search") ||
    lower.includes("get") ||
    lower.includes("list")
  ) {
    return "query";
  }

  if (
    lower.includes("map") ||
    lower.includes("transform") ||
    lower.includes("build")
  ) {
    return "mapper";
  }

  if (lower.includes("calculate") || lower.includes("compute")) {
    return "calculation";
  }

  return "external_service";
}

function extractDependencyCalls(method: MethodDeclaration): DependencyCall[] {
  const calls: DependencyCall[] = [];

  method.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expression = call.getExpression();

    if (expression.getKind() !== SyntaxKind.PropertyAccessExpression) {
      return;
    }

    const methodName = expression.getText();

    if (
      methodName.startsWith("console.") ||
      methodName.startsWith("this.logger.")
    ) {
      return;
    }

    const parent = call.getParent();

    const isAwaited = parent?.getKind() === SyntaxKind.AwaitExpression;

    let assignedTo: string | undefined;

    let returnUsed = false;

    const variableDecl = call.getFirstAncestorByKind(
      SyntaxKind.VariableDeclaration,
    );

    if (variableDecl) {
      assignedTo = variableDecl.getName();
      returnUsed = true;
    }

    if (call.getFirstAncestorByKind(SyntaxKind.ReturnStatement)) {
      returnUsed = true;
    }

    calls.push({
      method: methodName,

      kind: classifyDependencyCall(methodName),

      isAsync: isAwaited,

      returnUsed,

      assignedTo,
    });
  });

  return calls;
}

const dependencyCalls = extractDependencyCalls(method);

// =====================================================
// TRANSFORMATIONS
// =====================================================

function detectTransformationKind(expression: string): Transformation["kind"] {
  if (expression.includes("new Date")) {
    return "date_conversion";
  }

  if (expression.includes("??")) {
    return "nullish_default";
  }

  if (expression.includes("Number(")) {
    return "number_cast";
  }

  if (expression.includes("Boolean(")) {
    return "boolean_cast";
  }

  if (expression.includes("...")) {
    return "mapping";
  }
  if (expression.includes(".map(")) {
    return "mapping";
  }

  return "mapping";
}

function extractTransformations(method: MethodDeclaration): Transformation[] {
  const transformations: Transformation[] = [];

  method
    .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
    .forEach((obj) => {
      obj.getProperties().forEach((prop) => {
        if (prop.getKind() !== SyntaxKind.PropertyAssignment) {
          return;
        }

        const assignment = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);

        const initializer = assignment.getInitializer();

        if (!initializer) {
          return;
        }

        const expressionText = cleanText(initializer.getText());

        const kind = detectTransformationKind(expressionText);

        if (kind === "mapping" && expressionText === assignment.getName()) {
          return;
        }

        transformations.push({
          targetField: assignment.getName(),

          sourceExpression: expressionText,

          kind,
        });
      });
    });

  return transformations;
}

const transformations = extractTransformations(method);

// =====================================================
// METHOD SOURCE
// =====================================================

const methodSource = cleanText(method.getText())
  .replace(/\/\/.*$/gm, "")
  .replace(/\n\s*\n/g, "\n");

// =====================================================
// OUTPUT
// =====================================================

const output = {
  functionName: method.getName(),

  isAsync: method.isAsync(),

  methodSignature: methodSignature(method),

  constructorDependencies:
    constructorDecl?.getParameters().map((p) => ({
      name: p.getName(),

      type: cleanType(p.getType().getText()),
    })) ?? [],

  calledMethods: Array.from(calledMethods),

  dependencyCalls,

  transformations,

  relatedMethods: Array.from(relatedMethods),

  businessRules: Array.from(businessRules),

  relevantImports,

  methodSource,

  relevantDtos,

  relevantEnums,

  branches,

  dependencyUsages,
};

console.log(JSON.stringify(output, null, 2));
