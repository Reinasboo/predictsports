# Vercel Deployment Guide

## Overview
Predictsports is a monorepo application spanning multiple services. For Vercel deployment, we use a hybrid approach:

- **Frontend**: Next.js deployed to Vercel
- **Backend + Bot**: Deployed to external service (Railway, Render, or Heroku)
- **ML Engine**: Deployed to external service

## Architecture

```
Frontend (Next.js) → Vercel [vercel.com]
    ↓
Backend (Fastify) → External Service [Railway/Render]
    ├── Telegram Bot
    ├── Socket.io
    └── API Routes
    
ML Engine (FastAPI) → External Service
```

## Step 1: Deploy Frontend to Vercel

### 1.1 Connect Repository
```bash
# Link your GitHub repository to Vercel
# Visit https://vercel.com/new and select your GitHub repository
# Vercel will auto-detect this as a Next.js project
```

### 1.2 Configure Frontend Build Settings
- **Framework**: Automatically detected (Next.js)
- **Build Command**: `npm run build --prefix ./frontend`
- **Output Directory**: `frontend/.next`
- **Install Command**: `npm install --legacy-peer-deps`

### 1.3 Set Frontend Environment Variables
Add these to Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://your-backend-service.com
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyCDA7ZZwuQsvNjqd6nJ_wO65I7HEPyZ_hY
```

### 1.4 Deploy
- Push to main branch or use Vercel dashboard
- Frontend will be live at `your-project.vercel.app`

## Step 2: Deploy Backend + Bot

### 2.1 Choose External Hosting Service

**Option A: Railway (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project in Railway dashboard
# Link your repository
```

**Option B: Render**
```bash
# Visit https://dashboard.render.com
# Create new Web Service
# Select GitHub repository
```

**Option C: Heroku**
```bash
npm install -g heroku
heroku login
heroku create predictsports-backend
git push heroku main
```

### 2.2 Backend Build Configuration

**For Railway/Render:**

Create or update `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

### 2.3 Backend Environment Variables (External Service)

Set these in your hosting service dashboard:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=8707110372:AAE76L5PcD-eQxO-zIsnmMdHOOW5mf6nt0M

# APIs
GEMINI_API_KEY=AIzaSyCDA7ZZwuQsvNjqd6nJ_wO65I7HEPyZ_hY
PL_API_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/predictsports
REDIS_URL=redis://user:password@host:6379

# Bot behavior
NODE_ENV=production
LOG_LEVEL=info
```

### 2.4 Configure Database & Redis

Deploy PostgreSQL and Redis to the same service:

**Railway Example:**
```bash
# In Railway dashboard:
# 1. Add PostgreSQL plugin
# 2. Add Redis plugin
# 3. Copy connection strings to environment variables
```

### 2.5 Deploy Backend

**Railway:**
```bash
railway up
```

**Render:**
- Push to GitHub, Render auto-deploys

## Step 3: Deploy ML Engine (Optional)

### 3.1 Create Dockerfile for FastAPI

`engine/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY engine/requirements.txt .
RUN pip install -r requirements.txt

COPY engine/src ./src

EXPOSE 8001

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 3.2 Deploy to External Service

Follow similar steps as backend for Railway/Render/Heroku.

## Step 4: Configure Communication

### 4.1 Update Frontend API URL

After backend deployment, update the frontend environment in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend-service.com
```

### 4.2 Update Backend CORS

In `backend/src/app.ts`, ensure CORS is configured for your Vercel domain:

```typescript
app.register(cors, {
  origin: [
    'https://your-project.vercel.app',
    'http://localhost:3000',  // development
    'http://localhost:3001'   // frontend dev
  ],
  credentials: true
});
```

## Deployment Checklist

- [ ] Frontend builds successfully on Vercel
- [ ] Backend environment variables set in hosting service
- [ ] Database migrations run on first deployment
- [ ] Redis connection verified
- [ ] Telegram bot running and receiving updates
- [ ] Bot commands working (/start, /help, /analyze, /table, etc.)
- [ ] Frontend API calls working against production backend
- [ ] SSL/TLS enabled on all services
- [ ] Monitoring configured
- [ ] Error logging enabled (Sentry, Datadog, etc.)

## Monitoring & Debugging

### Vercel Frontend
```bash
# View logs
vercel logs your-project

# Git push to deploy
git push origin main
```

### Backend Service Logs
- Railway: Dashboard → Logs tab
- Render: Dashboard → Logs
- Heroku: `heroku logs --tail`

### Common Issues

**1. CORS Errors**
- Solution: Update backend CORS configuration with Vercel domain

**2. Database Connection Failed**
- Solution: Verify DATABASE_URL and firewall rules

**3. Bot Not Responding**
- Solution: Check TELEGRAM_BOT_TOKEN and logs for errors

**4. Slow API Responses**
- Solution: Check Redis connection, database indexes, and external API latency

## Cost Optimization

- **Vercel**: Free tier includes up to 12 edge function invocations per day. Pro plan for production.
- **Railway**: Starting at $5/month
- **Render**: Free tier available, Starter plan $12/month
- **Database**: Managed PostgreSQL starts at ~$15/month
- **Redis**: Managed Redis starts at ~$5/month

## Production Checklist

- [ ] Error tracking (Sentry, Datadog)
- [ ] Performance monitoring (New Relic, Logrocket)
- [ ] Automated backups enabled
- [ ] CDN configured for static assets
- [ ] API rate limiting enabled
- [ ] Webhook validation for Telegram
- [ ] Database query optimization
- [ ] Load testing completed
