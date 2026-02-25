import axios from 'axios';
import { logger } from '../lib/logger.js';

// Premier League API endpoints - can be local or remote
const PL_API_BASE_URL = process.env.PL_API_URL || 'http://localhost:5000';

export interface PlayerStats {
  name: string;
  position: string;
  club: string;
  nationality: string;
  dateOfBirth: string;
  height: string;
  keyStats: any;
}

export interface LeagueTableRow {
  position: string;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDifference: number;
  points: number;
}

export interface Fixture {
  date: string;
  homeTeam: string;
  awayTeam: string;
  time?: string;
}

class PremierLeagueService {
  /**
   * Fetch player statistics
   */
  async getPlayerStats(playerName: string): Promise<PlayerStats | null> {
    try {
      const response = await axios.get(`${PL_API_BASE_URL}/players/${encodeURIComponent(playerName)}`, {
        timeout: 5000,
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const player = response.data[0];
      return {
        name: player.name,
        position: player.position,
        club: player.club,
        nationality: player.Nationality,
        dateOfBirth: player['Date of Birth'],
        height: player.height,
        keyStats: player.key_stats,
      };
    } catch (err) {
      logger.warn(`Failed to fetch player stats for ${playerName}:`, err);
      return null;
    }
  }

  /**
   * Fetch Premier League standings table
   */
  async getLeagueTable(): Promise<LeagueTableRow[] | null> {
    try {
      const response = await axios.get(`${PL_API_BASE_URL}/table`, {
        timeout: 5000,
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Parse the table data - format depends on API response
      const table: LeagueTableRow[] = [];

      if (Array.isArray(response.data)) {
        // If it's an array of arrays/objects
        for (const row of response.data) {
          if (Array.isArray(row)) {
            table.push({
              position: row[0],
              team: row[1],
              played: parseInt(row[2]),
              wins: parseInt(row[3]),
              draws: parseInt(row[4]),
              losses: parseInt(row[5]),
              goalDifference: parseInt(row[6]),
              points: parseInt(row[7]),
            });
          } else if (typeof row === 'object') {
            table.push({
              position: row.Position,
              team: row.Team,
              played: row.Played,
              wins: row.Wins,
              draws: row.Draws,
              losses: row.Losses,
              goalDifference: row['Goal Difference'],
              points: row.Points,
            });
          }
        }
      }

      return table.length > 0 ? table : null;
    } catch (err) {
      logger.warn('Failed to fetch league table:', err);
      return null;
    }
  }

  /**
   * Fetch next fixtures for a team
   */
  async getTeamFixtures(teamName: string): Promise<Fixture[] | null> {
    try {
      const response = await axios.get(`${PL_API_BASE_URL}/fixtures/${encodeURIComponent(teamName)}`, {
        timeout: 5000,
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const fixtures: Fixture[] = [];

      // Parse fixture data
      const fixtureData = response.data[0] || response.data;

      if (typeof fixtureData === 'string') {
        // Parse string format: "Team A vs Team B DD/MM/YYYY HH:MM"
        const matches = Array.isArray(fixtureData) ? fixtureData : [fixtureData];

        for (const fixture of matches) {
          if (typeof fixture === 'string') {
            // Parse format: "Arsenal vs Chelsea 15/03/2026 15:00"
            const regex = /(.+?)\s+vs\s+(.+?)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})/;
            const match = fixture.match(regex);

            if (match) {
              fixtures.push({
                homeTeam: match[1].trim(),
                awayTeam: match[2].trim(),
                date: match[3],
                time: match[4],
              });
            }
          }
        }
      }

      return fixtures.length > 0 ? fixtures : null;
    } catch (err) {
      logger.warn(`Failed to fetch fixtures for ${teamName}:`, err);
      return null;
    }
  }

  /**
   * Check if Premier League API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${PL_API_BASE_URL}/health`, {
        timeout: 2000,
      });
      return response.status === 200;
    } catch (err) {
      // Try table endpoint as health check if /health doesn't exist
      try {
        const response = await axios.get(`${PL_API_BASE_URL}/table`, {
          timeout: 2000,
        });
        return response.status === 200;
      } catch (innerErr) {
        logger.debug('Premier League API is not available');
        return false;
      }
    }
  }
}

export const premierLeagueService = new PremierLeagueService();
