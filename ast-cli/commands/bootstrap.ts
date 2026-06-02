/**
 * bootstrap.ts
 *
 * Reads output/service_functions.json, groups functions by test_output_file,
 * and generates one Jest spec bootstrap per service file.
 *
 * What comes from the JSON (no extra AST needed):
 *   - class_name, source_file, test_output_file
 *   - relevantDtos, relevantEnums (union across all functions in the file)
 *   - constructorDependencies (for cross-checking / display)
 *
 * What still requires AST (once per service file):
 *   - @InjectRepository detection → getRepositoryToken(Entity)
 *   - Public methods of each dep class → mock shape
 *
 * Output: one .spec.ts file per test_output_file entry.
 */

import * as fs from "fs";
import * as path from "path";

import { createProject } from "../core/project";
import { extractServiceDeps, ServiceDep } from "../core/extractor/service-deps";
import {
  ExtractedDto,
  ExtractedEnum,
  RelevantImport,
} from "../core/extractor/types";
import { BOOTSTRAP_PATH, CORPUS_ROOT, FUNCTIONS_PATH } from "../core/config";

// ─────────────────────────────────────────────────────────────────────────────
// Types mirroring service_functions.json shape
// ─────────────────────────────────────────────────────────────────────────────

interface StoredFunction {
  name: string;
  class_name: string;
  module: string;
  source_file: string;
  test_output_file: string;
  context: {
    relevantDtos: ExtractedDto[];
    relevantEnums: ExtractedEnum[];
    relevantImports: RelevantImport[];
    constructorDependencies: { name: string; type: string }[];
  };
}

