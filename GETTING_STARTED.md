# Predictsports - Quick Setup Guide

## ⚠️ About the "517 Problems"

The problems you're seeing are **NOT actual compilation errors**. They are:

1. **CSS Linter Warnings** (~450 issues)
   - `@tailwind`, `@apply` are valid Tailwind CSS directives
   - These work perfectly at runtime
   - They're only flagged by the VS Code CSS linter
   - **Solution**: Ignore these warnings - they won't affect the app

2. **Missing Node Modules** (~60 issues)
   - Will be resolved when you run `npm install`
   - Current state shows TSError: Cannot find modules
   - **Solution**: Install dependencies (see below)

3. **tsconfig.json Being Parsed as TypeScript**
   - VS Code is treating JSON config as TypeScript
   - **Solution**: No action needed - it's a display issue

## 🚀 Getting Started (5 Minutes)

### Prerequisites

Before starting, ensure you have:
- ✅ **Node.js 18+** - [Download](https://nodejs.org)
- ✅ **Python 3.10+** - [Download](https://python.org)  
- ✅ **Docker Desktop** - [Download](https://docker.com/products/docker-desktop)

**Check Installed Versions**:
```powershell
node --version     # Should show v18 or newer
python --version   # Should show 3.10 or newer
docker --version   # Should show Docker version
```

### Step 1: Install Dependencies

From the project root directory:

```powershell
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..

# Engine dependencies
cd engine
python -m pip install -r requirements.txt
cd ..
```

**Or use the automated script:**
```powershell
./setup-windows.ps1
```

### Step 2: Configure Environment

Copy the example environment file:
```powershell
copy .env.example .env
```

Edit `.env` and update:
- Database credentials
- Redis connection string
- API keys for data providers
- JWT secret

Example `.env`:
```
# Database
DATABASE_URL=postgresql://predictsports:password@postgres:5432/predictsports
REDIS_URL=redis://redis:6379

# API Keys (optional for demo)
API_FOOTBALL_KEY=your_key_here
JWT_SECRET=your_secret_key

# Services
BACKEND_PORT=3001
FRONTEND_PORT=3000
ENGINE_PORT=8000
```

### Step 3: Start the Platform

**Start all services with Docker Compose:**
```powershell
docker-compose up
```

This starts:
- **Frontend** (Next.js) → http://localhost:3000
- **Backend** (Fastify) → http://localhost:3001
- **Engine** (FastAPI) → http://localhost:8000
- **PostgreSQL** → localhost:5432
- **Redis** → localhost:6379

### Step 4: Access the Application

Open your browser:
- **Main App**: http://localhost:3000
- **API Status**: http://localhost:3001/health
- **Engine Status**: http://localhost:8000/health

## 📋 Troubleshooting

### Issue: "docker: command not found"
**Solution**: Docker Desktop is not installed or not in PATH
- Install from: https://www.docker.com/products/docker-desktop
- After installation, restart your terminal

### Issue: "Port already in use"
**Solution**: Another service is using the port
```powershell
# Find what's using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill the process
Stop-Process -Id <PID> -Force
```

### Issue: "Cannot find module 'fastify'"
**Solution**: Dependencies not installed
```powershell
cd backend
npm install --legacy-peer-deps
cd ..
```

### Issue: Database connection failed
**Solution**: PostgreSQL container not running
```powershell
# Check container status
docker ps

# View logs
docker-compose logs postgres
```

### Issue: npm install fails
**Solution**: Try clearing npm cache and reinstalling
```powershell
npm cache clean --force
cd frontend
npm install
```

## 🔧 Docker Commands

```powershell
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose build --no-cache

# View running containers
docker ps

# Access container shell
docker exec -it predictsports-backend sh

# View service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f engine
```

## 📊 Project Structure

```
predictsports/
├── frontend/          # Next.js app (http://localhost:3000)
├── backend/           # Fastify API (http://localhost:3001)
├── engine/            # Python ML engine (http://localhost:8000)
├── docker-compose.yml # Service orchestration
├── .env.example       # Environment template
├── setup-windows.ps1  # Setup script (Windows)
├── setup.sh           # Setup script (Linux/Mac)
└── QUICK_START.md     # This file
```

## 🎯 What Each Service Does

### Frontend (`http://localhost:3000`)
- Next.js 14 application
- React components with Framer Motion animations
- Dark theme with neon accents
- Pages: Home, Dashboard, Match Details, Profile

### Backend (`http://localhost:3001`)
- Fastify REST API
- JWT authentication
- Real-time WebSocket support
- 20+ endpoints for fixtures, predictions, live feed

### Engine (`http://localhost:8000`)
- FastAPI Python app
- ML ensemble (5 models)
- 10 feature engineers
- Prediction generation

### Database (PostgreSQL)
- Stores fixtures, predictions, user data
- 15+ tables for comprehensive data model

### Cache (Redis)
- Caches predictions & match data
- Real-time event streaming
- Session management

## 🔐 Security

- **JWT Authentication** on protected endpoints
- **Rate Limiting**: 100 requests/minute
- **CORS** configured for cross-origin requests
- **Helmet** headers for security
- **Input Validation** on all endpoints

## 📚 Additional Resources

- **API Documentation**: See [API_DOCS.md](API_DOCS.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Development**: See [DEVELOPMENT.md](DEVELOPMENT.md)

## 🆘 Getting Help

1. Check logs: `docker-compose logs [service]`
2. Review documentation files in the repo
3. Check VS Code Terminal output
4. Verify all prerequisites are installed

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:3001/health
- [ ] Engine responds at http://localhost:8000/health
- [ ] Database is running: `docker ps` shows postgres
- [ ] Redis is running: `docker ps` shows redis
- [ ] No errors in `docker-compose logs`

## 📝 Next Steps

1. **Explore the Dashboard**: http://localhost:3000
2. **Check API Endpoints**: http://localhost:3001/api
3. **View Match Predictions**: Select a fixture from dashboard
4. **Try AI Chat**: Use the AI predictions analyst feature
5. **Check Profile**: View your stats and badges

---

**Happy Predicting! 🚀**

Need help? Check the documentation or open an issue on GitHub.
