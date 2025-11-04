// Image optimization utilities for better performance and UX

/**
 * Generate a blur-up placeholder using a tiny version of the image
 * @param {string} imageSrc - Original image source
 * @returns {string} - Base64 data URL for placeholder
 */
export const generateBlurPlaceholder = (imageSrc) => {
  // For now, return a CSS gradient placeholder
  // In production, you could generate actual tiny base64 images
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+';
};

/**
 * Generate responsive image srcset
 * @param {string} basePath - Base image path
 * @param {string} extension - Image extension (e.g., 'webp', 'jpg')
 * @param {Array} sizes - Array of sizes in pixels
 * @returns {string} - srcset string
 */
export const generateSrcSet = (basePath, extension = 'webp', sizes = [400, 800, 1200, 1600]) => {
  return sizes
    .map(size => {
      // Remove extension from basePath and add size
      const pathWithoutExt = basePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
      return `${pathWithoutExt}-${size}w.${extension} ${size}w`;
    })
    .join(', ');
};

/**
 * Get optimal image size based on viewport
 * @param {string} sizes - Sizes attribute value
 * @param {number} viewportWidth - Current viewport width
 * @returns {number} - Optimal image size in pixels
 */
export const getOptimalImageSize = (sizes, viewportWidth) => {
  // Parse sizes attribute like "(max-width: 768px) 100vw, 33vw"
  const sizeRules = sizes.split(',').map(rule => rule.trim());
  
  for (const rule of sizeRules) {
    if (rule.includes('vw')) {
      const vwMatch = rule.match(/(\d+(?:\.\d+)?)vw/);
      if (vwMatch) {
        return Math.ceil((parseFloat(vwMatch[1]) / 100) * viewportWidth);
      }
    }
    if (rule.includes('px')) {
      const pxMatch = rule.match(/(\d+)px/);
      if (pxMatch) {
        return parseInt(pxMatch[1]);
      }
    }
  }
  
  // Default fallback
  return 1200;
};

/**
 * Preload image for better performance
 * @param {string} src - Image source
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Intersection Observer hook for lazy loading images
 * This hook should be used in React components
 * Import React and useState, useEffect in your component file
 */
export const createIntersectionObserverHook = (React) => {
  return (ref, options = {}) => {
    const [isIntersecting, setIsIntersecting] = React.useState(false);
    const [hasBeenIntersected, setHasBeenIntersected] = React.useState(false);

    React.useEffect(() => {
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
          rootMargin: '50px',
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
};

/**
 * Optimized Image Component Props
 * Generates optimized image attributes
 */
export const getOptimizedImageProps = (imageSrc, options = {}) => {
  const {
    alt = '',
    width,
    height,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    loading = 'lazy',
    decoding = 'async',
    className = '',
    quality = 85
  } = options;

  // Check if image is WebP
  const isWebP = imageSrc.toLowerCase().endsWith('.webp');
  const extension = isWebP ? 'webp' : 'jpg';
  
  // Generate srcset if multiple sizes are available
  // For now, we'll use the original image
  // In production, you'd generate multiple sizes during build
  const srcSet = generateSrcSet(imageSrc, extension);
  const blurPlaceholder = generateBlurPlaceholder(imageSrc);

  return {
    src: imageSrc,
    srcSet: srcSet || undefined,
    sizes,
    alt,
    width,
    height,
    loading,
    decoding,
    className: `${className} optimized-image`.trim(),
    'data-placeholder': blurPlaceholder,
    style: {
      backgroundColor: '#1a1a1a',
      backgroundImage: `url(${blurPlaceholder})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  };
};

// Note: React import is only needed if using hooks
// For this utility file, we don't need React import

