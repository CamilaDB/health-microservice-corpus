# Resumo da análise experimental

## 1. Visão geral por modelo e estratégia

`verified_success_rate` é a métrica corrigida (exclui observações totalmente skip-repaired); `raw_jest_success_rate` é preservada apenas para rastreabilidade.

| model | strategy | observations_attempted | raw_jest_success_rate | fully_skipped_count | verified_eligible_count | verified_success_rate | functions_evaluated | generation_success_rate | mean_total_tests | median_total_tests | mean_passed_tests | mean_failed_tests | mean_function_coverage | median_function_coverage | mean_statement_coverage | mean_branch_coverage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | few_shot | 25 | 32.0 | 0 | 8 | 32.0 | 8 | 84.0 | 2.75 | 2.0 | 2.62 | 0.0 | 93.75 | 100.0 | 89.35 | 59.02 |
| falcon_7b | structured | 25 | 100.0 | 6 | 19 | 76.0 | 19 | 100.0 | 3.42 | 3.0 | 2.05 | 0.0 | 88.6 | 100.0 | 68.39 | 40.48 |
| falcon_7b | zero_shot | 25 | 76.0 | 0 | 19 | 76.0 | 19 | 100.0 | 3.11 | 2.0 | 2.47 | 0.0 | 97.37 | 100.0 | 87.5 | 67.06 |
| gemma_4 | few_shot | 25 | 92.0 | 1 | 22 | 88.0 | 22 | 92.0 | 3.91 | 2.0 | 3.68 | 0.0 | 100.0 | 100.0 | 95.82 | 69.3 |
| gemma_4 | structured | 25 | 96.0 | 1 | 23 | 92.0 | 23 | 100.0 | 4.65 | 3.0 | 4.3 | 0.0 | 100.0 | 100.0 | 97.0 | 70.39 |
| gemma_4 | zero_shot | 25 | 96.0 | 7 | 17 | 68.0 | 17 | 96.0 | 3.53 | 2.0 | 2.24 | 0.0 | 94.12 | 100.0 | 84.91 | 55.79 |
| qwen_4b | few_shot | 25 | 96.0 | 1 | 23 | 92.0 | 23 | 100.0 | 4.17 | 3.0 | 3.96 | 0.0 | 100.0 | 100.0 | 95.13 | 68.81 |
| qwen_4b | structured | 25 | 84.0 | 1 | 20 | 80.0 | 20 | 96.0 | 4.45 | 3.0 | 4.2 | 0.0 | 100.0 | 100.0 | 90.67 | 58.87 |
| qwen_4b | zero_shot | 25 | 96.0 | 2 | 22 | 88.0 | 22 | 100.0 | 5.36 | 4.0 | 4.73 | 0.0 | 90.91 | 100.0 | 84.27 | 59.98 |
| qwen_coder_3b | few_shot | 25 | 92.0 | 3 | 20 | 80.0 | 20 | 92.0 | 3.85 | 2.0 | 2.55 | 0.0 | 94.17 | 100.0 | 82.17 | 56.84 |
| qwen_coder_3b | structured | 25 | 92.0 | 1 | 22 | 88.0 | 22 | 100.0 | 4.14 | 3.0 | 2.91 | 0.0 | 96.97 | 100.0 | 78.25 | 48.47 |
| qwen_coder_3b | zero_shot | 25 | 76.0 | 7 | 12 | 48.0 | 12 | 96.0 | 2.92 | 3.0 | 2.17 | 0.0 | 100.0 | 100.0 | 93.13 | 62.55 |
| qwen_coder_7b | few_shot | 25 | 100.0 | 0 | 25 | 100.0 | 25 | 100.0 | 3.76 | 2.0 | 3.08 | 0.0 | 95.33 | 100.0 | 86.7 | 59.68 |
| qwen_coder_7b | structured | 25 | 96.0 | 1 | 23 | 92.0 | 23 | 100.0 | 4.0 | 3.0 | 3.3 | 0.0 | 94.93 | 100.0 | 87.69 | 62.66 |
| qwen_coder_7b | zero_shot | 25 | 96.0 | 1 | 23 | 92.0 | 23 | 100.0 | 3.83 | 2.0 | 2.87 | 0.0 | 94.93 | 100.0 | 85.05 | 61.8 |

## 2. Tendência por faixa de complexidade (todos os modelos agregados)

