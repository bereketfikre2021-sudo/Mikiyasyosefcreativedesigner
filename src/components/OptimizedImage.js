import React, { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for Intersection Observer
 */
const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenIntersected, setHasBeenIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasBeenIntersected(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
        ...options
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return { isIntersecting, hasBeenIntersected };
};

/**
 * OptimizedImage - Component for lazy loading and progressive image loading
 * Features:
 * - Intersection Observer based lazy loading
 * - Blur-up placeholder effect
 * - Responsive images with srcset
 * - Error handling
 * - Loading states
 */
const OptimizedImage = ({
  src,
  srcSet,
  sizes,
  alt = '',
  width,
  height,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  
  // Use Intersection Observer for lazy loading
  const { isIntersecting, hasBeenIntersected } = useIntersectionObserver(
    containerRef,
    { rootMargin: '100px' }
  );

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // Calculate aspect ratio for placeholder
  const aspectRatio = width && height ? (height / width) * 100 : 66.67; // Default 3:2

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${aspectRatio}%`,
        backgroundColor: '#1a1a1a',
        overflow: 'hidden'
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            ...props.style
          }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="image-error"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '0.875rem'
          }}
        >
          Failed to load image
        </div>
      )}

      {/* Loading spinner */}
      {!isLoaded && !hasError && shouldLoad && (
        <div
          className="image-spinner"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            border: '2px solid rgba(0, 212, 255, 0.3)',
            borderTopColor: '#00d4ff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

