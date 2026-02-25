# 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League API Integration Guide

## Overview

The Predictsports Telegram bot now integrates with the **Premier League API** to provide:
- 🎯 **Real player statistics** - Search any Premier League player
- 🏆 **League standings** - Live Premier League table
- ⚽ **Team fixtures** - Next upcoming matches for any PL team

---

## ✨ New Bot Commands

### `/analyze <Player Name or Team Name>`
**Example:** `/analyze Erling Haaland` or `/analyze Manchester City`

- Fetches real Premier League player stats if player exists
- Falls back to team analysis for team searches
- Shows position, club, nationality, height, and key statistics

### `/table`
**Shows:** Live Premier League standings

Displays:
- Top 10 teams with full standings
- Bottom 3 teams (relegation zone)
- Position, Played, Wins, Draws, Losses, Goal Difference, Points

---

## Setup Instructions

### Step 1: Clone the Premier League API

```bash
# Clone the Premier League API repository
git clone https://github.com/Reinasboo/premier-league-api.git
cd premier-league-api

# Install dependencies
pip install -r requirements.txt

# Start the API server (runs on port 5000 by default)
python main.py
```

**Output:** Server starts on `http://localhost:5000`

### Step 2: Configure Environment Variable

The backend automatically looks for the Premier League API at `http://localhost:5000`.

If running on a different port or remote server, update `.env`:

```dotenv
# .env in backend directory
PL_API_URL=http://localhost:5000  # Change if running elsewhere
```

### Step 3: Start the Backend

```bash
cd backend
npm run dev
```

The bot will automatically detect when the Premier League API becomes available.

---

## API Architecture

```
Telegram User
   ↓
@predictsportxbot
   ↓
Bot Command: /analyze, /table
   ↓
Predictsports Backend (Node.js/Fastify)
   ↓
Premier League API Service (backend/src/services/premier-league.ts)
   ↓
Premier League API (Flask Python)
   ↓
Scraped PL Data (players, teams, tables)
   ↓
Formatted Response → Telegram
```

---

## How It Works

### Player Stats Flow

```typescript
/analyze Erling Haaland
   ↓
premierLeagueService.getPlayerStats("Erling Haaland")
   ↓
GET http://localhost:5000/players/Erling%20Haaland
   ↓
Response: {
  name: "Erling Haaland",
  position: "Striker",
  club: "Manchester City",
  nationality: "Norwegian",
  dateOfBirth: "...",
  height: "...",
  keyStats: {...}
}
   ↓
formatPlayerStats(playerStats)
   ↓
Telegram message with formatted player data
```

### League Table Flow

```typescript
/table
   ↓
premierLeagueService.getLeagueTable()
   ↓
GET http://localhost:5000/table
   ↓
Response: Array of teams with standings
   ↓
formatLeagueTable(tableData)
   ↓
Formatted monospace table in Telegram
```

---

## Files Modified

### New Files
- **`backend/src/services/premier-league.ts`** - Premier League API client service
  - `getPlayerStats(playerName)` - Fetch player statistics
  - `getTeamFixtures(teamName)` - Fetch next 3 fixtures
  - `getLeagueTable()` - Fetch league standings
  - `isAvailable()` - Health check

### Updated Files
- **`backend/src/services/telegram-commands.ts`**
  - Updated `/analyze` command to fetch real player data
  - Added `/table` command for league standings
  - Integrated premier-league service

- **`backend/src/services/telegram-formatters.ts`**
  - Added `formatPlayerStats()` - Display player statistics
  - Added `formatLeagueTable()` - Display league table in ASCII format
  - Updated help message with new commands

- **`backend/src/lib/env.ts`**
  - Added `PL_API_URL` environment variable

- **`backend/.env`**
  - Added Premier League API URL

---

## Example Responses

### `/analyze Erling Haaland`

```
👤 Erling Haaland

Position: Striker
Club: Manchester City
Nationality: Norwegian
Date of Birth: 2000-07-21
Height: 194 cm

Key Stats:
• Appearances: 35
• Goals: 28
• Assists: 5
• ...

Data from Premier League ⚽
```

