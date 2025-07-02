
import { useState, useMemo } from 'react';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { EditRecipeForm } from '@/components/EditRecipeForm';
import { MethodSelector } from '@/components/MethodSelector';
import { RecipesByMethod } from '@/components/RecipesByMethod';
import { Recipe } from '@/pages/Index';

interface UserRecipesProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const UserRecipes = ({ onStartBrewing }: UserRecipesProps) => {
  const { userRecipes, loading, deleteRecipe, updateRecipeOrder } = useUserRecipes();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  // Get available methods from user recipes
  const availableMethods = useMemo(() => {
    const methods = new Set(userRecipes.map(recipe => recipe.method || 'Sem Método').filter(Boolean));
    return Array.from(methods).sort();
  }, [userRecipes]);

  // Initialize selected methods when available methods change
  useMemo(() => {
    if (availableMethods.length > 0 && selectedMethods.length === 0) {
      setSelectedMethods(availableMethods);
    }
  }, [availableMethods, selectedMethods.length]);

  // Group recipes by method and filter by selected methods
  const recipesByMethod = useMemo(() => {
    const filtered = userRecipes.filter(recipe => 
      selectedMethods.includes(recipe.method || 'Sem Método')
    );
    
    const grouped = filtered.reduce((acc, recipe) => {
      const method = recipe.method || 'Sem Método';
      if (!acc[method]) {
        acc[method] = [];
      }
      acc[method].push(recipe);
      return acc;
    }, {} as Record<string, Recipe[]>);

    return grouped;
  }, [userRecipes, selectedMethods]);

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowEditDialog(true);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    await deleteRecipe(recipeId);
  };

  const handleRecipeUpdated = () => {
    setEditingRecipe(null);
    setShowEditDialog(false);
  };

  const handleMoveRecipeUp = async (method: string, index: number) => {
    const methodRecipes = recipesByMethod[method];
    if (index > 0) {
      const allRecipes = [...userRecipes];
      const recipe1Index = allRecipes.findIndex(r => r.id === methodRecipes[index - 1].id);
      const recipe2Index = allRecipes.findIndex(r => r.id === methodRecipes[index].id);
      
      [allRecipes[recipe1Index], allRecipes[recipe2Index]] = [allRecipes[recipe2Index], allRecipes[recipe1Index]];
      await updateRecipeOrder(allRecipes);
    }
  };

  const handleMoveRecipeDown = async (method: string, index: number) => {
    const methodRecipes = recipesByMethod[method];
    if (index < methodRecipes.length - 1) {
      const allRecipes = [...userRecipes];
      const recipe1Index = allRecipes.findIndex(r => r.id === methodRecipes[index].id);
      const recipe2Index = allRecipes.findIndex(r => r.id === methodRecipes[index + 1].id);
      
      [allRecipes[recipe1Index], allRecipes[recipe2Index]] = [allRecipes[recipe2Index], allRecipes[recipe1Index]];
      await updateRecipeOrder(allRecipes);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
          <p className="text-coffee-600">Carregando suas receitas...</p>
        </div>
      </div>
    );
  }

  if (userRecipes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
          <p className="text-coffee-600 text-sm sm:text-base">
            Você ainda não salvou nenhuma receita. Vá para a aba "Receitas" e clique em "Adicionar Minha Receita" para começar!
          </p>
        </div>
      </div>
    );
  }

  const totalFilteredRecipes = Object.values(recipesByMethod).reduce((total, recipes) => total + recipes.length, 0);

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
        <p className="text-coffee-600 text-sm sm:text-base">
          {userRecipes.length} receita{userRecipes.length !== 1 ? 's' : ''} salva{userRecipes.length !== 1 ? 's' : ''}
          {selectedMethods.length < availableMethods.length && (
            <span> • {totalFilteredRecipes} exibida{totalFilteredRecipes !== 1 ? 's' : ''}</span>
          )}
        </p>
      </div>

      {/* Method Filter */}
      {availableMethods.length > 1 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-coffee-200">
          <MethodSelector
            selectedMethods={selectedMethods}
            availableMethods={availableMethods}
            onMethodsChange={setSelectedMethods}
          />
        </div>
      )}

      {/* Recipes grouped by method */}
      <div className="space-y-6">
        {Object.entries(recipesByMethod)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([method, recipes]) => (
            <RecipesByMethod
              key={method}
              recipes={recipes}
              methodName={method}
              onStartBrewing={onStartBrewing}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onMoveRecipeUp={(index) => handleMoveRecipeUp(method, index)}
              onMoveRecipeDown={(index) => handleMoveRecipeDown(method, index)}
            />
          ))}
      </div>

      {totalFilteredRecipes === 0 && selectedMethods.length < availableMethods.length && (
        <div className="text-center py-8">
          <p className="text-coffee-600">
            Nenhuma receita encontrada para os métodos selecionados.
          </p>
        </div>
      )}

      {/* Edit Recipe Dialog */}
      {editingRecipe && (
        <EditRecipeForm
          recipe={editingRecipe}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onRecipeUpdated={handleRecipeUpdated}
        />
      )}
    </div>
  );
};
