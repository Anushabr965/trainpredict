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
                predicted_minutes = round(float(predicted_eta), 2)
            else:
                predicted_minutes = max(5, round((train["distance_km"] / max(train["speed_kmh"], 1)) * 12 + train["delay"], 2))
                prediction_method = "Fallback heuristic"

            return {
                "train_number": train["train_number"],
                "train_name": train["train_name"],
                "distance_km": train["distance_km"],
                "speed_kmh": train["speed_kmh"],
                "current_delay": train["delay"],
                "predicted_eta_minutes": predicted_minutes,
                "prediction_method": prediction_method
            }

    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )