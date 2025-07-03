
import { Recipe } from "@/pages/Index";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface RecipeGridProps {
  recipes: Recipe[];
  onStartBrewing: (recipe: Recipe) => void;
  onMoveRecipeUp: (index: number) => void;
  onMoveRecipeDown: (index: number) => void;
}

export const RecipeGrid = ({ 
  recipes, 
  onStartBrewing, 
  onMoveRecipeUp, 
  onMoveRecipeDown 
}: RecipeGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {recipes.map((recipe, index) => (
        <div key={recipe.id} className="relative">
          <RecipeCard 
            recipe={recipe} 
            onStartBrewing={onStartBrewing}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button
              onClick={() => onMoveRecipeUp(index)}
              disabled={index === 0}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onMoveRecipeDown(index)}
              disabled={index === recipes.length - 1}
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
