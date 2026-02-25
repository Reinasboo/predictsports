import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function liveFeedRoutes(fastify: FastifyInstance) {
  // Get live matches
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const liveMatches = [
        {
          id: 1,
          homeTeam: 'Manchester City',
          awayTeam: 'Tottenham',
          minute: 35,
          score: '1-0',
          status: 'live',
          lastEvent: {
            type: 'goal',
            team: 'home',
            player: 'Erling Haaland',
            minute: 28,
          },
        },
        {
          id: 2,
          homeTeam: 'Newcastle United',
          awayTeam: 'Aston Villa',
          minute: 15,
          score: '0-0',
          status: 'live',
          lastEvent: null,
        },
      ];

      return reply.code(200).send({
        success: true,
        data: liveMatches,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch live feed',
      });
    }
  });

  // Get specific live match
  fastify.get('/:matchId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { matchId } = request.params as { matchId: string };

      const liveMatch = {
        id: parseInt(matchId),
        homeTeam: 'Manchester City',
        awayTeam: 'Tottenham',
        minute: 45,
        score: '2-0',
        status: 'live',
        homeTeamStats: {
          possession: 62,
          shots: 8,
          shotsOnTarget: 4,
        },
        awayTeamStats: {
          possession: 38,
          shots: 3,
          shotsOnTarget: 1,
        },
        events: [
          {
            minute: 28,
            type: 'goal',
            team: 'home',
            player: 'Erling Haaland',
          },
          {
            minute: 42,
            type: 'goal',
            team: 'home',
            player: 'Kevin De Bruyne',
          },
        ],
      };

      return reply.code(200).send({
        success: true,
        data: liveMatch,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch live match',
      });
    }
  });
}

export default liveFeedRoutes;
