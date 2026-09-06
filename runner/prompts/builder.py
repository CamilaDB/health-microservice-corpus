import re

from prompts.loader import load_prompt_template
from models.function_definition import FunctionDefinition
from models.function_context import (
    ExtractedBranch,
    ExtractedDto,
    ExtractedEnum,
    DependencyCall,
    ConstructorDep,
)
from models.method_generated_context import MethodGenerationContext
from utils.files import read_file
from utils.logging import logger


# ─────────────────────────────────────────────────────────────────────────────
# Formatters
# ─────────────────────────────────────────────────────────────────────────────

def _fmt_dtos(dtos: list[ExtractedDto]) -> str:
    return "\n\n".join(
        f"{dto.name}:\n"
        + "\n".join(
            f"- {f.name}{'?' if f.optional else ''}: {f.type}"
            for f in dto.fields
        )
        for dto in dtos
    )


def _fmt_enums(enums: list[ExtractedEnum]) -> str:
    return "\n".join(
        f"enum {e.name}: {' | '.join(f'{e.name}.{value}' for value in e.values)}"
        for e in enums
    )

def _fmt_branches(branches: list[ExtractedBranch]) -> str:
    return "\n\n".join(
        f"Condition: {b.condition}\n"
        f"Called methods: {', '.join(b.calledMethods) or 'none'}\n"
        f"Throws: {b.throws or 'none'}\n"
        f"Returns: {b.returns or 'none'}"
        for b in branches
    )


def _fmt_dependency_calls(calls: list[DependencyCall]) -> str:
    return "\n\n".join(
        f"Method: {c.method}\n"
        f"Kind: {c.kind}\n"
        f"Async: {c.isAsync}\n"
        f"Return used: {c.returnUsed}\n"
        f"Assigned to: {c.assignedTo or 'none'}"
        for c in calls
    )


def _fmt_constructor_deps(deps: list[ConstructorDep]) -> str:
    return "\n".join(f"- {d.name}: {d.type}" for d in deps)


def _fmt_available_mocks(
    deps: list[ConstructorDep],
    calls: list[DependencyCall],
    spec_content: str,
) -> str:
    """
    Produces an explicit mapping of mock variable → available methods,
    e.g.:
        patientServiceMock:
          - getPatientById (async)
          - listPatients (async)

        encounterRepositoryMock:
          - findActiveByPatient (async)
          - create (sync)
          - save (async)

    Mock variable names are extracted from the bootstrap spec so the LLM
    sees the exact identifiers declared in beforeEach — preventing the
    "wrong mock" confusion (e.g. encounterRepositoryMock.getPatientById).

    Method names come from the dependency_calls in the function context so
    only the methods actually used by this function are listed, not the
    entire mock surface.
    """
    # Build dep_name → mock_var map by scanning "let <var>: jest.Mocked<DepName>"
    # lines in the bootstrap spec.
    dep_to_mock: dict[str, str] = {}
    for dep in deps:
        # Match: let patientServiceMock: jest.Mocked<PatientService>
        pattern = rf"let\s+(\w+)\s*:\s*jest\.Mocked<[^>]*{re.escape(dep.type)}[^>]*>"
        m = re.search(pattern, spec_content)
        if m:
            dep_to_mock[dep.name] = m.group(1)
        else:
            # Fallback: camelCase(dep.type) + "Mock"
            t = dep.type
            dep_to_mock[dep.name] = t[0].lower() + t[1:] + "Mock"

    # Group called methods by which dep they belong to.
    # dep.name is "this.<dep.name>.<method>" → split on "."
    mock_methods: dict[str, list[str]] = {v: [] for v in dep_to_mock.values()}

    for call in calls:
        # call.method is e.g. "this.patientService.getPatientById"
        parts = call.method.split(".")
        if len(parts) < 3 or parts[0] != "this":
            continue
        dep_name = parts[1]       # "patientService"
        method_name = parts[2]    # "getPatientById"
        mock_var = dep_to_mock.get(dep_name)
        if mock_var and mock_var in mock_methods:
            suffix = " (async)" if call.isAsync else " (sync)"
            entry = f"{method_name}{suffix}"
            if entry not in mock_methods[mock_var]:
                mock_methods[mock_var].append(entry)

    lines = []
    for mock_var, methods in mock_methods.items():
        lines.append(f"{mock_var}:")
        if methods:
            lines.extend(f"  - {m}" for m in methods)
        else:
            lines.append("  (no direct calls in this function)")

    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# build_prompt
# ─────────────────────────────────────────────────────────────────────────────

