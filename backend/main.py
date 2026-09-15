from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routes.trains import router as train_router
from routes.eta import router as eta_router


BASE_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DIR = BASE_DIR / "frontend"


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
    return FileResponse(FRONTEND_DIR / "index.html")


app.include_router(train_router, prefix="/api")
app.include_router(eta_router, prefix="/api")

app.mount("", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")