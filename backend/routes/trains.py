from fastapi import APIRouter, HTTPException

router = APIRouter()


trains = [
    {
        "train_number": "12627",
        "train_name": "Karnataka Express",
        "current_station": "Bengaluru",
        "next_station": "Yeshwanthpur",
        "distance_km":25,
        "speed_kmh": 60,
        "delay": 10,
        "eta": "10:42 AM"
    },
    {
        "train_number": "12007",
        "train_name": "Shatabdi Express",
        "current_station": "Bengaluru",
        "next_station": "KSR Bengaluru",
        "distance_km": 20,
        "speed_kmh": 70,
        "delay": 5,
        "eta": "11:15 AM"
    }
]


@router.get("/trains")
def get_trains():
    return {
        "trains": trains
    }


@router.get("/trains/{train_number}")
def get_train(train_number: str):

    for train in trains:
        if train["train_number"] == train_number:
            return train

    raise HTTPException(
        status_code=404,
        detail="Train not found"
    )