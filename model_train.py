import os
import time
import pandas as pd
import numpy as np
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.snowball import SnowballStemmer
import pyarrow as pa
import pyarrow.parquet as pq
import warnings
warnings.simplefilter('ignore')

# ================================================================
#  Section 0 — Dataset Setup
# ================================================================

print("[INFO] Checking dataset files...")

# Change this path to where you extracted your dataset folder
DATA_PATH = "data/the-movies-dataset"

required_files = [
    "movies_metadata.csv",
    "credits.csv",
    "keywords.csv",
    "links.csv"
]

for file in required_files:
    path = os.path.join(DATA_PATH, file)
    if not os.path.exists(path):
        raise FileNotFoundError(f" Missing file: {file} in {DATA_PATH}")
print("[OK] All dataset CSV files found!")

# ================================================================
#  Section 1 — Data Loading
# ================================================================

print("[INFO] Loading CSV files...")
movies_dataset  = pd.read_csv(os.path.join(DATA_PATH, "movies_metadata.csv"))
credits         = pd.read_csv(os.path.join(DATA_PATH, "credits.csv"))
keywords        = pd.read_csv(os.path.join(DATA_PATH, "keywords.csv"))
links           = pd.read_csv(os.path.join(DATA_PATH, "links.csv"))
print("[OK] All CSV files loaded.")
print(f"movies_metadata: {movies_dataset.shape}")
print(f"credits: {credits.shape}")
print(f"keywords: {keywords.shape}")
print(f"links: {links.shape}")

# ================================================================
#  Section 2 — Data Cleaning & Merging
# ================================================================

print("[STEP] Dropping bad rows...")
movies_dataset = movies_dataset.drop([19730, 29503, 35587])

print("[STEP] Parsing genres...")
movies_dataset['genres'] = movies_dataset['genres'].fillna('[]').apply(literal_eval).apply(
    lambda x: [i['name'] for i in x] if isinstance(x, list) else []
)

print("[STEP] Converting IDs to int and merging datasets...")
keywords['id'] = keywords['id'].astype('int')
credits['id'] = credits['id'].astype('int')
movies_dataset['id'] = movies_dataset['id'].astype('int')

movies_dataset = movies_dataset.merge(credits, on='id')
master_dataset = movies_dataset.merge(keywords, on='id')
print(f"[OK] master_dataset merged: {master_dataset.shape}")

# ================================================================
#  Section 3 — Feature Engineering
# ================================================================

print("[STEP] Parsing cast, crew, keywords columns...")

def get_director(x):
    for i in x:
        if i['job'] == 'Director':
            return i['name']
    return np.nan

master_dataset['cast'] = master_dataset['cast'].apply(literal_eval)
master_dataset['crew'] = master_dataset['crew'].apply(literal_eval)
master_dataset['keywords'] = master_dataset['keywords'].apply(literal_eval)

master_dataset['cast'] = master_dataset['cast'].apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])
master_dataset['cast'] = master_dataset['cast'].apply(lambda x: x[:3] if len(x) >= 3 else x)
master_dataset['keywords'] = master_dataset['keywords'].apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])
master_dataset['director'] = master_dataset['crew'].apply(get_director)

print("[STEP] Cleaning and normalizing text data...")
master_dataset['cast'] = master_dataset['cast'].apply(lambda x: [str.lower(i.replace(" ", "")) for i in x])
master_dataset['main_director'] = master_dataset['director']
master_dataset['director'] = master_dataset['director'].astype('str').apply(lambda x: str.lower(x.replace(" ", "")))
master_dataset['director'] = master_dataset['director'].apply(lambda x: [x, x, x])

print("[STEP] Stemming keywords...")
stemmer = SnowballStemmer('english')
master_dataset['keywords'] = master_dataset['keywords'].apply(lambda x: [stemmer.stem(i) for i in x])
master_dataset['keywords'] = master_dataset['keywords'].apply(lambda x: [str.lower(i.replace(" ", "")) for i in x])

print("[STEP] Creating soup feature...")
master_dataset['soup'] = master_dataset['keywords'] + master_dataset['cast'] + master_dataset['director'] + master_dataset['genres']
master_dataset['soup'] = master_dataset['soup'].apply(lambda x: ' '.join(x))
print("[INFO] Feature engineering complete!")

