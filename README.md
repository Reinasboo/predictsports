# 🚀 Predictsports - AI Sports Prediction Platform

**Bloomberg Terminal × ESPN × FIFA UI × Crypto Dashboard** — Production-grade AI football analytics and probability forecasting platform.

## 📋 Overview

Predictsports is a real-time, data-driven football analytics platform leveraging multiple free public APIs with redundancy, normalization, caching, and failover support. The system combines advanced ML prediction models, live match updates, and a gamified UI for desktop and mobile.

### Key Features
- **Multi-Source Data Pipeline**: API-Football, Football-Data.org, Understat, StatsBomb, Odds API
- **AI Prediction Engine**: Ensemble models (Poisson, Logistic Regression, Rolling Form, Tactical Matchup)
- **Live Match Updates**: Real-time WebSocket integration for goals, odds, predictions
- **Gamified UI**: XP system, badges, leaderboards, confidence ratings
- **Production Ready**: Docker, Redis caching, PostgreSQL, rate limiting, error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PREDICTSPORTS                      │
├────────────────────┬────────────────────┬────────────┤
│    Frontend         │     Backend         │   Engine   │
│   (Next.js)         │   (Fastify)         │  (FastAPI) │
│                     │                     │            │
│  • Pages           │  • API Routes      │  • Models  │
│  • Components      │  • WebSocket      │  • Feature │
│  • Charts          │  • Cache (Redis)  │    Eng.   │
│  • Animations      │  • Queue (BullMQ) │  • Scoring│
└────────────────────┴────────────────────┴────────────┘
         ↓                    ↓                    ↓
    ┌─────────────────────────────────────────┐
    │   PostgreSQL (Matches, Predictions)      │
    │   Redis (Cache + Pub/Sub)               │
    └─────────────────────────────────────────┘
         ↑                    ↑
    ┌─────────────────────────────────────────┐
    │  Data Integration Layer                 │
    │  • API-Football (Primary)              │
    │  • Football-Data.org (Backup)          │
    │  • Understat (xG)                      │
    │  • Transfermarkt (Injuries)            │
    │  • Odds API (Market)                   │
    │  • OpenWeatherMap (Context)            │
    └─────────────────────────────────────────┘
```

## 📦 Tech Stack

**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Zustand (state management)
- Recharts/Chart.js (visualizations)
- Socket.IO client (real-time)
- PWA support

**Backend**
- Node.js (Fastify)
- TypeScript
- Socket.IO (WebSockets)
- BullMQ (job queue)
- Redis
- PostgreSQL

**ML Engine**
- FastAPI (Python)
- NumPy/SciPy (computation)
- Scikit-learn (models)
- Pandas (data)

**Deployment**
- Docker & Docker Compose
- Frontend: Vercel/Netlify ready
- Backend: Railway/Fly.io ready
- DB: Supabase/Neon ready
- Redis: Upstash ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.10+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### Installation

1. **Clone repository**
```bash
cd c:\Users\Admin\Predictsports
```

2. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

3. **Setup Backend**
```bash
cd ../backend
npm install
cp .env.example .env
npm start
```

4. **Setup Python Engine**
```bash
cd ../engine
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

5. **Setup Data Pipelines**
```bash
cd ../data-pipelines
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Scheduled jobs configured in backend
```

6. **Docker Compose (All Services)**
```bash
docker-compose up -d
```

## 📡 API Endpoints

### Fixtures & Matches
- `GET /api/fixtures` - List upcoming fixtures
- `GET /api/gameweek?week=30` - Current gameweek
- `GET /api/match/:id` - Match details

### Predictions
- `GET /api/predictions/:matchId` - Get predictions
- `GET /api/confidence` - Confidence metrics
- `POST /api/predictions/:matchId/simulate` - Scenario simulator

### Live Feed
- `GET /api/live-feed` - Current live matches
- `WebSocket /socket.io` - Real-time updates

### AI Engine
- `GET /api/engine/match/:id/analysis` - Detailed analysis
- `POST /api/engine/compare-teams` - Team comparison
- `POST /api/engine/chat` - AI chat interface

## 🎨 UI Components

### Core Components
- **ProbabilityBar** - Animated win/draw/loss probabilities
- **StatsMeter** - Expected goals, possession, shots
- **RadarChart** - Team comparison radar
- **ScenarioCard** - Match outcome scenarios
- **ConfidenceBadge** - Prediction confidence rating
- **MatchCard** - Live match with glow effects
- **LiveAlert** - Goal notifications with animation

### Screens
- **Home Dashboard** - Live fixtures, trending matches, AI confidence
- **Match Detail** - Probabilities, stats, scenarios, chat
- **Gameweek Hub** - Grid view, filters, heatmap
- **AI Chat** - Multi-turn conversation interface
- **Profile** - XP, badges, leaderboard

## 🔄 Data Pipeline

```
Cron Job (Every 30 mins)
  ↓
API-Football Fixtures + Live
  ↓
Understat xG Data
  ↓
Transfermarkt Injuries
  ↓
Odds API Market Data
  ↓
OpenWeatherMap Weather
  ↓
Data Normalization
  ↓
Redis Cache + PostgreSQL
  ↓
Prediction Engine Trigger
  ↓
WebSocket Broadcast
```

## 🤖 Prediction Models

### Ensemble Approach
1. **Poisson Goal Distribution** - Statistical modeling
2. **Logistic Regression** - Win/Draw/Loss probabilities
3. **Rolling Form Model** - Recent team performance
4. **Tactical Matchup Model** - Formation compatibility
5. **Market Deviation Model** - Odds analysis
6. **Situational Context** - Weather, fatigue, motivation

### Feature Engineering
- Form Index (last 10 games)
- Home Advantage Coefficient
- xG Differential
- Defensive Stability Index
- Fatigue Index (rotation risk)
- Referee Bias Score
- Weather Impact Modifier

## 🎮 Gamified Elements

- **XP System**: +10 XP per correct prediction, +5 for confidence boost
- **Badges**: First prediction, 10-streak, perfect week, master analyst
- **Levels**: Novice → Scout → Analyst → Expert → Master
- **Leaderboard**: Weekly rankings with XP decay
- **Confidence Boost**: Optional wager of XP for 2x multiplier

## 🔐 Security

- API key protection in .env
- Rate limiting: 100 req/min per IP
- Input validation on all endpoints
- CORS configured per environment
- SQL injection prevention (Prepared statements)
- CSRF tokens for POST requests
- Helmet.js for security headers

## 📊 Monitoring & Logging

- Winston logger (structured JSON logging)
- Sentry integration (error tracking)
- Redis monitoring dashboard
- Database query logs
- API performance metrics

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3
```

## 📝 Environment Variables

See `.env.example` files in each service directory:
- `frontend/.env.example`
- `backend/.env.example`
- `engine/.env.example`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

MIT License - feel free to use for commercial projects

## 📧 Support

For issues and feature requests, open a GitHub issue or contact: hello@predictsports.com

---

**Last Updated**: February 2026 | **Version**: 1.0.0-beta
