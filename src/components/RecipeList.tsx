
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { AddRecipeForm } from "@/components/AddRecipeForm";
import { RecipeListHeader } from "@/components/RecipeListHeader";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeTip } from "@/components/RecipeTip";
import { useRecipeOrdering } from "@/hooks/useRecipeOrdering";
import { defaultRecipes } from "@/data/defaultRecipes";

interface RecipeListProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const RecipeList = ({ onStartBrewing }: RecipeListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { recipes, moveRecipeUp, moveRecipeDown } = useRecipeOrdering(defaultRecipes);

  const handleRecipeAdded = () => {
    // This will trigger a re-render of the component that uses RecipeList
    // The parent component should handle refreshing the recipe list
  };

  return (
    <div className="space-y-6">
      <RecipeListHeader />

      <div className="flex justify-center">
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-coffee-600 hover:bg-coffee-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Minha Receita
        </Button>
      </div>
      
      <RecipeGrid
        recipes={recipes}
        onStartBrewing={onStartBrewing}
        onMoveRecipeUp={moveRecipeUp}
        onMoveRecipeDown={moveRecipeDown}
      />
      
      <RecipeTip />

      <AddRecipeForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onRecipeAdded={handleRecipeAdded}
      />
    </div>
  );
};
