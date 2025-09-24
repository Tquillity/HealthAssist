#!/bin/bash

# HealthAssist - Development Startup Script

echo "🏥 Starting HealthAssist Development Environment"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure you have MongoDB running or use MongoDB Atlas."
fi

echo "📦 Installing dependencies..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🔧 Setting up environment..."

# Create .env file if it doesn't exist
cd ../server
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit server/.env with your MongoDB connection string and JWT secret"
fi

echo "🌱 Seeding database with sample data..."
# Build and run the seed script
npm run build
if [ -f "dist/scripts/seedDatabase.js" ]; then
    node dist/scripts/seedDatabase.js
    echo "✅ Database seeded successfully"
else
    echo "⚠️  Seed script not found. Run 'npm run build' in the server directory first."
fi

echo "🚀 Starting development servers..."

# Start backend in background
echo "Starting backend server on http://localhost:5000"
cd ../server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend client on http://localhost:3000"
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
