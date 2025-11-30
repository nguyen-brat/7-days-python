#!/bin/bash
# Script to run the backend locally

echo "🚀 Starting Backend Server..."
echo "================================"

# Navigate to project root
cd "$(dirname "$0")"

# Load environment variables (ignore comments and empty lines)
export $(grep -v '^#' .env | grep -v '^[[:space:]]*$' | xargs)

# Sync dependencies with uv
echo "📦 Installing dependencies..."
uv sync

# Run the backend server
echo "🔧 Starting FastAPI server..."
echo "Backend will be available at: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""

# Run uvicorn from the backend directory
cd user_management/backend
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
