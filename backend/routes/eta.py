from fastapi import APIRouter, HTTPException
import joblib
import pandas as pd
from pathlib import Path

from routes.trains import trains

router = APIRouter()

# Load trained ML model

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "ml_model" / "linear_regression_model.pkl"

model = joblib.load(MODEL_PATH)


@router.get("/trains/{train_number}/eta")
def get_train_eta(train_number: str):

    # Find train
    for train in trains:

        if train["train_number"] == train_number:

            # Prepare input for ML model
            input_data = pd.DataFrame([{
                "distance_km": train["distance_km"],
                "speed_kmh": train["speed_kmh"],
                "current_delay": train["delay"],
                "scheduled_time_minutes": 25,
                "weather_factor": 0,
                "congestion_level": 1
            }])

            # Predict ETA
            predicted_eta = model.predict(input_data)[0]

            return {
                "train_number": train["train_number"],
                "train_name": train["train_name"],
                "distance_km": train["distance_km"],
                "speed_kmh": train["speed_kmh"],
                "current_delay": train["delay"],
                "predicted_eta_minutes": round(float(predicted_eta), 2),
                "prediction_method": "Linear Regression ML"
            }

    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )