
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'bounce-in';
  delay?: number;
  duration?: number;
  className?: string;
  onClick?: () => void;
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, animation = 'fade-in', delay = 0, duration = 300, className = '', onClick }, ref) => {
    const animationClasses = {
      'fade-in': 'animate-fade-in',
      'slide-up': 'animate-slide-in-up',
      'slide-down': 'animate-slide-in-down',
      'scale-in': 'animate-scale-in',
      'bounce-in': 'animate-bounce-in'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transform-gpu',
          animationClasses[animation],
          className
        )}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
          animationFillMode: 'both'
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';
