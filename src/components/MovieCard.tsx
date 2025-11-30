import React from 'react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: () => void;
}

const MoviePlaceholderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-5.84-2.56m0 0a14.95 14.95 0 00-5.84 2.56m5.84-2.56V4.72a.75.75 0 00-1.5 0v4.82m1.5 0a14.95 14.95 0 00-5.84 2.56m-5.84 0a14.95 14.95 0 005.84-2.56m0 0V4.72a.75.75 0 00-1.5 0v4.82" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);


export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onClick }) => {
  const animationDelay = { animationDelay: `${index * 80}ms` };

  return (
    <button
      onClick={onClick}
      className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] rounded-xl shadow-lg transition-all duration-300 ease-in-out pop-in flex flex-col group hover:border-[var(--color-accent-violet)] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--glow-color)] cursor-pointer text-left w-full overflow-hidden"
      style={animationDelay}
      aria-label={`View details for ${movie.title}`}
    >
        <div className="aspect-[2/3] w-full bg-cover bg-center bg-[var(--color-bg-start)] flex items-center justify-center p-4 relative">
            <MoviePlaceholderIcon className="w-16 h-16 text-[var(--glass-border)] transition-transform duration-300 group-hover:scale-95" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-gradient-to-r from-[var(--color-accent-pink)] to-[var(--color-accent-violet)] text-white font-bold rounded-full px-5 py-2.5 text-sm transform transition-transform duration-300 group-hover:scale-100 scale-90">
                    View Details
                </span>
            </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-[var(--color-text)] leading-tight">
                {movie.title}
            </h3>
            <div className='mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]'>
                <p>
                    <span className="font-semibold text-[var(--color-text-muted)]">Director:</span> {movie.director}
                </p>
                <p>
                    <span className="font-semibold text-[var(--color-text-muted)]">Released:</span> {movie.release_date}
                </p>
            </div>
        </div>
    </button>
  );
};