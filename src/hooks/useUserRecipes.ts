
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Recipe } from '@/pages/Index';
import { toast } from 'sonner';

export interface BrewHistory {
  id: string;
  recipe_id: string;
  recipe_name: string;
  brewed_at: string;
  user_id: string;
}

export const useUserRecipes = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [brewHistory, setBrewHistory] = useState<BrewHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUserRecipes = async () => {
    if (!user || !isSupabaseConfigured) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao carregar receitas:', error);
        toast.error('Erro ao carregar suas receitas');
        return;
      }

      if (data) {
        const recipes: Recipe[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          coffeeRatio: item.coffee_ratio,
          waterRatio: item.water_ratio,
          steps: item.steps
        }));
        setUserRecipes(recipes);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrewHistory = async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('brew_history')
        .select('*')
        .eq('user_id', user.id)
        .order('brewed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return;
      }

      if (data) {
        setBrewHistory(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para salvar receitas');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_recipes')
        .insert({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          coffee_ratio: recipe.coffeeRatio,
          water_ratio: recipe.waterRatio,
          steps: recipe.steps,
          user_id: user.id
        });

      if (error) {
        console.error('Erro ao salvar receita:', error);
        toast.error('Erro ao salvar receita');
        return false;
      }

      toast.success('Receita salva com sucesso!');
      loadUserRecipes();
      return true;
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast.error('Erro ao salvar receita');
      return false;
    }
  };

  const addToBrewHistory = async (recipe: Recipe) => {
    if (!user || !isSupabaseConfigured) return;

    try {
      const { error } = await supabase
        .from('brew_history')
        .insert({
          recipe_id: recipe.id,
          recipe_name: recipe.name,
          user_id: user.id,
          brewed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar histórico:', error);
        return;
      }

      loadBrewHistory();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadUserRecipes();
      loadBrewHistory();
    } else {
      setUserRecipes([]);
      setBrewHistory([]);
    }
  }, [user, isSupabaseConfigured]);

  return {
    userRecipes,
    brewHistory,
    loading,
    saveRecipe,
    addToBrewHistory,
    loadUserRecipes,
    loadBrewHistory
  };
};
