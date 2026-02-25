import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function matchesRoutes(fastify: FastifyInstance) {
  // Get match details
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };

      const match = {
        id: parseInt(id),
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        date: new Date().toISOString(),
        status: 'scheduled',
        homeTeamForm: 'WWWWW',
        awayTeamForm: 'DWWWL',
        headToHead: [
          { date: '2024-01-15', result: '2-2' },
          { date: '2023-12-20', result: '1-0' },
        ],
        injuries: {
          home: ['Bruno Fernandes'],
          away: ['Virgil van Dijk'],
        },
      };

      return reply.code(200).send({
        success: true,
        data: match,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch match',
      });
    }
  });

  // Get match statistics
  fastify.get('/:id/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };

      const stats = {
        matchId: parseInt(id),
        homeTeam: {
          expectedGoals: 1.8,
          possession: 55,
          shots: 12,
          shotsOnTarget: 5,
          passes: 450,
          tackles: 15,
        },
        awayTeam: {
          expectedGoals: 1.2,
          possession: 45,
          shots: 8,
          shotsOnTarget: 3,
          passes: 380,
          tackles: 18,
        },
      };

      return reply.code(200).send({
        success: true,
        data: stats,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch match stats',
      });
    }
  });
}

export default matchesRoutes;
