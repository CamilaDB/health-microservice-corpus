import path from "path";
import fs from "fs";

import {
  Project,
  SourceFile,
  ClassDeclaration,
  ConstructorDeclaration,
  EnumDeclaration,
  Scope,
} from "ts-morph";

interface Input {
  filePath: string;
  outputPath?: string;
}

interface DependencyMethod {
  name: string;
  isAsync: boolean;
}

interface DependencyInfo {
  name: string;
  importPath: string;
  variableName: string;
  methods: DependencyMethod[];
}

interface AdditionalImport {
  modulePath: string;
  symbolName: string;
}

const input: Input = JSON.parse(process.argv[2]);

const projectRoot = findProjectRoot(input.filePath);

process.stderr.write(`[LOG] projectRoot=${projectRoot}\n`);

function findProjectRoot(startFile: string): string {
  let current = path.dirname(path.resolve(startFile));

  while (true) {
    const tsconfig = path.join(current, "tsconfig.json");

    if (fs.existsSync(tsconfig)) {
      return current;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      throw new Error("Could not find tsconfig.json");
    }

    current = parent;
  }
}

const normalizedRoot = projectRoot.replace(/\\/g, "/");

const project = new Project({
  tsConfigFilePath: `${normalizedRoot}/tsconfig.json`,
  skipAddingFilesFromTsConfig: false,
});

project.addSourceFilesAtPaths([`${normalizedRoot}/src/**/*.ts`]);

process.stderr.write(`[LOG] sourceFiles=${project.getSourceFiles().length}\n`);

const sourceFile = project.addSourceFileAtPath(input.filePath);

project.resolveSourceFileDependencies();

const classDecl = sourceFile.getClasses()[0];

if (!classDecl) {
  throw new Error("Class not found");
}

const constructorDecl = classDecl.getConstructors()[0];

const dependencies = extractDependencies(sourceFile, constructorDecl);

const bootstrap = generateBootstrapSpec(sourceFile, classDecl, dependencies);

if (input.outputPath) {
  const output = project.createSourceFile(input.outputPath, bootstrap, {
    overwrite: true,
  });
  output.saveSync();
} else {
  process.stdout.write(bootstrap + "\n");
}

// ======================================================
// PATH HELPERS
// ======================================================

function buildRelativeImport(fromFile: string, toFile: string): string {
  let relative = path.relative(
    path.dirname(fromFile),
    toFile.replace(/\.ts$/, ""),
  );
  relative = relative.replace(/\\/g, "/");
  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }
  return relative;
}

// ======================================================
// EXTRACT PUBLIC METHODS
//
// Busca os métodos públicos da classe pelo nome.
// Procura em todos os source files do projeto — resolve tanto imports
// relativos quanto absolutos (src/...) após resolveSourceFileDependencies.
// Filtra private e protected: o spec file não pode chamar esses métodos.
// ======================================================

function resolveImportSourceFile(
  moduleSpecifier: string,
  sourceFile: SourceFile,
): SourceFile | undefined {
  // ==========================================
  // FIRST TRY:
  // ts-morph native resolution
  // ==========================================

  const direct = sourceFile
    .getImportDeclarations()
    .find((i) => i.getModuleSpecifierValue() === moduleSpecifier)
    ?.getModuleSpecifierSourceFile();

  if (direct) {
    return direct;
  }

  // ==========================================
  // ABSOLUTE IMPORTS (src/...)
  // ==========================================

  const project = sourceFile.getProject();

  const normalized = moduleSpecifier.replace(/\\/g, "/");

  const candidates = [normalized + ".ts", normalized + "/index.ts"];

  for (const candidate of candidates) {
    const found = project.getSourceFiles().find((sf) => {
      const path = sf.getFilePath().replace(/\\/g, "/");

      return path.endsWith(candidate);
    });

    if (found) {
      return found;
    }
  }

  // ==========================================
  // RELATIVE IMPORT FALLBACK
  // ==========================================

  try {
    const currentDir = path.dirname(sourceFile.getFilePath());

    const absoluteBase = path.resolve(currentDir, moduleSpecifier);

    const relativeCandidates = [
      absoluteBase + ".ts",
      path.join(absoluteBase, "index.ts"),
    ];

    for (const candidate of relativeCandidates) {
      const normalizedCandidate = candidate.replace(/\\/g, "/");

      const found = project.getSourceFiles().find((sf) => {
        const filePath = sf.getFilePath().replace(/\\/g, "/");

        return filePath === normalizedCandidate;
      });

      if (found) {
        return found;
      }
    }
  } catch {}

  process.stderr.write(`[WARN] Could not resolve import: ${moduleSpecifier}\n`);

  return undefined;
}

