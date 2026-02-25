# Predictsports Complete File Index

## 📂 Project Structure Overview

```
Predictsports/
├── 📄 Documentation Files
│   ├── README.md                          - Main project overview
│   ├── QUICK_START.md                     - Quick setup guide
│   ├── API_DOCS.md                        - Complete API documentation
│   ├── ARCHITECTURE.md                    - System architecture
│   ├── DEVELOPMENT.md                     - Development guide
│   ├── DEPLOYMENT.md                      - Production deployment
│   ├── BUILD_SUMMARY.md                   - Build overview
│   ├── PROJECT_STATUS.md                  - This project completion report
│   └── FILE_INDEX.md                      - This file
│
├── 🐳 Docker & Infrastructure
│   ├── docker-compose.yml                 - Local development orchestration
│   ├── backend/Dockerfile                 - Backend service container
│   ├── frontend/Dockerfile                - Frontend service container
│   ├── engine/Dockerfile                  - Python ML engine container
│   ├── setup.bat                          - Windows setup script
│   ├── setup.sh                           - Unix setup script
│   ├── .env.example                       - Root environment template
│   └── .github/workflows/ci-cd.yml        - GitHub Actions CI/CD pipeline
│
├── 🎨 Frontend (Next.js + TypeScript)
│   ├── frontend/
│   │   ├── package.json                   - Frontend dependencies
│   │   ├── tsconfig.json                  - TypeScript config
│   │   ├── next.config.js                 - Next.js configuration
│   │   ├── tailwind.config.ts             - Tailwind CSS theme
│   │   ├── .env.example                   - Frontend env template
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx               - Home/Dashboard page
│   │       │   ├── layout.tsx             - Root layout
│   │       │   ├── providers.tsx          - Client-side providers
│   │       │   ├── dashboard/page.tsx     - Dashboard page
│   │       │   ├── gameweek/page.tsx      - Gameweek hub
│   │       │   ├── match/[id]/page.tsx    - Match detail page
│   │       │   ├── profile/page.tsx       - User profile/gamification
│   │       │   └── (auth)/                - Auth pages folder
│   │       ├── components/
│   │       │   ├── animations/index.ts    - 20+ animation variants
│   │       │   ├── common/
│   │       │   │   ├── MatchCard.tsx      - Match display component
│   │       │   │   └── Navigation.tsx     - Header navigation
│   │       │   ├── dashboard/             - Dashboard components
│   │       │   └── match/
│   │       │       └── PredictionCharts.tsx - Chart components
│   │       ├── hooks/
│   │       │   └── useMatches.ts          - Custom React hooks
│   │       ├── services/
│   │       │   └── api.ts                 - API client layer (axios)
│   │       ├── store/
│   │       │   └── index.ts               - Zustand state management
│   │       ├── lib/
│   │       │   ├── features.ts            - Feature flags
│   │       │   └── mockData.ts            - Development mock data
│   │       ├── types/
│   │       │   └── index.ts               - TypeScript type definitions
│   │       └── styles/
│   │           └── globals.css            - Global styles & animations
│
├── 🔧 Backend (Fastify + TypeScript)
│   ├── backend/
│   │   ├── package.json                   - Backend dependencies
│   │   ├── tsconfig.json                  - TypeScript config
│   │   ├── .env.example                   - Backend env template
│   │   └── src/
│   │       ├── index.ts                   - Entry point
│   │       ├── app.ts                     - Fastify setup & middleware
│   │       ├── clients/
│   │       │   └── api.ts                 - External API clients
│   │       ├── controllers/               - Route handlers
│   │       ├── db/
│   │       │   ├── connection.ts          - PostgreSQL pool
│   │       │   ├── schema.sql             - Database schema (15+ tables)
│   │       │   └── seed.sql               - Initial seed data
│   │       ├── lib/
│   │       │   ├── env.ts                 - Environment variables
│   │       │   ├── logger.ts              - Winston logger
│   │       │   └── redis.ts               - Redis client
│   │       ├── middleware/
│   │       │   └── auth.ts                - JWT authentication
│   │       ├── routes/
│   │       │   ├── index.ts               - Route registration
│   │       │   ├── fixtures.ts            - GET /fixtures endpoints
│   │       │   ├── matches.ts             - GET /matches endpoints
│   │       │   ├── predictions.ts         - GET /predictions endpoints
│   │       │   ├── live-feed.ts           - GET /live-feed endpoints
│   │       │   ├── health.ts              - GET /health endpoint
│   │       │   └── engine.ts              - ML engine endpoints
│   │       ├── services/
│   │       │   ├── fixtures.ts            - Fixture business logic
│   │       │   ├── providers.ts           - Multi-source data providers
│   │       │   ├── pipeline.ts            - Data pipeline orchestration
│   │       │   ├── normalization.ts       - Data normalization
│   │       │   └── websocket.ts           - WebSocket handlers
│   │       └── types/
│   │           └── index.ts               - TypeScript interfaces
│
├── 🤖 Python ML Engine (FastAPI)
│   ├── engine/
│   │   ├── requirements.txt                - Python dependencies
│   │   └── src/
│   │       ├── main.py                    - FastAPI setup
│   │       ├── features/
│   │       │   └── engineering.py         - 10+ feature engineers
│   │       ├── models/
│   │       │   └── ensemble.py            - 5 prediction models + ensemble
│   │       ├── routes/
│   │       │   ├── predictions.py         - Prediction endpoints
│   │       │   └── health.py              - Health check
│   │       └── lib/
│   │           ├── config.py              - Configuration
│   │           ├── logger.py              - Logging
│   │           └── redis_client.py        - Redis integration
│
├── 📊 Data Pipelines
│   ├── data-pipelines/
│   │   ├── package.json                   - Orchestration dependencies
│   │   └── src/
│   │       ├── normalization/             - Data normalization
│   │       ├── pipelines/                 - Pipeline definitions
│   │       └── providers/                 - Data provider adaptors
│
└── 📋 Configuration & Scripts
    ├── .env.example                       - Main environment template
    ├── backend/.env.example               - Backend config template
    ├── frontend/.env.example              - Frontend config template
    ├── docker-compose.yml                 - Docker Compose orchestration
    ├── setup.bat                          - Windows automatic setup
    ├── setup.sh                           - Unix automatic setup
    └── .github/workflows/ci-cd.yml        - GitHub Actions CI/CD
```

