
import { ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatedContainer } from './animated-container';

interface EnhancedCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'coffee' | 'glass' | 'gradient';
  hover?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EnhancedCard = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  hover = true,
  interactive = false,
  className = '',
  onClick
}: EnhancedCardProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    coffee: 'bg-gradient-to-br from-coffee-50 to-amber-50 dark:from-coffee-900/20 dark:to-amber-900/20 border-coffee-200 dark:border-coffee-700',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700'
  };

  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : '';
  const interactiveClasses = interactive ? 'cursor-pointer select-none' : '';
  const pressedClasses = isPressed ? 'scale-95' : '';

  return (
    <AnimatedContainer animation="fade-in" className="h-full">
      <Card
        className={cn(
          variantClasses[variant],
          hoverClasses,
          interactiveClasses,
          pressedClasses,
          'transform-gpu transition-transform duration-150',
          className
        )}
        onClick={onClick}
        onMouseDown={() => interactive && setIsPressed(true)}
        onMouseUp={() => interactive && setIsPressed(false)}
        onMouseLeave={() => interactive && setIsPressed(false)}
        onTouchStart={() => interactive && setIsPressed(true)}
        onTouchEnd={() => interactive && setIsPressed(false)}
      >
        {(title || subtitle || icon) && (
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className={title || subtitle || icon ? 'pt-0' : ''}>
          {children}
        </CardContent>
      </Card>
    </AnimatedContainer>
  );
};
