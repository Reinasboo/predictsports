import redis.asyncio as redis
import os
import logging

logger = logging.getLogger(__name__)

redis_client = None

async def init_redis():
    global redis_client
    redis_client = await redis.from_url(
        os.getenv("REDIS_URL", "redis://localhost:6379"),
        encoding="utf8",
        decode_responses=True
    )
    logger.info("✅ Redis connected")

async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("✅ Redis closed")

def get_redis():
    if not redis_client:
        raise RuntimeError("Redis not initialized")
    return redis_client
