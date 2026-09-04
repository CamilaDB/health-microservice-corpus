"""
Streamlit exploration dashboard for the frozen experiment.

Deliberately has no metric-calculation logic of its own: every load_*/
build_* call below comes from analysis/experiment_analysis.py, the single
source of truth also used to generate the static tables/figures. This
file only handles filtering, layout, and presentation.
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

import experiment_analysis as ea

st.set_page_config(page_title="TCC Experimental Dashboard", layout="wide")


# ─────────────────────────────────────────────────────────────────────────────
# Cached loads -- all delegate to experiment_analysis.py
# ─────────────────────────────────────────────────────────────────────────────

@st.cache_data
def get_results() -> pd.DataFrame:
    # enforce_single_run=False: this dashboard implements its own run
    # selector (see sidebar_filters below), so it needs every run_id
    # present, not just one -- see load_results' docstring.
    return ea.load_results(enforce_single_run=False)


@st.cache_data
def get_mutation() -> pd.DataFrame:
    # enforce_single_run stays True (the default) here, deliberately unlike
    # get_results/get_errors_raw: mutation/smell post-processing is a
    # separate command launched after generation (see CLAUDE.md, "Run
    # identity and reproducibility"), so its run_id legitimately does not
    # have to equal the generation run_id selected in the sidebar -- only
    # to be internally single-valued, which _enforce_single_run already
    # guarantees (auto-selects if one run_id, raises if more than one).
    # Cross-filtering this by the results-selected run_id would wrongly
    # blank the tab out whenever mutation was run under its own run_id.
    return ea.load_mutation_results()


@st.cache_data
def get_function_mutation() -> pd.DataFrame:
    return ea.load_function_mutation_results()


@st.cache_data
def get_smell() -> pd.DataFrame:
    return ea.load_smell_results()


@st.cache_data
def get_errors_raw() -> pd.DataFrame:
    return ea.load_error_events(enforce_single_run=False)


@st.cache_data
def get_errors_reclassified() -> pd.DataFrame:
    return ea.build_reclassified_error_events(get_errors_raw())


@st.cache_data
def get_manifest(run_id: str | None) -> dict | None:
    return ea.load_latest_run_manifest(run_id)


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


# ─────────────────────────────────────────────────────────────────────────────
# Sidebar filters (UX only -- filtering happens here, calculation does not)
# ─────────────────────────────────────────────────────────────────────────────

def sidebar_filters(df: pd.DataFrame) -> pd.DataFrame:
    st.sidebar.header("Filtros")

    model_options = sorted(df["model"].dropna().unique().tolist()) if "model" in df.columns else []
    strategy_options = sorted(df["strategy"].dropna().unique().tolist()) if "strategy" in df.columns else []
    module_options = sorted(df["module"].dropna().unique().tolist()) if "module" in df.columns else []
    function_options = sorted(df["function"].dropna().unique().tolist()) if "function" in df.columns else []
    run_options = sorted(df["run_id"].dropna().unique().tolist()) if "run_id" in df.columns else []

    selected_run = (
        st.sidebar.selectbox("Execução (run_id)", run_options, index=len(run_options) - 1)
        if run_options else None
    )
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

    return filtered, selected_run


# ─────────────────────────────────────────────────────────────────────────────
# Sections
# ─────────────────────────────────────────────────────────────────────────────

def section_overview(df: pd.DataFrame) -> None:
    st.header("1. Overview")
    st.caption(
        "verified_success_rate exclui observações totalmente skip-repaired "
        "(jest_success == True mas nenhum teste foi de fato verificado). "
        "raw_jest_success_rate é mantida apenas para rastreabilidade."
    )
    summary = ea.build_summary_by_model_strategy(df)
    if summary.empty:
        st.warning("Nenhuma observação corresponde aos filtros selecionados.")
        return

    total_attempted = int(summary["observations_attempted"].sum())
    total_verified = int(summary["verified_eligible_count"].sum())
    total_skipped = int(summary["fully_skipped_count"].sum())
    verified_rate = round(100 * total_verified / total_attempted, 2) if total_attempted else 0.0

    cols = st.columns(5)
    with cols[0]:
        metric_card("Observações tentadas", f"{total_attempted}")
    with cols[1]:
        metric_card("Sucesso verificado", f"{verified_rate:.1f}%", f"{total_verified} observações")
    with cols[2]:
        metric_card("Totalmente skip-repaired", f"{total_skipped}", "excluídas do sucesso verificado")
    with cols[3]:
        mean_cov = df.loc[df["verified_eligible"], "fn_statements_pct"].mean() if "fn_statements_pct" in df.columns else float("nan")
        metric_card("Cobertura média (statements)", f"{mean_cov:.1f}%" if pd.notna(mean_cov) else "n/d")
    with cols[4]:
        mean_tokens = df["tokens"].mean() if "tokens" in df.columns else float("nan")
        metric_card("Tokens médios / observação", f"{mean_tokens:.0f}" if pd.notna(mean_tokens) else "n/d")

    st.subheader("Resultado da execução por modelo × estratégia")
    st.dataframe(summary, use_container_width=True)


def section_model_comparison(df: pd.DataFrame) -> None:
    st.header("2. Model comparison")
    summary = ea.build_summary_by_model_strategy(df)
    if summary.empty:
        return
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Taxa de sucesso verificado")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="verified_success_rate").fillna(0))
    with c2:
        st.subheader("Cobertura de statements média (sucesso verificado)")
        st.bar_chart(summary.pivot(index="model", columns="strategy", values="mean_statement_coverage").fillna(0))
    st.dataframe(summary, use_container_width=True)


def section_strategy_comparison(df: pd.DataFrame) -> None:
    st.header("3. Strategy comparison")
    summary = ea.build_summary_by_model_strategy(df)
    if summary.empty:
        return
    strategy_summary = (
        summary.groupby("strategy", dropna=False)
        .agg(
            verified_success_rate=("verified_success_rate", "mean"),
            mean_statement_coverage=("mean_statement_coverage", "mean"),
            mean_total_tests=("mean_total_tests", "mean"),
            fully_skipped_count=("fully_skipped_count", "sum"),
        )
        .round(2)
        .reset_index()
    )
    st.bar_chart(strategy_summary.set_index("strategy")[["verified_success_rate", "mean_statement_coverage"]])
    st.dataframe(strategy_summary, use_container_width=True)
    st.caption("Média não ponderada entre modelos, por estratégia -- diagnóstico, não um ranking definitivo.")


def section_complexity(df: pd.DataFrame, smell: pd.DataFrame, function_mutation: pd.DataFrame) -> None:
    st.header("4. Complexity analysis (H2)")
    st.caption(
        "H2: a qualidade dos testes gerados diminui com a complexidade ciclomática, mais "
        "fortemente para modelos menores. Ordem de modelo definida pela configuração já "
        "documentada do experimento: gemma4:e2b < qwen2.5-coder:3b < qwen2.5-coder:7b."
    )

    by_model = ea.build_h2_coverage_by_model_ccm(df)
    if by_model.empty:
        st.info("Sem dados de CCM disponíveis.")
        return

    small_n = by_model[by_model["verified_observations"].fillna(0) <= 3]
    if not small_n.empty:
        st.warning(
            "Células com amostra pequena (≤ 3 observações verificadas): "
            + ", ".join(
                f"{row.model}/{row.ccm_band} (n={int(row.verified_observations)})"
                for row in small_n.itertuples()
            )
        )

    st.subheader("Cobertura média de statements por modelo × faixa de CCM")
    pivot = by_model.pivot(index="ccm_band", columns="model", values="mean_statement_coverage")
    st.bar_chart(pivot)

    st.subheader("Tabela H2 completa (modelo × estratégia × faixa de CCM)")
    st.caption(
        "attempted_observations inclui tudo; fully_skipped_observations são não mensuráveis "
        "(passed_tests == 0), NÃO zero de cobertura; as colunas de cobertura vêm somente de "
        "verified_observations."
    )
    full_table = ea.build_h2_coverage_table(df)
    st.dataframe(full_table, use_container_width=True)

    st.subheader("Achado complementar: assertion roulette por CCM (Opção A)")
    st.caption(
        "Function-level e mapeável a CCM, mas sem tendência clara de degradação por "
        "complexidade neste conjunto de dados -- reportado por completude, não usado como "
        "evidência primária de H2."
    )
    h2_smell = ea.build_h2_smell_table(smell) if not smell.empty else pd.DataFrame()
    if not h2_smell.empty:
        st.dataframe(h2_smell, use_container_width=True)
    else:
        st.info("Sem dados de smell disponíveis para os filtros selecionados.")

    st.subheader("Mutation score por faixa de CCM (evidência complementar de H2)")
    st.caption(
        "mutation_results.csv (módulo) NÃO é usado aqui -- um módulo abrange várias faixas de "
        "CCM. Esta tabela vem de mutation_function_results.csv, que mapeia cada mutante Stryker "
        "à função-alvo que o contém (location), não ao módulo inteiro -- ver CLAUDE.md. "
        "mutation_score_corrected é ponderado por mutante (soma antes de dividir), nunca a média "
        "não ponderada das taxas por função. distinct_functions é o tamanho amostral da célula: "
        "10-19 e ≥20 têm poucas funções distintas (5 e 3 de 25)."
    )
    h2_mutation = ea.build_h2_mutation_by_ccm_model(function_mutation) if not function_mutation.empty else pd.DataFrame()
    if not h2_mutation.empty:
        small_n_mut = h2_mutation[h2_mutation["distinct_functions"].fillna(0) <= 3]
        if not small_n_mut.empty:
            st.warning(
                "Células com poucas funções distintas (≤ 3): "
                + ", ".join(
                    f"{row.model}/{row.ccm_band} ({int(row.distinct_functions)} funções, "
                    f"{int(row.mutants_total)} mutantes)"
                    for row in small_n_mut.itertuples()
                )
            )
        pivot_mut = h2_mutation.pivot(index="ccm_band", columns="model", values="mutation_score_corrected")
        st.bar_chart(pivot_mut)
        st.dataframe(h2_mutation, use_container_width=True)
    else:
        st.info("Sem dados de mutação por função disponíveis para os filtros selecionados.")


def section_function_explorer(df: pd.DataFrame) -> None:
    st.header("5. Function-level explorer")
    st.caption("verified_eligible e fully_skipped tornam visível o que jest_success sozinho esconde.")
    detail_cols = [
        "model", "strategy", "module", "function", "fn_id", "ccm",
        "total_tests", "passed_tests", "failed_tests", "pending_tests",
        "jest_success", "verified_eligible", "fully_skipped", "artifact_disposition",
        "fn_statements_pct", "fn_branches_pct", "fn_functions_pct",
    ]
    available = [c for c in detail_cols if c in df.columns]
    details = df[available].copy()
    if "fn_statements_pct" in details.columns:
        details["fn_statements_pct"] = details["fn_statements_pct"].round(2)
    st.dataframe(details, use_container_width=True)

    skipped = df[df["fully_skipped"]] if "fully_skipped" in df.columns else pd.DataFrame()
    if not skipped.empty:
        st.subheader(f"Observações totalmente skip-repaired ({len(skipped)})")
        st.dataframe(skipped[available], use_container_width=True)


def section_errors_and_repairs(errors: pd.DataFrame) -> None:
    st.header("6. Errors and repairs")
    if errors.empty:
        st.info("Nenhum evento de erro disponível para os filtros selecionados.")
        return
    st.caption(
        "error_category/error_subcategory abaixo são os valores RECLASSIFICADOS (Fase 3, diagnóstico); "
        "os originais ficam em error_category_original/error_subcategory_original. "
        "Diagnóstico apenas -- nunca uma métrica de desempenho primária."
    )

    top = ea.build_top_failure_modes(errors, top_n=5)
    st.subheader("Modos de falha mais comuns por modelo × estratégia")
    st.dataframe(top, use_container_width=True)

    st.subheader("Eventos por fase")
    st.dataframe(ea.build_error_summary_by_phase(errors), use_container_width=True)

    st.subheader("Assinaturas de erro repetidas (mesmo error_hash, ≥2 ocorrências)")
    repeated = ea.build_repeated_error_signatures(errors)
    st.dataframe(repeated, use_container_width=True)
    if not repeated.empty:
        st.caption(
            "Uma assinatura repetida em vários attempts geralmente significa que o mecanismo de "
            "repair nunca conseguiu agir sobre essa falha (ex.: falha não parseável) -- não que a "
            "correção foi tentada e falhou repetidamente."
        )


def section_mutation(mutation: pd.DataFrame, function_mutation: pd.DataFrame) -> None:
    st.header("7. Mutation analysis")
    if mutation.empty:
        st.info("Sem resultados de mutação disponíveis.")
        return
    summary = ea.build_mutation_summary_by_model_strategy(mutation)
    st.caption(
        "mutation_score_corrected: killed / (killed+survived+no_coverage+timeout); "
        "compile_error excluído do denominador. mutation_score_stryker_unweighted_mean é o valor "
        "original (média não ponderada por módulo, sem no_coverage) -- mantido só para rastreabilidade. "
        "Esta seção é por MÓDULO (mutation_results.csv); ver a aba Complexity analysis para a "
        "quebra por FUNÇÃO x faixa de CCM (mutation_function_results.csv)."
    )
    chart_df = summary.copy()
    chart_df["group"] = chart_df["model"] + " / " + chart_df["strategy"]
    chart_df = chart_df.set_index("group")

    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Mutation score corrigido")
        st.bar_chart(chart_df[["mutation_score_corrected"]])
    with c2:
        st.subheader("Participação de mutantes sem cobertura (no_coverage_share)")
        st.bar_chart(chart_df[["no_coverage_share"]])
    st.dataframe(summary, use_container_width=True)

    if not function_mutation.empty:
        st.subheader("Detalhe por função (mutation_function_results.csv)")
        st.caption(
            "mutants_killed_by_own_tests vs. mutants_killed_by_other_function_tests: kills "
            "atribuídos via killedBy + marcador FN_<função>_END no nome do teste -- distingue "
            "kills pelos próprios testes da função de kills por testes de uma função irmã no "
            "mesmo módulo."
        )
        fn_cols = [
            "model", "strategy", "module", "function", "fn_id", "ccm",
            "mutants_total", "mutants_killed", "mutants_killed_by_own_tests",
            "mutants_killed_by_other_function_tests", "mutants_survived",
            "mutants_no_coverage", "mutants_timeout", "mutants_unmapped_in_module",
            "mutation_score_corrected", "no_coverage_share",
        ]
        available = [c for c in fn_cols if c in function_mutation.columns]
        st.dataframe(function_mutation[available], use_container_width=True)


def section_smells(smell: pd.DataFrame) -> None:
    st.header("8. Test smells")
    if smell.empty:
        st.info("Sem resultados de test smell disponíveis.")
        return
    summary = ea.build_smell_summary_by_model_strategy(smell)
    st.caption(
        "Taxas calculadas apenas sobre observações com it_active > 0 (measurable_functions). "
        "unmeasurable_functions (totalmente skip-repaired) são excluídas, não tratadas como 0% smell."
    )
    chart_df = summary.copy()
    chart_df["group"] = chart_df["model"] + " / " + chart_df["strategy"]
    st.bar_chart(chart_df.set_index("group")[["assertion_roulette_rate", "empty_test_rate"]])
    st.dataframe(summary, use_container_width=True)


def section_provenance(run_id: str | None) -> None:
    st.header("9. Experiment provenance")
    manifest = get_manifest(run_id)
    if manifest is None:
        st.info("Nenhum run manifest encontrado em experiments/runs/.")
        return

    c1, c2, c3 = st.columns(3)
    with c1:
        metric_card("run_id", str(manifest.get("run_id", "n/d")))
    with c2:
        metric_card("target_count", str(manifest.get("target_count", "n/d")))
    with c3:
        metric_card("error_event_schema_version", str(manifest.get("error_event_schema_version", "n/d")))

    st.subheader("Configuração")
    st.json({
        k: manifest.get(k)
        for k in ("created_at", "unit_of_analysis", "models", "strategies", "temperature",
                   "max_tokens", "max_runtime_repairs", "max_typescript_repairs", "ast_generated_at")
        if k in manifest
    })

    if "corpus_provenance" in manifest:
        cp = manifest["corpus_provenance"]
        st.subheader("Corpus provenance")
        st.write(f"Arquivos: {cp.get('file_count', 'n/d')} — fingerprint: `{cp.get('fingerprint', 'n/d')}`")

    if "prompt_hashes" in manifest:
        st.subheader("Prompt template hashes (SHA-256)")
        st.json(manifest["prompt_hashes"])


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    st.title("Dashboard de resultados experimentais")
    st.caption(
        "Toda métrica aqui vem de analysis/experiment_analysis.py -- nenhum cálculo é "
        "reimplementado neste arquivo."
    )

    df = get_results()
    filtered, selected_run = sidebar_filters(df)

    if filtered.empty:
        st.warning("Nenhum dado corresponde aos filtros selecionados.")
        return

    errors_raw = get_errors_raw()
    if not errors_raw.empty and selected_run and "run_id" in errors_raw.columns:
        errors_raw = errors_raw[errors_raw["run_id"] == selected_run]
    errors = ea.build_reclassified_error_events(errors_raw)
    if not errors.empty:
        if "model" in filtered.columns:
            errors = errors[errors["model"].isin(filtered["model"].unique())]
        if "strategy" in filtered.columns:
            errors = errors[errors["strategy"].isin(filtered["strategy"].unique())]

    # mutation/smell are NOT filtered by selected_run: they are their own
    # single-run-enforced post-processing artifacts (see get_mutation), not
    # necessarily sharing a run_id with the generation run selected above.
    mutation = get_mutation()
    if not mutation.empty:
        if "model" in filtered.columns:
            mutation = mutation[mutation["model"].isin(filtered["model"].unique())]
        if "strategy" in filtered.columns:
            mutation = mutation[mutation["strategy"].isin(filtered["strategy"].unique())]

    function_mutation = get_function_mutation()
    if not function_mutation.empty:
        if "model" in filtered.columns:
            function_mutation = function_mutation[function_mutation["model"].isin(filtered["model"].unique())]
        if "strategy" in filtered.columns:
            function_mutation = function_mutation[function_mutation["strategy"].isin(filtered["strategy"].unique())]

    smell = get_smell()
    if not smell.empty:
        if "model" in filtered.columns:
            smell = smell[smell["model"].isin(filtered["model"].unique())]
        if "strategy" in filtered.columns:
            smell = smell[smell["strategy"].isin(filtered["strategy"].unique())]

    tabs = st.tabs([
        "Overview", "Model comparison", "Strategy comparison", "Complexity analysis",
        "Function explorer", "Errors and repairs", "Mutation analysis", "Test smells",
        "Experiment provenance",
    ])
    with tabs[0]:
        section_overview(filtered)
    with tabs[1]:
        section_model_comparison(filtered)
    with tabs[2]:
        section_strategy_comparison(filtered)
    with tabs[3]:
        section_complexity(filtered, smell, function_mutation)
    with tabs[4]:
        section_function_explorer(filtered)
    with tabs[5]:
        section_errors_and_repairs(errors)
    with tabs[6]:
        section_mutation(mutation, function_mutation)
    with tabs[7]:
        section_smells(smell)
    with tabs[8]:
        section_provenance(selected_run)


if __name__ == "__main__":
    main()
