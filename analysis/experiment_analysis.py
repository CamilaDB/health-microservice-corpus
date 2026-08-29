from __future__ import annotations

import os
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent
RESULTS_CSV = ROOT_DIR / "experiments" / "metrics" / "results.csv"
OUTPUT_DIR = ROOT_DIR / "experiments" / "analysis"
TABLES_DIR = OUTPUT_DIR / "tables"
FIGURES_DIR = OUTPUT_DIR / "figures"
SMELL_RESULTS_CSV = ROOT_DIR / "experiments" / "metrics" / "smell_results.csv"
MUTATION_RESULTS_CSV = ROOT_DIR / "experiments" / "metrics" / "mutation_results.csv"
SMELL_OUTPUT_DIR = OUTPUT_DIR / "smell"
MUTATION_OUTPUT_DIR = OUTPUT_DIR / "mutation"

NUMERIC_COLUMNS = [
    "ccm",
    "duration_ns",
    "tokens",
    "total_tests",
    "passed_tests",
    "failed_tests",
    "pending_tests",
    "fn_statements_total",
    "fn_statements_covered",
    "fn_statements_pct",
    "fn_branches_total",
    "fn_branches_covered",
    "fn_branches_pct",
    "fn_functions_total",
    "fn_functions_covered",
    "fn_functions_pct",
    "fn_lines_total",
    "fn_lines_covered",
    "fn_lines_pct",
]


def _as_bool(series: pd.Series) -> pd.Series:
    """Parse CSV booleans without treating the string 'False' as truthy."""
    return series.astype("string").str.strip().str.lower().isin({"true", "1", "yes"})


def load_results(csv_path: Path = RESULTS_CSV) -> pd.DataFrame:
    if not csv_path.exists():
        raise FileNotFoundError(f"Result CSV not found: {csv_path}")

    df = pd.read_csv(csv_path)
    if "run_id" in df.columns:
        requested_run = os.getenv("EXPERIMENT_RUN_ID")
        run_ids = sorted(df["run_id"].dropna().astype(str).unique().tolist())
        if requested_run:
            df = df[df["run_id"].astype(str) == requested_run].copy()
            if df.empty:
                raise ValueError(f"No observations found for EXPERIMENT_RUN_ID={requested_run}")
        elif len(run_ids) > 1:
            raise ValueError(
                "Multiple run_id values found. Set EXPERIMENT_RUN_ID to analyse one run "
                "and prevent cross-run contamination."
            )
    for column in NUMERIC_COLUMNS:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")
    if "generation_success" in df.columns:
        df["generation_success"] = _as_bool(df["generation_success"])
    if "jest_success" in df.columns:
        df["jest_success"] = _as_bool(df["jest_success"])
    if "analysis_eligible" in df.columns:
        df["analysis_eligible"] = _as_bool(df["analysis_eligible"])
    else:
        # Legacy rows have no explicit eligibility field. Preserve their
        # original function-level interpretation without counting failures.
        df["analysis_eligible"] = (
            df.get("generation_success", False) & df.get("jest_success", False)
        )
    if "strategy" in df.columns:
        df["strategy"] = df["strategy"].fillna("unknown").astype(str)
    if "model" in df.columns:
        df["model"] = df["model"].fillna("unknown").astype(str)
    return df


def build_summary_by_model_strategy(df: pd.DataFrame) -> pd.DataFrame:
    keys = ["model", "strategy"]
    attempted = (
        df.groupby(keys, dropna=False)
        .agg(
            observations_attempted=("function", "size"),
            generation_success_rate=("generation_success", "mean"),
            jest_success_rate=("jest_success", "mean"),
        )
        .reset_index()
    )
    eligible = df[df["analysis_eligible"]].copy()
    grouped = eligible.groupby(keys, dropna=False)
    summary = grouped.agg(
        functions_evaluated=("function", "nunique"),
        mean_total_tests=("total_tests", "mean"),
        median_total_tests=("total_tests", "median"),
        mean_passed_tests=("passed_tests", "mean"),
        mean_failed_tests=("failed_tests", "mean"),
        mean_function_coverage=("fn_functions_pct", "mean"),
        median_function_coverage=("fn_functions_pct", "median"),
    ).reset_index().merge(attempted, on=keys, how="outer")
    summary["functions_evaluated"] = summary["functions_evaluated"].fillna(0).astype(int)
    summary["generation_success_rate"] = (summary["generation_success_rate"] * 100).round(2)
    summary["jest_success_rate"] = (summary["jest_success_rate"] * 100).round(2)
    summary["mean_total_tests"] = summary["mean_total_tests"].round(2)
    summary["median_total_tests"] = summary["median_total_tests"].round(2)
    summary["mean_passed_tests"] = summary["mean_passed_tests"].round(2)
    summary["mean_failed_tests"] = summary["mean_failed_tests"].round(2)
    summary["mean_function_coverage"] = summary["mean_function_coverage"].round(2)
    summary["median_function_coverage"] = summary["median_function_coverage"].round(2)
    return summary.sort_values(["model", "strategy"]).reset_index(drop=True)


