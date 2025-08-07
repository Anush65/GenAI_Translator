#!/bin/bash

echo "Starting Creative Language Translator..."
echo

echo "Starting Backend Server..."
cd /workspace
source venv/bin/activate
cd backend
python3 main.py &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd /workspace
npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo

# Wait for user input to stop servers
echo "Press Enter to stop both servers..."
read -r

echo "Stopping servers..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "Servers stopped."