| ccm_band | functions | mean_total_tests | mean_function_coverage | mean_statement_coverage | mean_branch_coverage |
| --- | --- | --- | --- | --- | --- |
| 1-4 | 12 | 2.05 | 99.38 | 97.13 | 53.85 |
| 5-9 | 5 | 4.38 | 100.0 | 85.12 | 75.37 |
| 10-19 | 5 | 6.88 | 81.73 | 67.55 | 60.69 |
| ≥20 | 3 | 8.27 | 96.67 | 70.56 | 66.74 |

## 3. H2 -- complexidade x modelo (cobertura de statements/branches)

Evidência primária de H2 (Opção C): cobertura por modelo × estratégia × faixa de CCM, sobre observações de sucesso verificado. `attempted_observations` inclui tudo; `fully_skipped_observations` são não mensuráveis (não zero); as colunas de cobertura vêm apenas de `verified_observations`. Ver `docs/experimental-workflow.md` para o achado negativo da Opção A (assertion roulette).

| model | strategy | ccm_band | attempted_observations | fully_skipped_observations | verified_observations | distinct_functions | mean_statement_coverage | median_statement_coverage | q1_statement_coverage | q3_statement_coverage | mean_branch_coverage | median_branch_coverage | q1_branch_coverage | q3_branch_coverage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | few_shot | 1-4 | 12 | 0 | 5 | 5 | 100.0 | 100.0 | 100.0 | 100.0 | 60.0 | 100.0 | 0.0 | 100.0 |
| falcon_7b | few_shot | 5-9 | 5 | 0 | 1 | 1 | 100.0 | 100.0 | 100.0 | 100.0 | 83.33 | 83.33 | 83.33 | 83.33 |
| falcon_7b | few_shot | 10-19 | 5 | 0 | 1 | 1 | 14.81 | 14.81 | 14.81 | 14.81 | 3.12 | 3.12 | 3.12 | 3.12 |
| falcon_7b | few_shot | ≥20 | 3 | 0 | 1 | 1 | 100.0 | 100.0 | 100.0 | 100.0 | 85.71 | 85.71 | 85.71 | 85.71 |
| falcon_7b | structured | 1-4 | 12 | 1 | 11 | 11 | 89.09 | 100.0 | 100.0 | 100.0 | 50.0 | 50.0 | 0.0 | 100.0 |
| falcon_7b | structured | 5-9 | 5 | 2 | 3 | 3 | 32.36 | 38.89 | 28.54 | 39.44 | 22.92 | 25.0 | 18.75 | 28.12 |
| falcon_7b | structured | 10-19 | 5 | 3 | 2 | 2 | 17.75 | 17.75 | 16.28 | 19.22 | 6.92 | 6.92 | 5.02 | 8.81 |
| falcon_7b | structured | ≥20 | 3 | 0 | 3 | 3 | 62.31 | 73.53 | 50.28 | 79.94 | 45.48 | 50.0 | 38.64 | 54.59 |
| falcon_7b | zero_shot | 1-4 | 12 | 0 | 10 | 10 | 98.18 | 100.0 | 100.0 | 100.0 | 66.67 | 100.0 | 16.67 | 100.0 |
| falcon_7b | zero_shot | 5-9 | 5 | 0 | 4 | 4 | 89.95 | 89.9 | 86.67 | 93.18 | 81.25 | 81.25 | 71.88 | 90.62 |
| falcon_7b | zero_shot | 10-19 | 5 | 0 | 3 | 3 | 50.65 | 57.14 | 35.98 | 68.57 | 48.26 | 66.67 | 34.89 | 70.84 |
| falcon_7b | zero_shot | ≥20 | 3 | 0 | 2 | 2 | 84.49 | 84.49 | 79.01 | 89.97 | 68.88 | 68.88 | 59.44 | 78.32 |
| gemma_4 | few_shot | 1-4 | 12 | 0 | 12 | 12 | 98.48 | 100.0 | 100.0 | 100.0 | 54.17 | 75.0 | 0.0 | 100.0 |
| gemma_4 | few_shot | 5-9 | 5 | 0 | 5 | 5 | 98.18 | 100.0 | 100.0 | 100.0 | 90.0 | 87.5 | 87.5 | 100.0 |
| gemma_4 | few_shot | 10-19 | 5 | 1 | 3 | 3 | 90.15 | 94.59 | 85.22 | 97.3 | 85.68 | 91.18 | 81.31 | 92.81 |
| gemma_4 | few_shot | ≥20 | 3 | 0 | 2 | 2 | 82.43 | 82.43 | 73.64 | 91.22 | 83.8 | 83.8 | 79.78 | 87.82 |
| gemma_4 | structured | 1-4 | 12 | 0 | 12 | 12 | 100.0 | 100.0 | 100.0 | 100.0 | 56.94 | 91.66 | 0.0 | 100.0 |
| gemma_4 | structured | 5-9 | 5 | 0 | 5 | 5 | 98.89 | 100.0 | 100.0 | 100.0 | 88.75 | 87.5 | 87.5 | 93.75 |
| gemma_4 | structured | 10-19 | 5 | 1 | 4 | 4 | 94.09 | 96.8 | 92.92 | 97.98 | 80.59 | 78.18 | 76.31 | 82.46 |
| gemma_4 | structured | ≥20 | 3 | 0 | 2 | 2 | 80.16 | 80.16 | 72.51 | 87.8 | 84.82 | 84.82 | 80.29 | 89.35 |
| gemma_4 | zero_shot | 1-4 | 12 | 2 | 10 | 10 | 100.0 | 100.0 | 100.0 | 100.0 | 58.33 | 91.66 | 0.0 | 100.0 |
| gemma_4 | zero_shot | 5-9 | 5 | 3 | 2 | 2 | 80.91 | 80.91 | 80.46 | 81.36 | 62.5 | 62.5 | 62.5 | 62.5 |
| gemma_4 | zero_shot | 10-19 | 5 | 1 | 4 | 4 | 58.24 | 66.47 | 41.38 | 83.34 | 49.42 | 51.34 | 34.82 | 65.94 |
| gemma_4 | zero_shot | ≥20 | 3 | 1 | 1 | 1 | 48.65 | 48.65 | 48.65 | 48.65 | 42.42 | 42.42 | 42.42 | 42.42 |
| qwen_4b | few_shot | 1-4 | 12 | 0 | 12 | 12 | 100.0 | 100.0 | 100.0 | 100.0 | 56.94 | 91.66 | 0.0 | 100.0 |
| qwen_4b | few_shot | 5-9 | 5 | 1 | 4 | 4 | 97.73 | 100.0 | 97.73 | 100.0 | 79.17 | 83.34 | 68.75 | 93.75 |
| qwen_4b | few_shot | 10-19 | 5 | 0 | 5 | 5 | 88.58 | 89.66 | 89.19 | 90.0 | 83.42 | 92.86 | 82.35 | 95.0 |
| qwen_4b | few_shot | ≥20 | 3 | 0 | 2 | 2 | 77.03 | 77.03 | 65.54 | 88.51 | 82.81 | 82.81 | 76.26 | 89.36 |
| qwen_4b | structured | 1-4 | 12 | 1 | 11 | 11 | 90.91 | 100.0 | 75.0 | 100.0 | 34.85 | 50.0 | 0.0 | 50.0 |
| qwen_4b | structured | 5-9 | 5 | 0 | 3 | 3 | 91.48 | 94.44 | 87.22 | 97.22 | 83.33 | 87.5 | 75.0 | 93.75 |
| qwen_4b | structured | 10-19 | 5 | 0 | 4 | 4 | 91.51 | 91.13 | 85.23 | 97.41 | 90.58 | 94.72 | 89.95 | 95.36 |
| qwen_4b | structured | ≥20 | 3 | 0 | 2 | 2 | 86.48 | 86.48 | 79.73 | 93.24 | 90.88 | 90.88 | 89.38 | 92.38 |
| qwen_4b | zero_shot | 1-4 | 12 | 1 | 11 | 11 | 100.0 | 100.0 | 100.0 | 100.0 | 54.55 | 100.0 | 0.0 | 100.0 |
| qwen_4b | zero_shot | 5-9 | 5 | 0 | 5 | 5 | 89.14 | 88.89 | 81.82 | 100.0 | 83.33 | 87.5 | 66.67 | 100.0 |
| qwen_4b | zero_shot | 10-19 | 5 | 1 | 4 | 4 | 60.84 | 71.68 | 42.86 | 89.66 | 56.76 | 65.07 | 33.33 | 88.5 |
| qwen_4b | zero_shot | ≥20 | 3 | 0 | 2 | 2 | 32.43 | 32.43 | 16.22 | 48.64 | 37.88 | 37.88 | 18.94 | 56.82 |
| qwen_coder_3b | few_shot | 1-4 | 12 | 1 | 11 | 11 | 99.17 | 100.0 | 100.0 | 100.0 | 60.61 | 100.0 | 0.0 | 100.0 |
| qwen_coder_3b | few_shot | 5-9 | 5 | 1 | 3 | 3 | 75.76 | 100.0 | 63.64 | 100.0 | 68.06 | 87.5 | 56.25 | 89.58 |
| qwen_coder_3b | few_shot | 10-19 | 5 | 1 | 3 | 3 | 30.88 | 20.69 | 17.75 | 38.92 | 21.28 | 10.71 | 6.92 | 30.36 |
| qwen_coder_3b | few_shot | ≥20 | 3 | 0 | 3 | 3 | 77.53 | 91.18 | 68.56 | 93.32 | 67.38 | 75.0 | 57.2 | 81.38 |
| qwen_coder_3b | structured | 1-4 | 12 | 0 | 12 | 12 | 89.58 | 100.0 | 75.0 | 100.0 | 36.11 | 50.0 | 0.0 | 50.0 |
| qwen_coder_3b | structured | 5-9 | 5 | 0 | 4 | 4 | 56.68 | 59.72 | 38.07 | 78.34 | 55.21 | 60.42 | 50.0 | 65.62 |
| qwen_coder_3b | structured | 10-19 | 5 | 1 | 4 | 4 | 67.57 | 76.64 | 55.85 | 88.36 | 62.17 | 74.54 | 51.21 | 85.51 |
| qwen_coder_3b | structured | ≥20 | 3 | 0 | 2 | 2 | 74.75 | 74.75 | 64.4 | 85.1 | 81.79 | 81.79 | 75.74 | 87.84 |
| qwen_coder_3b | zero_shot | 1-4 | 12 | 2 | 8 | 8 | 91.48 | 100.0 | 80.11 | 100.0 | 45.83 | 50.0 | 0.0 | 75.0 |
| qwen_coder_3b | zero_shot | 5-9 | 5 | 1 | 2 | 2 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| qwen_coder_3b | zero_shot | 10-19 | 5 | 1 | 2 | 2 | 92.85 | 92.85 | 89.28 | 96.43 | 91.94 | 91.94 | 90.42 | 93.47 |
| qwen_coder_3b | zero_shot | ≥20 | 3 | 3 | 0 | 0 |  |  |  |  |  |  |  |  |
| qwen_coder_7b | few_shot | 1-4 | 12 | 0 | 12 | 12 | 100.0 | 100.0 | 100.0 | 100.0 | 56.94 | 91.66 | 0.0 | 100.0 |
| qwen_coder_7b | few_shot | 5-9 | 5 | 0 | 5 | 5 | 75.7 | 81.82 | 80.0 | 83.33 | 60.0 | 62.5 | 62.5 | 75.0 |
| qwen_coder_7b | few_shot | 10-19 | 5 | 0 | 5 | 5 | 78.04 | 85.19 | 67.57 | 85.71 | 68.12 | 62.5 | 55.88 | 72.22 |
| qwen_coder_7b | few_shot | ≥20 | 3 | 0 | 3 | 3 | 66.24 | 73.53 | 51.63 | 84.49 | 56.02 | 50.0 | 40.15 | 68.88 |
| qwen_coder_7b | structured | 1-4 | 12 | 0 | 12 | 12 | 100.0 | 100.0 | 100.0 | 100.0 | 56.94 | 91.66 | 0.0 | 100.0 |
| qwen_coder_7b | structured | 5-9 | 5 | 0 | 5 | 5 | 94.14 | 100.0 | 88.89 | 100.0 | 87.5 | 100.0 | 75.0 | 100.0 |
| qwen_coder_7b | structured | 10-19 | 5 | 1 | 4 | 4 | 56.85 | 56.29 | 19.22 | 93.92 | 47.8 | 46.53 | 8.81 | 85.51 |
| qwen_coder_7b | structured | ≥20 | 3 | 0 | 2 | 2 | 59.4 | 59.4 | 45.91 | 72.88 | 64.56 | 64.56 | 55.0 | 74.12 |
| qwen_coder_7b | zero_shot | 1-4 | 12 | 0 | 11 | 11 | 100.0 | 100.0 | 100.0 | 100.0 | 62.12 | 100.0 | 0.0 | 100.0 |
| qwen_coder_7b | zero_shot | 5-9 | 5 | 0 | 5 | 5 | 89.7 | 100.0 | 81.82 | 100.0 | 75.83 | 75.0 | 62.5 | 91.67 |
| qwen_coder_7b | zero_shot | 10-19 | 5 | 1 | 4 | 4 | 53.0 | 53.59 | 19.22 | 87.37 | 45.59 | 42.12 | 8.81 | 78.9 |
| qwen_coder_7b | zero_shot | ≥20 | 3 | 0 | 3 | 3 | 65.25 | 82.35 | 54.69 | 84.35 | 58.85 | 65.62 | 46.44 | 74.65 |

