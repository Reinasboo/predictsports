import { Telegraf, Context } from 'telegraf';
import { logger } from '../lib/logger.js';
import * as formatters from './telegram-formatters.js';
import { premierLeagueService } from './premier-league.js';

/**
 * Register all Telegram bot commands
 */
export function registerCommands(bot: Telegraf<Context>) {
  // /start command
  bot.start((ctx) => {
    try {
      const message = formatters.formatWelcomeMessage();
      ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
        logger.error('Failed to send start message:', err);
      });
    } catch (err) {
      logger.error('Error in /start command:', err);
      ctx.reply('Welcome to Predictsports! Use /help for available commands.').catch(() => {});
    }
  });

  // /help command
  bot.command('help', (ctx) => {
    try {
      const message = formatters.formatHelpMessage();
      ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
        logger.error('Failed to send help message:', err);
      });
    } catch (err) {
      logger.error('Error in /help command:', err);
      ctx.reply('Use /start to see available commands.').catch(() => {});
    }
  });

  // /today command - show today's fixtures
  bot.command('today', async (ctx) => {
    try {
      ctx.sendChatAction('typing');

      // Mock data - in production, this would call the actual API
      const fixtures = [
        {
          id: 1,
          homeTeam: { name: 'Manchester City' },
          awayTeam: { name: 'Chelsea' },
          kickoff: new Date().toISOString(),
          predictions: {
            homeWinProb: 0.62,
            drawProb: 0.22,
            awayWinProb: 0.16,
            confidence: 'High',
          },
        },
        {
          id: 2,
          homeTeam: { name: 'Liverpool' },
          awayTeam: { name: 'Arsenal' },
          kickoff: new Date().toISOString(),
          predictions: {
            homeWinProb: 0.54,
            drawProb: 0.28,
            awayWinProb: 0.18,
            confidence: 'High',
          },
        },
      ];

      const message = formatters.formatTodayFixtures(fixtures);
      ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
        logger.error('Failed to send today fixtures:', err);
      });
    } catch (err) {
      logger.error('Error in /today command:', err);
      ctx.reply(formatters.formatError('fetching today\'s fixtures'), { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // /match command - predict specific match
  bot.hears(/^\/match\s+(.+)\s+vs\s+(.+)$/i, async (ctx) => {
    try {
      ctx.sendChatAction('typing');
      const homeTeam = ctx.match?.[1]?.trim();
      const awayTeam = ctx.match?.[2]?.trim();

      if (!homeTeam || !awayTeam) {
        ctx.reply('Usage: /match Team A vs Team B\n\nExample: /match Manchester City vs Arsenal', { parse_mode: 'Markdown' }).catch(() => {});
        return;
      }

      // Mock prediction data
      const mockMatch = {
        id: Math.random(),
        homeTeam: { name: homeTeam },
        awayTeam: { name: awayTeam },
        predictions: {
          homeWinProb: 0.58,
          drawProb: 0.25,
          awayWinProb: 0.17,
          confidence: 'High',
          overProb: 0.60,
          underProb: 0.40,
          topScoreline: '2-1',
        },
        expectedGoals: {
          home: 1.8,
          away: 1.1,
        },
      };

      const message = formatters.formatMatchPrediction(mockMatch);
      ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
        logger.error('Failed to send match prediction:', err);
      });
    } catch (err) {
      logger.error('Error in /match command:', err);
      ctx.reply(formatters.formatError('predicting match'), { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // Fallback handler for /match without proper format
  bot.command('match', (ctx) => {
    const text = ctx.update.message?.text || '';
    if (!text.includes(' vs ')) {
      ctx.reply('*Usage:* /match Team A vs Team B\n\n*Example:*\n/match Manchester City vs Arsenal\n/match Liverpool vs Chelsea', { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // /gameweek command - upcoming fixtures
  bot.command('gameweek', async (ctx) => {
    try {
      ctx.sendChatAction('typing');

      // Mock gameweek data
      const fixtures = [
        {
          id: 1,
          homeTeam: { name: 'Manchester City' },
          awayTeam: { name: 'Chelsea' },
          kickoff: new Date(Date.now() + 86400000).toISOString(),
          predictions: { confidence: 'Very High', homeWinProb: 0.65 },
        },
        {
          id: 2,
          homeTeam: { name: 'Liverpool' },
          awayTeam: { name: 'Arsenal' },
          kickoff: new Date(Date.now() + 172800000).toISOString(),
          predictions: { confidence: 'High', homeWinProb: 0.54 },
        },
        {
          id: 3,
          homeTeam: { name: 'Tottenham' },
          awayTeam: { name: 'Manchester United' },
          kickoff: new Date(Date.now() + 259200000).toISOString(),
          predictions: { confidence: 'Medium', homeWinProb: 0.48 },
        },
      ];

      const message = formatters.formatGameweek(fixtures);
      ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
        logger.error('Failed to send gameweek fixtures:', err);
      });
    } catch (err) {
      logger.error('Error in /gameweek command:', err);
      ctx.reply(formatters.formatError('fetching gameweek fixtures'), { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // /analyze command - player/team analysis
  bot.command('analyze', async (ctx) => {
    try {
      ctx.sendChatAction('typing');
      const input = ctx.payload?.trim();

      if (!input) {
        ctx.reply('*Usage:* /analyze Player Name or /analyze Team Name\n\n*Examples:*\n/analyze Erling Haaland\n/analyze Manchester City', { parse_mode: 'Markdown' }).catch(() => {});
        return;
      }

      // Try to fetch player stats first
      const playerStats = await premierLeagueService.getPlayerStats(input);

      if (playerStats) {
        const message = formatters.formatPlayerStats(playerStats);
        ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
          logger.error('Failed to send player stats:', err);
        });
      } else {
        // Fallback to team analysis
        const message = formatters.formatTeamAnalysis({
          name: input,
          wins: 18,
          draws: 5,
          losses: 3,
          goalsFor: 67,
          goalsAgainst: 22,
          form: 'Excellent',
          momentum: '+5 wins streak',
          nextMatch: 'vs Arsenal (in 3 days)',
        });
        ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
          logger.error('Failed to send team analysis:', err);
        });
      }
    } catch (err) {
      logger.error('Error in /analyze command:', err);
      ctx.reply(formatters.formatError('analyzing'), { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // /table command - Premier League standings
  bot.command('table', async (ctx) => {
    try {
      ctx.sendChatAction('typing');

      const table = await premierLeagueService.getLeagueTable();

      if (table && table.length > 0) {
        const message = formatters.formatLeagueTable(table);
        ctx.reply(message, { parse_mode: 'Markdown' }).catch((err) => {
          logger.error('Failed to send league table:', err);
        });
      } else {
        ctx.reply('❌ Unable to fetch Premier League table. Please try again later.', { parse_mode: 'Markdown' }).catch(() => {});
      }
    } catch (err) {
      logger.error('Error in /table command:', err);
      ctx.reply(formatters.formatError('fetching league table'), { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  // Generic text handler for unrecognized commands
  bot.on('message', (ctx) => {
    const message = ctx.message as any;
    const text = message?.text || '';

    if (text && !text.startsWith('/')) {
      ctx.reply('👋 I didn\'t understand that command.\n\nUse /help to see available commands or /start to get started!', { parse_mode: 'Markdown' }).catch(() => {});
    }
  });

  logger.info('✅ Telegram bot commands registered');
}