### `/table`

```
🏆 Premier League Table

POS | TEAM              | P  | W  | D  | L  | GD | PTS
────────────────────────────────────────────────────
 1  | Manchester City   | 28 | 20 | 5  | 3  | 45 | 65
 2  | Liverpool         | 28 | 19 | 5  | 4  | 42 | 62
 3  | Arsenal           | 28 | 17 | 7  | 4  | 38 | 58
 ...
20  | Southampton       | 28 |  3 | 2  | 23 |-42 | 11

Updated from Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿
```

---

## Error Handling

The service gracefully handles errors:

| Scenario | Behavior |
|----------|----------|
| Premier League API unavailable | Bot shows "Unable to fetch data" message |
| Player not found | Falls back to team analysis |
| Invalid team name | Shows "Not found" with alternatives |
| API timeout | Retries with 5-second timeout |
| Network error | Friendly error message to user |

---

## Performance Considerations

### Timeouts
- API calls timeout after **5 seconds**
- Health checks timeout after **2 seconds**

### Caching
- Premier League API responses are cached by the API itself
- Backend can implement Redis caching for frequently requested players/teams
  
### Rate Limiting
- No rate limits from Premier League API (unofficial/educational use)
- Backend rate limiting applies per Telegram user

---

## Troubleshooting

### Issue: "Unable to fetch Premier League data"

**Solution 1: Check if Premier League API is running**
```bash
curl http://localhost:5000/table
```

**Solution 2: Verify environment variable**
```bash
# In backend directory
cat .env | grep PL_API_URL
```

**Solution 3: Check backend logs**
```bash
# Look for "Premier League API" messages in npm run dev output
```

### Issue: Player not found, even spelled correctly

**Solution:** Try common name instead of full name
- ❌ `/analyze Mohammad Salah` → Use `/analyze Salah`
- ✅ `/analyze Mohamed Salah better` → Use `/analyze Mo Salah`

### Issue: Table shows partial data

**Solution:** Premier League API might be still scraping data. Wait 2-3 minutes and retry.

---

## Deployment

### Docker Setup

Add to `docker-compose.yml`:

```yaml
  pl-api:
    build:
      context: ./premier-league-api
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    networks:
      - predictsports-network
    restart: unless-stopped
```

Set backend environment variable:
```yaml
environment:
  - PL_API_URL=http://pl-api:5000
```

### Fly.io / Railway

1. Deploy Premier League API to separate service
2. Set `PL_API_URL` to remote service URL
3. Ensure both services can communicate (same network/DNS)

Example:
```bash
PL_API_URL=https://my-pl-api.fly.dev
```

---

## Statistics & Monitoring

### Logging

Successful API calls are logged:
```
✅ Successfully fetched player stats for [player name]
✅ Successfully fetched league table (20 teams)
✅ Successfully fetched fixtures for [team name]
```

Errors are logged:
```
⚠️ Failed to fetch player stats: [error message]
```

### Bot Analytics

Track in telegram-bot logs:
- `/analyze` command usage
- `/table` command usage
- Success/failure rates
- Average response times

---

## Future Enhancements

**Potential additions:**
1. **Team fixtures integration** - `/fixtures Team Name` command
2. **Recent results** - `/results Team Name` 
3. **Player comparison** - `/compare Player1 vs Player2`
4. **Injury reports** - `/injuries Team Name`
5. **Stats caching** - Redis integration for faster responses
6. **Webhooks** - Real-time updates from Premier League API

---

## Links & References

- **Premier League API Repo:** https://github.com/Reinasboo/premier-league-api
- **Used By:** @predictsportxbot on Telegram
- **Last Updated:** February 25, 2026
- **Status:** ✅ Active & Integrated

---

## Support

**Having issues?**
1. Check troubleshooting section above
2. Verify `PL_API_URL` in `.env`
3. Ensure Premier League API is running on port 5000
4. Check backend logs: `npm run dev`

**For Premier League API issues:**
See https://github.com/Reinasboo/premier-league-api#troubleshooting

---

**Made with ⚽ by Predictsports**
