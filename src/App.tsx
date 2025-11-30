import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Movie } from './types';
import { MovieCard } from './components/MovieCard';
import { Loader } from './components/Loader';
import { Toast } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { getMovieRecommendations, getMovieDetails } from './services/movieService';

// --- MovieModal Component Definition ---
interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ModalLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-2">
      <div className="w-8 h-8 border-2 border-t-2 border-[var(--color-text-muted)] border-t-[var(--color-accent-violet)] rounded-full animate-spin"></div>
      <p className="text-sm text-[var(--color-text-muted)]">Fetching details...</p>
    </div>
);

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [details, setDetails] = useState<{ summary: string; genres: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movie) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        setDetails(null);
        try {
          const movieDetails = await getMovieDetails(movie);
          setDetails(movieDetails);
        } catch (err) {
            setError('Could not load movie details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [movie]);

  if (!movie) {
    return null;
  }
  
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie " + movie.director)}`;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
    >
      <div
        className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl w-full max-w-lg m-4 relative flex flex-col overflow-hidden animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{maxHeight: '90vh', boxShadow: '0 0 40px var(--glow-color)'}}
      >
        <div className="p-6 border-b border-[var(--glass-border)] flex-shrink-0">
            <h2 id="movie-modal-title" className="text-2xl font-bold text-[var(--color-text)]">{movie.title}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Directed by {movie.director} &bull; {movie.release_date}</p>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
            {isLoading && <ModalLoader />}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {details && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <h3 className="font-semibold text-[var(--color-text-secondary)] mb-1">Summary</h3>
                        <p className="text-[var(--color-text)] leading-relaxed">{details.summary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-[var(--color-text-secondary)] mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {details.genres.map(genre => (
                                <span key={genre} className="bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-violet)] text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full">{genre}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-4 border-t border-[var(--glass-border)] flex justify-between items-center bg-black/20 flex-shrink-0">
             <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-violet)] hover:from-[var(--color-accent-violet)] hover:to-[var(--color-accent-pink)] text-white font-bold rounded-full px-5 py-2.5 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_var(--glow-color)] text-sm"
             >
                Search on Google
            </a>
            <button 
                onClick={onClose} 
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                aria-label="Close movie details"
            >
                Close
            </button>
        </div>
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label="Close movie details"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
// --- End of MovieModal Component ---

const App: React.FC = () => {
  const [movieQuery, setMovieQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const searchStartTime = useRef<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('movie-app-theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
        root.classList.add('light-theme');
    } else {
        root.classList.remove('light-theme');
    }
    localStorage.setItem('movie-app-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
      setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string) => {
    setToast(prev => ({ ...prev, show: false }));
    setTimeout(() => {
        setToast({ message, show: true });
    }, 150);
  };

  const handleGetRecommendations = useCallback(async () => {
    if (!movieQuery.trim()) {
      showToast('Please enter a movie title.');
      return;
    }

    setHasSearched(true);
    setError(null);
    setRecommendations([]);
    showToast('Finding recommendations…');
    setIsLoading(true);
    searchStartTime.current = Date.now();

    try {
      const movies = await getMovieRecommendations(movieQuery);
      setRecommendations(movies);
      if (movies.length > 0) {
        showToast(`${movies.length} movies found!`);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      showToast(`Error: ${error.message}`);
    } finally {
      const duration = Date.now() - (searchStartTime.current || Date.now());
      const remainingTime = 1500 - duration;
      
      if (remainingTime > 0) {
        setTimeout(() => setIsLoading(false), remainingTime);
      } else {
        setIsLoading(false);
      }
    }
  }, [movieQuery]);

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 flex flex-col items-center bg-transparent">
      
      <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
      
      <header 
        className="relative w-full max-w-4xl sticky top-4 z-10 p-6 pt-16 sm:pt-6 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] text-center mb-8 animate-fade-in-up"
        style={{boxShadow: '0 8px 32px 0 var(--glow-color)'}}
      >
        <h1 className="text-4xl md:text-5xl font-bold py-2 gradient-text shimmer">
          Movie Recommendation System
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2 mb-6">Discover your next favorite film.</p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={movieQuery}
            onChange={(e) => setMovieQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleGetRecommendations()}
            placeholder="e.g., 'The Matrix', 'Inception'..."
            className="flex-grow bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full py-3 px-6 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:outline-none transition duration-300 w-full"
            disabled={isLoading}
          />
          <div className="tooltip-container w-full sm:w-auto" data-tooltip="Fetch similar movies">
            <button
              onClick={handleGetRecommendations}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-violet)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full px-8 py-3 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_20px_var(--glow-color)]"
            >
              {isLoading ? 'Searching...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
      </header>
      
      {error && (
        <div className="mt-8 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <main className="w-full max-w-screen-xl mt-8 flex-grow animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        {isLoading ? (
          <Loader />
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendations.map((movie, index) => (
              <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} onClick={() => handleOpenModal(movie)} />
            ))}
          </div>
        ) : hasSearched ? (
           <div className="text-center text-[var(--color-text-muted)] mt-20">
            <p className="text-2xl font-bold">No movies found.</p>
            <p>Try a different movie title or check for typos.</p>
          </div>
        ) : (
          <div className="text-center text-[var(--color-text-muted)] mt-20">
            <p className="text-2xl font-bold">Ready to find some movies?</p>
            <p>Enter a movie you like and we'll suggest others!</p>
          </div>
        )}
      </main>
      
      <Toast 
        message={toast.message} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
};

export default App;