import { Telegraf, Context } from 'telegraf';
import { logger } from '../lib/logger.js';
import { registerCommands } from './telegram-commands.js';

let bot: Telegraf<Context> | null = null;

export async function initTelegramBot(): Promise<Telegraf<Context> | null> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    logger.warn('⚠️  TELEGRAM_BOT_TOKEN not provided - Telegram bot will be disabled');
    return null;
  }

  try {
    bot = new Telegraf(botToken);

    // Register error handler
    bot.catch((err: unknown, ctx: Context) => {
      logger.error('Telegram bot error:', err);
      if (!ctx.message?.chat.id) return;
      ctx.reply('Sorry, something went wrong. Please try again later.').catch(() => {
        logger.error('Failed to send error reply to Telegram user');
      });
    });

    // Register all commands
    registerCommands(bot);

    // Setup polling
    await bot.launch();

    logger.info('✅ Telegram bot started successfully');

    // Graceful shutdown
    process.once('SIGINT', () => {
      logger.info('Shutting down Telegram bot...');
      bot?.stop('SIGINT');
    });
    process.once('SIGTERM', () => {
      logger.info('Shutting down Telegram bot...');
      bot?.stop('SIGTERM');
    });

    return bot;
  } catch (err) {
    logger.error('Failed to initialize Telegram bot:', err);
    return null;
  }
}

export function getTelegramBot(): Telegraf<Context> | null {
  return bot;
}

export async function stopTelegramBot() {
  if (bot) {
    await bot.stop('STOP');
    bot = null;
    logger.info('Telegram bot stopped');
  }
}
