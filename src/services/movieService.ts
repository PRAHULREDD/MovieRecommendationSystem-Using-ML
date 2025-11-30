import { Movie } from "../types";

const BACKEND_URL = 'http://localhost:8000';

export const getMovieRecommendations = async (movieName: string): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movie_name: movieName }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Movie "${movieName}" not found in database`);
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const recommendations = await response.json();
        
        return recommendations.map((movie: any) => ({
            title: movie.title,
            director: movie.overview.replace('Directed by ', ''),
            release_date: movie.release_date
        }));

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Backend server not running. Please start the backend.');
        }
        throw error;
    }
};

export const getMovieDetails = async (movie: Movie): Promise<{ summary: string; genres: string[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                summary: `${movie.title} is a compelling film directed by ${movie.director}. Released in ${movie.release_date.split('-')[0]}, this movie offers an engaging story that has captivated audiences.`,
                genres: ["Drama", "Thriller"],
            });
        }, 500);
    });
};