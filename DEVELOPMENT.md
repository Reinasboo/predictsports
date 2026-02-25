# Predictsports Development Guide

## Project Structure Overview

```
predictsports/
├── backend/              # Node.js + Fastify API
├── frontend/             # Next.js web application
├── engine/               # Python ML prediction engine
├── data-pipelines/       # Data ingestion orchestrator
└── docker-compose.yml    # Docker orchestration
```

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Quick Start

1. **Clone and setup**
```bash
cd predictsports
cp .env.example .env
# Edit .env with your API keys
```

2. **Start all services**
```bash
# Linux/Mac
bash setup.sh

# Windows
setup.bat

# Or manually
docker-compose up -d
```

3. **Access services**
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- ML Engine: http://localhost:8001

## Backend Development

### Stack
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: BullMQ

### Key Files
- `src/index.ts` - Main entry point
- `src/app.ts` - Fastify app setup
- `src/routes/` - API endpoints
- `src/services/` - Business logic
- `src/db/` - Database layer

### Running Locally
```bash
cd backend
npm install
npm run dev
```

### Building
```bash
npm run build
npm start
```

### Testing
```bash
npm run test
npm run lint
```

## Frontend Development

### Stack
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: Zustand
- **Real-time**: Socket.IO

### Key Files
- `src/app/` - Next.js pages (App Router)
- `src/components/` - Reusable components
- `src/services/api.ts` - API client
- `src/styles/` - Global styles

### Running Locally
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Building
```bash
npm run build
npm start
```

## ML Engine Development

### Stack
- **Framework**: FastAPI
- **ML**: Scikit-learn, NumPy
- **Language**: Python 3.11

### Key Files
- `src/main.py` - FastAPI app
- `src/models/` - ML models
- `src/routes/` - API endpoints
- `src/features/` - Feature engineering

### Running Locally
```bash
cd engine
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

## Database Management

### Initialize Schema
```bash
docker-compose exec postgres psql -U predictsports -d predictsports < backend/src/db/schema.sql
```

### Seed Sample Data
```bash
docker-compose exec postgres psql -U predictsports -d predictsports < backend/src/db/seed.sql
```

### Access PostgreSQL
```bash
docker-compose exec postgres psql -U predictsports -d predictsports
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f engine
```

## API Key Configuration

### Required APIs
1. **API-Football** (RapidAPI)
   - Get key from: https://rapidapi.com/api-sports/api/api-football
   - Add to .env: `RAPIDAPI_KEY=...`

2. **Football-Data.org**
   - Get key from: https://www.football-data.org/
   - Add to .env: `FOOTBALL_DATA_API_KEY=...`

3. **The Odds API**
   - Get key from: https://theosdsapi.com/
   - Add to .env: `ODDS_API_KEY=...`

4. **OpenWeatherMap**
   - Get key from: https://openweathermap.org/api
   - Add to .env: `OPENWEATHER_API_KEY=...`

## Adding New Endpoints

### Backend (Fastify)

1. Create route file: `src/routes/new-feature.ts`
```typescript
import { FastifyInstance } from 'fastify'

export async function newFeatureRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return { message: 'Hello' }
  })
}
```

2. Register in `src/routes/index.ts`
```typescript
await fastify.register(newFeatureRoutes, { prefix: '/api/new-feature' })
```

### Frontend (Next.js)

1. Create page: `src/app/new-page/page.tsx`
```typescript
'use client'

export default function NewPage() {
  return <div>New Page</div>
}
```

2. Add navigation link in `Navigation.tsx`

## Deployment

### Production Checklist
- [ ] Set up environment variables
- [ ] Configure CORS origins
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up CI/CD pipeline

### Deploy to Vercel (Frontend)
```bash
vercel --prod
```

### Deploy to Railway (Backend)
```bash
railway up
```

### Deploy to Fly.io (Alternative)
```bash
flyctl launch
flyctl deploy
```

## Troubleshooting

### Services won't start
```bash
# Check Docker daemon
docker ps

# Check logs
docker-compose logs

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database connection error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Verify connection string in .env
# Format: postgresql://user:password@host:port/database
```

### Redis connection error
```bash
# Test Redis
docker-compose exec redis redis-cli ping

# Should return: PONG
```

### API rate limiting
- Adjust `RATE_LIMIT` and `RATE_LIMIT_WINDOW` in .env

## Performance Tips

- Use Redis caching for frequently accessed data
- Implement pagination for large result sets
- Use database indexes on frequently queried columns
- Consider CDN for static assets
- Enable compression on API responses
- Use connection pooling

## Security Best Practices

- Never commit .env files
- Use environment variables for secrets
- Validate all user input
- Implement rate limiting
- Use HTTPS in production
- Add CORS restrictions
- Regular security audits

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge to main

## Support

For issues or questions:
- Create GitHub issue
- Check existing issues
- Review documentation
- Contact: support@predictsports.dev
