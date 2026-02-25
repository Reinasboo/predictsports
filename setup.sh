#!/bin/bash

echo "🚀 Predictsports Setup Script"
echo "=============================="

# Check dependencies
echo "Checking dependencies..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

echo "✅ All dependencies found"

# Create .env file
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your API keys"
fi

# Build Docker images
echo ""
echo "Building Docker images..."
docker-compose build

# Start services
echo ""
echo "Starting services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 10

# Initialize database
echo ""
echo "Initializing database..."
docker-compose exec -T postgres psql -U predictsports -d predictsports < backend/src/db/schema.sql

# Seed database
echo ""
echo "Seeding database with sample data..."
docker-compose exec -T postgres psql -U predictsports -d predictsports < backend/src/db/seed.sql

echo ""
echo "✅ Setup complete!"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost:3001"
echo "  - Backend API: http://localhost:3000"
echo "  - ML Engine: http://localhost:8001"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "Next steps:"
echo "  1. Update .env with your API keys"
echo "  2. Visit http://localhost:3001 to access the platform"
