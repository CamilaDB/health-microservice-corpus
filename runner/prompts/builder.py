from config import CORPUS_DIR
from prompts.loader import (
    load_prompt_template,
)
from ts_ast.extractor import extract_focused_source
from utils.files import read_file
from utils.logging import logger

def build_prompt(
    strategy,
    function_data,
    existing_spec_file: str,
):

    template = load_prompt_template(strategy)

    existing_spec_content = read_file(
        existing_spec_file
    )

    focused = extract_focused_source(
        file_path=str(
            CORPUS_DIR / function_data.source_file
        ),
        function_name=function_data.name,
    )

    is_async: bool = focused.get("isAsync", False)
    is_async_label = "true" if is_async else "false"

    method_source = focused["methodSource"]

    method_signature = focused["methodSignature"]

    called_methods = focused["calledMethods"]

    related_methods = focused["relatedMethods"]

    business_rules = focused["businessRules"]

    dtos = focused["relevantDtos"]

    enums = focused["relevantEnums"]

    branches = focused.get("branches", [])

    dependency_usages = focused.get(
        "dependencyUsages",
        [],
    )

    dependency_calls = focused.get(
        "dependencyCalls",
        [],
    )

    transformations = focused.get(
        "transformations",
        [],
    )

    constructor_dependencies = focused.get(
        "constructorDependencies",
        [],
    )

    # ==================================================
    # DTOS
    # ==================================================

    dto_text = "\n\n".join(
        [
            f"{dto['name']}:\n"
            + "\n".join(
                [
                    f"- {f['name']}{'?' if f['optional'] else ''}: {f['type']}"
                    for f in dto["fields"]
                ]
            )
            for dto in dtos
        ]
    )

    # ==================================================
    # ENUMS
    # ==================================================

    enum_text = "\n\n".join(
        [
            f"{enum['name']} = [{', '.join(enum['values'])}]"
            for enum in enums
        ]
    )

    # ==================================================
    # BRANCHES
    # ==================================================

    branches_text = "\n\n".join(
        [
            (
                f"Condition: {b.get('condition', '')}\n"
                f"Called methods: {', '.join(b.get('calledMethods', [])) or 'none'}\n"
                f"Throws: {b.get('throws', 'none')}\n"
                f"Returns: {b.get('returns', 'none')}"
            )
            for b in branches
        ]
    )

    # ==================================================
    # DEPENDENCY USAGES
    # ==================================================

    dependency_usages_text = "\n\n".join(
        [
            (
                f"Method: {d.get('method')}\n"
                f"Accessed properties: "
                f"{', '.join(d.get('accessedProperties', [])) or 'none'}"
            )
            for d in dependency_usages
        ]
    )

    # ==================================================
    # DEPENDENCY CALLS
    # ==================================================

    dependency_calls_text = "\n\n".join(
        [
            (
                f"Method: {d.get('method')}\n"
                f"Kind: {d.get('kind')}\n"
                f"Async: {d.get('isAsync')}\n"
                f"Return used: {d.get('returnUsed')}\n"
                f"Assigned to: {d.get('assignedTo') or 'none'}"
            )
            for d in dependency_calls
        ]
    )

    # ==================================================
    # TRANSFORMATIONS
    # ==================================================

    transformations_text = "\n\n".join(
        [
            (
                f"Target field: {t.get('targetField')}\n"
                f"Expression: {t.get('sourceExpression')}\n"
                f"Kind: {t.get('kind')}"
            )
            for t in transformations
        ]
    )

    # ==================================================
    # CONSTRUCTOR DEPENDENCIES
    # ==================================================

    constructor_dependencies_text = "\n".join(
        [
            f"- {d['name']}: {d['type']}"
            for d in constructor_dependencies
        ]
    )

    # ==================================================
    # REPLACEMENTS
    # ==================================================

    replacements = {

        "{{FUNCTION_NAME}}":
            function_data.name,

        "{{IS_ASYNC}}":
            is_async_label,

        "{{METHOD_SIGNATURE}}":
            method_signature,

        "{{METHOD_SOURCE}}":
            method_source,

        "{{CALLED_METHODS}}":
            chr(10).join(
                f"- {m}"
                for m in called_methods
            ),

        "{{RELATED_METHODS}}":
            chr(10).join(
                f"- {m}"
                for m in related_methods
            ),

        "{{BUSINESS_RULES}}":
            chr(10).join(
                f"- {r}"
                for r in business_rules
            ),

        "{{BRANCHES}}":
            branches_text,

        "{{DEPENDENCY_USAGES}}":
            dependency_usages_text,

        "{{DEPENDENCY_CALLS}}":
            dependency_calls_text,

        "{{TRANSFORMATIONS}}":
            transformations_text,

        "{{CONSTRUCTOR_DEPENDENCIES}}":
            constructor_dependencies_text,

        "{{RELATED_DTOS}}":
            dto_text,

        "{{RELATED_ENUMS}}":
            enum_text,

        "{{EXISTING_SPEC_FILE}}":
            existing_spec_content,
    }

    for key, value in replacements.items():

        template = template.replace(
            key,
            value or "none",
        )

    logger.info(
        f"Prompt size: {len(template)} chars"
    )

    approx_tokens = len(template) // 4

    logger.info(
        f"Approx tokens: {approx_tokens}"
    )

    logger.info(f"template {template}")

    return template



def build_runtime_repair_prompt(
    *,
    broken_block: str,
    error_message: str,
    method_metadata: str,
) -> str:

    return f"""
METHOD METADATA:
{method_metadata}

BROKEN TEST BLOCK:
{broken_block}

JEST ERROR:
{error_message}
"""


REPAIR_PROMPT_TEMPLATE = """
The following Jest spec failed.

Repair strategy:
1. Identify the failing test
2. Identify the root cause
3. Apply a minimal patch
4. Preserve working tests
5. Preserve imports and mocks

JEST ERRORS:
{jest_stderr}

CURRENT SPEC FILE:
```ts
{spec_content}
"""

def build_repair_prompt(spec_content: str, jest_stderr: str) -> str:
    cleaned_error = (
        jest_stderr
        .strip()[:2500]
    )

    logger.debug(f"cleaned_error: {cleaned_error}")

    return REPAIR_PROMPT_TEMPLATE.format(
        jest_stderr=cleaned_error,
        spec_content=spec_content,
    )
