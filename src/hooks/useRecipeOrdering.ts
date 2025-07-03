
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Recipe } from '@/pages/Index';
import { defaultMethodOrder } from '@/data/defaultRecipes';

const STORAGE_KEY = 'coffee-recipes-order';

export const useRecipeOrdering = (initialRecipes: Recipe[]) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  // Função para ordenar receitas pela ordem padrão
  const sortRecipesByDefaultOrder = (recipesToSort: Recipe[]) => {
    return [...recipesToSort].sort((a, b) => {
      const indexA = defaultMethodOrder.indexOf(a.method || "");
      const indexB = defaultMethodOrder.indexOf(b.method || "");
      
      // Se o método não está na ordem padrão, coloque no final
      const orderA = indexA === -1 ? defaultMethodOrder.length : indexA;
      const orderB = indexB === -1 ? defaultMethodOrder.length : indexB;
      
      return orderA - orderB;
    });
  };

  // Salvar ordem quando usuário estiver logado
  const saveRecipeOrder = (newRecipes: Recipe[]) => {
    if (user) {
      const orderIds = newRecipes.map(recipe => recipe.id);
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(orderIds));
    }
  };

  const moveRecipeUp = (index: number) => {
    if (index > 0) {
      const newRecipes = [...recipes];
      [newRecipes[index - 1], newRecipes[index]] = [newRecipes[index], newRecipes[index - 1]];
      setRecipes(newRecipes);
      saveRecipeOrder(newRecipes);
    }
  };

  const moveRecipeDown = (index: number) => {
    if (index < recipes.length - 1) {
      const newRecipes = [...recipes];
      [newRecipes[index], newRecipes[index + 1]] = [newRecipes[index + 1], newRecipes[index]];
      setRecipes(newRecipes);
      saveRecipeOrder(newRecipes);
    }
  };

  // Carregar ordem salva ou aplicar ordem padrão
  useEffect(() => {
    if (user) {
      // Se logado, tentar carregar ordem salva
      const savedOrder = localStorage.getItem(`${STORAGE_KEY}-${user.id}`);
      if (savedOrder) {
        try {
          const orderIds = JSON.parse(savedOrder);
          const orderedRecipes = orderIds.map((id: string) => 
            initialRecipes.find(recipe => recipe.id === id)
          ).filter(Boolean);
          
          // Adicionar receitas que não estão na ordem salva
          const missingRecipes = initialRecipes.filter(recipe => 
            !orderIds.includes(recipe.id)
          );
          
          setRecipes([...orderedRecipes, ...sortRecipesByDefaultOrder(missingRecipes)]);
        } catch (error) {
          console.error('Erro ao carregar ordem salva:', error);
          setRecipes(sortRecipesByDefaultOrder(initialRecipes));
        }
      } else {
        setRecipes(sortRecipesByDefaultOrder(initialRecipes));
      }
    } else {
      // Se não logado, usar ordem padrão
      setRecipes(sortRecipesByDefaultOrder(initialRecipes));
    }
  }, [user, initialRecipes]);

  return {
    recipes,
    moveRecipeUp,
    moveRecipeDown
  };
};