def build_prompt(
    strategy: str,
    function_data: FunctionDefinition,
    existing_spec_file: str,
) -> tuple[str, str]:
    """
    Builds the generation prompt for a single function.

    Returns (prompt, method_source). All context comes from
    function_data.context — no subprocess or extra file I/O.
    """
    template = load_prompt_template(strategy, strategy)
    assert isinstance(template, str), (
        f"load_prompt_template returned {type(template).__name__}, expected str"
    )

    existing_spec_content = read_file(existing_spec_file)
    assert isinstance(existing_spec_content, str), (
        f"read_file returned {type(existing_spec_content).__name__}, expected str"
    )

    bootstrap_end_marker = "// AUTO-GENERATED-BOOTSTRAP-END"
    bootstrap_idx = existing_spec_content.find(bootstrap_end_marker)
    if bootstrap_idx != -1:
        spec_for_prompt = existing_spec_content[:bootstrap_idx + len(bootstrap_end_marker)]
    else:
        spec_for_prompt = existing_spec_content

    ctx = function_data.context

    available_mocks = _fmt_available_mocks(
        deps=ctx.constructorDependencies,
        calls=ctx.dependencyCalls,
        spec_content=spec_for_prompt,
    )

    replacements = {
        "{{FUNCTION_NAME}}":
            function_data.name,

        # "{{IS_ASYNC}}":
        #     "true" if ctx.isAsync else "false",

        "{{METHOD_SIGNATURE}}":
            ctx.methodSignature,

        "{{METHOD_SOURCE}}":
            ctx.methodSource,

        # "{{CALLED_METHODS}}":
        #     _fmt_list(ctx.calledMethods),

        # "{{RELATED_METHODS}}":
        #     _fmt_list(ctx.relatedMethods),

        # "{{BUSINESS_RULES}}":
        #     _fmt_list(ctx.businessRules),

        "{{BRANCHES}}":
            _fmt_branches(ctx.branches),

        # "{{DEPENDENCY_USAGES}}":
        #     _fmt_dependency_usages(ctx.dependencyUsages),

        "{{DEPENDENCY_CALLS}}":
            _fmt_dependency_calls(ctx.dependencyCalls),

        # "{{TRANSFORMATIONS}}":
        #     _fmt_transformations(ctx.transformations),

        "{{CONSTRUCTOR_DEPENDENCIES}}":
            _fmt_constructor_deps(ctx.constructorDependencies),

        "{{AVAILABLE_MOCKS}}":
            available_mocks,

        "{{RELATED_DTOS}}":
            _fmt_dtos(ctx.relevantDtos),

        "{{RELATED_ENUMS}}":
            _fmt_enums(ctx.relevantEnums),

        "{{EXISTING_SPEC_FILE}}":
            spec_for_prompt,
    }

    for key, value in replacements.items():
        template = template.replace(key, value or "none")

    logger.debug(f"template {template}")

    return template


# ─────────────────────────────────────────────────────────────────────────────
# Repair prompts
# ─────────────────────────────────────────────────────────────────────────────

def build_runtime_repair_prompt(
    *,
    repair_prompt: str,
    broken_block: str,
    error_message: str,
    context: MethodGenerationContext,
) -> str:
    
    template = repair_prompt

    replacements = {
        "{{ERROR}}": error_message,
        "{{BROKEN_TEST}}": broken_block,

        "{{SOURCE_FUNCTION}}": context.focused_source,

        "{{RELATED_DTOS}}":
            _fmt_dtos(context.relevant_dtos),
        "{{RELATED_ENUMS}}":
            _fmt_enums(context.relevant_enums),
    }

    for key, value in replacements.items():
        template = template.replace(key, value or "none")

    logger.debug(f"repair template {template}")

    return template


_REPAIR_PROMPT_TEMPLATE = """The following Jest spec failed.

IMPORTANT RULES FOR REPAIR:
- Sync functions (not async, no Promise return): use expect(() => service.METHOD()).toThrow(ExceptionClass)
- Async functions: use await expect(service.METHOD()).rejects.toThrow(ExceptionClass)
- Do NOT use .rejects on a sync function — it silently passes even when it should fail
- Preserve all working tests unchanged
- Preserve all imports and mock declarations
- Return the full corrected spec file

TYPESCRIPT / JEST ERRORS:
{errors}

CURRENT SPEC FILE:
```ts
{spec_content}
```
"""


def build_repair_prompt(
    spec_content: str,
    jest_stderr: str = "",
    ts_stdout: str = "",
) -> str:
    # tsc writes errors to stdout; jest writes to stderr.
    # Prefer whichever is non-empty, falling back to the other.
    errors = (ts_stdout.strip() or jest_stderr.strip())[:2500]
    logger.debug(f"repair errors: {errors}")
    return _REPAIR_PROMPT_TEMPLATE.format(
        errors=errors,
        spec_content=spec_content,
    )