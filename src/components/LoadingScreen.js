import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ isLoading }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
      }, 500);
    }
  }, [isLoading]);

  if (!isLoading && !fadeOut) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-spinner"></div>
        </div>
        <div className="loading-text">
          <h2>Mikiyas Yosef</h2>
          <p>Creative Designer & Video Editor</p>
        </div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

