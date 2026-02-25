# Predictsports - Setup & Deployment Guide

## 🔧 Installation Steps

### Prerequisites
- Windows 10/11 or macOS/Linux
- 8GB RAM minimum (16GB recommended)
- 50GB free disk space
- Admin access

### Step 1: Install Docker Desktop

#### Option A: Windows (Recommended)
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Run the installer
3. Follow the setup wizard
4. When prompted, enable WSL 2 (Windows Subsystem for Linux 2)
5. Restart your computer
6. Verify installation:
   ```powershell
   docker --version
   docker run hello-world
   ```

#### Option B: macOS
1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
2. Drag Docker.app to Applications folder
3. Launch Docker from Applications
4. Verify installation:
   ```bash
   docker --version
   docker run hello-world
   ```

#### Option C: Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify
docker --version
```

### Step 2: Install Node.js & npm
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation:
  ```
  node --version
  npm --version
  ```

### Step 3: Install Python
- Download from: https://www.python.org/ (Python 3.11+)
- Verify installation:
  ```
  python --version
  pip --version
  ```

### Step 4: Navigate to Project Directory
```powershell
cd C:\Users\Admin\Predictsports
# or
cd ~/Predictsports  # macOS/Linux
```

## 📦 Install Dependencies

### Frontend
```bash
cd frontend
npm install
cd ..
```

### Backend
```bash
cd backend
npm install
cd ..
```

### ML Engine
```bash
cd engine
pip install -r requirements.txt
cd ..
```

## 🚀 Running the Platform

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- ML Engine: http://localhost:8000
- API Documentation: http://localhost:3001/api/docs

### Option 2: Manual Setup (Development)

#### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
# Access at http://localhost:3000
```

#### Terminal 2 - Backend
```bash
cd backend
npm run dev
# Access at http://localhost:3001
```

#### Terminal 3 - ML Engine
```bash
cd engine
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
# Access at http://localhost:8000
```

#### Terminal 4 - Database (Docker only)
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=predictsports \
  -e POSTGRES_DB=predictsports \
  -p 5432:5432 \
  postgres:14

# And Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7
```

## 📝 Environment Configuration

### 1. Create .env files

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**backend/.env**
```
DATABASE_URL=postgresql://postgres:predictsports@localhost:5432/predictsports
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
NODE_ENV=development
API_PORT=3001

# Optional: Data Provider APIs
API_FOOTBALL_KEY=your_key
FOOTBALL_DATA_KEY=your_key
ODDS_API_KEY=your_key
OPENWEATHER_KEY=your_key
```

**engine/.env**
```
DATABASE_URL=postgresql://postgres:predictsports@localhost:5432/predictsports
REDIS_URL=redis://localhost:6379
MODEL_CACHE_TTL=3600
DEBUG=False
```

### 2. Initialize Database

```bash
# With Docker running:
docker-compose run backend npm run migrate

# Or manually:
psql -U postgres -d predictsports < backend/src/db/schema.sql
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:3001/health
- [ ] ML Engine responds at http://localhost:8000/health
- [ ] Database connection works
- [ ] Redis cache accessible
- [ ] WebSocket connection successful
- [ ] API endpoints return data

### Test Endpoints

```bash
# Frontend loads
curl http://localhost:3000

# Backend health check
curl http://localhost:3001/health

# ML Engine health check
curl http://localhost:8000/health

# Get fixtures
curl http://localhost:3001/api/fixtures

# Get predictions
curl http://localhost:3001/api/predictions/1
```

## 🐛 Troubleshooting

### Docker not starting
- Ensure WSL 2 is enabled (Windows)
- Check if Docker daemon is running
- Try: `docker ps`

### Port already in use
```bash
# Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Database connection failed
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check password is correct

### Redis connection failed
- Verify Redis container is running
- Check REDIS_URL in .env
- Ensure port 6379 is not blocked

### npm install failed
- Delete node_modules: `rm -r frontend/node_modules`
- Clear cache: `npm cache clean --force`
- Retry: `npm install`

### Python dependencies failed
- Create virtual environment: `python -m venv env`
- Activate: `source env/bin/activate` (macOS/Linux) or `env\Scripts\activate` (Windows)
- Install: `pip install -r engine/requirements.txt`

## 📊 Service Status

### Docker Compose Services

```yaml
# Running services:
- frontend (Next.js)         - Port 3000
- backend (Fastify)          - Port 3001
- engine (FastAPI)           - Port 8000
- postgres (PostgreSQL)      - Port 5432
- redis (Cache)              - Port 6379
```

### Health Check
```bash
# All services
docker-compose ps

# Service logs
docker-compose logs backend
docker-compose logs engine
docker-compose logs postgres
```

## 🔒 Production Deployment

For production, see [DEPLOYMENT.md](DEPLOYMENT.md)

Key steps:
1. Build Docker images: `docker-compose build`
2. Configure environment variables
3. Run database migrations
4. Start services: `docker-compose up -d`
5. Verify health checks
6. Monitor logs
7. Scale if needed

## 📚 Documentation

- [README.md](README.md) - Project overview
- [QUICK_START.md](QUICK_START.md) - 5-minute guide
- [API_DOCS.md](API_DOCS.md) - API reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all ports are available
4. Check database is initialized
5. Review error messages carefully
6. Consult documentation

## ✨ What's Next

Once running:
1. Open http://localhost:3000
2. Create an account
3. Browse upcoming fixtures
4. View predictions
5. Make predictions
6. Check leaderboard
7. Earn badges & XP

---

**Happy predicting! 🎯**
