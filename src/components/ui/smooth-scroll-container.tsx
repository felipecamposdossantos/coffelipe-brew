
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SmoothScrollContainerProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
}

export const SmoothScrollContainer = forwardRef<HTMLDivElement, SmoothScrollContainerProps>(
  ({ children, className, maxHeight = 'calc(100vh - 200px)' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-coffee-300/50',
          'hover:scrollbar-thumb-coffee-400/70 dark:scrollbar-thumb-coffee-600/50',
          'dark:hover:scrollbar-thumb-coffee-500/70 scroll-smooth',
          className
        )}
        style={{ maxHeight }}
      >
        {children}
      </div>
    );
  }
);

SmoothScrollContainer.displayName = 'SmoothScrollContainer';
