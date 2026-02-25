import { FastifyInstance } from 'fastify';
import fixturesRoutes from './fixtures.js';
import predictionsRoutes from './predictions.js';
import matchesRoutes from './matches.js';
import liveFeedRoutes from './live-feed.js';

export async function initRoutes(fastify: FastifyInstance) {
  // Mount route groups
  await fastify.register(fixturesRoutes as any, { prefix: '/api/fixtures' });
  await fastify.register(predictionsRoutes as any, { prefix: '/api/predictions' });
  await fastify.register(matchesRoutes as any, { prefix: '/api/matches' });
  await fastify.register(liveFeedRoutes as any, { prefix: '/api/live' });

  // Direct confidence endpoint
  fastify.get<{ Params: { matchId: string } }>(
    '/api/confidence/:matchId',
    async (request: any) => {
      const { matchId } = request.params;
      return {
        success: true,
        data: {
          matchId,
          overallConfidence: 'HIGH',
          scores: {
            modelAgreement: 0.89,
            dataCompleteness: 0.95,
            matchVolatility: 0.42,
            historicalAccuracy: 0.82,
          },
        },
      };
    }
  );

  // Root API info
  fastify.get('/api', async () => ({
    name: 'Predictsports API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      fixtures: '/api/fixtures',
      gameweek: '/api/fixtures/gameweek',
      matches: '/api/matches',
      predictions: '/api/predictions',
      confidence: '/api/confidence/{id}',
      live: '/api/live',
      health: '/health',
    },
  }));
}
