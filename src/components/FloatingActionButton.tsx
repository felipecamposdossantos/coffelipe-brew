
import { useState } from "react";
import { Plus, Coffee, Timer, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onAddRecipe: () => void;
  onQuickBrew: () => void;
  onOpenTimer: () => void;
}

export const FloatingActionButton = ({ 
  onAddRecipe, 
  onQuickBrew, 
  onOpenTimer 
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 safe-area-bottom">
      {/* Action Buttons */}
      <div className={cn(
        "flex flex-col gap-3 mb-4 transition-all duration-200 ease-out",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}>
        <Button
          onClick={() => handleAction(onAddRecipe)}
          className="touch-target w-12 h-12 rounded-full bg-coffee-600 hover:bg-coffee-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <BookOpen className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => handleAction(onOpenTimer)}
          className="touch-target w-12 h-12 rounded-full bg-coffee-500 hover:bg-coffee-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Timer className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={() => handleAction(onQuickBrew)}
          className="touch-target w-12 h-12 rounded-full bg-coffee-400 hover:bg-coffee-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Coffee className="w-5 h-5" />
        </Button>
      </div>

      {/* Main FAB */}
      <Button
        onClick={toggleMenu}
        className={cn(
          "touch-target w-14 h-14 rounded-full bg-coffee-700 hover:bg-coffee-800 text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform",
          isOpen ? "rotate-45" : "rotate-0"
        )}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};