function extractPublicMethods(
  dependencyName: string,
  importPath: string,
  sourceFile: SourceFile,
): DependencyMethod[] {
  const importDecl = sourceFile
    .getImportDeclarations()
    .find(
      (imp) =>
        imp.getModuleSpecifierValue() === importPath &&
        imp.getNamedImports().some((n) => n.getName() === dependencyName),
    );

  if (!importDecl) {
    process.stderr.write(
      `[WARN] Import declaration not found for ${dependencyName}\n`,
    );

    return [];
  }

  const importedFile = resolveImportSourceFile(
    importDecl.getModuleSpecifierValue(),
    sourceFile,
  );

  if (!importedFile) {
    process.stderr.write(
      `[WARN] Source file not resolved for ${dependencyName}\n`,
    );

    return [];
  }

  const classDecl = importedFile
    .getClasses()
    .find((cls) => cls.getName() === dependencyName);

  if (!classDecl) {
    process.stderr.write(
      `[WARN] Class declaration not found for ${dependencyName}\n`,
    );

    return [];
  }

  return classDecl
    .getMethods()
    .filter(
      (m) =>
        !m.isStatic() &&
        m.getScope() !== Scope.Private &&
        m.getScope() !== Scope.Protected,
    )
    .map((method) => {
      const returnType = method.getReturnType().getText();

      const isAsync = method.isAsync() || returnType.includes("Promise<");

      return {
        name: method.getName(),
        isAsync,
      };
    });
}

// ======================================================
// EXTRACT DEPENDENCIES (constructor params)
// ======================================================

function extractDependencies(
  sourceFile: SourceFile,
  constructorDecl?: ConstructorDeclaration,
): DependencyInfo[] {
  if (!constructorDecl) {
    return [];
  }

  return constructorDecl.getParameters().map((param) => {
    const typeName =
      param.getType().getSymbol()?.getName() ?? param.getType().getText();

    const importDecl = sourceFile
      .getImportDeclarations()
      .find((imp) =>
        imp.getNamedImports().some((n) => n.getName() === typeName),
      );

    if (!importDecl) {
      throw new Error(`Import not found for dependency: ${typeName}`);
    }

    return {
      name: typeName,
      importPath: importDecl.getModuleSpecifierValue(),
      variableName: buildMockVariableName(typeName),
      methods: extractPublicMethods(
        typeName,
        importDecl.getModuleSpecifierValue(),
        sourceFile,
      ),
    };
  });
}

// ======================================================
// MOCK VARIABLE NAME
// ======================================================

function buildMockVariableName(className: string): string {
  return className.charAt(0).toLowerCase() + className.slice(1) + "Mock";
}

// ======================================================
// COLLECT ADDITIONAL IMPORTS
//
// Percorre recursivamente os arquivos importados pelo service
// e coleta enums, DTOs e exceções necessários no spec file.
//
// Profundidade máxima: 2
//   depth 0 = service
//   depth 1 = imports diretos (DTOs, enums do service)
//   depth 2 = imports dos DTOs/enums (enums dentro de DTOs)
// ======================================================

function collectAdditionalImports(
  serviceSourceFile: SourceFile,
  className: string,
  dependencies: DependencyInfo[],
): AdditionalImport[] {
  const collected: AdditionalImport[] = [];
  const visitedFiles = new Set<string>();
  const collectedSymbols = new Set<string>();

  const excludedSymbols = new Set<string>([
    className,
    "Test",
    "TestingModule",
    ...dependencies.map((d) => d.name),
  ]);

  function addSymbol(modulePath: string, symbolName: string) {
    if (excludedSymbols.has(symbolName)) return;
    if (collectedSymbols.has(symbolName)) return;
    collectedSymbols.add(symbolName);
    collected.push({ modulePath, symbolName });
  }

  function visitFile(file: SourceFile, depth: number = 0) {
    const filePath = file.getFilePath();
    if (visitedFiles.has(filePath)) return;
    visitedFiles.add(filePath);

    // Enums declarados neste arquivo
    file.getEnums().forEach((enumDecl: EnumDeclaration) => {
      const relPath = buildRelativeImport(
        input.filePath.replace(/\\/g, "/"),
        filePath.replace(/\\/g, "/"),
      );
      addSymbol(relPath, enumDecl.getName());
    });

    // DTOs e Entidades declarados neste arquivo
    file.getClasses().forEach((cls) => {
      const name = cls.getName();
      if (!name) return;
      if (name.endsWith("Dto") || name.endsWith("Entity")) {
        const relPath = buildRelativeImport(
          input.filePath.replace(/\\/g, "/"),
          filePath.replace(/\\/g, "/"),
        );
        addSymbol(relPath, name);
      }
    });

    // Parar recursão após profundidade 2
    if (depth >= 2) return;

    file.getImportDeclarations().forEach((imp) => {
      const moduleSpecifier = imp.getModuleSpecifierValue();

      // Imports externos (@nestjs/common etc.) — só exceções
      if (moduleSpecifier.startsWith("@")) {
        imp.getNamedImports().forEach((namedImport) => {
          const name = namedImport.getName();
          if (name.endsWith("Exception")) {
            addSymbol(moduleSpecifier, name);
          }
        });
        return;
      }

      const importedFile = imp.getModuleSpecifierSourceFile();
      if (!importedFile) return;

      const importedPath = importedFile.getFilePath();
      if (
        importedPath.includes("node_modules") ||
        importedPath.endsWith(".d.ts")
      )
        return;

      visitFile(importedFile, depth + 1);
    });
  }

  visitFile(serviceSourceFile);

  return collected;
}

