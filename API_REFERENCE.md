# Backend API Documentation

## Overview

The Predictsports backend is built with Fastify and provides RESTful API endpoints along with WebSocket connections for real-time updates.

**Base URL**: `http://localhost:3000` (development) | `https://api.predictsports.dev` (production)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

Obtain token via `/auth/login` endpoint.

## API Endpoints

### Health & Status

#### GET /health
Server health check endpoint.

**Response** (200 OK):
```json
{
  "status": "ok",
  "uptime": 1234,
  "timestamp": "2026-02-27T10:30:00Z"
}
```

---

### Matches

#### GET /api/v1/matches
Retrieve list of upcoming and recent matches.

**Query Parameters**:
- `week` (integer): Game week filter
- `limit` (integer, default: 20): Results limit
- `offset` (integer, default: 0): Pagination offset
- `status` (string): Match status - "upcoming", "live", "completed"
- `league` (string): League filter - "premier-league", "champions-league"

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "match_123",
      "homeTeam": { "name": "Manchester City", "id": "team_1" },
      "awayTeam": { "name": "Liverpool", "id": "team_2" },
      "kickoff": "2026-03-01T15:00:00Z",
      "status": "upcoming",
      "venue": "Etihad Stadium",
      "predictions": {
        "homeWin": 0.65,
        "draw": 0.20,
        "awayWin": 0.15
      }
    }
  ],
  "pagination": {
    "total": 380,
    "limit": 20,
    "offset": 0
  }
}
```

**Error Responses**:
- 400 Bad Request: Invalid parameters
- 503 Service Unavailable: Data source error

---

#### GET /api/v1/matches/:id
Get detailed information for a specific match.

**Path Parameters**:
- `id` (string, required): Match ID

**Response** (200 OK):
```json
{
  "id": "match_123",
  "homeTeam": { "name": "Manchester City", "stats": {...} },
  "awayTeam": { "name": "Liverpool", "stats": {...} },
  "kickoff": "2026-03-01T15:00:00Z",
  "status": "live",
  "liveScore": { "home": 2, "away": 1, "minute": 65 },
  "predictions": {
    "model_id": "ensemble_v1",
    "homeWin": 0.65,
    "draw": 0.20,
    "awayWin": 0.15,
    "confidence": 0.82,
    "expectedGoals": { "home": 2.1, "away": 0.8 }
  },
  "odds": { "homeWin": 1.5, "draw": 4.2, "awayWin": 5.5 },
  "fixtures": [...]
}
```

---

### Predictions

#### GET /api/v1/predictions
Get user's prediction history.

**Authentication**: Required

**Query Parameters**:
- `limit` (integer, default: 50)
- `offset` (integer, default: 0)
- `status` (string): "pending", "won", "lost", "void"

**Response** (200 OK):
```json
{
  "predictions": [
    {
      "id": "pred_456",
      "matchId": "match_123",
      "prediction": "homeWin",
      "confidence": 0.75,
      "result": "won",
      "xp_earned": 150,
      "created_at": "2026-02-27T10:00:00Z",
      "match": {...}
    }
  ],
  "stats": {
    "accuracy": 0.62,
    "totalPredictions": 45,
    "wonPredictions": 28,
    "totalXP": 4250
  }
}
```

---

#### POST /api/v1/predictions
Create a new prediction.

**Authentication**: Required

**Request Body**:
```json
{
  "matchId": "match_123",
  "prediction": "homeWin",
  "confidence": 0.75,
  "odds": 1.5
}
```

**Response** (201 Created):
```json
{
  "id": "pred_789",
  "matchId": "match_123",
  "prediction": "homeWin",
  "confidence": 0.75,
  "xp_potential": 150,
  "status": "pending",
  "created_at": "2026-02-27T10:30:00Z"
}
```

**Error Responses**:
- 400 Bad Request: Invalid prediction data
- 401 Unauthorized: Missing token
- 409 Conflict: Match already started

---

### Live Feed

#### WebSocket /ws/live/:matchId
Real-time match updates via WebSocket.

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:3000/ws/live/match_123');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Match update:', update);
};
```

