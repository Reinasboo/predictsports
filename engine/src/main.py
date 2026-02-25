from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import logging
from contextlib import asynccontextmanager
from src.routes import predictions, health
from src.lib.redis_client import init_redis, close_redis
from src.lib.logger import logger

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Predictsports AI Engine")
    await init_redis()
    yield
    logger.info("🛑 Shutting down Predictsports AI Engine")
    await close_redis()

# Create FastAPI app
app = FastAPI(
    title="Predictsports AI Engine",
    description="AI-powered football prediction engine",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(predictions.router, prefix="/predictions", tags=["predictions"])

@app.get("/")
async def root():
    return {
        "service": "Predictsports AI Engine",
        "version": "1.0.0",
        "status": "running"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
