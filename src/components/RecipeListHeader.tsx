
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecipeListHeaderProps {
  onAddRecipe: () => void;
  totalRecipes: number;
  filteredCount: number;
  isFiltered: boolean;
}

export const RecipeListHeader = ({ 
  onAddRecipe, 
  totalRecipes, 
  filteredCount, 
  isFiltered 
}: RecipeListHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
        Receitas de Café
      </h2>
      <p className="text-coffee-600 dark:text-coffee-300 text-sm sm:text-base">
        Escolha seu método preferido e siga as etapas cronometradas
      </p>
      {user && (
        <p className="text-coffee-500 dark:text-coffee-400 text-xs mt-1">
          Sua organização das receitas é salva automaticamente
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-sm text-coffee-600 dark:text-coffee-400">
          {isFiltered ? (
            <span>
              Mostrando {filteredCount} de {totalRecipes} receitas
            </span>
          ) : (
            <span>{totalRecipes} receitas disponíveis</span>
          )}
        </div>
        
        {user && (
          <Button
            onClick={onAddRecipe}
            className="bg-coffee-600 hover:bg-coffee-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        )}
      </div>
    </div>
  );
};
