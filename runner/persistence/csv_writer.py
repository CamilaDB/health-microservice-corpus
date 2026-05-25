import pandas as pd

from config import RESULTS_CSV


def save_result(row):

    RESULTS_CSV.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    if RESULTS_CSV.exists():
        df = pd.read_csv(RESULTS_CSV)
    else:
        df = pd.DataFrame()

    df = pd.concat(
        [df, pd.DataFrame([row])],
        ignore_index=True,
    )

    df.to_csv(
        RESULTS_CSV,
        index=False,
    )
