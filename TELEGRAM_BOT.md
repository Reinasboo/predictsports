# Predictsports Telegram Bot Integration

## Overview
The Telegram bot provides instant access to Predictsports predictions directly within Telegram. No login required - just add the bot and start getting predictions!

## Quick Start

### 1. Create a Telegram Bot
1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the setup wizard and name your bot
4. Copy the **API Token** (looks like: `123456789:ABCdEfGhIjKlMnOpQrStUvWxYz...`)

### 2. Configure Backend
Add the token to your `.env` file:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdEfGhIjKlMnOpQrStUvWxYz...
```

### 3. Start Backend
The bot will automatically start when the backend server starts:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Telegram bot started successfully
```

### 4. Use the Bot
Find your bot on Telegram by username and start interacting!

## Available Commands

### `/start`
Welcome message with quick overview and available commands.

**Response:**
- Bot introduction
- Available commands list
- Example usage

### `/help`
Show detailed help and command list.

**Response:**
- All commands with descriptions
- Usage examples

### `/today`
View today's featured match predictions.

**Response:**
- List of today's matches (up to 5)
- Win probabilities for each match
- Confidence levels
- Quick navigation to detailed predictions

**Example:**
```
📅 Today's Matches

1. Manchester City vs Chelsea
   Win Prob: 62% | Confidence: High

2. Liverpool vs Arsenal
   Win Prob: 54% | Confidence: High

Use /match Team A vs Team B for full details
```

### `/match Team A vs Team B`
Get detailed prediction for a specific match.

**Usage:**
```
/match Manchester City vs Arsenal
/match Chelsea vs Liverpool
```

**Response:**
- Win probabilities (Home/Draw/Away)
- Expected Goals for both teams
- Over/Under 2.5 probability
- Most likely scoreline
- Prediction confidence

**Example:**
```
⚽ Manchester City vs Arsenal

Win Probabilities:
🏠 Manchester City: 62.0%
🤝 Draw: 22.0%
✈️  Arsenal: 16.0%

Expected Goals:
Manchester City: 1.8
Arsenal: 1.1

Over/Under 2.5:
Over: 60% | Under: 40%

Confidence: High
📊 Top Scoreline: 2-1
```

### `/gameweek`
View all upcoming fixtures sorted by prediction confidence.

**Response:**
- List of upcoming matches (up to 8)
- Date for each match
- Home team win probability
- Prediction confidence
- Sorted by confidence (highest first)

**Example:**
```
📊 Upcoming Fixtures (by confidence)

1. Manchester City vs Chelsea
   📅 2026-02-26 | 🏆 62% | 📈 Very High

2. Liverpool vs Arsenal
   📅 2026-02-27 | 🏆 54% | 📈 High

Use /match to get details on any match
```

### `/analyze Team`
Get team form and momentum analysis.

**Usage:**
```
/analyze Manchester City
/analyze Liverpool
```

**Response:**
- Recent results (W-D-L)
- Goals scored/conceded
- Goal differential
- Current form assessment
- Momentum indicator
- Next match preview

**Example:**
```
📈 Manchester City - Form Summary

Recent Results:
Wins: 18 | Draws: 5 | Losses: 3

Goals:
For: 67 | Against: 22
Goal Diff: +45

Form: Excellent
Momentum: +5 wins streak

Next Match: vs Arsenal (in 3 days)
```

## Message Format Standards

All messages are formatted for readability:
- ✅ Clean line breaks
- ✅ Emojis for quick scanning (not excessive)
- ✅ Markdown formatting for emphasis
- ✅ Professional tone
- ✅ No spam or clickbait

## Error Handling

The bot handles errors gracefully:

### Match Not Found
```
🔍 Match Not Found

Could not find a match for: "Manchester vs United"

Try:
• /today - See today's fixtures
• /gameweek - See all upcoming matches
• /help - View all commands

Need help? Use exact team names!
```

### API Unavailable
```
⚠️ Error

Something went wrong while fetching today's fixtures.

Please try again later or use /help for commands.
```

## Architecture

```
User sends Telegram message
    ↓
Telegram Bot API
    ↓
Telegraf (bot framework)
    ↓
Command Handler
    ↓
Telegram Formatters
    ↓
Existing Predictsports API
    ↓
Formatted Response → Telegram User
```

## File Structure

```
backend/src/services/
├── telegram-bot.ts        # Main bot service (initialization, lifecycle)
├── telegram-commands.ts   # Command handlers (/start, /today, etc.)
└── telegram-formatters.ts # Message formatting functions
```

## Features

✅ **No Authentication Required** - Users add bot and start using instantly

✅ **Graceful Degradation** - Bot works even if database/Redis unavailable (uses mock data)

✅ **Polling-Based** - Default mode, works behind firewalls without webhook setup

✅ **Error Handling** - Friendly messages if matches not found or API fails

✅ **Clean Formatting** - Professional, readable messages designed for Telegram

✅ **Reuses Existing API** - Calls Predictsports prediction services

✅ **Optional Feature** - Backend works fine without Telegram token configured

## Deployment

### Local Testing
```bash
cd backend
npm run dev
# Bot starts automatically
```

### Production (Railway/Fly.io/VPS)
1. Add `TELEGRAM_BOT_TOKEN` to environment variables
2. Deploy backend normally
3. Bot automatically starts on deployment

No webhook setup needed - polling mode handles all connectivity.

## Future Enhancements

Potential additions (non-breaking):
- Live match updates via Telegram notifications
- User betting slips (view generated forecasts as formatted cards)
- Team statistics/standings
- Injury reports for specific teams
- Customizable prediction thresholds

## Example Conversation

```
User: /start

Bot: 🎯 Welcome to Predictsports
I'm your AI sports prediction assistant...

User: /today

Bot: 📅 Today's Matches
1. Manchester City vs Chelsea
   Win Prob: 62% | Confidence: High
...

User: /match Manchester City vs Chelsea

Bot: ⚽ Manchester City vs Chelsea
Win Probabilities:
🏠 Manchester City: 62.0%
...

User: /analyze Manchester City

Bot: 📈 Manchester City - Form Summary
Recent Results: Wins: 18 | Draws: 5 | Losses: 3
...
```

## Troubleshooting

### Bot doesn't respond
- Check `TELEGRAM_BOT_TOKEN` is correct in `.env`
- Ensure backend is running: `npm run dev`
- Check backend logs for errors

### Commands not working
- Use exact syntax: `/match Team A vs Team B`
- Team names should match official names
- Try `/today` to get valid team names

### Predictions seem wrong
- Bot uses mock data if database unavailable
- Check backend logs: `npm run dev`
- Ensure all API services are configured

## Support

For issues:
1. Check bot logs in terminal
2. Verify `TELEGRAM_BOT_TOKEN` is set correctly
3. Ensure backend is running on correct port (default 3001)
4. Review error messages in terminal output

## License

Predictsports Telegram Bot - Part of Predictsports Platform
Built with Telegraf for Telegram Bot API
