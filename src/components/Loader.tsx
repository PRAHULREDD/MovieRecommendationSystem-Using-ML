import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full py-20">
      <div className="film-reel-loader">
        <div className="reel-container">
            <div className="film-reel front">
                <div className="reel-spoke"></div>
                <div className="reel-spoke"></div>
                <div className="reel-spoke"></div>
            </div>
            <div className="film-reel back">
                <div className="reel-spoke"></div>
                <div className="reel-spoke"></div>
                <div className="reel-spoke"></div>
            </div>
        </div>
      </div>
      <p className="text-[var(--color-text)] mt-8 text-lg">Finding great movies for you...</p>
    </div>
  );
};