import { logger } from '../lib/logger';
import { getRedis } from '../lib/redis';

const redis = getRedis();

export class DataNormalizationService {
  /**
   * Normalize team IDs across different data sources
   */
  async normalizeTeamId(sourceId: number, source: string): Promise<string> {
    const cacheKey = `team:${source}:${sourceId}`;
    
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const normalizedId = `PSP_TEAM_${sourceId}`;
    if (redis) {
      await redis.set(cacheKey, normalizedId);
    }
    return normalizedId;
  }

  /**
   * Normalize player IDs
   */
  async normalizePlayerId(sourceId: number, source: string): Promise<string> {
    const cacheKey = `player:${source}:${sourceId}`;
    
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const normalizedId = `PSP_PLAYER_${sourceId}`;
    if (redis) {
      await redis.set(cacheKey, normalizedId);
    }
    return normalizedId;
  }

  /**
   * Normalize match IDs
   */
  async normalizeMatchId(sourceId: number, source: string): Promise<string> {
    const cacheKey = `match:${source}:${sourceId}`;
    
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const normalizedId = `PSP_MATCH_${sourceId}`;
    if (redis) {
      await redis.set(cacheKey, normalizedId);
    }
    return normalizedId;
  }

  /**
   * Merge fixture data from multiple sources
   */
  async mergeFixtures(sources: any[]): Promise<any> {
    // Combine data, prioritizing complete information
    const merged = {
      id: sources[0]?.id,
      homeTeam: { ...sources[0]?.homeTeam },
      awayTeam: { ...sources[0]?.awayTeam },
      date: sources[0]?.date,
      status: sources[0]?.status,
      xG: sources[1]?.xG, // From Understat
      injuries: sources[2]?.injuries, // From Transfermarkt
      weather: sources[3]?.weather, // From OpenWeatherMap
      odds: sources[4]?.odds, // From Odds API
    };

    return merged;
  }

  /**
   * Normalize odds format across different providers
   */
  async normalizeOdds(odds: any, provider: string): Promise<any> {
    let normalized = { ...odds };

    switch (provider) {
      case 'betfair':
        // Convert Betfair fractional to decimal
        normalized.decimal = 1 + odds.fractional;
        break;
      case 'pinnacle':
        // Already in decimal format
        break;
      default:
        logger.warn('Unknown odds provider: ' + provider);
    }

    return normalized;
  }
}

export class DataValidationService {
  /**
   * Validate fixture data completeness
   */
  validateFixture(fixture: any): { valid: boolean; score: number; missing: string[] } {
    const missing: string[] = [];
    const required = ['homeTeam', 'awayTeam', 'date', 'status', 'league'];

    required.forEach((field) => {
      if (!fixture[field]) {
        missing.push(field);
      }
    });

    const score = (required.length - missing.length) / required.length;

    return {
      valid: missing.length === 0,
      score,
      missing,
    };
  }

  /**
   * Validate prediction data
   */
  validatePrediction(prediction: any): boolean {
    const { homeWin, draw, awayWin } = prediction.probabilities || {};

    if (!homeWin || !draw || !awayWin) {
      return false;
    }

    const total = homeWin + draw + awayWin;
    return Math.abs(total - 1.0) < 0.01; // Allow 1% margin
  }
}
