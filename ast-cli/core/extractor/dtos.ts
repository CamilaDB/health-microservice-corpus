import {
  ClassDeclaration,
  EnumDeclaration,
  InterfaceDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
} from "ts-morph";
import { cleanType, normalizePath } from "../utils";
import { DtoField, ExtractedDto, ExtractedEnum } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Import resolution
// ─────────────────────────────────────────────────────────────────────────────

export function resolveImportSourceFile(
  moduleSpecifier: string,
  sf: SourceFile,
  project: Project,
): SourceFile | undefined {
  const direct = sf
    .getImportDeclarations()
    .find((i) => i.getModuleSpecifierValue() === moduleSpecifier)
    ?.getModuleSpecifierSourceFile();

  if (direct) return direct;

  const normalized = moduleSpecifier.replace(/\\/g, "/");

  for (const candidate of [normalized + ".ts", normalized + "/index.ts"]) {
    const found = project
      .getSourceFiles()
      .find((s) => s.getFilePath().replace(/\\/g, "/").endsWith(candidate));
    if (found) return found;
  }

  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Enum extraction
// ─────────────────────────────────────────────────────────────────────────────

export function extractEnum(
  en: EnumDeclaration,
  importPath: string,
): ExtractedEnum {
  return {
    name: en.getName(),
    values: en.getMembers().map((m) => m.getName()),
    importPath,
    sourceFilePath: normalizePath(en.getSourceFile().getFilePath()),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Recursive enum registration
// Resolves an enum by type-name string and stores it in enumMap with the
// correct importPath. Returns the importPath where the enum was found, or
// undefined when not resolvable.
// ─────────────────────────────────────────────────────────────────────────────

function registerEnumFromType(
  typeText: string,
  sourceFile: SourceFile,
  project: Project,
  enumMap: Map<string, ExtractedEnum>,
): void {
  if (enumMap.has(typeText)) return;

  // Check if the enum is declared in the same file
  const inFileEnum = sourceFile.getEnum(typeText);
  if (inFileEnum) {
    // Use the source file's own path as the import specifier for same-file enums.
    // The bootstrap will resolve this to a relative path from the spec file.
    const importPath = sourceFile.getFilePath();
    enumMap.set(typeText, extractEnum(inFileEnum, importPath));
    return;
  }

  // Search through import declarations for a matching named export
  for (const imp of sourceFile.getImportDeclarations()) {
    const names = imp.getNamedImports().map((n) => n.getName());
    if (!names.includes(typeText)) continue;

    const importPath = imp.getModuleSpecifierValue();
    const imported = resolveImportSourceFile(importPath, sourceFile, project);
    if (!imported) continue;

    const en = imported.getEnum(typeText);
    if (en) {
      enumMap.set(typeText, extractEnum(en, importPath));
    }
    return;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Field extraction helpers
// Both helpers accept the current importPath so that enums discovered while
// walking fields are stored with the correct module specifier.
// ─────────────────────────────────────────────────────────────────────────────

function extractClassFields(
  cls: ClassDeclaration,
  importedFile: SourceFile,
  project: Project,
  enumMap: Map<string, ExtractedEnum>,
): DtoField[] {
  return cls.getProperties().map((prop) => {
    const typeText = cleanType(prop.getType().getText());

    // Primary: resolve via type symbol (catches imported enums reliably)
    const typeSymbol = prop.getType().getSymbol();
    typeSymbol?.getDeclarations().forEach((decl) => {
      if (decl.getKind() === SyntaxKind.EnumDeclaration) {
        const en = decl as EnumDeclaration;
        if (!enumMap.has(en.getName())) {
          // Find the import specifier for this enum in the imported file
          const imp = importedFile
            .getImportDeclarations()
            .find((i) =>
              i.getNamedImports().some((n) => n.getName() === en.getName()),
            );
          const importPath =
            imp?.getModuleSpecifierValue() ?? importedFile.getFilePath();
          enumMap.set(en.getName(), extractEnum(en, importPath));
        }
      }
    });

    // Fallback: resolve by bare type name string (union types, indirect aliases)
    const bareType = typeText.replace(/[\[\]?]/g, "").trim();
    if (bareType) {
      registerEnumFromType(bareType, importedFile, project, enumMap);
    }

    return {
      name: prop.getName(),
      type: typeText,
      optional: prop.hasQuestionToken(),
    };
  });
}

function extractInterfaceFields(
  iface: InterfaceDeclaration,
  importedFile: SourceFile,
  project: Project,
  enumMap: Map<string, ExtractedEnum>,
): DtoField[] {
  return iface.getProperties().map((prop: PropertySignature) => {
    const typeText = cleanType(prop.getType().getText());

    const typeSymbol = prop.getType().getSymbol();
    typeSymbol?.getDeclarations().forEach((decl) => {
      if (decl.getKind() === SyntaxKind.EnumDeclaration) {
        const en = decl as EnumDeclaration;
        if (!enumMap.has(en.getName())) {
          const imp = importedFile
            .getImportDeclarations()
            .find((i) =>
              i.getNamedImports().some((n) => n.getName() === en.getName()),
            );
          const importPath =
            imp?.getModuleSpecifierValue() ?? importedFile.getFilePath();
          enumMap.set(en.getName(), extractEnum(en, importPath));
        }
      }
    });

    const bareType = typeText.replace(/[\[\]?]/g, "").trim();
    if (bareType) {
      registerEnumFromType(bareType, importedFile, project, enumMap);
    }

    return {
      name: prop.getName(),
      type: typeText,
      optional: prop.hasQuestionToken(),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Path patterns that indicate a file contains DTOs / types / enums
// ─────────────────────────────────────────────────────────────────────────────

const DTO_PATH_PATTERNS = [
  "dto",
  "enum",
  "model",
  "schema",
  "types",
  "entity",
  "interface",
  "constants",
];

// ─────────────────────────────────────────────────────────────────────────────
// Main collector
// Walks all relevant import paths, extracts classes, interfaces, and enums
// that are actually referenced by the method (via the identifiers set).
// Every extracted item carries the importPath from which it was resolved —
// this is the module specifier as written in the service's import statement.
// ─────────────────────────────────────────────────────────────────────────────

export function collectDtosAndEnums(
  relevantImportPaths: Set<string>,
  identifiers: Set<string>,
  sourceFile: SourceFile,
  project: Project,
): { dtos: ExtractedDto[]; enums: ExtractedEnum[] } {
  const enumMap = new Map<string, ExtractedEnum>();
  const dtos: ExtractedDto[] = [];

  for (const importPath of relevantImportPaths) {
    const lowerPath = importPath.toLowerCase();

    if (!DTO_PATH_PATTERNS.some((p) => lowerPath.includes(p))) continue;

    let importedFile: SourceFile | undefined;
    try {
      importedFile = resolveImportSourceFile(importPath, sourceFile, project);
    } catch (e) {
      process.stderr.write(
        `Warning: failed to resolve import "${importPath}": ${e}\n`,
      );
      continue;
    }

    if (!importedFile) continue;

    const sourceFilePath = normalizePath(importedFile.getFilePath());

    // ── classes (DTOs, entities) ──────────────────────────────────────────

    importedFile.getClasses().forEach((cls) => {
      const name = cls.getName();
      if (!name || !identifiers.has(name)) return;

      dtos.push({
        name,
        kind: "class",
        importPath,
        sourceFilePath,
        fields: extractClassFields(cls, importedFile!, project, enumMap),
      });
    });

    // ── interfaces ────────────────────────────────────────────────────────

    importedFile.getInterfaces().forEach((iface) => {
      const name = iface.getName();
      if (!name || !identifiers.has(name)) return;

      dtos.push({
        name,
        kind: "interface",
        importPath,
        sourceFilePath,
        fields: extractInterfaceFields(iface, importedFile!, project, enumMap),
      });
    });

    // ── type aliases that resolve to object shapes ────────────────────────

    importedFile.getTypeAliases().forEach((alias: TypeAliasDeclaration) => {
      const name = alias.getName();
      if (!name || !identifiers.has(name)) return;

      const typeNode = alias.getTypeNode();
      if (!typeNode) return;

      if (typeNode.getKind() !== SyntaxKind.TypeLiteral) return;

      const fields: DtoField[] = typeNode
        .asKindOrThrow(SyntaxKind.TypeLiteral)
        .getProperties()
        .map((prop) => {
          const typeText = cleanType(prop.getType().getText());
          const bareType = typeText.replace(/[\[\]?]/g, "").trim();
          if (bareType) {
            registerEnumFromType(bareType, importedFile!, project, enumMap);
          }
          return {
            name: prop.getName(),
            type: typeText,
            optional: prop.hasQuestionToken(),
          };
        });

      dtos.push({
        name,
        kind: "interface",
        importPath,
        sourceFilePath,
        fields,
      });
    });

    // ── standalone enums ──────────────────────────────────────────────────
    // Enum-only files are captured entirely; individual names may not appear
    // in identifiers if they're used only as type annotations.

    importedFile.getEnums().forEach((en) => {
      const name = en.getName();
      if (
        !enumMap.has(name) &&
        (identifiers.has(name) || lowerPath.includes("enum"))
      ) {
        enumMap.set(name, extractEnum(en, importPath));
      }
    });
  }

  return { dtos, enums: Array.from(enumMap.values()) };
}
