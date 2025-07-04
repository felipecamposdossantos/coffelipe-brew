
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RecipeCard } from "./RecipeCard";
import { AddRecipeForm } from "./AddRecipeForm";
import { RecipeListHeader } from "./RecipeListHeader";
import { MethodSelector } from "./MethodSelector";
import { AdvancedFilters } from "./AdvancedFilters";
import { defaultRecipes } from "@/data/defaultRecipes";
import { Recipe } from "@/types/recipe";

interface RecipeListProps {
  onStartBrewing: (recipe: Recipe, mode?: 'auto' | 'manual') => void;
}

export const RecipeList = ({ onStartBrewing }: RecipeListProps) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredByAdvanced, setFilteredByAdvanced] = useState<Recipe[]>([]);
  const [isUsingAdvancedFilters, setIsUsingAdvancedFilters] = useState(false);

  const { data: recipes = [], isLoading, refetch } = useQuery({
    queryKey: ['defaultRecipes'],
    queryFn: () => Promise.resolve(defaultRecipes),
    staleTime: Infinity,
  });

  const availableMethods = useMemo(() => {
    const methods = new Set(recipes.map(recipe => recipe.method || 'Sem Método').filter(Boolean));
    return Array.from(methods).sort();
  }, [recipes]);

  // Initialize selected methods when available methods change
  useMemo(() => {
    if (availableMethods.length > 0 && selectedMethods.length === 0) {
      setSelectedMethods(availableMethods);
    }
  }, [availableMethods, selectedMethods.length]);

  // Filter recipes by method and advanced filters
  const filteredRecipes = useMemo(() => {
    const baseRecipes = isUsingAdvancedFilters ? filteredByAdvanced : recipes;
    
    return baseRecipes.filter(recipe => 
      selectedMethods.includes(recipe.method || 'Sem Método')
    );
  }, [recipes, selectedMethods, filteredByAdvanced, isUsingAdvancedFilters]);

  const handleAdvancedFilter = (filtered: Recipe[]) => {
    setFilteredByAdvanced(filtered);
    setIsUsingAdvancedFilters(true);
  };

  const resetAdvancedFilters = () => {
    setIsUsingAdvancedFilters(false);
    setFilteredByAdvanced([]);
  };

  const handleRecipeAdded = () => {
    // Refetch the recipes query to update the list
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">Receitas</h2>
          <p className="text-coffee-600 dark:text-coffee-300">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecipeListHeader 
        onAddRecipe={() => setShowAddForm(true)}
        totalRecipes={recipes.length}
        filteredCount={filteredRecipes.length}
        isFiltered={selectedMethods.length < availableMethods.length || isUsingAdvancedFilters}
      />

      {/* Method Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-coffee-200 dark:border-coffee-700">
        <MethodSelector
          selectedMethods={selectedMethods}
          availableMethods={availableMethods}
          onMethodsChange={setSelectedMethods}
        />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        recipes={recipes}
        onFilteredRecipes={handleAdvancedFilter}
        availableMethods={availableMethods}
      />

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onStartBrewing={onStartBrewing}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-coffee-600 dark:text-coffee-400">
            {selectedMethods.length < availableMethods.length || isUsingAdvancedFilters
              ? "Nenhuma receita encontrada com os filtros selecionados."
              : "Nenhuma receita disponível."
            }
          </p>
          {isUsingAdvancedFilters && (
            <button
              onClick={resetAdvancedFilters}
              className="mt-2 text-coffee-600 dark:text-coffee-400 underline hover:text-coffee-800 dark:hover:text-coffee-200"
            >
              Remover filtros avançados
            </button>
          )}
        </div>
      )}

      {/* Add Recipe Form */}
      <AddRecipeForm 
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onRecipeAdded={handleRecipeAdded}
      />
    </div>
  );
};
