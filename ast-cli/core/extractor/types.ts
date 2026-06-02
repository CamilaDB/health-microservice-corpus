// ─────────────────────────────────────────────────────────────────────────────
// Shared types for the function context extractor.
// All interfaces are plain data — no ts-morph nodes leak out of this module.
// ─────────────────────────────────────────────────────────────────────────────

// ── DTO / type shape ──────────────────────────────────────────────────────────

export interface DtoField {
  name: string;
  type: string;
  optional: boolean;
}

export interface ExtractedDto {
  name: string;
  /** "class" for @nestjs DTOs / TypeORM entities; "interface" for plain TS interfaces */
  kind: "class" | "interface";
  fields: DtoField[];
  /** Module specifier as it appears in the import statement, e.g. "./dto/create-patient.dto" */
  importPath: string;
  sourceFilePath: string;
}

export interface ExtractedEnum {
  name: string;
  values: string[];
  /** Module specifier as it appears in the import statement, e.g. "./enums/encounter-status.enum" */
  importPath: string;
  sourceFilePath: string;
}

// ── dependency analysis ───────────────────────────────────────────────────────

export type DependencyCallKind =
  | "validation"
  | "repository_save"
  | "repository_create"
  | "query"
  | "external_service"
  | "mapper"
  | "calculation";

export interface DependencyCall {
  method: string;
  kind: DependencyCallKind;
  isAsync: boolean;
  /** true when the return value is assigned or passed to another expression */
  returnUsed: boolean;
  assignedTo?: string;
}

export interface MethodDependencyUsage {
  /** full call chain that produced the value, e.g. "this.orderRepo.findOne" */
  method: string;
  /** properties accessed on the return value, e.g. ["id", "status"] */
  accessedProperties: string[];
}

// ── branch analysis ───────────────────────────────────────────────────────────

export interface ExtractedBranch {
  condition: string;
  calledMethods: string[];
  dependencyUsages?: MethodDependencyUsage[];
  throws?: string;
  returns?: string;
}

// ── transformation analysis ───────────────────────────────────────────────────

export type TransformationKind =
  | "date_conversion"
  | "nullish_default"
  | "number_cast"
  | "boolean_cast"
  | "mapping";

export interface Transformation {
  targetField: string;
  sourceExpression: string;
  kind: TransformationKind;
}

export interface RelevantImport {
  symbol: string;
  importPath: string;
}

// ── full function context ─────────────────────────────────────────────────────

export interface FunctionContext {
  functionName: string;
  isAsync: boolean;
  methodSignature: string;
  /** cleaned source — inline comments stripped, blank lines collapsed */
  methodSource: string;
  /** JSDoc comment if present, kept separate so prompts can choose to use it */
  jsDoc?: string;
  constructorDependencies: { name: string; type: string }[];
  dependencyCalls: DependencyCall[];
  transformations: Transformation[];
  /** all property-access call chains found in the method */
  calledMethods: string[];
  /** signatures of other methods on the same class that are called via `this.` */
  relatedMethods: string[];
  /** error/validation messages extracted from throw statements */
  businessRules: string[];
  branches: ExtractedBranch[];
  /** cross-branch view: which properties were accessed on each dependency's return value */
  dependencyUsages: MethodDependencyUsage[];
  relevantImports: RelevantImport[];
  relevantDtos: ExtractedDto[];
  relevantEnums: ExtractedEnum[];
}
