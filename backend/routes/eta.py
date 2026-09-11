from fastapi import APIRouter, HTTPException
from services.eta_service import calculate_eta
from routes.trains import trains

router = APIRouter()

@router.get("/trains/{train_number}/eta")
def get_train_eta(train_number: str):

    for train in trains:

        if train["train_number"] == train_number:

            predicted_eta = calculate_eta(
                train["distance_km"],
                train["speed_kmh"],
                train["delay"]
            )

            return {
                "train_number": train["train_number"],
                "train_name": train["train_name"],
                "distance_km": train["distance_km"],
                "speed_kmh": train["speed_kmh"],
                "current_delay": train["delay"],
                "predicted_eta_minutes": predicted_eta
            }

    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )