import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.591 1.591M5.25 12H3m4.243-4.95l-1.591-1.591M12 12a4.5 4.5 0 000 9 4.5 4.5 0 000-9z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <div 
        className="tooltip-container fixed top-6 right-6 z-50 animate-fade-in"
        data-tooltip="Switch theme"
        style={{ animationDelay: '200ms' }}
    >
      <button
        onClick={onToggle}
        className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full p-2 text-[var(--color-text)] hover:text-white hover:border-[var(--color-accent-violet)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] transform hover:scale-110 hover:shadow-[0_0_15px_var(--glow-color)]"
        aria-label="Switch theme"
      >
        <div className="w-6 h-6 relative overflow-hidden">
            <SunIcon className={`absolute transition-all duration-500 ease-in-out ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            <MoonIcon className={`absolute transition-all duration-500 ease-in-out ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
        </div>
      </button>
    </div>
  );
};