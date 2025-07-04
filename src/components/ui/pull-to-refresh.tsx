
import { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  threshold?: number;
  enabled?: boolean;
}

export const PullToRefresh = ({
  onRefresh,
  children,
  className = '',
  threshold = 80,
  enabled = true
}: PullToRefreshProps) => {
  const { elementRef, isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShowIcon = pullDistance > 20;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Pull indicator */}
      {shouldShowIcon && (
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center justify-center py-4 transition-all duration-200"
          style={{
            transform: `translateX(-50%) translateY(${Math.max(0, pullDistance - 40)}px)`,
            opacity: progress
          }}
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-coffee-600 animate-spin" />
          ) : (
            <RefreshCw 
              className={cn(
                "w-6 h-6 text-coffee-600 transition-transform duration-200",
                progress >= 1 && "rotate-180"
              )}
            />
          )}
          <span className="text-xs text-coffee-600 mt-1">
            {isRefreshing ? 'Atualizando...' : progress >= 1 ? 'Solte para atualizar' : 'Puxe para atualizar'}
          </span>
        </div>
      )}

      {/* Content */}
      <div
        ref={elementRef}
        className="h-full overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};
