
import { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Coffee, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedContainer } from '@/components/ui/animated-container';

interface FloatingActionButtonProps {
  onStartQuickBrew: () => void;
  onCreateRecipe: () => void;
  onOpenRecipes: () => void;
}

export const FloatingActionButton = ({ 
  onStartQuickBrew, 
  onCreateRecipe, 
  onOpenRecipes 
}: FloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300 ease-out",
        isExpanded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
      )}>
        <AnimatedContainer animation="scale-in" delay={100}>
          <EnhancedButton
            size="sm"
            onClick={() => handleActionClick(onStartQuickBrew)}
            hapticFeedback="medium"
            glowEffect
            className="bg-coffee-600 hover:bg-coffee-700 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            icon={<Coffee className="w-5 h-5" />}
          />
        </AnimatedContainer>
        
        <AnimatedContainer animation="scale-in" delay={150}>
          <EnhancedButton
            size="sm"
            onClick={() => handleActionClick(onCreateRecipe)}
            hapticFeedback="medium"
            glowEffect
            className="bg-coffee-500 hover:bg-coffee-600 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            icon={<Plus className="w-5 h-5" />}
          />
        </AnimatedContainer>
      </div>

      {/* Main FAB */}
      <EnhancedButton
        onClick={handleMainClick}
        hapticFeedback="medium"
        glowEffect
        className={cn(
          "bg-coffee-600 hover:bg-coffee-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300",
          isExpanded && "rotate-45 bg-coffee-700"
        )}
        icon={isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      />
    </div>
  );
};
