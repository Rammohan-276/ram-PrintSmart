@echo off
title Fish Prediction API Server
color 0A
echo ================================================================
echo 🐟 Fish Prediction API Server
echo ================================================================
echo 📡 Starting server at: http://localhost:8000
echo 📚 Documentation at: http://localhost:8000/docs
echo 🛑 To stop: Close this window or press Ctrl+C
echo ================================================================
echo.

cd /d "C:\Users\a30ku\way-to-marine"
python start_api.py

pause