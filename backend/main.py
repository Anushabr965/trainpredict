from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.trains import router as trains_router
from routes.eta import router as eta_router


app = FastAPI(
    title="RailPredict API",
    description="Dynamic ETA Prediction System for Coaching Trains",
    version="1.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROUTES
# =====================================================

app.include_router(
    trains_router,
    prefix="/api"
)

app.include_router(
    eta_router,
    prefix="/api"
)


# =====================================================
# CONTROL ROOM
# =====================================================

@app.get("/")
def root():
    return {
        "message": "RailPredict API is running"
    }


@app.get("/control-room/analyze")
def analyze_control_room(
    speed_kmh: float,
    current_delay: float,
    weather_factor: int = 0,
    congestion_level: int = 1
):

    alerts = []


    # -------------------------------------------------
    # TRAIN DELAY
    # -------------------------------------------------

    if current_delay > 15:

        alerts.append({
            "alert": "Critical Train Delay",
            "severity": "Critical",
            "action": "Recalculate ETA"
        })


    # -------------------------------------------------
    # TRACK CONGESTION
    # -------------------------------------------------

    if congestion_level == 3:

        alerts.append({
            "alert": "High Track Congestion",
            "severity": "High",
            "action": "Monitor Traffic"
        })


    # -------------------------------------------------
    # WEATHER
    # -------------------------------------------------

    if weather_factor == 2:

        alerts.append({
            "alert": "Severe Weather",
            "severity": "High",
            "action": "Reduce Speed"
        })


    # -------------------------------------------------
    # LOW SPEED
    # -------------------------------------------------

    if speed_kmh < 40:

        alerts.append({
            "alert": "Low Train Speed",
            "severity": "Warning",
            "action": "Monitor Speed"
        })


    # -------------------------------------------------
    # NETWORK STATUS
    # -------------------------------------------------

    if any(
        alert["severity"] == "Critical"
        for alert in alerts
    ):

        network_status = "Disruption"

    elif alerts:

        network_status = "Warning"

    else:

        network_status = "Normal"


    return {
        "network_status": network_status,
        "alert_count": len(alerts),
        "alerts": alerts
    }