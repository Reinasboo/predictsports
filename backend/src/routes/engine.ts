import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function engineRoutes(fastify: FastifyInstance) {
  // Get detailed match analysis
  fastify.get('/match/:matchId/analysis', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { matchId } = request.params as { matchId: string };

      const analysis = {
        matchId: parseInt(matchId),
        summary: 'Manchester United has slight advantage with superior form',
        keyFactors: [
          'Home advantage worth ~0.3 goals',
          'Manchester United on 5-game winning streak',
          'Liverpool missing key defender Virgil van Dijk',
          'Expected goal differential favors Manchester United',
        ],
        modelBreakdown: {
          poissonModel: 0.62,
          logisticRegression: 0.55,
          formModel: 0.58,
          tacticModel: 0.60,
          marketModel: 0.56,
        },
        recommendation: 'Manchester United Win',
        riskFactors: [
          'High volatility match (derby)',
          'Recent penalty variance against this referee',
        ],
      };

      return reply.code(200).send({
        success: true,
        data: analysis,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch analysis',
      });
    }
  });

  // Compare teams
  fastify.post('/compare-teams', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { homeTeamId, awayTeamId } = request.body as { homeTeamId: string; awayTeamId: string };

      const comparison = {
        homeTeam: {
          name: 'Manchester United',
          attackingStrength: 0.85,
          defensiveStrength: 0.78,
          formIndex: 0.88,
          winRate: 0.62,
        },
        awayTeam: {
          name: 'Liverpool',
          attackingStrength: 0.82,
          defensiveStrength: 0.75,
          formIndex: 0.75,
          winRate: 0.58,
        },
        advantages: {
          home: ['Form', 'Home advantage'],
          away: ['Attacking depth'],
        },
      };

      return reply.code(200).send({
        success: true,
        data: comparison,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to compare teams',
      });
    }
  });

  // AI Chat endpoint
  fastify.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { message, matchId, context } = request.body as { message: string; matchId?: string; context?: string };

      const response = {
        message: 'Manchester United has a 58% probability of winning based on our ensemble model. Key factors include their superior form (5W-0L) and home advantage. However, Liverpool poses a significant threat with their attacking prowess.',
        followUpQuestions: [
          'What about their head-to-head record?',
          'How do injuries affect this prediction?',
          'What does the odds market suggest?',
        ],
      };

      return reply.code(200).send({
        success: true,
        data: response,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to process chat',
      });
    }
  });
}

export default engineRoutes;
