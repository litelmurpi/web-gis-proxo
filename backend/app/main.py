from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx
from app.api import endpoints
from app.api import simulation

@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.client = httpx.AsyncClient(timeout=30.0)
    yield

    await app.state.client.aclose()

app = FastAPI(
    title="UrbanInsight AI Backend", 
    version="2.0", 
    description="API for RL-driven Urban Planning",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "UrbanInsight AI API v2.0 is running"}
