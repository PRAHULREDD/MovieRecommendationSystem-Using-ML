@echo off
echo Starting Movie Recommender Frontend...
echo.

if not exist "package.json" (
    echo Error: package.json not found!
    echo Please ensure you're in the correct directory.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting Vite development server...
echo Frontend will be available at: http://localhost:3000
echo.
npm run dev
pause