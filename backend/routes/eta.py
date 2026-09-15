from fastapi import APIRouter, HTTPException
import joblib
import pandas as pd
from pathlib import Path

from routes.trains import trains

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "ml_model" / "linear_regression_model.pkl"


def load_model_or_fallback():
    if MODEL_PATH.exists():
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            pass

    return None


model = load_model_or_fallback()


# =====================================================
# NORMAL ETA
# =====================================================

@router.get("/trains/{train_number}/eta")
def get_train_eta(train_number: str):

    for train in trains:

        if train["train_number"] == train_number:

            if model is not None:

                input_data = pd.DataFrame([{
                    "distance_km": train["distance_km"],
                    "speed_kmh": train["speed_kmh"],
                    "current_delay": train["delay"],
                    "scheduled_time_minutes": 25,
                    "weather_factor": 0,
                    "congestion_level": 1
                }])

                predicted_eta = model.predict(input_data)[0]

                prediction_method = "Linear Regression ML"

                predicted_minutes = round(
                    float(predicted_eta),
                    2
                )

            else:

                predicted_minutes = max(
                    5,
                    round(
                        (
                            train["distance_km"]
                            / max(train["speed_kmh"], 1)
                        ) * 12
                        + train["delay"],
                        2
                    )
                )

                prediction_method = "Fallback heuristic"


            return {

                "train_number":
                    train["train_number"],

                "train_name":
                    train["train_name"],

                "distance_km":
                    train["distance_km"],

                "speed_kmh":
                    train["speed_kmh"],

                "current_delay":
                    train["delay"],

                "predicted_eta_minutes":
                    predicted_minutes,

                "prediction_method":
                    prediction_method

            }


    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )


# =====================================================
# DYNAMIC ETA
# =====================================================

@router.get("/trains/{train_number}/dynamic-eta")
def get_dynamic_train_eta(
    train_number: str,
    speed_kmh: float,
    current_delay: float,
    weather_factor: int = 0,
    congestion_level: int = 1
):

    # -------------------------------------------------
    # FIND TRAIN
    # -------------------------------------------------

    for train in trains:

        if train["train_number"] == train_number:

            # -------------------------------------------------
            # VALIDATE INPUT
            # -------------------------------------------------

            if speed_kmh <= 0:

                raise HTTPException(
                    status_code=400,
                    detail="Speed must be greater than zero"
                )


            if current_delay < 0:

                raise HTTPException(
                    status_code=400,
                    detail="Delay cannot be negative"
                )


            if weather_factor not in [0, 1, 2]:

                raise HTTPException(
                    status_code=400,
                    detail="Weather factor must be 0, 1, or 2"
                )


            if congestion_level not in [1, 2, 3]:

                raise HTTPException(
                    status_code=400,
                    detail="Congestion level must be 1, 2, or 3"
                )


            # -------------------------------------------------
            # ML PREDICTION
            # -------------------------------------------------

            if model is not None:

                input_data = pd.DataFrame([{

                    "distance_km":
                        train["distance_km"],

                    "speed_kmh":
                        speed_kmh,

                    "current_delay":
                        current_delay,

                    "scheduled_time_minutes":
                        25,

                    "weather_factor":
                        weather_factor,

                    "congestion_level":
                        congestion_level

                }])


                predicted_eta = model.predict(
                    input_data
                )[0]


                predicted_minutes = round(
                    float(predicted_eta),
                    2
                )


                prediction_method = (
                    "Linear Regression ML"
                )


            # -------------------------------------------------
            # FALLBACK
            # -------------------------------------------------

            else:

                predicted_minutes = max(

                    5,

                    round(

                        (
                            train["distance_km"]
                            / max(speed_kmh, 1)
                        ) * 12

                        + current_delay

                        + (weather_factor * 5)

                        + (congestion_level - 1) * 4,

                        2
                    )
                )


                prediction_method = (
                    "Fallback heuristic"
                )


            # -------------------------------------------------
            # RETURN RESULT
            # -------------------------------------------------

            return {

                "train_number":
                    train["train_number"],

                "train_name":
                    train["train_name"],

                "distance_km":
                    train["distance_km"],

                "speed_kmh":
                    speed_kmh,

                "current_delay":
                    current_delay,

                "weather_factor":
                    weather_factor,

                "congestion_level":
                    congestion_level,

                "predicted_eta_minutes":
                    predicted_minutes,

                "prediction_method":
                    prediction_method

            }


    # -------------------------------------------------
    # TRAIN NOT FOUND
    # -------------------------------------------------

    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )