@echo off
echo Starting Movie Recommender Backend...
echo.

if not exist "movie_env\Scripts\activate.bat" (
    echo Error: Virtual environment not found!
    echo Please create it first: python -m venv movie_env
    pause
    exit /b 1
)

if not exist "backend\movie_database_full.parquet" (
    echo Error: Movie database file not found!
    echo Please ensure backend\movie_database_full.parquet exists.
    pause
    exit /b 1
)

if not exist "backend\model_full.parquet" (
    echo Error: Model file not found!
    echo Please ensure backend\model_full.parquet exists.
    pause
    exit /b 1
)

echo Activating virtual environment...
call movie_env\Scripts\activate.bat

echo Starting FastAPI backend server...
echo Backend will be available at: http://localhost:8000
echo.
cd backend
python backend.py
pause