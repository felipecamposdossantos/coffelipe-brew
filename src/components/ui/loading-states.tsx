
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
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  skeletonVariant?: 'recipe-card' | 'recipe-list' | 'dashboard' | 'timer' | 'user-profile';
  skeletonCount?: number;
  children: React.ReactNode;
}

export const LoadingStates = ({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyTitle = 'Nenhum item encontrado',
  emptyDescription = 'Não há dados para exibir no momento.',
  emptyIcon = <Coffee className="w-12 h-12" />,
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
          icon={<AlertCircle className="w-12 h-12 text-red-500" />}
          title="Erro ao carregar"
          description={error}
          action={onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          )}
        />
      </AnimatedContainer>
    );
  }

  if (isEmpty) {
    return (
      <AnimatedContainer animation="fade-in">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      </AnimatedContainer>
    );
  }

  return <>{children}</>;
};
