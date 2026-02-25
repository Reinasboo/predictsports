# Predictsports Deployment Guide

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Git

### Services to Deploy
1. **Frontend** (Next.js) → Vercel / Railway
2. **Backend** (Fastify) → Railway / Fly.io
3. **Python Engine** (FastAPI) → Railway
4. **Database** (PostgreSQL) → Supabase / Neon
5. **Cache** (Redis) → Upstash
6. **Storage** (S3) → AWS / Cloudinary

---

## Step 1: Infrastructure Setup

### 1.1 Database (Supabase)
```bash
# Create Supabase project
# Copy connection string to DATABASE_URL
# Run migrations:

psql $DATABASE_URL < backend/src/db/schema.sql
```

### 1.2 Redis (Upstash)
```bash
# Create Upstash Redis cluster
# Copy Redis URL to REDIS_URL
```

### 1.3 Environment Variables
```bash
# Copy root .env.example to .env
cp .env.example .env

# Update with production values:
# - Database URLs
# - API keys for all providers
# - Redis connection
# - JWT secret (use strong 256+ char string)
```

---

## Step 2: Backend Deployment (Railway)

### Create Railway Project
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Set environment variables
railway variables set \
  DATABASE_URL=$DATABASE_URL \
  REDIS_URL=$REDIS_URL \
  NODE_ENV=production \
  API_SECRET_KEY=$API_SECRET_KEY
```

### Deploy Backend
```bash
cd backend

# Build
npm run build

# Deploy
railway up
```

Railway will:
- Build Docker image
- Deploy to production
- Set up health checks
- Configure auto-scaling
- Enable monitoring

### Verify Backend
```bash
curl https://api.predictsports.com/health
```

---

## Step 3: Python Engine Deployment

```bash
cd engine

# Build Docker image
docker build -t predictsports-engine:latest .

# Push to Railway
railway up

# Environment variables
railway variables set \
  REDIS_URL=$REDIS_URL \
  PYTHON_ENGINE_PORT=8000
```

### Verify Engine
```bash
curl https://engine.predictsports.com/health
```

---

## Step 4: Frontend Deployment (Vercel)

### Connect to Vercel
```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://api.predictsports.com
NEXT_PUBLIC_WS_URL=wss://api.predictsports.com/ws
```

### Verify Frontend
```
https://predictsports.com
```

---

## Step 5: Database Schema & Seeding

```bash
# Run migrations
psql $DATABASE_URL < backend/src/db/schema.sql

# Seed initial data
node backend/dist/db/seed.js
```

---

## Step 6: SSL/TLS Configuration

### CloudFlare DNS
```
api.predictsports.com → Railway backend IP
engine.predictsports.com → Railway engine IP
predictsports.com → Vercel frontend
```

Automatic SSL via Vercel and Railway

---

## Step 7: Monitoring & Logging

### Application Performance Monitoring (APM)
```bash
# Install Sentry
npm install @sentry/node

# Configure in backend
export SENTRY_DSN=https://...@sentry.io/...
```

### Logs
- Railway Dashboard: View real-time logs
- Vercel Dashboard: View build & deployment logs
- CloudWatch: For detailed metrics

### Alerts
Set up alerts in Railway for:
- High error rate (>5%)
- High response times (>2s)
- Database connection failures
- Redis connection failures

---

## Step 8: Performance Optimization

### Frontend
```bash
# Enable Vercel Edge Caching
# Set cache headers in next.config.js

# Enable Image Optimization
# Use next/image for all images

# Code splitting
# Automatic via Next.js
```

### Backend
```bash
# Enable Redis caching
# Implement rate limiting
# Compress responses
# Use connection pooling
```

### Database
```bash
# Create indexes on frequently queried columns
CREATE INDEX idx_matches_kickoff ON matches(kickoff);
CREATE INDEX idx_predictions_match_id ON predictions(match_id);

# Enable connection pooling (PgBouncer)
```

---

## Step 9: Security

### API Key Management
```bash
# Rotate API keys monthly
# Store in Railway secrets
# Use different keys per environment
```

### CORS Configuration
```bash
# Only allow predictsports.com
CORS_ORIGIN=https://predictsports.com
```

### Rate Limiting
```bash
# 100 requests per 15 minutes
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Database Encryption
```bash
# Enable SSL connections
# Use environment-specific credentials
```

---

## Step 10: Backups

### Database Backups
```bash
# Daily automated backups via Supabase
# Retention: 30 days
# Test restore monthly
```

### Redis Backups
```bash
# Enable persistence in Upstash
# Daily snapshots
```

---

## Monitoring & Maintenance

### Daily Checks
```bash
# Health endpoint
curl https://api.predictsports.com/health

# Check Redis connection
redis-cli -u $REDIS_URL PING

# Check database
psql $DATABASE_URL -c "SELECT 1"
```

### Weekly Tasks
- Review error logs
- Check API rate limiting
- Validate data pipeline execution
- Test database backups

### Monthly Tasks
- Performance review
- Security audit
- API key rotation
- Dependency updates

---

## Rollback Procedures

### Frontend
```bash
# Vercel automatically keeps version history
# Rollback: Vercel Dashboard > Deployments > Rollback
```

### Backend/Engine
```bash
# Railway keeps deployment history
# Rollback via Railway Dashboard or CLI:
railway deploy --from=<previous-deployment-id>
```

### Database
```bash
# Use Supabase point-in-time recovery
# Restore from backup
```

---

## Troubleshooting

### High Latency
- Check Redis connection
- Review database slow queries
- Check CPU/memory usage on Railway
- Monitor network between services

### API Errors
- Check logs in Railway dashboard
- Verify API key validity
- Check rate limiting
- Validate request format

### Data Pipeline Issues
- Verify external API availability
- Check Redis connectivity
- Review normalization logic
- Check database connections

### Frontend Issues
- Check build logs in Vercel
- Verify API endpoint connectivity
- Check WebSocket connection
- Review browser console errors

---

## Cost Optimization

### Recommendations
- Use Reserved Instances for stable workloads
- Enable auto-scaling to match demand
- Use Redis persistence only when needed
- Implement database query optimization
- Use CDN for static assets

### Estimated Monthly Costs (2026)
- Railway Backend: ~$20-50
- Railway Engine: ~$20-50
- Vercel Frontend: ~$20
- Supabase Database: ~$25-100
- Upstash Redis: ~$10-25
- **Total: ~$95-245/month**

---

## Support

For deployment issues:
- Email: deploy@predictsports.com
- Slack: #deployment-help
- Docs: https://docs.predictsports.com/deploy
