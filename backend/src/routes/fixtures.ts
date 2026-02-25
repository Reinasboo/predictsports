import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getRedis } from '../lib/redis';
import { logger } from '../lib/logger';

const redis = getRedis();

export async function fixturesRoutes(fastify: FastifyInstance) {
  // GET /fixtures - Get upcoming/live fixtures
  fastify.get<{ Querystring: { league?: string; status?: string; limit?: string } }>(
    '/',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { league = 'all', status = 'upcoming', limit = '20' } = request.query as any;
      const cacheKey = `fixtures:${league}:${status}:${limit}`;

      try {
        // Try cache first
        if (redis) {
          const cached = await redis.get(cacheKey);
          if (cached) {
            return JSON.parse(cached);
          }
        }

        // Fetch from data pipeline - sample data
        const fixtures = [
          {
            id: 1,
            internalId: 'PSP_FIX_001',
            homeTeam: {
              id: 1,
              name: 'Manchester United',
              logo: 'https://example.com/mu.png',
              form: 'WWLWW',
            },
            awayTeam: {
              id: 2,
              name: 'Liverpool',
              logo: 'https://example.com/lfc.png',
              form: 'WWWLW',
            },
            date: new Date(Date.now() + 86400000).toISOString(),
            status: status === 'all' ? 'scheduled' : status,
            league: 'Premier League',
            confidence: 0.87,
            predictions: {
              homeWin: 0.52,
              draw: 0.28,
              awayWin: 0.20,
              overUnder: { under2_5: 0.45, over2_5: 0.55 },
            },
          },
          {
            id: 2,
            internalId: 'PSP_FIX_002',
            homeTeam: {
              id: 3,
              name: 'Arsenal',
              logo: 'https://example.com/afc.png',
              form: 'WWWWL',
            },
            awayTeam: {
              id: 4,
              name: 'Chelsea',
              logo: 'https://example.com/cfc.png',
              form: 'LWWWW',
            },
            date: new Date(Date.now() + 172800000).toISOString(),
            status: status === 'all' ? 'scheduled' : status,
            league: 'Premier League',
            confidence: 0.92,
            predictions: {
              homeWin: 0.58,
              draw: 0.25,
              awayWin: 0.17,
              overUnder: { under2_5: 0.42, over2_5: 0.58 },
            },
          },
        ];

        // Cache for 5 minutes
        if (redis) {
          await redis.setEx(cacheKey, 300, JSON.stringify(fixtures));
        }

        return reply.code(200).send({
          success: true,
          data: fixtures.slice(0, parseInt(limit)),
          total: fixtures.length,
        });
      } catch (error) {
        logger.error('Failed to fetch fixtures: ' + cacheKey + ' - ' + String(error));
        return reply.code(500).send({ success: false, error: 'Failed to fetch fixtures' });
      }
    }
  );

  // GET /fixtures/live - Get live match data
  fastify.get<{ Querystring: { limit?: string } }>(
    '/live',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { limit = '10' } = request.query as any;
      const cacheKey = 'fixtures:live:current';

      try {
        let cached;
        if (redis) {
          cached = await redis.get(cacheKey);
        }
        if (cached) {
          return JSON.parse(cached);
        }

        const liveMatches = [
          {
            id: 100,
            homeTeam: { name: 'Tottenham', score: 2 },
            awayTeam: { name: 'Brighton', score: 1 },
            status: 'live',
            elapsed: 67,
            events: [
              { minute: 23, type: 'goal', team: 'home', player: 'Kane' },
              { minute: 41, type: 'card', team: 'away', player: 'Moder', card: 'yellow' },
              { minute: 55, type: 'goal', team: 'home', player: 'Richarlison' },
            ],
          },
        ];

        if (redis) {
          await redis.setEx(cacheKey, 30, JSON.stringify(liveMatches));
        } // Cache for 30 seconds

        return reply.code(200).send({
          success: true,
          data: liveMatches.slice(0, parseInt(limit)),
          total: liveMatches.length,
        });
      } catch (error) {
        logger.error('Failed to fetch live matches: ' + String(error));
        return reply.code(500).send({ success: false, error: 'Failed to fetch live matches' });
      }
    }
  );

  // GET /fixtures/:id - Get fixture details
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as any;
      const cacheKey = `fixture:${id}`;

      try {
        let cached;
        if (redis) {
          cached = await redis.get(cacheKey);
        }
        if (cached) {
          return JSON.parse(cached);
        }

        const fixture = {
          id: parseInt(id),
          homeTeam: {
            id: 1,
            name: 'Manchester United',
            xG: 1.8,
            shots: 12,
            possession: 58,
          },
          awayTeam: {
            id: 2,
            name: 'Liverpool',
            xG: 2.1,
            shots: 14,
            possession: 42,
          },
          predictions: {
            homeWin: 0.52,
            draw: 0.28,
            awayWin: 0.20,
            btts: 0.65,
            over2_5: 0.72,
          },
          confidence: 'high',
          scenarios: [
            { name: 'Balanced Tactical', probability: 0.45 },
            { name: 'Home Dominance', probability: 0.35 },
            { name: 'Upset', probability: 0.20 },
          ],
        };

        if (!fixture) {
          return reply.code(404).send({ success: false, error: 'Fixture not found' });
        }

        if (redis) {
          await redis.setEx(cacheKey, 600, JSON.stringify(fixture));
        } // Cache for 10 minutes

        return reply.code(200).send({ success: true, data: fixture });
      } catch (error) {
        logger.error('Failed to fetch fixture: ' + id + ' - ' + String(error));
        return reply.code(500).send({ success: false, error: 'Failed to fetch fixture' });
      }
    }
  );

  // GET /fixtures/gameweek/:week - Get gameweek fixtures
  fastify.get<{ Params: { week: string }; Querystring: { league?: string } }>(
    '/gameweek/:week',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { week } = request.params as any;
      const { league = 'all' } = request.query as any;
      const cacheKey = `gameweek:${week}:${league}`;

      try {
        let cached;
        if (redis) {
          cached = await redis.get(cacheKey);
        }
        if (cached) {
          return JSON.parse(cached);
        }
          week: parseInt(week),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 604800000).toISOString(),
          fixtures: 10,
          stats: {
            averageConfidence: 0.89,
            totalMatches: 10,
            preferredBets: 'home_wins',
          },
          matches: [
            {
              id: 1,
              homeTeam: 'Manchester United',
              awayTeam: 'Liverpool',
              confidence: 0.87,
            },
            {
              id: 2,
              homeTeam: 'Arsenal',
              awayTeam: 'Chelsea',
              confidence: 0.92,
            },
          ],
        };

        if (redis) {
          await redis.setEx(cacheKey, 600, JSON.stringify(gameweek));
        }

        return reply.code(200).send({
          success: true,
          data: gameweek,
        });
      } catch (error) {
        logger.error('Failed to fetch gameweek: ' + week + ' - ' + String(error));
        return reply.code(500).send({
          success: false,
          error: 'Failed to fetch gameweek',
        });
      }
    }
  );
}

export default fixturesRoutes;
