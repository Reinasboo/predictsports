# Predictsports API Documentation

## Overview
Complete REST API for the Predictsports AI sports prediction platform with real-time WebSocket support.

**Base URL:** `https://api.predictsports.com` | Dev: `http://localhost:3001`
**WebSocket:** `wss://api.predictsports.com/ws`
**API Version:** v1

---

## Authentication

All requests require Bearer token:

```bash
Authorization: Bearer <jwt_token>
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 604800
}
```

---

## Fixtures Endpoints

### GET /fixtures
Get all fixtures with optional filters

Query Parameters:
- `league` - League ID
- `season` - Season (2024)
- `status` - SCHEDULED, LIVE, FINISHED
- `limit` - Per page (default: 20)

### GET /fixtures/live
Get currently live matches in real-time

### GET /matches/{matchId}
Get single match details with full context

### GET /gameweek/{leagueId}
Get all matches for gameweek

---

## Predictions Endpoints

### GET /predictions/{matchId}
Get AI predictions for a match

Response includes:
- Result probabilities (Win/Draw/Loss)
- Goal markets (Over/Under)
- BTTS probability
- Top 5 scorelines
- 3 scenarios (Favorites, Balanced, Upset)
- Confidence level

### POST /predictions/batch
Get predictions for multiple matches

```json
{
  "matchIds": ["match_123", "match_124"]
}
```

### GET /predictions/advanced/{matchId}
Advanced analytics with:
- Expected goals (xG)
- Possession projection
- Shot quality analysis
- Player-level predictions

---

## Live Feed (WebSocket)

### Subscribe to Live Match

```javascript
ws.send(JSON.stringify({
  type: 'SUBSCRIBE_LIVE',
  matchId: 'match_123'
}));
```

Events:
- `GOAL` - Goal event
- `ODDS_UPDATE` - Odds changed
- `PREDICTION_UPDATE` - Recalculated
- `CARD` - Yellow/Red card
- `SUBSTITUTION` - Player sub
- `END_MATCH` - Match finished

---

## Confidence Endpoint

### GET /confidence/{matchId}
Confidence metrics for predictions

Response:
- Overall confidence (Very High/High/Medium/Low)
- Component scores
- Positive/negative factors

---

## Error Codes

| Code | Status |
|------|--------|
| INVALID_REQUEST | 400 |
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| NOT_FOUND | 404 |
| RATE_LIMITED | 429 |
| INTERNAL_ERROR | 500 |

---

## Rate Limits

100 requests per 15 minutes

Headers:
- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 87`
- `X-RateLimit-Reset: timestamp`

---

## Examples

### Get Predictions
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://api.predictsports.com/predictions/match_123
```

### WebSocket Live Updates
```javascript
const ws = new WebSocket('wss://api.predictsports.com/ws');
ws.send(JSON.stringify({
  type: 'SUBSCRIBE_LIVE',
  matchId: 'match_123',
  token: 'TOKEN'
}));
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## Support

- Documentation: https://docs.predictsports.com
- Status: https://status.predictsports.com
- Email: api@predictsports.com


## Base URL
```
http://localhost:3000/api
```

## Authentication
All requests require a valid JWT token in the Authorization header (future implementation).

## Endpoints

### Fixtures

#### Get All Fixtures
```
GET /fixtures
```

Response:
```json
[
  {
    "id": "uuid",
    "home_team_name": "Manchester United",
    "away_team_name": "Liverpool",
    "kickoff": "2024-02-10T15:00:00Z",
    "status": "scheduled"
  }
]
```

#### Get Fixtures by Date
```
GET /fixtures/date/:date
```

Parameters:
- `date` (string): ISO date format (YYYY-MM-DD)

#### Get Current Gameweek
```
GET /fixtures/gameweek/current
```

#### Get Live Fixtures
```
GET /fixtures/live
```

### Predictions

#### Get Prediction for Match
```
GET /predictions/:matchId
```

Response:
```json
{
  "id": "uuid",
  "match_id": "uuid",
  "home_win_probability": 0.45,
  "draw_probability": 0.30,
  "away_win_probability": 0.25,
  "over_2_5_probability": 0.55,
  "both_teams_score_probability": 0.48,
  "confidence": "high",
  "model_agreement": 0.87,
  "data_completeness": 0.92
}
```

#### Batch Predictions
```
POST /predictions/batch
```

Request:
```json
{
  "matchIds": ["uuid1", "uuid2", "uuid3"]
}
```

#### Generate New Predictions
```
POST /predictions/generate
```

Request:
```json
{
  "matchIds": ["uuid1", "uuid2"]
}
```

#### Get Confidence Metrics
```
GET /predictions/confidence/:matchId
```

### Matches

#### Get Match Details
```
GET /matches/:id
```

#### Get Head-to-Head
```
GET /matches/:homeId/:awayId/h2h
```

#### Get Team Matches
```
GET /matches/team/:teamId
```

### WebSocket Events

Connect to WebSocket at `ws://localhost:3000`:

```javascript
const socket = io('http://localhost:3000');

// Subscribe to match updates
socket.emit('subscribe-match', 'match-id');

// Listen for goal updates
socket.on('goal', (data) => {
  console.log('Goal scored!', data);
});

// Listen for prediction updates
socket.on('prediction-update', (data) => {
  console.log('Predictions recalculated', data);
});
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

Common status codes:
- 200: Success
- 400: Bad request
- 404: Not found
- 500: Server error

## Rate Limiting

- Rate limit: 100 requests per 15 minutes per IP
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Response Headers

- `Content-Type: application/json`
- `X-Powered-By: Predictsports`
- `Cache-Control: varies (see endpoint docs)`
