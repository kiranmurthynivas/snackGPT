#!/bin/bash

# SnackGPT Setup Script
# This script helps you set up the SnackGPT project for the Aya MCP Hackathon

echo "🍽️ Welcome to SnackGPT Setup!"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Create environment file
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env file"
    echo "⚠️  Please edit server/.env and add your Comput3 API key"
else
    echo "✅ server/.env already exists"
fi

# Create necessary directories
echo ""
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p docs
echo "✅ Directories created"

# Check if Comput3 API key is set
if grep -q "your_comput3_api_key_here" server/.env; then
    echo ""
    echo "⚠️  IMPORTANT: Please update server/.env with your Comput3 API key"
    echo "   You can get one from: https://comput3.ai"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your Comput3 API key"
echo "2. Run 'npm run dev' to start both frontend and backend"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy cooking! 🍳"
