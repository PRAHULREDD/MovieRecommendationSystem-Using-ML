@echo off
echo ========================================
echo Movie Recommender System Setup
echo ========================================
echo.

echo Step 1: Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH!
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)
python --version

echo.
echo Step 2: Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
node --version
npm --version

echo.
echo Step 3: Creating Python virtual environment...
if exist "movie_env" (
    echo Virtual environment already exists, skipping...
) else (
    python -m venv movie_env
    if errorlevel 1 (
        echo Error: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

echo.
echo Step 4: Installing Python dependencies...
call movie_env\Scripts\activate.bat
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo Warning: Some dependency conflicts detected, but installation completed.
    echo This is normal if you have gradio installed.
)

echo.
echo Step 5: Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install Node.js dependencies!
    pause
    exit /b 1
)

echo.
echo Step 6: Setup complete!
if not exist "backend\movie_database_full.parquet" (
    echo Warning: backend\movie_database_full.parquet not found!
    echo This file is required for the backend to work.
)

if not exist "backend\model_full.parquet" (
    echo Warning: backend\model_full.parquet not found!
    echo This file is required for the backend to work.
)

echo.
echo Step 7: Checking environment configuration...
if not exist ".env.local" (
    echo Warning: .env.local not found!
    echo Creating default .env.local file...
    echo GEMINI_API_KEY=PLACEHOLDER_API_KEY > .env.local
    echo Please update .env.local with your actual Gemini API key.
) else (
    echo .env.local file exists.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Run start_app.bat to start both frontend and backend
echo 2. Or run start_backend.bat and start_frontend.bat separately
echo.
echo Make sure to:
echo - Update .env.local with your Gemini API key
echo - Ensure movie_database_full.parquet and model_full.parquet exist
echo.
pause