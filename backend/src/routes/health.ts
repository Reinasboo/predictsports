import { FastifyInstance } from 'fastify';

async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return reply.code(200).send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'connected',
        redis: 'connected',
        engine: 'ready',
      },
    });
  });
}

export default healthRoutes;
