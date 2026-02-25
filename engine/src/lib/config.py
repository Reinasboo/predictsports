import os
from functools import lru_cache

class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://predictsports:predictsports_dev@localhost:5432/predictsports"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
