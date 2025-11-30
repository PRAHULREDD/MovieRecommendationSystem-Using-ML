import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] text-[var(--color-text)] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } pointer-events-none`}
      style={{boxShadow: '0 0 20px var(--glow-color)'}}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};