def build_summary_by_ccm(df: pd.DataFrame) -> pd.DataFrame:
    if "ccm" not in df.columns:
        return pd.DataFrame(columns=["ccm_band", "functions", "mean_total_tests", "mean_function_coverage"])

    df_copy = df[df["analysis_eligible"]].copy()
    df_copy["ccm_band"] = pd.cut(
        df_copy["ccm"],
        bins=[0, 5, 10, 20, float("inf")],
        labels=["1-5", "6-10", "11-20", ">20"],
        right=False,
    )
    cc_summary = (
        df_copy.groupby("ccm_band", dropna=False, observed=False)
        .agg(
            functions=("function", "nunique"),
            mean_total_tests=("total_tests", "mean"),
            mean_function_coverage=("fn_functions_pct", "mean"),
        )
        .reset_index()
    )
    cc_summary["mean_total_tests"] = cc_summary["mean_total_tests"].round(2)
    cc_summary["mean_function_coverage"] = cc_summary["mean_function_coverage"].round(2)
    return cc_summary


def build_top_functions(df: pd.DataFrame) -> pd.DataFrame:
    top = df[df["analysis_eligible"]][["model", "strategy", "module", "function", "ccm", "total_tests", "passed_tests", "fn_functions_pct"]].copy()
    top = top.sort_values(["model", "strategy", "total_tests"], ascending=[True, True, False]).reset_index(drop=True)
    return top


def _ensure_output_dirs() -> None:
    TABLES_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)


def export_summary_tables(df: pd.DataFrame) -> dict[str, Path]:
    _ensure_output_dirs()
    outputs: dict[str, Path] = {}

    summary_model_strategy = build_summary_by_model_strategy(df)
    summary_model_strategy_path = TABLES_DIR / "summary_by_model_strategy.csv"
    summary_model_strategy.to_csv(summary_model_strategy_path, index=False)
    outputs["summary_by_model_strategy"] = summary_model_strategy_path

    ccm_summary = build_summary_by_ccm(df)
    ccm_summary_path = TABLES_DIR / "summary_by_ccm.csv"
    ccm_summary.to_csv(ccm_summary_path, index=False)
    outputs["summary_by_ccm"] = ccm_summary_path

    top_functions = build_top_functions(df)
    top_functions_path = TABLES_DIR / "top_functions.csv"
    top_functions.to_csv(top_functions_path, index=False)
    outputs["top_functions"] = top_functions_path

    return outputs


def load_smell_results(csv_path: Path = SMELL_RESULTS_CSV) -> pd.DataFrame:
    if not csv_path.exists():
        return pd.DataFrame()

    df = pd.read_csv(csv_path)
    for column in [
        "ccm",
        "it_active",
        "it_skip",
        "assertion_roulette_count",
        "empty_test_count",
        "assertion_roulette_rate",
        "empty_test_rate",
    ]:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")
    return df


def build_smell_summary_by_model_strategy(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=[
            "model",
            "strategy",
            "functions",
            "avg_it_active",
            "avg_assertion_roulette_count",
            "avg_empty_test_count",
            "assertion_roulette_rate",
            "empty_test_rate",
        ])

    summary = (
        df.groupby(["model", "strategy"], dropna=False)
        .agg(
            functions=("function", "nunique"),
            avg_it_active=("it_active", "mean"),
            avg_assertion_roulette_count=("assertion_roulette_count", "mean"),
            avg_empty_test_count=("empty_test_count", "mean"),
            assertion_roulette_rate=("assertion_roulette_rate", "mean"),
            empty_test_rate=("empty_test_rate", "mean"),
        )
        .reset_index()
    )

    summary["avg_it_active"] = summary["avg_it_active"].round(2)
    summary["avg_assertion_roulette_count"] = summary["avg_assertion_roulette_count"].round(2)
    summary["avg_empty_test_count"] = summary["avg_empty_test_count"].round(2)
    summary["assertion_roulette_rate"] = summary["assertion_roulette_rate"].round(2)
    summary["empty_test_rate"] = summary["empty_test_rate"].round(2)
    return summary.sort_values(["model", "strategy"]).reset_index(drop=True)


def export_smell_tables(df: pd.DataFrame) -> dict[str, Path]:
    if df.empty:
        return {}

    SMELL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs: dict[str, Path] = {}

    smell_summary = build_smell_summary_by_model_strategy(df)
    smell_summary_path = SMELL_OUTPUT_DIR / "smell_summary_by_model_strategy.csv"
    smell_summary.to_csv(smell_summary_path, index=False)
    outputs["smell_summary_by_model_strategy"] = smell_summary_path

    return outputs


