from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

ROOT_DIR = Path(__file__).resolve().parent.parent
RESULTS_PATH = ROOT_DIR / "experiments" / "metrics" / "results.csv"
MUTATION_PATH = ROOT_DIR / "experiments" / "metrics" / "mutation_results.csv"
SMELL_PATH = ROOT_DIR / "experiments" / "metrics" / "smell_results.csv"


def _as_bool(series: pd.Series) -> pd.Series:
    return series.astype("string").str.strip().str.lower().isin({"true", "1", "yes"})


def load_data(path: Path = RESULTS_PATH) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Results CSV not found: {path}")

    df = pd.read_csv(path)
    for column in [
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
    ]:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    if "generation_success" in df.columns:
        df["generation_success"] = _as_bool(df["generation_success"])
    if "jest_success" in df.columns:
        df["jest_success"] = _as_bool(df["jest_success"])
    if "analysis_eligible" in df.columns:
        df["analysis_eligible"] = _as_bool(df["analysis_eligible"])
    else:
        df["analysis_eligible"] = df.get("generation_success", False) & df.get("jest_success", False)

    return df


@st.cache_data
def get_data() -> pd.DataFrame:
    return load_data()


@st.cache_data
def get_mutation_data() -> pd.DataFrame:
    if not MUTATION_PATH.exists():
        return pd.DataFrame()

    df = pd.read_csv(MUTATION_PATH)
    if "mutation_score" in df.columns:
        df["mutation_score"] = pd.to_numeric(df["mutation_score"], errors="coerce")
    return df


def sidebar_filters(df: pd.DataFrame) -> pd.DataFrame:
    st.sidebar.header("Filtros")

    model_options = sorted(df["model"].dropna().unique().tolist()) if "model" in df.columns else []
    strategy_options = sorted(df["strategy"].dropna().unique().tolist()) if "strategy" in df.columns else []
    module_options = sorted(df["module"].dropna().unique().tolist()) if "module" in df.columns else []
    function_options = sorted(df["function"].dropna().unique().tolist()) if "function" in df.columns else []
    run_options = sorted(df["run_id"].dropna().unique().tolist()) if "run_id" in df.columns else []

    selected_run = st.sidebar.selectbox("Execu\u00e7\u00e3o", run_options, index=len(run_options) - 1) if run_options else None
    selected_models = st.sidebar.multiselect("Modelo", model_options, default=model_options)
    selected_strategies = st.sidebar.multiselect("Estratégia", strategy_options, default=strategy_options)
    selected_modules = st.sidebar.multiselect("Módulo", module_options, default=module_options)
    selected_functions = st.sidebar.multiselect("Função", function_options, default=function_options)

    filtered = df.copy()
    if selected_run:
        filtered = filtered[filtered["run_id"] == selected_run]
    if selected_models:
        filtered = filtered[filtered["model"].isin(selected_models)]
    if selected_strategies:
        filtered = filtered[filtered["strategy"].isin(selected_strategies)]
    if selected_modules:
        filtered = filtered[filtered["module"].isin(selected_modules)]
    if selected_functions:
        filtered = filtered[filtered["function"].isin(selected_functions)]

    return filtered


def metric_card(label: str, value: str, delta: str | None = None) -> None:
    st.markdown(
        f"""
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem;">
          <div style="color: #666; font-size: 0.8rem;">{label}</div>
          <div style="font-size: 1.8rem; font-weight: 700; margin-top: 0.2rem;">{value}</div>
          {f'<div style="color: #666; font-size: 0.8rem; margin-top: 0.2rem;">{delta}</div>' if delta else ''}
        </div>
        """,
        unsafe_allow_html=True,
    )


st.set_page_config(page_title="TCC Experimental Dashboard", layout="wide")


