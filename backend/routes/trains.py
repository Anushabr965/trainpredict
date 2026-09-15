from fastapi import APIRouter, HTTPException

router = APIRouter()


trains = [
    {
        "train_number": "12009",
        "train_name": "Shatabdi Express",
        "current_station": "Bengaluru City",
        "next_station": "Yeshwanthpur",
        "distance_km": 28,
        "speed_kmh": 78,
        "delay": 4,
        "eta": "10:42 AM"
    },
    {
        "train_number": "12677",
        "train_name": "Karnataka Express",
        "current_station": "Mysuru Junction",
        "next_station": "Bengaluru City",
        "distance_km": 132,
        "speed_kmh": 66,
        "delay": 9,
        "eta": "11:15 AM"
    },
    {
        "train_number": "16526",
        "train_name": "Chamundi Express",
        "current_station": "Bengaluru Cantt",
        "next_station": "KSR Bengaluru",
        "distance_km": 18,
        "speed_kmh": 52,
        "delay": 12,
        "eta": "09:58 AM"
    },
    {
        "train_number": "22635",
        "train_name": "Vande Bharat",
        "current_station": "Hubballi",
        "next_station": "Bengaluru City",
        "distance_km": 400,
        "speed_kmh": 90,
        "delay": 2,
        "eta": "12:20 PM"
    },
    {
        "train_number": "16595",
        "train_name": "Mysuru Express",
        "current_station": "Krishnarajapuram",
        "next_station": "Mysuru Junction",
        "distance_km": 118,
        "speed_kmh": 58,
        "delay": 7,
        "eta": "10:55 AM"
    },
    {
        "train_number": "17325",
        "train_name": "Intercity Express",
        "current_station": "Yesvantpur",
        "next_station": "Bengaluru Cantonment",
        "distance_km": 24,
        "speed_kmh": 61,
        "delay": 5,
        "eta": "11:02 AM"
    },
    {
        "train_number": "11019",
        "train_name": "Mysuru - Chennai Express",
        "current_station": "Bengaluru Cantonment",
        "next_station": "Katpadi",
        "distance_km": 302,
        "speed_kmh": 49,
        "delay": 15,
        "eta": "01:18 PM"
    },
    {
        "train_number": "12138",
        "train_name": "Udyan Express",
        "current_station": "KSR Bengaluru",
        "next_station": "Mysuru Junction",
        "distance_km": 126,
        "speed_kmh": 72,
        "delay": 3,
        "eta": "10:50 AM"
    },
    {
        "train_number": "12431",
        "train_name": "Rajdhani Express",
        "current_station": "Hubballi",
        "next_station": "Bengaluru City",
        "distance_km": 399,
        "speed_kmh": 82,
        "delay": 6,
        "eta": "12:05 PM"
    },
    {
        "train_number": "12952",
        "train_name": "Golden Chariot",
        "current_station": "Kengeri",
        "next_station": "Ramanagara",
        "distance_km": 86,
        "speed_kmh": 43,
        "delay": 11,
        "eta": "09:40 AM"
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