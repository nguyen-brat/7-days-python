#!/bin/bash
# Script to run the frontend locally

echo "🚀 Starting Frontend Server..."
echo "================================"

# Navigate to frontend directory
cd "$(dirname "$0")/user_management/frontend"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run the development server
echo "🔧 Starting Vite dev server..."
echo "Frontend will be available at: http://localhost:5173"
echo ""

npm run dev
