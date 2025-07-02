
import { Button } from "@/components/ui/button";
import { Play, Settings } from "lucide-react";

interface RecipeActionsProps {
  onStartBrewing: (mode: 'auto' | 'manual') => void;
}

export const RecipeActions = ({ onStartBrewing }: RecipeActionsProps) => {
  return (
    <div className="space-y-2">
      <Button 
        onClick={() => onStartBrewing('auto')}
        className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Preparo Automático
      </Button>
      <Button 
        onClick={() => onStartBrewing('manual')}
        variant="outline"
        className="w-full border-coffee-300 text-coffee-600 hover:bg-coffee-50"
      >
        <Settings className="w-4 h-4 mr-2" />
        Preparo Manual
      </Button>
    </div>
  );
};