# ================================================================
#  Section 4 — Dataset Finalization (Full Dataset)
# ================================================================

print("[STEP] Cleaning unnecessary columns safely...")

columns_to_drop = [
    'adult','belongs_to_collection','budget','homepage','original_language',
    'production_companies','production_countries','revenue','runtime',
    'spoken_languages','status','video','overview','tagline',
    'vote_average','vote_count','cast','crew','keywords','director',
    'id','imdb_id','original_title','poster_path','genres'
]

existing_cols = [col for col in columns_to_drop if col in master_dataset.columns]
master_dataset.drop(existing_cols, axis=1, inplace=True, errors='ignore')

print(f"[INFO] Remaining columns after cleaning: {master_dataset.columns.tolist()}")
if 'popularity' in master_dataset.columns:
    print("[STEP] Cleaning popularity column...")
    master_dataset['popularity'] = pd.to_numeric(master_dataset['popularity'], errors='coerce')
    master_dataset.dropna(subset=['popularity'], inplace=True)
    master_dataset.sort_values(by=['popularity'], ascending=False, inplace=True)
    master_dataset.drop(['popularity'], axis=1, inplace=True)
else:
    print("[WARN] 'popularity' column not found — skipping sort.")

master_dataset.reset_index(inplace=True, drop=True)
print(f"[STEP] Using all movies for training: {master_dataset.shape[0]}")
print("[OK] Dataset finalized successfully!")

# ================================================================
#  Section 5 — Model Training (Optimized for 16 GB RAM)
# ================================================================

print("[TRAIN] Starting model training...")
start_time = time.time()

count = CountVectorizer(analyzer='word', ngram_range=(1, 2), min_df=3, max_features=15000, stop_words='english')
count_matrix = count.fit_transform(master_dataset['soup'])
print(f"[OK] Count matrix shape: {count_matrix.shape}")

print("[TRAIN] Computing cosine similarity (sparse, float32)...")
similarity_matrix = cosine_similarity(count_matrix, dense_output=False)
similarity_matrix = similarity_matrix.astype(np.float32)
print("[OK] Cosine similarity matrix computed successfully.")

# ================================================================
#  Section 6 — Export Model & Dataset
# ================================================================

print("[SAVE] Saving dataset and model to disk...")
master_dataset.to_parquet("movie_database_full.parquet", engine="fastparquet", index=False)

pq.write_table(pa.Table.from_pandas(
    pd.DataFrame(similarity_matrix.toarray(), dtype=np.float32)
), "model_full.parquet")

print("[DONE] Model and dataset exported.")
print(f"⏱ Total training time: {(time.time() - start_time)/60:.2f} minutes")

# ================================================================
#  Section 7 — Inference
# ================================================================

print("[LOAD] Loading model and dataset for inference...")
master_dataset = pd.read_parquet("movie_database_full.parquet")
table = pa.parquet.read_table("model_full.parquet").to_pandas()

titles = master_dataset['title']
indices = pd.Series(master_dataset.index, index=master_dataset['title'])

def get_recommendations(movie_id_from_db, movie_db):
    try:
        sim_scores = list(enumerate(movie_db[movie_id_from_db]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:15]
        movie_indices = [i[0] for i in sim_scores]
        output = master_dataset.iloc[movie_indices]
        output.reset_index(inplace=True, drop=True)
        response = []
        for i in range(len(output)):
            response.append({
                'movie_title': output['title'].iloc[i],
                'movie_release_date': output['release_date'].iloc[i],
                'movie_director': output['main_director'].iloc[i],
                'google_link': "https://www.google.com/search?q=" + '+'.join(output['title'].iloc[i].strip().split())
            })
        return response
    except Exception as e:
        print("Error:", e)
        return []

print("[READY] Model loaded. Type a movie name to test recommendations.")
movie_name = input("🎬 Enter a movie name: ")

if movie_name in titles.to_list():
    movie_index = titles.to_list().index(movie_name)
    recommendations = get_recommendations(movie_index, table)

    print(f"\n{'Movie Title':<40} | {'Director':<20} | {'Release Date':<15}")
    print("-" * 80)
    for rec in recommendations:
        print(f"{rec['movie_title']:<40} | {rec['movie_director']:<20} | {rec['movie_release_date']:<15}")
else:
    print("[WARN] Movie not found in database. Try another title.")