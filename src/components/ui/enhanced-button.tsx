
import { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  glowEffect?: boolean;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    loading = false, 
    icon, 
    iconPosition = 'left', 
    hapticFeedback = 'light',
    glowEffect = false,
    className,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback for mobile devices
      if ('navigator' in window && 'vibrate' in navigator) {
        const intensity = hapticFeedback === 'light' ? 10 : hapticFeedback === 'medium' ? 50 : 100;
        navigator.vibrate(intensity);
      }
      
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-200 transform active:scale-95',
          'hover:shadow-lg hover:-translate-y-0.5',
          glowEffect && 'hover:shadow-coffee-500/25 hover:shadow-lg',
          'focus:ring-2 focus:ring-coffee-500/20 focus:outline-none',
          'disabled:transform-none disabled:hover:translate-y-0 disabled:hover:shadow-none',
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';