---

## 📋 Key Files by Function

### API Routes (Backend)
| Endpoint | File | Method | Purpose |
|----------|------|--------|---------|
| `/fixtures` | `routes/fixtures.ts` | GET | Get all fixtures with filtering |
| `/fixtures/live` | `routes/fixtures.ts` | GET | Get live matches |
| `/gameweek/{leagueId}` | `routes/fixtures.ts` | GET | Get gameweek matches |
| `/matches/{id}` | `routes/matches.ts` | GET | Get match details |
| `/matches/h2h/{teamA}/{teamB}` | `routes/matches.ts` | GET | Head-to-head |
| `/predictions/{id}` | `routes/predictions.ts` | GET | Get predictions |
| `/predictions/batch` | `routes/predictions.ts` | POST | Batch predictions |
| `/confidence/{id}` | `routes/predictions.ts` | GET | Confidence metrics |
| `/live-feed` | `routes/live-feed.ts` | GET | Live match updates |
| `/health` | `routes/health.ts` | GET | Health check |

### Data Providers (Multi-Source)
| Provider | File | Purpose |
|----------|------|---------|
| API-Football | `services/providers.ts` | Primary fixtures & live |
| Football-Data.org | `services/providers.ts` | Backup fixtures |
| The Odds API | `services/providers.ts` | Betting odds |
| OpenWeatherMap | `services/providers.ts` | Weather data |
| Understat | `services/providers.ts` | xG data |
| StatsBomb | `services/providers.ts` | Historical events |
| SportMonks | `services/providers.ts` | Lineups & fitness |
| Transfermarkt | `services/providers.ts` | Injuries |
| WorldFootball | `services/providers.ts` | Referee data |
| ScoreBat | `services/providers.ts` | Live scores |

### Frontend Pages
| Page | File | Components | Purpose |
|------|------|-----------|---------|
| Home Dashboard | `app/page.tsx` | MatchCarousel, TrendingMatches | Main hub |
| Gameweek | `app/gameweek/page.tsx` | MatchGrid, ConfidenceFilter | Week matches |
| Match Detail | `app/match/[id]/page.tsx` | PredictionCharts, Scenarios | Full analysis |
| Profile | `app/profile/page.tsx` | Stats, Badges, Leaderboard | Gamification |
| Dashboard | `app/dashboard/page.tsx` | Overview, Charts | User dashboard |

### Frontend Utilities
| Utility | File | Purpose |
|---------|------|---------|
| API Client | `services/api.ts` | Axios instance + interceptors |
| State Management | `store/index.ts` | Zustand with persistence |
| Custom Hooks | `hooks/useMatches.ts` | React hooks for data fetching |
| Type Definitions | `types/index.ts` | 400+ TypeScript types |
| Feature Flags | `lib/features.ts` | Feature toggles |
| Mock Data | `lib/mockData.ts` | Development dummy data |
| Animations | `components/animations/index.ts` | 20+ motion variants |

