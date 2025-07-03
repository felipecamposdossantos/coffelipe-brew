
import { useAuth } from "@/contexts/AuthContext";

export const RecipeListHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">
        Receitas de Café
      </h2>
      <p className="text-coffee-600 text-sm sm:text-base">
        Escolha seu método preferido e siga as etapas cronometradas
      </p>
      {user && (
        <p className="text-coffee-500 text-xs mt-1">
          Sua organização das receitas é salva automaticamente
        </p>
      )}
    </div>
  );
};
