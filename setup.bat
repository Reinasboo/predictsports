@echo off
REM Predictsports Setup Script for Windows
REM Production-grade AI sports prediction platform

setlocal enabledelayedexpansion

echo.
echo 🚀 PREDICTSPORTS SETUP SCRIPT
echo ===============================
echo Building production-grade AI sports analytics platform
echo.

REM Check required tools
echo Checking dependencies...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.10+
    exit /b 1
)

echo ✅ All dependencies found
echo.

REM Create .env files
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo ⚠️  Please update .env with your API keys before running
)

if not exist backend\.env (
    echo Creating backend/.env file...
    copy backend\.env.example backend\.env >nul
)

if not exist frontend\.env.local (
    echo Creating frontend/.env.local file...
    copy frontend\.env.example frontend\.env.local >nul
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
echo Building backend services...
cd backend
call npm install
cd ..

echo Building frontend...
cd frontend
call npm install
cd ..

echo Setting up Python environment...
cd engine
pip install -r requirements.txt
cd ..

echo Building data pipelines...
cd data-pipelines
call npm install
cd ..

REM Build Docker images
echo.
echo 🐳 Building Docker containers...
docker-compose build

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your API keys
echo 2. Run: docker-compose up
echo 3. Access frontend at http://localhost:3000
echo 4. API available at http://localhost:3001
echo.
echo For detailed setup instructions, see DEVELOPMENT.md
echo.
echo Building Docker images and starting services...
docker-compose up -d

REM Wait for services
echo Waiting for services to start...
timeout /t 10 /nobreak

REM Initialize database
echo Initializing database...
docker-compose exec -T postgres psql -U predictsports -d predictsports -f /docker-entrypoint-initdb.d/01-schema.sql

echo.
echo ✅ Setup complete!
echo.
echo Services:
echo   - Frontend: http://localhost:3001
echo   - Backend API: http://localhost:3000
echo   - ML Engine: http://localhost:8001
echo.
echo Run 'docker-compose logs -f' to view logs
