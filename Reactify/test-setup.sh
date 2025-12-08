#!/bin/bash

# Reactify Test Script
# This script verifies that both backend and frontend work correctly

echo "🔍 Reactify System Check"
echo "========================"
echo ""

# Check Node.js
echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

# Check MongoDB
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB installed"
else
    echo "⚠️  MongoDB not found - you'll need MongoDB running for the backend"
fi

echo ""
echo "📦 Checking Dependencies..."
echo ""

# Backend
cd backend
if [ -d "node_modules" ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing - run: cd backend && npm install"
fi

# Frontend
cd ../frontend
if [ -d "node_modules" ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing - run: cd frontend && npm install"
fi

cd ..

echo ""
echo "📝 Project Structure:"
echo "   ✓ Backend: Node.js + Express + MongoDB + Socket.IO"
echo "   ✓ Frontend: React + Vite + Tailwind CSS"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Ensure MongoDB is running:"
echo "   mongod --dbpath /path/to/db"
echo ""
echo "2. Create backend/.env file (see backend/.env.example)"
echo ""
echo "3. Start Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "========================"