interface FunctionsFile {
  functions: StoredFunction[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Load JSON
// ─────────────────────────────────────────────────────────────────────────────

const functionsPath = path.resolve(process.cwd(), FUNCTIONS_PATH);

if (!fs.existsSync(functionsPath)) {
  process.stderr.write(
    `[bootstrap] ERROR: ${functionsPath} not found. Run "functions" first.\n`,
  );
  process.exit(1);
}

const { functions }: FunctionsFile = JSON.parse(
  fs.readFileSync(functionsPath, "utf-8"),
);

// ─────────────────────────────────────────────────────────────────────────────
// Group by test_output_file
// Each group becomes one spec file.
// ─────────────────────────────────────────────────────────────────────────────

const groups = new Map<
  string,
  {
    testOutputFile: string;
    sourceFile: string;
    className: string;
    fns: StoredFunction[];
  }
>();

for (const fn of functions) {
  if (!groups.has(fn.test_output_file)) {
    groups.set(fn.test_output_file, {
      testOutputFile: fn.test_output_file,
      sourceFile: fn.source_file,
      className: fn.class_name,
      fns: [],
    });
  }
  groups.get(fn.test_output_file)!.fns.push(fn);
}

// ─────────────────────────────────────────────────────────────────────────────
// AST project — shared across all groups (single parse)
// ─────────────────────────────────────────────────────────────────────────────

const project = createProject();

// ─────────────────────────────────────────────────────────────────────────────
// Per-group generation
// ─────────────────────────────────────────────────────────────────────────────

for (const group of groups.values()) {
  // source_file is relative to CORPUS_ROOT (e.g. "src/patient/patient.service.ts")
  const absSourceFile = path.join(CORPUS_ROOT, group.sourceFile);

  let sf = project.getSourceFile(absSourceFile);
  if (!sf) {
    try {
      sf = project.addSourceFileAtPath(absSourceFile);
    } catch {
      process.stderr.write(
        `[bootstrap] ERROR: could not find source file for "${absSourceFile}"\n`,
      );
      continue;
    }
  }

  const deps = extractServiceDeps(sf, project);
  const { dtos, enums, relevantImports } = mergeTypesFromFunctions(group.fns);
  const spec = generateSpec(
    group.className,
    group.sourceFile,
    group.testOutputFile,
    deps,
    dtos,
    enums,
    relevantImports,
  );

  const outAbs = path.join(BOOTSTRAP_PATH, group.testOutputFile);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, spec, "utf-8");

  console.log(
    `[bootstrap] ${group.testOutputFile} (${group.fns.length} functions, ${deps.length} deps)`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Merge DTOs and enums across all functions in a group
// De-duplicated by name — first occurrence wins.
// ─────────────────────────────────────────────────────────────────────────────

function mergeTypesFromFunctions(fns: StoredFunction[]): {
  dtos: ExtractedDto[];
  enums: ExtractedEnum[];
  relevantImports: RelevantImport[];
} {
  const dtoMap = new Map<string, ExtractedDto>();
  const enumMap = new Map<string, ExtractedEnum>();

  const importMap = new Map<string, RelevantImport>();

  for (const fn of fns) {
    for (const dto of fn.context.relevantDtos ?? []) {
      if (!dtoMap.has(dto.name)) {
        dtoMap.set(dto.name, dto);
      }
    }

    for (const en of fn.context.relevantEnums ?? []) {
      if (!enumMap.has(en.name)) {
        enumMap.set(en.name, en);
      }
    }

    for (const imp of fn.context.relevantImports ?? []) {
      const key = `${imp.importPath}:${imp.symbol}`;

      if (!importMap.has(key)) {
        importMap.set(key, imp);
      }
    }
  }

  return {
    dtos: Array.from(dtoMap.values()),
    enums: Array.from(enumMap.values()),
    relevantImports: Array.from(importMap.values()),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Code generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the relative import path from the spec file to the service file.
 * e.g. spec="src/patient/patient.service.spec.ts", service="src/patient/patient.service.ts"
 * → "./patient.service"
 */
function relativeImport(fromSpec: string, toService: string): string {
  const rel = path.relative(
    path.dirname(fromSpec),
    toService.replace(/\.ts$/, ""),
  );
  const normalized = rel.replace(/\\/g, "/");
  return normalized.startsWith(".") ? normalized : "./" + normalized;
}

function addImport(
  symbolToImport: Map<string, { symbol: string; importPath: string }>,
  importPath: string,
  symbol: string,
) {
  if (!importPath || !symbol) return;

  const existing = symbolToImport.get(symbol);

  // já existe um import para esse símbolo
  if (existing) {
    // prefere caminhos relativos ao invés de src/*
    const existingIsSrc = existing.importPath.startsWith("src/");
    const newIsSrc = importPath.startsWith("src/");

    if (existingIsSrc && !newIsSrc) {
      symbolToImport.set(symbol, {
        symbol,
        importPath,
      });
    }

    return;
  }

  symbolToImport.set(symbol, {
    symbol,
    importPath,
  });
}

function generateImports(
  className: string,
  specFile: string,
  sourceFile: string,
  deps: ServiceDep[],
  dtos: ExtractedDto[],
  enums: ExtractedEnum[],
  relevantImports: RelevantImport[],
): string {
  const lines: string[] = [];

  // Framework
  lines.push(`import { Test, TestingModule } from '@nestjs/testing';`);

  //   const hasRepo = deps.some((d) => d.isRepository);
  //   if (hasRepo) {
  //     lines.push(`import { getRepositoryToken } from '@nestjs/typeorm';`);
  //     lines.push(`import { Repository } from 'typeorm';`);
  //   }

  //   // Entity imports (one per @InjectRepository dep)
  //   deps
  //     .filter((d) => d.isRepository && d.entityName && d.entityImportPath)
  //     .forEach((d) => {
  //       lines.push(`import { ${d.entityName} } from '${d.entityImportPath}';`);
  //     });

  // Non-repository deps
  //   deps
  //     .filter((d) => !d.isRepository)
  //     .sort((a, b) => a.typeName.localeCompare(b.typeName))
  //     .forEach((d) => {
  //       lines.push(`import { ${d.typeName} } from '${d.importPath}';`);
  //     });

  // DTOs and enums — grouped by importPath and emitted as real import statements.
  // importPath is the module specifier as it appears in the service file's own
  // imports (e.g. "./dto/create-patient.dto", "../enums/order-status.enum").
  const symbolToImport = new Map<
    string,
    { symbol: string; importPath: string }
  >();

  for (const dep of deps) {
    // if (dep.isRepository) continue;

    addImport(symbolToImport, dep.importPath, dep.typeName);
  }

  for (const dto of dtos) {
    addImport(
      symbolToImport,
      relativeImport(specFile, dto.sourceFilePath),
      dto.name,
    );
  }

  for (const en of enums) {
    addImport(
      symbolToImport,
      relativeImport(specFile, en.sourceFilePath),
      en.name,
    );
  }

  for (const imp of relevantImports) {
    addImport(symbolToImport, imp.importPath, imp.symbol);
  }

  const byImportPath = new Map<string, Set<string>>();

  for (const { symbol, importPath } of symbolToImport.values()) {
    if (!byImportPath.has(importPath)) {
      byImportPath.set(importPath, new Set());
    }

    byImportPath.get(importPath)!.add(symbol);
  }

  // External (@nestjs/…, typeorm, …) first, then local — both alphabetically sorted.
  const externalPaths = [...byImportPath.keys()]
    .filter((p) => p.startsWith("@"))
    .sort();

  const localPaths = [...byImportPath.keys()]
    .filter((p) => !p.startsWith("@"))
    .sort();

  for (const p of [...externalPaths, ...localPaths]) {
    const symbols = Array.from(byImportPath.get(p)!).sort();

    lines.push(`import { ${symbols.join(", ")} } from '${p}';`);
  }

  // The service under test — always last
  lines.push(
    `import { ${className} } from '${relativeImport(specFile, sourceFile)}';`,
  );

  return lines.join("\n");
}

function generateLetBlock(className: string, deps: ServiceDep[]): string {
  const lines = [`let service: ${className};`];

  deps.forEach((dep) => {
    if (dep.isRepository && dep.entityName) {
      lines.push(
        `let ${dep.mockVar}: jest.Mocked<Repository<${dep.entityName}>>;`,
      );
    } else {
      lines.push(`let ${dep.mockVar}: jest.Mocked<${dep.typeName}>;`);
    }
  });

  return lines.map((l) => `  ${l}`).join("\n");
}

function generateMockInit(deps: ServiceDep[]): string {
  return deps
    .map((dep) => {
      if (dep.methods.length === 0) {
        const type =
          dep.isRepository && dep.entityName
            ? `Repository<${dep.entityName}>`
            : dep.typeName;
        return [
          `    // TODO: add mock methods for ${dep.typeName} (could not resolve via AST)`,
          `    ${dep.mockVar} = {} as jest.Mocked<${type}>;`,
        ].join("\n");
      }

      const methodLines = dep.methods.map((m) => {
        if (m.name === "createQueryBuilder") {
          return [
            `      createQueryBuilder: jest.fn().mockReturnValue({`,
            `        leftJoinAndSelect: jest.fn().mockReturnThis(),`,
            `        andWhere: jest.fn().mockReturnThis(),`,
            `        getMany: jest.fn().mockResolvedValue([]),`,
            `        getOne: jest.fn().mockResolvedValue(undefined),`,
            `      }),`,
          ].join("\n");
        }
        const factory = m.isAsync
          ? "jest.fn().mockResolvedValue(undefined)"
          : "jest.fn().mockReturnValue(undefined)";
        return `      ${m.name}: ${factory},`;
      });

      const type =
        dep.isRepository && dep.entityName
          ? `Repository<${dep.entityName}>`
          : dep.typeName;

      return [
        `    ${dep.mockVar} = {`,
        methodLines.join("\n"),
        `    } as jest.Mocked<${type}>;`,
      ].join("\n");
    })
    .join("\n\n");
}

function generateProviders(className: string, deps: ServiceDep[]): string {
  const entries = [className];

  deps.forEach((dep) => {
    if (dep.isRepository && dep.entityName) {
      entries.push(
        `{ provide: getRepositoryToken(${dep.entityName}), useValue: ${dep.mockVar} }`,
      );
    } else {
      entries.push(`{ provide: ${dep.typeName}, useValue: ${dep.mockVar} }`);
    }
  });

  return entries.map((e) => `          ${e}`).join(",\n");
}

function generateSpec(
  className: string,
  sourceFile: string,
  specFile: string,
  deps: ServiceDep[],
  dtos: ExtractedDto[],
  enums: ExtractedEnum[],
  relevantImports: RelevantImport[],
): string {
  const imports = generateImports(
    className,
    specFile,
    sourceFile,
    deps,
    dtos,
    enums,
    relevantImports,
  );
  const lets = generateLetBlock(className, deps);
  const mockInit = generateMockInit(deps);
  const providers = generateProviders(className, deps);

  // Inline enum reference block — gives LLMs and developers a quick reference
  // for valid enum values without having to open the source.
  //   const enumRef =
  //     enums.length > 0
  //       ? [
  //           `  /**`,
  //           `   * Enum reference (auto-generated — do not edit):`,
  //           ...enums.map((e) => `   * ${e.name}: ${e.values.join(" | ")}`),
  //           `   */`,
  //         ].join("\n") + "\n\n"
  //       : "";

  return `// AUTO-GENERATED-BOOTSTRAP-START
${imports}

describe('${className}', () => {

${lets}

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {

${mockInit}

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
${providers},
        ],
      }).compile();

    service = module.get<${className}>(${className});

  });
  // AUTO-GENERATED-BOOTSTRAP-END

  // TESTS_APPEND_HERE
});
`;
}
