import { apiFootballClient, footballDataClient, oddsApiClient } from './api'
import { getRedis } from '../lib/redis.js'
import { logger } from '../lib/logger.js'

const redis = getRedis()

export class FixtureProvider {
  async getFixtures(leagueId: number = 39) {
    try {
      // Try primary source
      const cacheKey = `fixtures:league:${leagueId}`
      
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      }

      const response = await apiFootballClient.get('/fixtures', {
        params: { league: leagueId, season: 2024 },
      })

      const fixtures = response.data?.response || []
      if (redis) {
        await redis.setEx(cacheKey, 3600, JSON.stringify(fixtures))
      }

      return fixtures
    } catch (err) {
      logger.warn('API-Football failed, trying Football-Data.org')

      // Fallback to secondary source
      try {
        const response = await footballDataClient.get('/competitions/PL/matches')
        return response.data?.matches || []
      } catch (fallbackErr) {
        logger.error('All fixture sources failed: ' + String(fallbackErr))
        throw fallbackErr
      }
    }
  }

  async getLiveMatches() {
    try {
      const response = await apiFootballClient.get('/fixtures', {
        params: { live: 'all' },
      })
      return response.data?.response || []
    } catch (err) {
      logger.error('Failed to fetch live matches: ' + String(err))
      return []
    }
  }

  async getMatchDetails(matchId: number) {
    try {
      const cacheKey = `match:${matchId}`
      
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      }

      const response = await apiFootballClient.get('/fixtures', {
        params: { id: matchId },
      })

      const match = response.data?.response?.[0]
      if (match && redis) {
        await redis.setEx(cacheKey, 1800, JSON.stringify(match))
      }

      return match
    } catch (err) {
      logger.error('Failed to fetch match details: ' + String(err))
      throw err
    }
  }
}

export class OddsProvider {
  async getOdds(matchId: string) {
    try {
      const cacheKey = `odds:${matchId}`
      
      if (redis) {
        const cached = await redis.get(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      }

      const response = await oddsApiClient.get('/sports/soccer_epl/odds', {
        params: { regions: 'uk', markets: 'h2h' },
      })

      const odds = response.data?.events || []
      if (redis) {
        await redis.setEx(cacheKey, 300, JSON.stringify(odds))
      }

      return odds
    } catch (err) {
      logger.error('Failed to fetch odds: ' + String(err))
      return []
    }
  }
}

export const fixtureProvider = new FixtureProvider()
export const oddsProvider = new OddsProvider()
