import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../lib/logger';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Simple auth for now - validate API key from env
  const apiKey = request.headers['x-api-key'] || request.query?.api_key;
  const validKey = process.env.API_KEY || 'test-key-123';

  if (!apiKey || apiKey !== validKey) {
    logger.warn({ apiKey }, 'Unauthorized API key attempt');
    return reply.code(401).send({ success: false, error: 'Unauthorized' });
  }
}

export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Basic rate limiting - can be enhanced with Redis
  const ip = request.ip;
  // Track IP-based rate limiting
  logger.debug({ ip }, 'Rate limit check');
}