### ML Engine Features
| Feature | File | Calculation |
|---------|------|------------|
| Form Index | `features/engineering.py` | Recent W/D/L weighted |
| Momentum Score | `features/engineering.py` | Form trend |
| Home Advantage | `features/engineering.py` | Home win % vs away |
| xG Differential | `features/engineering.py` | Attacking advantage |
| Defensive Stability | `features/engineering.py` | GA + clean sheets |
| Fatigue Index | `features/engineering.py` | Fixture congestion |
| Rotation Risk | `features/engineering.py` | Squad rotation probability |
| Motivation Pressure | `features/engineering.py` | Psychological factors |
| Weather Impact | `features/engineering.py` | Conditions modifier |
| Referee Bias | `features/engineering.py` | Card tendencies |

### ML Engine Models
| Model | File | Output |
|-------|------|--------|
| Poisson | `models/ensemble.py` | Goal probabilities |
| Logistic | `models/ensemble.py` | Win/Draw/Loss |
| Form-based | `models/ensemble.py` | Recent form trend |
| Tactical | `models/ensemble.py` | Matchup analysis |
| Ensemble | `models/ensemble.py` | Weighted average |

---

## 🔄 Data Flow

```
External APIs (10 providers)
    ↓
Backend Services Layer
    ├─ providers.ts (Data fetching)
    ├─ normalization.ts (Data mapping)
    └─ pipeline.ts (Orchestration)
    ↓
PostgreSQL Database
    ↓
Redis Cache
    ↓
Python ML Engine
    ├─ Feature Engineering (10 features)
    ├─ Prediction Models (5 models)
    └─ Ensemble Averaging
    ↓
REST API + WebSocket
    ↓
Frontend Application
    ├─ API Service (axios)
    ├─ State Management (Zustand)
    ├─ Real-time Updates (WebSocket)
    └─ UI Rendering (React components)
    ↓
User Browser / Mobile
```

---

## 📦 Dependencies

### Frontend
- **Core**: next, react, typescript
- **Styling**: tailwindcss, postcss
- **UI**: framer-motion, lucide-react
- **State**: zustand, zustand/middleware
- **HTTP**: axios
- **Charts**: recharts
- **WebSocket**: socket.io-client

### Backend
- **Framework**: fastify, fastify-cors, fastify-helmet
- **Database**: pg, pg-pool
- **Cache**: redis, ioredis
- **Job Queue**: bullmq
- **Auth**: jsonwebtoken, bcrypt
- **Utilities**: axios, dotenv, winston
- **DevOps**: docker, docker-compose

### Python Engine
- **Framework**: fastapi, uvicorn
- **ML**: scikit-learn, numpy, scipy
- **Data**: pandas, joblib
- **Cache**: redis
- **Utilities**: python-dotenv, pydantic

---

## 🚀 Quick Reference

### Run Locally
```bash
setup.bat                    # Windows
bash setup.sh               # Unix
docker-compose up           # Start all services
```

### Access Services
```
Frontend:  http://localhost:3000
Backend:   http://localhost:3001
Engine:    http://localhost:8000
Database:  localhost:5432
Redis:     localhost:6379
```

### Deploy to Production
```bash
# See DEPLOYMENT.md for detailed steps
docker-compose -f docker-compose.yml build
docker push predictsports-backend:latest
docker push predictsports-frontend:latest
docker push predictsports-engine:latest
# Deploy to Railway/Vercel via GitHub Actions
```

---

## 📚 Documentation Files

| Document | Purpose |
|----------|---------|
| README.md | Project overview & features |
| QUICK_START.md | 5-minute setup guide |
| API_DOCS.md | Complete API reference |
| ARCHITECTURE.md | System design & flow |
| DEVELOPMENT.md | Local development setup |
| DEPLOYMENT.md | Production deployment guide |
| BUILD_SUMMARY.md | Build process overview |
| PROJECT_STATUS.md | Completion checklist |
| FILE_INDEX.md | This file |

---

## 🔑 Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `RAPID_API_KEY` - API-Football key
- `FOOTBALL_DATA_API_KEY` - Backup fixtures
- `ODDS_API_KEY` - Betting odds
- `WEATHER_API_KEY` - Weather data

### Optional
- `SENTRY_DSN` - Error tracking
- `SENDGRID_API_KEY` - Email service
- `CLOUDINARY_*` - Image service

See `.env.example` for complete list.

---

**Generated**: February 6, 2026
**Status**: ✅ Complete
**Version**: 1.0.0

---
