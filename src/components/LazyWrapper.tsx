
import React, { Suspense, lazy, memo } from 'react';
import { Coffee } from 'lucide-react';
import { useOptimizedLazyLoading } from '@/hooks/useOptimizedLazyLoading';

// Componentes lazy carregados sob demanda
export const LazyRecipeAnalytics = lazy(() => 
  import('./RecipeAnalytics').then(module => ({ default: module.RecipeAnalytics }))
);

export const LazySmartSuggestions = lazy(() => 
  import('./SmartSuggestions').then(module => ({ default: module.SmartSuggestions }))
);

export const LazyRecipeComparison = lazy(() => 
  import('./RecipeComparison').then(module => ({ default: module.RecipeComparison }))
);

export const LazyBrewHistory = lazy(() => 
  import('./BrewHistory').then(module => ({ default: module.BrewHistory }))
);

export const LazyCoffeeBeansManager = lazy(() => 
  import('./CoffeeBeansManager').then(module => ({ default: module.CoffeeBeansManager }))
);

export const LazyFilterPapersManager = lazy(() => 
  import('./FilterPapersManager').then(module => ({ default: module.FilterPapersManager }))
);

// Loading otimizado
const OptimizedLoading = memo(() => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <Coffee className="w-8 h-8 mx-auto text-coffee-600 animate-pulse mb-2" />
      <p className="text-coffee-600 dark:text-coffee-300 text-sm">Carregando...</p>
    </div>
  </div>
));

OptimizedLoading.displayName = 'OptimizedLoading';

// Wrapper otimizado com intersection observer
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = memo(({ children, fallback }: LazyWrapperProps) => {
  const { elementRef, isVisible } = useOptimizedLazyLoading({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  return (
    <div ref={elementRef} className="min-h-[100px]">
      {isVisible ? (
        <Suspense fallback={fallback || <OptimizedLoading />}>
          {children}
        </Suspense>
      ) : (
        fallback || <OptimizedLoading />
      )}
    </div>
  );
});

LazyWrapper.displayName = 'LazyWrapper';