## 4. H2 -- complexidade x modelo (mutation score, evidência complementar)

`mutation_function_results.csv` mapeia cada mutante Stryker à função-alvo que o contém (via `location`), não ao módulo inteiro -- por isso, ao contrário do `mutation_results.csv` bruto (uma linha por módulo, que cobre várias faixas de CCM), esta tabela é uma agregação genuína por função, ponderada por mutante (soma de killed/survived/no_coverage/timeout antes de calcular a taxa, nunca a média não ponderada das taxas por função). `mutants_killed_by_own_tests` isola os kills atribuíveis aos próprios testes da função (via `killedBy` e o marcador `FN_<função>_END` no nome do teste), separando-os de kills por testes de uma função irmã no mesmo módulo. Ver a coluna `distinct_functions` para o tamanho amostral de cada célula -- as faixas `11-20` e `>20` têm poucas funções distintas (5 e 3 de 25) e devem ser lidas com essa ressalva.

| model | ccm_band | distinct_functions | mutants_total | mutants_killed | mutants_killed_by_own_tests | no_coverage_share | mutation_score_corrected |
| --- | --- | --- | --- | --- | --- | --- | --- |
| falcon_7b | 1-4 | 12 | 174 | 86 | 80 | 30.46 | 49.43 |
| falcon_7b | 5-9 | 5 | 318 | 90 | 90 | 58.49 | 28.3 |
| falcon_7b | 10-19 | 5 | 951 | 66 | 53 | 89.91 | 6.94 |
| falcon_7b | ≥20 | 3 | 864 | 259 | 259 | 46.3 | 29.98 |
| gemma_4 | 1-4 | 12 | 174 | 154 | 151 | 4.02 | 88.51 |
| gemma_4 | 5-9 | 5 | 318 | 194 | 194 | 24.84 | 61.01 |
| gemma_4 | 10-19 | 5 | 951 | 456 | 417 | 33.02 | 47.95 |
| gemma_4 | ≥20 | 3 | 864 | 285 | 285 | 51.85 | 32.99 |
| qwen_4b | 1-4 | 12 | 174 | 123 | 119 | 13.22 | 70.69 |
| qwen_4b | 5-9 | 5 | 318 | 150 | 150 | 32.39 | 47.17 |
| qwen_4b | 10-19 | 5 | 951 | 436 | 410 | 25.87 | 45.85 |
| qwen_4b | ≥20 | 3 | 864 | 279 | 279 | 48.84 | 32.29 |
| qwen_coder_3b | 1-4 | 12 | 174 | 122 | 114 | 10.34 | 70.11 |
| qwen_coder_3b | 5-9 | 5 | 318 | 106 | 106 | 49.37 | 33.33 |
| qwen_coder_3b | 10-19 | 5 | 951 | 156 | 150 | 64.56 | 16.4 |
| qwen_coder_3b | ≥20 | 3 | 864 | 230 | 230 | 53.01 | 26.62 |
| qwen_coder_7b | 1-4 | 12 | 174 | 150 | 150 | 0.57 | 86.71 |
| qwen_coder_7b | 5-9 | 5 | 318 | 193 | 193 | 14.15 | 60.69 |
| qwen_coder_7b | 10-19 | 5 | 951 | 284 | 258 | 47.63 | 29.86 |
| qwen_coder_7b | ≥20 | 3 | 864 | 312 | 312 | 32.87 | 36.11 |
