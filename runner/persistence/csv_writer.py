import pandas as pd

from config import (
    GLOBAL_RESULTS_CSV,
    MUTATION_RESULTS_CSV,
    RESULTS_CSV,
    SERVICE_RESULTS_CSV,
    SMELL_RESULTS_CSV,
)


def save_result(row):
    RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(RESULTS_CSV) if RESULTS_CSV.exists() else pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(RESULTS_CSV, index=False)


def save_service_result(row):
    SERVICE_RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(SERVICE_RESULTS_CSV) if SERVICE_RESULTS_CSV.exists() else pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(SERVICE_RESULTS_CSV, index=False)


def save_global_result(row):
    GLOBAL_RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(GLOBAL_RESULTS_CSV) if GLOBAL_RESULTS_CSV.exists() else pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(GLOBAL_RESULTS_CSV, index=False)


def save_mutation_result(row):
    MUTATION_RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(MUTATION_RESULTS_CSV) if MUTATION_RESULTS_CSV.exists() else pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(MUTATION_RESULTS_CSV, index=False)


def save_smell_result(row):
    SMELL_RESULTS_CSV.parent.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(SMELL_RESULTS_CSV) if SMELL_RESULTS_CSV.exists() else pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(SMELL_RESULTS_CSV, index=False)