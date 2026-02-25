#!/usr/bin/env powershell

###############################################################################
# Predictsports - Automated Setup Script
# This script sets up the entire Predictsports platform
###############################################################################

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Predictsports Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = & python --version
    Write-Host "✅ Python $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.10+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = & docker --version
    Write-Host "✅ Docker $dockerVersion found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not found. Installing Docker Desktop..." -ForegroundColor Yellow
    Write-Host "Please note: Docker Desktop installation requires administrator privileges" -ForegroundColor Yellow
    Write-Host "" 
    Read-Host "Press Enter to continue with Docker installation (you may need to provide admin confirmation)"
    
    try {
        & winget install Docker.DockerDesktop
        Write-Host "✅ Docker Desktop installation started" -ForegroundColor Green
        Write-Host "⏳ Installation may take 5-10 minutes. Please wait..." -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Docker installation failed. Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
Push-Location backend
& npm install
Pop-Location
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Install frontend dependencies  
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location frontend
& npm install
Pop-Location
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Install engine dependencies
Write-Host "📦 Installing engine dependencies..." -ForegroundColor Cyan
Push-Location engine
& python -m pip install -r requirements.txt
Pop-Location
Write-Host "✅ Engine dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy .env.example to .env and update with your settings"
Write-Host "2. Ensure Docker Desktop is running"
Write-Host "3. Run: docker-compose up" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "- Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Backend:   http://localhost:3001" -ForegroundColor Cyan  
Write-Host "- Engine:    http://localhost:8000" -ForegroundColor Cyan
Write-Host "- Postgres:  localhost:5432" -ForegroundColor Cyan
Write-Host "- Redis:     localhost:6379" -ForegroundColor Cyan
Write-Host ""
