"""
Mirrors the FunctionContext interface from core/extractor/types.ts.
All fields are optional with defaults so that older JSON (missing some fields)
doesn't break deserialization.
"""

from dataclasses import dataclass, field

@dataclass
class DtoField:
    name: str = ""
    type: str = ""
    optional: bool = False


@dataclass
class ExtractedDto:
    name: str = ""
    kind: str = "class"          # "class" | "interface"
    importPath: str = ""
    sourceFilePath: str = ""
    fields: list[DtoField] = field(default_factory=list)

    def __post_init__(self):
        self.fields = [
            DtoField(**f) if isinstance(f, dict) else f
            for f in self.fields
        ]


@dataclass
class ExtractedEnum:
    name: str = ""
    values: list[str] = field(default_factory=list)
    importPath: str = ""
    sourceFilePath: str = ""

@dataclass
class ExtractedImport:
    symbol: str = ""
    importPath: str = ""

@dataclass
class DependencyCall:
    method: str = ""
    kind: str = "external_service"
    isAsync: bool = False
    returnUsed: bool = False
    assignedTo: str | None = None


@dataclass
class MethodDependencyUsage:
    method: str = ""
    accessedProperties: list[str] = field(default_factory=list)


@dataclass
class ExtractedBranch:
    condition: str = ""
    calledMethods: list[str] = field(default_factory=list)
    dependencyUsages: list[MethodDependencyUsage] = field(default_factory=list)
    throws: str | None = None
    returns: str | None = None

    def __post_init__(self):
        self.dependencyUsages = [
            MethodDependencyUsage(**u) if isinstance(u, dict) else u
            for u in (self.dependencyUsages or [])
        ]


@dataclass
class Transformation:
    targetField: str = ""
    sourceExpression: str = ""
    kind: str = "mapping"


@dataclass
class ConstructorDep:
    name: str = ""
    type: str = ""


@dataclass
class FunctionContext:
    functionName: str = ""
    isAsync: bool = False
    methodSignature: str = ""
    methodSource: str = ""
    jsDoc: str | None = None

    constructorDependencies: list[ConstructorDep] = field(default_factory=list)
    dependencyCalls: list[DependencyCall] = field(default_factory=list)
    transformations: list[Transformation] = field(default_factory=list)
    calledMethods: list[str] = field(default_factory=list)
    relatedMethods: list[str] = field(default_factory=list)
    businessRules: list[str] = field(default_factory=list)
    branches: list[ExtractedBranch] = field(default_factory=list)
    dependencyUsages: list[MethodDependencyUsage] = field(default_factory=list)
    relevantImports: list[ExtractedImport] = field(default_factory=list)
    relevantDtos: list[ExtractedDto] = field(default_factory=list)
    relevantEnums: list[ExtractedEnum] = field(default_factory=list)

    def __post_init__(self):
        self.constructorDependencies = [
            ConstructorDep(**d) if isinstance(d, dict) else d
            for d in self.constructorDependencies
        ]
        self.dependencyCalls = [
            DependencyCall(**c) if isinstance(c, dict) else c
            for c in self.dependencyCalls
        ]
        self.transformations = [
            Transformation(**t) if isinstance(t, dict) else t
            for t in self.transformations
        ]
        self.branches = [
            ExtractedBranch(**b) if isinstance(b, dict) else b
            for b in self.branches
        ]
        self.dependencyUsages = [
            MethodDependencyUsage(**u) if isinstance(u, dict) else u
            for u in self.dependencyUsages
        ]
        self.relevantDtos = [
            ExtractedDto(**d) if isinstance(d, dict) else d
            for d in self.relevantDtos
        ]
        self.relevantEnums = [
            ExtractedEnum(**e) if isinstance(e, dict) else e
            for e in self.relevantEnums
        ]
