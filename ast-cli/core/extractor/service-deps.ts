/**
 * service-deps.ts
 *
 * Extracts per-service dependency metadata that cannot be derived from the
 * per-function context stored in service_functions.json:
 *
 *  - Whether a constructor param is @InjectRepository (TypeORM)
 *  - The entity name / import path for repository deps
 *  - Public methods of each non-repository dependency (for mock generation)
 *
 * This module is called once per service file, not per function.
 */

import {
  ClassDeclaration,
  ConstructorDeclaration,
  ParameterDeclaration,
  Project,
  Scope,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import { resolveImportSourceFile } from "./dtos";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DepMethod {
  name: string;
  isAsync: boolean;
}

export interface ServiceDep {
  /** Type name used in constructor (e.g. "PatientService", "Repository") */
  typeName: string;
  /** Variable name for the mock (e.g. "patientServiceMock") */
  mockVar: string;
  /** Import path of the type (e.g. "../patient/patient.service") */
  importPath: string;

  isRepository: boolean;
  /** Entity class name when isRepository — e.g. "Patient" */
  entityName?: string;
  /** Import path of the entity file — e.g. "./entities/patient.entity" */
  entityImportPath?: string;

  /** Public methods extracted from the dependency class */
  methods: DepMethod[];
}

// Standard TypeORM Repository<T> surface area — used for all @InjectRepository deps.
export const REPOSITORY_MOCK_METHODS: DepMethod[] = [
  { name: "findOne", isAsync: true },
  { name: "find", isAsync: true },
  { name: "save", isAsync: true },
  { name: "create", isAsync: false },
  { name: "delete", isAsync: true },
  { name: "update", isAsync: true },
  { name: "count", isAsync: true },
  { name: "createQueryBuilder", isAsync: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function mockVarName(typeName: string): string {
  return typeName.charAt(0).toLowerCase() + typeName.slice(1) + "Mock";
}

function isInjectRepo(param: ParameterDeclaration): boolean {
  return param.getDecorators().some((d) => d.getName() === "InjectRepository");
}

function entityNameFromDecorator(
  param: ParameterDeclaration,
): string | undefined {
  const dec = param
    .getDecorators()
    .find((d) => d.getName() === "InjectRepository");
  const args = dec?.getArguments() ?? [];
  return args[0]?.getText().trim();
}

function entityImportPath(
  entityName: string,
  sf: SourceFile,
): string | undefined {
  return sf
    .getImportDeclarations()
    .find((i) => i.getNamedImports().some((n) => n.getName() === entityName))
    ?.getModuleSpecifierValue();
}

function publicMethodsOf(
  typeName: string,
  importPath: string,
  sf: SourceFile,
  project: Project,
): DepMethod[] {
  const importedFile = resolveImportSourceFile(importPath, sf, project);
  if (!importedFile) {
    process.stderr.write(`[WARN] Could not resolve source for ${typeName}\n`);
    return [];
  }

  const cls = importedFile.getClasses().find((c) => c.getName() === typeName);
  if (!cls) {
    process.stderr.write(
      `[WARN] Class ${typeName} not found in ${importPath}\n`,
    );
    return [];
  }

  return cls
    .getMethods()
    .filter(
      (m) =>
        !m.isStatic() &&
        m.getScope() !== Scope.Private &&
        m.getScope() !== Scope.Protected,
    )
    .map((m) => ({
      name: m.getName(),
      isAsync: m.isAsync() || m.getReturnType().getText().includes("Promise<"),
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main extractor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts all constructor dependencies from the @Injectable class in a
 * service source file. Returns a flat list ready for mock/provider generation.
 */
export function extractServiceDeps(
  sf: SourceFile,
  project: Project,
): ServiceDep[] {
  // Prefer the @Injectable class; fall back to the first class in the file.
  const cls =
    sf
      .getClasses()
      .find((c) =>
        c.getDecorators().some((d) => d.getName() === "Injectable"),
      ) ?? sf.getClasses()[0];

  if (!cls) return [];

  const ctor = cls.getConstructors()[0];
  if (!ctor) return [];

  return ctor.getParameters().flatMap((param): ServiceDep[] => {
    // ── @InjectRepository ────────────────────────────────────────────────────
    if (isInjectRepo(param)) {
      const entity = entityNameFromDecorator(param);
      if (!entity) {
        process.stderr.write(
          `[WARN] @InjectRepository without resolvable entity\n`,
        );
        return [];
      }
      return [
        {
          typeName: "Repository",
          mockVar: mockVarName(entity + "Repository"),
          importPath: "typeorm",
          isRepository: true,
          entityName: entity,
          entityImportPath: entityImportPath(entity, sf),
          methods: REPOSITORY_MOCK_METHODS,
        },
      ];
    }

    // ── Regular injectable ───────────────────────────────────────────────────
    const typeName =
      param.getType().getSymbol()?.getName() ?? param.getType().getText();

    const importDecl = sf
      .getImportDeclarations()
      .find((i) => i.getNamedImports().some((n) => n.getName() === typeName));

    if (!importDecl) {
      process.stderr.write(
        `[WARN] Import not found for ${typeName} — skipping\n`,
      );
      return [];
    }

    const importPath = importDecl.getModuleSpecifierValue();

    return [
      {
        typeName,
        mockVar: mockVarName(typeName),
        importPath,
        isRepository: false,
        methods: publicMethodsOf(typeName, importPath, sf, project),
      },
    ];
  });
}
