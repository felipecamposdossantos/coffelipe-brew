
import { useAuth } from "@/contexts/AuthContext";

export const RecipeTip = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-coffee-100 p-4 sm:p-6 rounded-lg border border-coffee-200">
      <h3 className="font-semibold text-coffee-800 mb-2 text-sm sm:text-base">
        💡 Dica do Mestre do Café
      </h3>
      <p className="text-coffee-700 text-xs sm:text-sm">
        A temperatura ideal da água é entre 90-96°C. Use sempre café recém moído 
        para obter o melhor sabor. Cada método extrai diferentes características 
        do grão, experimente todos para descobrir seu favorito!{user && " Sua organização personalizada das receitas é salva automaticamente."}
      </p>
    </div>
  );
};
