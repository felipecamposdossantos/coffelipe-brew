
import { Recipe } from "@/pages/Index";
import { UserRecipeCard } from "./UserRecipeCard";

interface RecipesByMethodProps {
  recipes: Recipe[];
  methodName: string;
  onStartBrewing: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
  onMoveRecipeUp: (index: number) => void;
  onMoveRecipeDown: (index: number) => void;
}

export const RecipesByMethod = ({
  recipes,
  methodName,
  onStartBrewing,
  onEditRecipe,
  onDeleteRecipe,
  onMoveRecipeUp,
  onMoveRecipeDown
}: RecipesByMethodProps) => {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-coffee-800 dark:text-coffee-200 border-b border-coffee-200 dark:border-coffee-700 pb-2">
        {methodName} ({recipes.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <UserRecipeCard
            key={recipe.id}
            recipe={recipe}
            onStartBrewing={onStartBrewing}
            onEdit={onEditRecipe}
            onDelete={onDeleteRecipe}
            onMoveUp={() => onMoveRecipeUp(index)}
            onMoveDown={() => onMoveRecipeDown(index)}
            canMoveUp={index > 0}
            canMoveDown={index < recipes.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