// ======================================================
// GENERATE IMPORTS
// ======================================================

function generateImports(
  sourceFile: SourceFile,
  className: string,
  serviceImport: string,
  dependencies: DependencyInfo[],
): string {
  const lines: string[] = [];

  lines.push(`import { Test, TestingModule } from '@nestjs/testing';`);

  const additional = collectAdditionalImports(
    sourceFile,
    className,
    dependencies,
  );

  // Agrupar por modulePath
  const byModule = new Map<string, Set<string>>();
  additional.forEach(({ modulePath, symbolName }) => {
    if (!byModule.has(modulePath)) byModule.set(modulePath, new Set());
    byModule.get(modulePath)!.add(symbolName);
  });

  // Externos primeiro, depois locais — ambos ordenados
  const externalModules = [...byModule.keys()]
    .filter((m) => m.startsWith("@"))
    .sort();
  const localModules = [...byModule.keys()]
    .filter((m) => !m.startsWith("@"))
    .sort();

  [...externalModules, ...localModules].forEach((modulePath) => {
    const symbols = Array.from(byModule.get(modulePath)!).sort();
    lines.push(`import { ${symbols.join(", ")} } from '${modulePath}';`);
  });

  lines.push(`import { ${className} } from './${serviceImport}';`);

  dependencies.forEach((dep) => {
    lines.push(`import { ${dep.name} } from '${dep.importPath}';`);
  });

  [...dependencies].sort((a, b) => a.name.localeCompare(b.name));

  return lines.join("\n");
}

// ======================================================
// GENERATE LETS
// ======================================================

function generateLets(
  className: string,
  dependencies: DependencyInfo[],
): string {
  const lines: string[] = [`let service: ${className};`];

  dependencies.forEach((dep) => {
    lines.push(`let ${dep.variableName}: jest.Mocked<${dep.name}>;`);
  });

  return lines.join("\n  ");
}

// ======================================================
// GENERATE MOCK INITIALIZATION
//
// Se a classe não tiver métodos públicos extraídos (ex: import absoluto
// não resolvido mesmo após resolveSourceFileDependencies), gera um mock
// vazio com TODO para revisão — não quebra o pipeline.
// ======================================================

function generateMockInitialization(dependencies: DependencyInfo[]): string {
  return dependencies
    .map((dep) => {
      if (dep.methods.length === 0) {
        return (
          `// TODO: add mock methods for ${dep.name} (class not resolved via AST)\n    ` +
          `${dep.variableName} = {} as jest.Mocked<${dep.name}>;`
        );
      }

      const methods = dep.methods
        .map((method) => {
          const mockFactory = method.isAsync
            ? "jest.fn().mockResolvedValue(undefined)"
            : "jest.fn().mockReturnValue(undefined)";

          return `${method.name}: ${mockFactory},`;
        })
        .join("\n          ");

      return `${dep.variableName} = {\n          ${methods}\n        } as jest.Mocked<${dep.name}>;`;
    })
    .join("\n\n    ");
}

// ======================================================
// GENERATE PROVIDERS
// ======================================================

function generateProviders(
  className: string,
  dependencies: DependencyInfo[],
): string {
  const providers: string[] = [className];

  dependencies.forEach((dep) => {
    providers.push(`{ provide: ${dep.name}, useValue: ${dep.variableName} }`);
  });

  return providers.join(",\n          ");
}

// ======================================================
// GENERATE SPEC
// ======================================================

function generateBootstrapSpec(
  sourceFile: SourceFile,
  classDecl: ClassDeclaration,
  dependencies: DependencyInfo[],
): string {
  const className = classDecl.getName() ?? "UnknownService";
  const serviceImport = sourceFile.getBaseNameWithoutExtension();

  const imports = generateImports(
    sourceFile,
    className,
    serviceImport,
    dependencies,
  );

  const lets = generateLets(className, dependencies);
  const mockInitialization = generateMockInitialization(dependencies);
  const providers = generateProviders(className, dependencies);

  return `// AUTO-GENERATED-BOOTSTRAP-START
${imports}

describe('${className}', () => {

  ${lets}

  beforeEach(async () => {

    ${mockInitialization}

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ${providers},
        ],
      }).compile();

    service = module.get<${className}>(${className});

    jest.clearAllMocks();
  });
  // AUTO-GENERATED-BOOTSTRAP-END

  // TESTS_APPEND_HERE
});`;
}
