
import { useState, useRef } from 'react';
import { useOptimizedLazyLoading } from '@/hooks/useOptimizedLazyLoading';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: 'blur' | 'skeleton';
  aspectRatio?: 'square' | 'video' | 'auto';
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  fallback = '/placeholder.svg',
  placeholder = 'skeleton',
  aspectRatio = 'auto',
  loading = 'lazy'
}: OptimizedImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { elementRef, isVisible } = useOptimizedLazyLoading({
    threshold: 0.1,
    rootMargin: '50px'
  });

  const shouldLoad = loading === 'eager' || isVisible;

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'overflow-hidden bg-gray-100 dark:bg-gray-800 relative',
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Placeholder */}
      {!imageLoaded && !imageError && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          placeholder === 'skeleton' && 'animate-pulse bg-gray-200 dark:bg-gray-700',
          placeholder === 'blur' && 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
        )}>
          {placeholder === 'skeleton' && (
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded opacity-50" />
          )}
        </div>
      )}

      {/* Main Image */}
      {shouldLoad && (
        <img
          src={imageError ? fallback : src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
        />
      )}
    </div>
  );
};
