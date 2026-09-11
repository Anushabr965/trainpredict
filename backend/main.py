from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.trains import router as train_router
from routes.eta import router as eta_router


app = FastAPI(
    title="RailPredict API",
    description="Dynamic Train ETA Prediction System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "RailPredict Backend is running!",
        "status": "success"
    }


app.include_router(train_router)
app.include_router(eta_router)