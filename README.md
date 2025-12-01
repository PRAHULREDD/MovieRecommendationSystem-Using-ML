# 🎬 Movie Recommendation System Using ML

> **Machine Learning Project** - Content-Based Filtering Algorithm Implementation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org)
[![ML](https://img.shields.io/badge/ML-Content--Based%20Filtering-orange.svg)]()
[![Dataset](https://img.shields.io/badge/Dataset-MovieLens-red.svg)]()

A machine learning-powered movie recommendation system that suggests movies based on content similarity. Built with FastAPI backend serving ML models and React frontend for user interaction.

## 🧠 **ML Engineering Highlights**

**Advanced Machine Learning Implementation:**
- ✅ **Content-Based Filtering Algorithm** using Cosine Similarity
- ✅ **Feature Engineering** with TF-IDF vectorization on movie metadata
- ✅ **High-Performance Model Serving** with sub-second inference times
- ✅ **Scalable Data Pipeline** processing 45,000+ movies from MovieLens dataset
- ✅ **Production-Ready ML API** with FastAPI and Pydantic validation
- ✅ **Optimized Model Storage** using Parquet format for fast I/O operations

**Technical Architecture:**
- 🔥 **Real-time Recommendations** - Instant similarity computation
- 🔥 **Memory-Efficient Design** - Precomputed similarity matrix
- 🔥 **RESTful ML API** - Clean separation of ML logic and web interface
- 🔥 **Type-Safe Data Models** - Pydantic schemas for robust data handling

## 📊 **ML Technical Implementation**

### **Algorithm & Model Architecture**
- **Content-Based Filtering**: Recommends movies based on item features similarity
- **Cosine Similarity Matrix**: Precomputed 45K x 45K similarity scores
- **Feature Engineering**: Combined movie genres, cast, director, and keywords
- **Text Processing**: TF-IDF vectorization with n-gram analysis
- **Dimensionality**: 15,000 optimized features for memory efficiency

### **Data Engineering Pipeline**
- **Dataset**: MovieLens 45K movies with metadata, credits, and keywords
- **ETL Process**: Automated data cleaning, feature extraction, and model training
- **Storage Format**: Apache Parquet for 10x faster I/O vs CSV
- **Model Persistence**: Serialized similarity matrix for instant inference
- **Memory Optimization**: Float32 precision for 50% memory reduction

### **Production ML API**
- **FastAPI Framework**: Async endpoints with automatic OpenAPI documentation
- **Sub-second Latency**: Optimized similarity search with indexed lookups
- **Error Handling**: Robust exception handling for missing movies
- **Data Validation**: Pydantic models ensure type safety and data integrity
- **Scalable Architecture**: Stateless design ready for horizontal scaling

## ✨ User Features

- **Intelligent Recommendations**: ML-powered movie suggestions
- **Modern UI**: Glassmorphism design with dark/light themes
- **Real-time Search**: Instant movie lookup and recommendations
- **Responsive Design**: Optimized for all devices
- **Movie Details**: Rich metadata display with director and release info

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - [Download here](https://python.org)
- **Node.js 16+** - [Download here](https://nodejs.org)
- **Git** (optional) - For cloning the repository

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PRAHULREDD/MovieRecommendationSystem-Using-ML.git
   cd MovieRecommendationSystem-Using-ML
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

4. **Start the backend server:**
   ```bash
   cd backend
   python backend.py
   ```

5. **Start the frontend (in new terminal):**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Manual Setup (Alternative)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/movie-recommender.git
   cd movie-recommender
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create Python virtual environment:**
   ```bash
   python -m venv movie_env
   ```

4. **Activate virtual environment and install Python dependencies:**
   ```bash
   movie_env\Scripts\activate
   pip install -r backend/requirements.txt
   ```

5. **Download dataset and model files:**
   - See [SETUP.md](SETUP.md) for detailed instructions

6. **Download dataset and model files:**
   - Download the MovieLens dataset and place in `data/` folder
   - Generate model files using the training scripts

5. **Start the backend server:**
   ```bash
   start_backend.bat
   ```

6. **Start the frontend server (in a new terminal):**
   ```bash
   start_frontend.bat
   ```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
MovieRecommendationSystem-Using-ML/
├── backend/                    # ML Backend
│   ├── backend.py              # FastAPI server with ML endpoints
│   ├── model_full.parquet      # Trained similarity matrix
│   ├── movie_database_full.parquet # Processed movie dataset
│   └── requirements.txt        # Python dependencies
├── src/                        # React Frontend
│   ├── components/             # UI components
│   ├── services/               # API integration
│   └── types.ts                # TypeScript definitions
├── data/                       # Dataset
│   └── the-movies-dataset/     # MovieLens CSV files
├── index.html                  # Main HTML file
├── package.json                # Node.js dependencies
├── vite.config.ts              # Vite configuration
└── README.md                   # Project documentation
```

## 🛠️ **ML Engineering Skills Demonstrated**

### **Machine Learning**
- Content-based recommendation algorithms
- Feature engineering and text processing
- Model optimization and performance tuning
- Similarity computation and ranking algorithms

### **Data Engineering**
- ETL pipeline design and implementation
- Large dataset processing (45K+ records)
- Data format optimization (Parquet)
- Memory-efficient data structures

### **MLOps & Production**
- Model serialization and deployment
- RESTful API design for ML services
- Async programming for high performance
- Error handling and data validation
- Scalable architecture patterns

### **Full-Stack Integration**
- **Backend**: FastAPI, Pandas, PyArrow, Pydantic
- **Frontend**: React, TypeScript, Modern UI/UX
- **DevOps**: Automated setup scripts, environment management

## 🔧 Troubleshooting

### Common Issues

1. **Backend not starting:**
   - Ensure `movie_database_full.parquet` and `model_full.parquet` exist
   - Check if Python virtual environment is activated

2. **Frontend not loading:**
   - Run `npm install` to ensure all dependencies are installed
   - Check if Node.js version is 16 or higher

3. **API connection errors:**
   - Ensure backend is running on port 8000

## 📸 Screenshots

*Add screenshots of your application here*

## 🚀 Demo

*Add live demo link here if available*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movies Dataset](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset) from Kaggle
- React and FastAPI communities
- Contributors and testers
