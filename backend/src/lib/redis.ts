import { createClient } from 'redis';
import { logger } from './logger.js';

let redis: ReturnType<typeof createClient> | null = null;
let redisEnabled = false;

export async function initRedis() {
  try {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redis.on('error', (err: Error) => logger.warn('Redis Client Error', err));
    redis.on('connect', () => {
      logger.info('Redis Client Connected');
      redisEnabled = true;
    });
    redis.on('disconnect', () => {
      logger.warn('Redis Client Disconnected');
      redisEnabled = false;
    });

    await redis.connect();
    redisEnabled = true;
    return redis;
  } catch (error) {
    logger.warn('Redis initialization failed, continuing without Redis:', error);
    redisEnabled = false;
    return null;
  }
}

export function getRedis() {
  if (!redis || !redisEnabled) {
    return null;
  }
  return redis;
}

export { redis };
