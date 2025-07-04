
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Coffee, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

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
  const { impactFeedback } = useHapticFeedback();

  if (!isMobile) return null;

  const handleMainClick = () => {
    impactFeedback('medium');
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleActionClick = (action: () => void) => {
    impactFeedback('light');
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-3 transition-all duration-300",
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      )}>
        <Button
          size="sm"
          onClick={() => handleActionClick(onStartQuickBrew)}
          className="bg-coffee-600 hover:bg-coffee-700 text-white rounded-full w-12 h-12 shadow-lg"
        >
          <Coffee className="w-5 h-5" />
        </Button>
        
        <Button
          size="sm"
          onClick={() => handleActionClick(onCreateRecipe)}
          className="bg-coffee-500 hover:bg-coffee-600 text-white rounded-full w-12 h-12 shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Main FAB */}
      <Button
        onClick={handleMainClick}
        className={cn(
          "bg-coffee-600 hover:bg-coffee-700 text-white rounded-full w-14 h-14 shadow-lg transition-transform duration-300",
          isExpanded && "rotate-45"
        )}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
};