def main() -> None:
    df = get_data()
    filtered = sidebar_filters(df)

    st.title("Dashboard de resultados experimentais")
    st.caption("Análise principal baseada em execuções por função (modelo × estratégia × função).")

    if filtered.empty:
        st.warning("Nenhum dado corresponde aos filtros selecionados.")
        return

    total_rows = len(filtered)
    eligible = filtered[filtered["analysis_eligible"]].copy()
    if eligible.empty:
        st.warning("Nenhuma observa\u00e7\u00e3o eleg\u00edvel para a an\u00e1lise principal.")
        return
    mean_tests = eligible["total_tests"].mean() if "total_tests" in eligible.columns else 0
    mean_coverage = eligible["fn_functions_pct"].mean() if "fn_functions_pct" in eligible.columns else 0
    success_rate = (
        filtered["jest_success"].mean() * 100 if "jest_success" in filtered.columns else 0
    )

    mean_tokens = filtered["tokens"].mean() if "tokens" in filtered.columns else 0
    mean_duration_ms = (
        (filtered["duration_ns"].mean() / 1_000_000) if "duration_ns" in filtered.columns else 0
    )

    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("Observações", f"{total_rows}")
    col2.metric("Média total_tests", f"{mean_tests:.2f}")
    col3.metric("Cobertura média", f"{mean_coverage:.2f}%")
    col4.metric("Sucesso do Jest", f"{success_rate:.1f}%")
    col5.metric("Tokens médios", f"{mean_tokens:.0f}")

    summary = (
        eligible.groupby(["model", "strategy"], dropna=False)
        .agg(
            functions=("function", "nunique"),
            mean_total_tests=("total_tests", "mean"),
            mean_coverage=("fn_functions_pct", "mean"),
            mean_tokens=("tokens", "mean"),
            mean_duration_ms=("duration_ns", "mean"),
            mean_runtime_repairs=("runtime_repairs", "mean"),
        )
        .reset_index()
    )
    success_rates = (
        filtered.groupby(["model", "strategy"], dropna=False)
        .agg(jest_success_rate=("jest_success", "mean"))
        .reset_index()
    )
    summary = summary.merge(success_rates, on=["model", "strategy"], how="left")
    summary["mean_total_tests"] = summary["mean_total_tests"].round(2)
    summary["mean_coverage"] = summary["mean_coverage"].round(2)
    summary["jest_success_rate"] = (summary["jest_success_rate"] * 100).round(2)
    summary["mean_tokens"] = summary["mean_tokens"].round(0)
    summary["mean_duration_ms"] = (summary["mean_duration_ms"] / 1_000_000).round(2)
    summary["mean_runtime_repairs"] = summary["mean_runtime_repairs"].round(2)

    if "model" in summary.columns:
        model_summary = (
            summary.groupby("model", dropna=False)
            .agg(
                mean_total_tests=("mean_total_tests", "mean"),
                mean_coverage=("mean_coverage", "mean"),
                jest_success_rate=("jest_success_rate", "mean"),
                mean_tokens=("mean_tokens", "mean"),
                mean_duration_ms=("mean_duration_ms", "mean"),
                mean_runtime_repairs=("mean_runtime_repairs", "mean"),
            )
            .reset_index()
        )
        if not model_summary.empty:
            model_summary["quality_score"] = (
                0.45 * model_summary["jest_success_rate"]
                + 0.35 * model_summary["mean_coverage"]
                + 0.20 * model_summary["mean_total_tests"]
            )
            model_summary["cost_penalty"] = (
                0.35 * model_summary["mean_duration_ms"]
                + 0.15 * model_summary["mean_tokens"] / 1000
            )
            model_summary["overall_rank_score"] = (
                model_summary["quality_score"] - model_summary["cost_penalty"]
            )
            model_summary = model_summary.sort_values("overall_rank_score", ascending=False).reset_index(drop=True)

    chart_col1, chart_col2 = st.columns(2)
    with chart_col1:
        st.subheader("Média de testes por modelo e estratégia")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="mean_total_tests").fillna(0))

    with chart_col2:
        st.subheader("Taxa de sucesso do Jest")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="jest_success_rate").fillna(0))

    chart_col3, chart_col4 = st.columns(2)
    with chart_col3:
        st.subheader("Tokens médios por modelo e estratégia")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="mean_tokens").fillna(0))

    with chart_col4:
        st.subheader("Tempo médio de geração (ms)")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="mean_duration_ms").fillna(0))

    if "runtime_repairs" in filtered.columns:
        repair_summary = (
            filtered.groupby(["model", "strategy"], dropna=False)
            .agg(mean_runtime_repairs=("runtime_repairs", "mean"), total_runtime_repairs=("runtime_repairs", "sum"))
            .reset_index()
        )
        st.subheader("Retentativas de reparo por modelo e estratégia")
        st.bar_chart(repair_summary.pivot(index="model", columns="strategy", values="total_runtime_repairs").fillna(0))

    if "model" in summary.columns and "model_summary" in locals():
        st.subheader("Ranking geral do melhor modelo")
        st.dataframe(model_summary[["model", "jest_success_rate", "mean_coverage", "mean_total_tests", "mean_duration_ms", "mean_tokens", "overall_rank_score"]], use_container_width=True)

    if "model" in summary.columns and "model_summary" in locals():
        tradeoff_df = model_summary[["model", "mean_duration_ms", "mean_runtime_repairs", "jest_success_rate"]].copy()
        st.subheader("Trade-off: retentativas × tempo × qualidade")
        st.scatter_chart(
            tradeoff_df,
            x="mean_duration_ms",
            y="mean_runtime_repairs",
            color="model",
        )

    strategy_summary = (
        summary.groupby("strategy", dropna=False)
        .agg(
            mean_total_tests=("mean_total_tests", "mean"),
            mean_coverage=("mean_coverage", "mean"),
            jest_success_rate=("jest_success_rate", "mean"),
            mean_runtime_repairs=("mean_runtime_repairs", "mean"),
            mean_tokens=("mean_tokens", "mean"),
        )
        .reset_index()
    )
    if not strategy_summary.empty:
        strategy_summary["quality_score"] = (
            0.45 * strategy_summary["jest_success_rate"]
            + 0.35 * strategy_summary["mean_coverage"]
            + 0.20 * strategy_summary["mean_total_tests"]
        )
        strategy_summary["cost_penalty"] = (
            0.35 * strategy_summary["mean_runtime_repairs"]
            + 0.15 * strategy_summary["mean_tokens"] / 1000
        )
        strategy_summary["strategy_rank_score"] = (
            strategy_summary["quality_score"] - strategy_summary["cost_penalty"]
        )
        strategy_summary = strategy_summary.sort_values("strategy_rank_score", ascending=False).reset_index(drop=True)

        st.subheader("Ranking da melhor estratégia de prompt")
        st.dataframe(
            strategy_summary[["strategy", "jest_success_rate", "mean_coverage", "mean_total_tests", "mean_runtime_repairs", "mean_tokens", "strategy_rank_score"]],
            use_container_width=True,
        )

    mutation_df = get_mutation_data()
    if not mutation_df.empty:
        mutation_summary = (
            mutation_df.groupby(["model", "strategy"], dropna=False)
            .agg(mutation_score=("mutation_score", "mean"), mutants_total=("mutants_total", "sum"))
            .reset_index()
        )
        st.subheader("Mutation score por modelo e estratégia")
        st.bar_chart(mutation_summary.pivot(index="model", columns="strategy", values="mutation_score").fillna(0))

    if {"ccm", "total_tests"}.issubset(filtered.columns):
        st.subheader("Relação entre CCM e quantidade de testes")
        scatter_df = filtered[["model", "strategy", "ccm", "total_tests"]].dropna()
        st.scatter_chart(scatter_df, x="ccm", y="total_tests", color="strategy")

    st.subheader("Tabela resumida")
    st.dataframe(summary, use_container_width=True)

    st.subheader("Detalhes por função")
    detail_cols = [
        "model",
        "strategy",
        "module",
        "function",
        "ccm",
        "total_tests",
        "passed_tests",
        "failed_tests",
        "tokens",
        "duration_ns",
        "runtime_repairs",
        "fn_functions_pct",
        "jest_success",
    ]
    details = filtered[detail_cols].copy()
    if "fn_functions_pct" in details.columns:
        details["fn_functions_pct"] = details["fn_functions_pct"].round(2)
    if "duration_ns" in details.columns:
        details["duration_ns"] = (details["duration_ns"] / 1_000_000).round(2)
    st.dataframe(details, use_container_width=True)


if __name__ == "__main__":
    main()
