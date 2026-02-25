import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { logger } from './lib/logger.js';
import { initDatabase } from './db/connection.js';
import { initRedis } from './lib/redis.js';
import { initTelegramBot } from './services/telegram-bot.js';
import fixturesRoutes from './routes/fixtures.js';
import predictionsRoutes from './routes/predictions.js';
import matchesRoutes from './routes/matches.js';
import liveFeedRoutes from './routes/live-feed.js';
import engineRoutes from './routes/engine.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || '0.0.0.0';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

async function start() {
  try {
    // Initialize database (graceful degradation)
    try {
      await initDatabase();
      logger.info('✅ Database initialized');
    } catch (err) {
      logger.warn('⚠️  Database initialization failed, continuing without database');
    }

    // Initialize Redis (graceful degradation)
    try {
      await initRedis();
      logger.info('✅ Redis initialized');
    } catch (err) {
      logger.warn('⚠️  Redis initialization failed, continuing without Redis');
    }

    // Initialize Telegram Bot (optional)
    try {
      await initTelegramBot();
    } catch (err) {
      logger.warn('⚠️  Telegram bot initialization failed - bot will not be available');
    }

    // Create Fastify server
    const fastify = Fastify({
      logger: ENVIRONMENT === 'production',
    });

    // Register plugins
    await fastify.register(helmet);
    logger.info('✅ Helmet security headers configured');

    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });
    logger.info('✅ CORS configured');

    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
    });
    logger.info('✅ Rate limiting configured');

    // Setup Socket.IO directly
    const io = new Server(fastify.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
      },
    });
    
    // Store io instance on fastify for access in route handlers
    fastify.decorate('io', io);
    logger.info('✅ WebSocket (Socket.IO) configured');

    // Register routes
    await fastify.register(healthRoutes, { prefix: '/api/health' });
    await fastify.register(fixturesRoutes, { prefix: '/api/fixtures' });
    await fastify.register(matchesRoutes, { prefix: '/api/match' });
    await fastify.register(predictionsRoutes, { prefix: '/api/predictions' });
    await fastify.register(liveFeedRoutes, { prefix: '/api/live-feed' });
    await fastify.register(engineRoutes, { prefix: '/api/engine' });

    logger.info('✅ Routes registered');

    // Start server
    await fastify.listen({ host: HOST, port: PORT });
    logger.info(`🚀 Predictsports Backend running at http://${HOST}:${PORT}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
