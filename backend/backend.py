from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pyarrow.parquet as pq
import pyarrow as pa
from typing import List

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load pre-trained model
master_dataset = pd.read_parquet("movie_database_full.parquet")
table = pa.parquet.read_table("model_full.parquet").to_pandas()
titles = master_dataset['title']
titles_lower = titles.str.lower().tolist()

class MovieRequest(BaseModel):
    movie_name: str

class Movie(BaseModel):
    title: str
    overview: str
    poster_path: str
    vote_average: float
    release_date: str

@app.post("/api/recommendations", response_model=List[Movie])
async def get_recommendations(request: MovieRequest):
    movie_name = request.movie_name.strip().lower()
    
    if movie_name not in titles_lower:
        raise HTTPException(status_code=404, detail=f"Movie '{request.movie_name}' not found")
    
    idx = titles_lower.index(movie_name)
    sim_scores = list(enumerate(table[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
    movies = master_dataset.iloc[[i[0] for i in sim_scores]]
    
    recommendations = []
    for _, movie in movies.iterrows():
        recommendations.append(Movie(
            title=movie['title'],
            overview=f"Directed by {movie.get('main_director', 'Unknown')}",
            poster_path="",  # No poster data in your model
            vote_average=8.0,  # Default rating
            release_date=str(movie.get('release_date', ''))
        ))
    
    return recommendations

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "movies_count": len(master_dataset)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)