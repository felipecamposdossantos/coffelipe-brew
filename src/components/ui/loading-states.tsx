
import { SkeletonLoader } from './skeleton-loader';
import { EmptyState } from './empty-state';
import { Coffee, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { AnimatedContainer } from './animated-container';

interface LoadingStatesProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyVariant?: 'recipes' | 'my-recipes' | 'history' | 'search' | 'timer' | 'general';
  onRetry?: () => void;
  skeletonVariant?: 'recipe-card' | 'recipe-list' | 'dashboard' | 'timer' | 'user-profile';
  skeletonCount?: number;
  children: React.ReactNode;
}

export const LoadingStates = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyTitle,
  emptyDescription,
  emptyVariant = 'general',
  onRetry,
  skeletonVariant = 'recipe-card',
  skeletonCount = 3,
  children
}: LoadingStatesProps) => {
  if (isLoading) {
    return (
      <AnimatedContainer animation="fade-in">
        <SkeletonLoader variant={skeletonVariant} count={skeletonCount} />
      </AnimatedContainer>
    );
  }

  if (error) {
    return (
      <AnimatedContainer animation="fade-in">
        <EmptyState
          variant="general"
          title="Erro ao carregar"
          description={error}
          action={onRetry ? {
            label: 'Tentar novamente',
            onClick: onRetry,
            icon: <RefreshCw className="w-4 h-4" />
          } : undefined}
        />
      </AnimatedContainer>
    );
  }

  if (isEmpty) {
    return (
      <AnimatedContainer animation="fade-in">
        <EmptyState
          variant={emptyVariant}
          title={emptyTitle}
          description={emptyDescription}
        />
      </AnimatedContainer>
    );
  }

  return <>{children}</>;
};