**Message Types**:

**Goal Event**:
```json
{
  "type": "goal",
  "matchId": "match_123",
  "team": "home",
  "player": "Erling Haaland",
  "minute": 45,
  "score": { "home": 1, "away": 0 },
  "timestamp": "2026-02-27T15:45:00Z"
}
```

**Status Update**:
```json
{
  "type": "status",
  "matchId": "match_123",
  "status": "live",
  "minute": 65,
  "possession": { "home": 58, "away": 42 }
}
```

**Prediction Update**:
```json
{
  "type": "prediction_update",
  "matchId": "match_123",
  "predictions": {
    "homeWin": 0.72,
    "draw": 0.18,
    "awayWin": 0.10
  },
  "confidence": 0.85
}
```

---

### Gamification

#### GET /api/v1/user/profile
Get user's gamification stats.

**Authentication**: Required

**Response** (200 OK):
```json
{
  "userId": "user_123",
  "username": "predictmaster",
  "level": 12,
  "xp": 4250,
  "xp_needed_next_level": 5000,
  "badges": [
    { "id": "first_prediction", "name": "First Prediction", "earned": "2026-02-01" },
    { "id": "streak_10", "name": "10-Game Winning Streak", "earned": "2026-02-20" }
  ],
  "stats": {
    "predictions_made": 45,
    "accuracy": 0.62,
    "total_winnings": 1250,
    "streaks": { "current": 3, "longest": 15 }
  },
  "leaderboard_position": 245,
  "league_position": 12
}
```

---

#### GET /api/v1/leaderboard
Get global leaderboard.

**Query Parameters**:
- `limit` (integer, default: 100)
- `timeframe` (string): "week", "month", "season", "all"
- `metric` (string): "xp", "accuracy", "winnings"

**Response** (200 OK):
```json
{
  "entries": [
    {
      "rank": 1,
      "userId": "user_456",
      "username": "legendary_predictor",
      "value": 45000,
      "metric": "xp",
      "badges": 8,
      "streak": 25
    },
    ...
  ],
  "timeframe": "week",
  "generated_at": "2026-02-27T10:30:00Z"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error code",
  "message": "Human readable message",
  "details": {
    "field": "error description"
  },
  "timestamp": "2026-02-27T10:30:00Z"
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid request parameters
- `UNAUTHORIZED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Request conflicts with current state
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error
- `SERVICE_UNAVAILABLE` (503): Dependency unavailable

---

## Rate Limiting

API requests are rate-limited per user:

- **Standard users**: 100 requests/minute
- **Premium users**: 500 requests/minute
- **Admin users**: Unlimited

Rate limit headers in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1645954800
```

---

## Pagination

List endpoints support pagination with:
```
GET /api/v1/matches?limit=20&offset=40
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "total": 380,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

---

## Examples

### Get Match Predictions
```bash
curl -X GET "http://localhost:3000/api/v1/matches/match_123" \
  -H "Authorization: Bearer <token>"
```

### Create a Prediction
```bash
curl -X POST "http://localhost:3000/api/v1/predictions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "matchId": "match_123",
    "prediction": "homeWin",
    "confidence": 0.75,
    "odds": 1.5
  }'
```

### Subscribe to Live Match Updates
```javascript
const ws = new WebSocket('ws://localhost:3000/ws/live/match_123');
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

---

## Versioning

Current API version: **v1**.

All endpoints are versioned as `/api/v1/...`. Future incompatible changes will be released as v2, v3, etc.

---

## Support & Issues

For API issues or questions:
1. Check this documentation
2. Review [GitHub Issues](https://github.com/Reinasboo/predictsports/issues)
3. Start a [GitHub Discussion](https://github.com/Reinasboo/predictsports/discussions)
4. Contact via Issues with label `api-question`

---

**Last Updated**: February 27, 2026
**maintainers**: Predictsports Team
