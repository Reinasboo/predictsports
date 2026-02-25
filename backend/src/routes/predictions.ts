import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getRedis } from '../lib/redis';
import { logger } from '../lib/logger';

const redis = getRedis();

async function predictionsRoutes(fastify: FastifyInstance) {
  // GET /predictions/:matchId - Get predictions for a match
  fastify.get<{ Params: { matchId: string } }>(
    '/:matchId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { matchId } = request.params as any;
      const cacheKey = `predictions:${matchId}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        const predictions = {
          matchId: parseInt(matchId),
          timestamp: new Date().toISOString(),
          probabilities: {
            homeWin: 0.58,
            draw: 0.22,
            awayWin: 0.20,
          },
          goals: {
            over0_5: 0.92,
            over1_5: 0.78,
            over2_5: 0.58,
            over3_5: 0.35,
          },
          bothTeamsToScore: 0.65,
          confidence: 'high',
          topScorelines: [
            { score: '2-1', probability: 0.15 },
            { score: '1-1', probability: 0.12 },
            { score: '2-0', probability: 0.11 },
            { score: '1-0', probability: 0.10 },
            { score: '3-1', probability: 0.08 },
          ],
        };

        await redis!.setEx(cacheKey, 300, JSON.stringify(predictions));

        return reply.code(200).send({
          success: true,
          data: predictions,
        });
      } catch (error) {
        logger.error('Failed to fetch predictions: ' + matchId + ' - ' + String(error));
        return reply.code(500).send({
          success: false,
          error: 'Failed to fetch predictions',
        });
      }
    }
  );

  // POST /predictions/:matchId/simulate - Simulate match scenarios
  fastify.post<{ Params: { matchId: string }; Body: any }>(
    '/:matchId/simulate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { matchId } = request.params as any;
        const { scenario } = request.body as any;

        const simulation = {
          scenario: scenario || 'balanced',
          predictions: {
            homeWin: 0.55,
            draw: 0.25,
            awayWin: 0.20,
          },
          expectedScore: '1-1',
          keyFactors: [
            'Home advantage: +0.05',
            'Form index: Man Utd 8.5 vs Liverpool 8.2',
            'Tactical flexibility: Strong',
          ],
        };

        return reply.code(200).send({
          success: true,
          data: simulation,
        });
      } catch (error) {
        logger.error('Failed to simulate predictions: ' + String(error));
        return reply.code(500).send({
          success: false,
          error: 'Failed to simulate predictions',
        });
      }
    }
  );

  // GET /predictions/confidence/:matchId - Get confidence level
  fastify.get<{ Params: { matchId: string } }>(
    '/confidence/:matchId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { matchId } = request.params as { matchId: string };

        const confidence = {
          matchId: parseInt(matchId),
          level: 'high',
          score: 0.87,
          modelAgreement: 0.91,
          dataCompleteness: 0.94,
          volatilityRating: 0.62,
          reasonsForConfidence: [
            'High model agreement across ensemble',
            'Complete player injury data',
            'Recent form data available for both teams',
          ],
          reasonsForCaution: [
            'Weather conditions uncertain',
            'One referee flagged for inconsistent decisions',
          ],
        };

        return reply.code(200).send({
          success: true,
          data: confidence,
        });
      } catch (error) {
        const matchIdStr = (request.params as { matchId: string }).matchId;
        logger.error('Failed to fetch confidence: ' + matchIdStr + ' - ' + String(error));
        return reply.code(500).send({
          success: false,
          error: 'Failed to fetch confidence',
        });
      }
    }
  );
}

export default predictionsRoutes;
