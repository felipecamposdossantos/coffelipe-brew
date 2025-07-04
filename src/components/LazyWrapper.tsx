
import { Suspense, lazy } from 'react';
import { Coffee } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Coffee className="w-8 h-8 mx-auto text-coffee-600 animate-pulse mb-2" />
      <p className="text-coffee-600 dark:text-coffee-300">Carregando...</p>
    </div>
  </div>
);

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }: LazyWrapperProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Lazy loading dos componentes principais
export const LazyRecipeAnalytics = lazy(() => import('./RecipeAnalytics').then(module => ({
  default: module.RecipeAnalytics
})));

export const LazySmartSuggestions = lazy(() => import('./SmartSuggestions').then(module => ({
  default: module.SmartSuggestions
})));

export const LazyRecipeComparison = lazy(() => import('./RecipeComparison').then(module => ({
  default: module.RecipeComparison
})));

export const LazyBrewHistory = lazy(() => import('./BrewHistory').then(module => ({
  default: module.BrewHistory
})));

export const LazyCoffeeBeansManager = lazy(() => import('./CoffeeBeansManager').then(module => ({
  default: module.CoffeeBeansManager
})));

export const LazyFilterPapersManager = lazy(() => import('./FilterPapersManager').then(module => ({
  default: module.FilterPapersManager
})));
