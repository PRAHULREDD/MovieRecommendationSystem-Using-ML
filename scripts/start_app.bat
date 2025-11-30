@echo off
echo Starting Movie Recommender System...
echo.

echo Checking if virtual environment exists...
if not exist "movie_env\Scripts\activate.bat" (
    echo Virtual environment not found! Please create it first.
    echo Run: python -m venv movie_env
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0 && call movie_env\Scripts\activate.bat && cd backend && python backend.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000 (or check the terminal for actual port)
echo.
echo Press any key to exit...
pause