import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { Server } from 'socket.io';
import { initRoutes } from './routes/index.js';
import { setupWebSocket } from './services/websocket.js';
import { logger } from './lib/logger.js';
import { env } from './lib/env.js';

export async function createApp() {
  const fastify = Fastify({
    logger: true,
    trustProxy: true,
  });

  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(cors, {
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  });

  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT,
    timeWindow: `${env.RATE_LIMIT_WINDOW}s`,
  });

  // Setup Socket.IO directly
  const io = new Server(fastify.server, {
    cors: {
      origin: env.CORS_ORIGINS.split(','),
      credentials: true,
    },
  });

  // Attach io instance to fastify for access in handlers
  fastify.decorate('io', io);

  // Setup WebSocket handlers
  setupWebSocket(fastify);

  // Register routes
  initRoutes(fastify);

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  return fastify;
}