def plot_smell_rates(df: pd.DataFrame, output_path: Path) -> None:
    if df.empty:
        return

    summary = build_smell_summary_by_model_strategy(df)
    use_df = summary[["model", "strategy", "assertion_roulette_rate", "empty_test_rate"]].copy()

    labels = [f"{row.model}\n{row.strategy}" for _, row in use_df.iterrows()]
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(labels, use_df["assertion_roulette_rate"], label="Assertion Roulette (%)")
    ax.bar(labels, use_df["empty_test_rate"], label="Empty Test (%)", alpha=0.7)
    ax.set_title("Taxa de smells por modelo e estratégia")
    ax.set_ylabel("Taxa (%)")
    ax.legend()
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def export_smell_figures(df: pd.DataFrame) -> dict[str, Path]:
    if df.empty:
        return {}

    SMELL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs: dict[str, Path] = {}
    outputs["smell_rates"] = SMELL_OUTPUT_DIR / "smell_rates.png"
    plot_smell_rates(df, outputs["smell_rates"])
    return outputs


def load_mutation_results(csv_path: Path = MUTATION_RESULTS_CSV) -> pd.DataFrame:
    if not csv_path.exists():
        return pd.DataFrame()

    df = pd.read_csv(csv_path)
    for column in ["mutation_score", "mutants_total", "mutants_killed", "mutants_survived", "mutants_timeout", "mutants_no_coverage", "mutants_compile_error"]:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")
    return df


def build_mutation_summary_by_model_strategy(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["model", "strategy", "modules", "mutation_score", "mutants_total", "mutants_killed"])

    summary = (
        df.groupby(["model", "strategy"], dropna=False)
        .agg(
            modules=("module", "nunique"),
            mutation_score=("mutation_score", "mean"),
            mutants_total=("mutants_total", "sum"),
            mutants_killed=("mutants_killed", "sum"),
        )
        .reset_index()
    )
    summary["mutation_score"] = summary["mutation_score"].round(2)
    return summary.sort_values(["model", "strategy"]).reset_index(drop=True)


def export_mutation_tables(df: pd.DataFrame) -> dict[str, Path]:
    if df.empty:
        return {}

    MUTATION_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs: dict[str, Path] = {}

    mutation_summary = build_mutation_summary_by_model_strategy(df)
    mutation_path = MUTATION_OUTPUT_DIR / "mutation_summary_by_model_strategy.csv"
    mutation_summary.to_csv(mutation_path, index=False)
    outputs["mutation_summary_by_model_strategy"] = mutation_path
    return outputs


def plot_mutation_score(df: pd.DataFrame, output_path: Path) -> None:
    if df.empty:
        return

    summary = build_mutation_summary_by_model_strategy(df)
    fig, ax = plt.subplots(figsize=(10, 6))
    labels = [f"{row.model}\n{row.strategy}" for _, row in summary.iterrows()]
    ax.bar(labels, summary["mutation_score"], color="#c44e52")
    ax.set_title("Mutation score por modelo e estratégia")
    ax.set_ylabel("Mutation score (%)")
    ax.set_ylim(0, 110)
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def export_mutation_figures(df: pd.DataFrame) -> dict[str, Path]:
    if df.empty:
        return {}

    MUTATION_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs: dict[str, Path] = {}
    outputs["mutation_score"] = MUTATION_OUTPUT_DIR / "mutation_score.png"
    plot_mutation_score(df, outputs["mutation_score"])
    return outputs


def plot_mean_tests_by_strategy(df: pd.DataFrame, output_path: Path) -> None:
    summary = build_summary_by_model_strategy(df)
    pivot = summary.pivot(index="model", columns="strategy", values="mean_total_tests").fillna(0)

    fig, ax = plt.subplots(figsize=(10, 6))
    pivot.plot(kind="bar", ax=ax)
    ax.set_title("Média de testes por função por modelo e estratégia")
    ax.set_xlabel("Modelo")
    ax.set_ylabel("Média de testes por função")
    ax.legend(title="Estratégia")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def plot_success_rate_by_strategy(df: pd.DataFrame, output_path: Path) -> None:
    summary = build_summary_by_model_strategy(df)
    pivot = summary.pivot(index="model", columns="strategy", values="jest_success_rate").fillna(0)

    fig, ax = plt.subplots(figsize=(10, 6))
    pivot.plot(kind="bar", ax=ax)
    ax.set_title("Taxa de sucesso de execução do Jest por modelo e estratégia")
    ax.set_xlabel("Modelo")
    ax.set_ylabel("Sucesso (%)")
    ax.legend(title="Estratégia")
    ax.set_ylim(0, 110)
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def plot_coverage_boxplot(df: pd.DataFrame, output_path: Path) -> None:
    if "fn_functions_pct" not in df.columns:
        return

    fig, ax = plt.subplots(figsize=(10, 6))
    df.boxplot(column="fn_functions_pct", by="strategy", ax=ax, grid=False)
    ax.set_title("Distribuição de cobertura por função por estratégia")
    ax.set_xlabel("Estratégia")
    ax.set_ylabel("Cobertura de funções (%)")
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def plot_ccm_vs_tests(df: pd.DataFrame, output_path: Path) -> None:
    if {"ccm", "total_tests"}.difference(df.columns):
        return

    fig, ax = plt.subplots(figsize=(10, 6))
    for strategy, strategy_df in df.groupby("strategy"):
        strategy_df = strategy_df.dropna(subset=["ccm", "total_tests"])
        ax.scatter(strategy_df["ccm"], strategy_df["total_tests"], alpha=0.7, label=strategy)

    ax.set_title("Relação entre complexidade ciclomática e testes gerados")
    ax.set_xlabel("CCM")
    ax.set_ylabel("total_tests")
    ax.legend(title="Estratégia")
    ax.grid(alpha=0.3)
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches="tight")
    plt.close(fig)


def export_figures(df: pd.DataFrame) -> dict[str, Path]:
    _ensure_output_dirs()
    outputs: dict[str, Path] = {}
    outputs["mean_tests_by_strategy"] = FIGURES_DIR / "mean_tests_by_strategy.png"
    outputs["success_rate_by_strategy"] = FIGURES_DIR / "success_rate_by_strategy.png"
    outputs["coverage_boxplot"] = FIGURES_DIR / "coverage_boxplot.png"
    outputs["ccm_vs_tests"] = FIGURES_DIR / "ccm_vs_tests.png"

    plot_mean_tests_by_strategy(df, outputs["mean_tests_by_strategy"])
    plot_success_rate_by_strategy(df, outputs["success_rate_by_strategy"])
    plot_coverage_boxplot(df, outputs["coverage_boxplot"])
    plot_ccm_vs_tests(df, outputs["ccm_vs_tests"])

    return outputs


def dataframe_to_markdown(df: pd.DataFrame) -> str:
    if df.empty:
        return "| Sem dados |"

    headers = [str(column) for column in df.columns]
    rows = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]

    for _, row in df.iterrows():
        values = ["" if pd.isna(value) else str(value) for value in row.tolist()]
        rows.append("| " + " | ".join(values) + " |")

    return "\n".join(rows)


def build_article_markdown(summary: pd.DataFrame, ccm_summary: pd.DataFrame) -> str:
    lines = [
        "# Resumo da análise experimental",
        "",
        "## 1. Visão geral por modelo e estratégia",
        "",
        dataframe_to_markdown(summary),
        "",
        "## 2. Tendência por faixa de complexidade",
        "",
        dataframe_to_markdown(ccm_summary),
        "",
    ]
    return "\n".join(lines)


def generate_analysis_report() -> dict[str, Path]:
    df = load_results()
    outputs = export_summary_tables(df)
    fig_outputs = export_figures(df)
    outputs.update(fig_outputs)

    smell_df = load_smell_results()
    smell_outputs = export_smell_tables(smell_df)
    smell_figures = export_smell_figures(smell_df)
    outputs.update(smell_outputs)
    outputs.update(smell_figures)

    mutation_df = load_mutation_results()
    mutation_outputs = export_mutation_tables(mutation_df)
    mutation_figures = export_mutation_figures(mutation_df)
    outputs.update(mutation_outputs)
    outputs.update(mutation_figures)

    summary = build_summary_by_model_strategy(df)
    ccm_summary = build_summary_by_ccm(df)
    markdown_path = OUTPUT_DIR / "article_summary.md"
    markdown_path.write_text(build_article_markdown(summary, ccm_summary), encoding="utf-8")
    outputs["article_summary"] = markdown_path

    if not smell_df.empty:
        smell_md = OUTPUT_DIR / "smell_summary.md"
        smell_md.write_text(
            "# Test smell summary\n\n" + dataframe_to_markdown(build_smell_summary_by_model_strategy(smell_df)),
            encoding="utf-8",
        )
        outputs["smell_summary"] = smell_md

    if not mutation_df.empty:
        mutation_md = OUTPUT_DIR / "mutation_summary.md"
        mutation_md.write_text(
            "# Mutation summary\n\n" + dataframe_to_markdown(build_mutation_summary_by_model_strategy(mutation_df)),
            encoding="utf-8",
        )
        outputs["mutation_summary"] = mutation_md

    return outputs


if __name__ == "__main__":
    generate_analysis_report()
    print("Analysis artefacts generated at:")
    for path in sorted(OUTPUT_DIR.glob("**/*")):
        if path.is_file():
            print(path.relative_to(ROOT_DIR))
