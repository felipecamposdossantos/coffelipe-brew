
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
  coffee_bean_name?: string;
  coffee_bean_brand?: string;
  coffee_bean_type?: string;
  grinder_brand?: string;
  grinder_clicks?: number;
  paper_brand?: string;
  water_temperature?: number;
  coffee_ratio?: number;
  water_ratio?: number;
}

const GRINDER_BRANDS_KEY = 'coffee_custom_grinders';

export const useUserRecipes = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [brewHistory, setBrewHistory] = useState<BrewHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // Custom grinder management
  const getCustomGrinders = (): string[] => {
    try {
      const stored = localStorage.getItem(GRINDER_BRANDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveCustomGrinder = (grinderName: string) => {
    if (!grinderName.trim()) return;
    
    const existing = getCustomGrinders();
    if (!existing.includes(grinderName.trim())) {
      const updated = [...existing, grinderName.trim()];
      localStorage.setItem(GRINDER_BRANDS_KEY, JSON.stringify(updated));
    }
  };

  const loadUserRecipes = async () => {
    if (!user || !isSupabaseConfigured) {
      console.log('loadUserRecipes: No user or Supabase not configured');
      return;
    }

    console.log('loadUserRecipes: Starting to load recipes for user:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar receitas:', error);
        toast.error('Erro ao carregar suas receitas');
        return;
      }

      console.log('loadUserRecipes: Raw data from DB:', data);

      if (data) {
        const recipes: Recipe[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          coffeeRatio: item.coffee_ratio,
          waterRatio: item.water_ratio,
          waterTemperature: item.water_temperature || undefined,
          grinderBrand: item.grinder_brand || undefined,
          grinderClicks: item.grinder_clicks || undefined,
          paperBrand: item.paper_brand || undefined,
          coffeeBeanId: item.coffee_bean_id || undefined,
          steps: item.steps
        }));
        console.log('loadUserRecipes: Mapped recipes:', recipes);
        setUserRecipes(recipes);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
      console.log('loadUserRecipes: Finished loading');
    }
  };

  const loadBrewHistory = async () => {
    if (!user || !isSupabaseConfigured) {
      console.log('loadBrewHistory: No user or Supabase not configured');
      return;
    }

    console.log('loadBrewHistory: Starting to load history for user:', user.id);
    try {
      const { data, error } = await supabase
        .from('brew_history')
        .select(`
          *,
          coffee_beans (
            name,
            brand,
            type
          )
        `)
        .eq('user_id', user.id)
        .order('brewed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return;
      }

      console.log('loadBrewHistory: Raw data from DB:', data);

      if (data) {
        const historyWithBeans = data.map(item => ({
          ...item,
          coffee_bean_name: item.coffee_beans?.name,
          coffee_bean_brand: item.coffee_beans?.brand,
          coffee_bean_type: item.coffee_beans?.type
        }));
        console.log('loadBrewHistory: Mapped history:', historyWithBeans);
        setBrewHistory(historyWithBeans);
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

    // Save custom grinder if it's a new one
    if (recipe.grinderBrand && !['Comandante', '1Zpresso JX-Pro', 'Baratza Encore', 'Hario Mini Mill Slim', 'Timemore C2', 'Timemore C3', 'Porlex Mini', 'Mazzer Mini', 'Fellow Ode', 'Wilfa Uniform', 'Hario Skerton', 'Rhinowares Hand Grinder', 'OE Lido 3', 'Orphan Espresso Pharos'].includes(recipe.grinderBrand)) {
      saveCustomGrinder(recipe.grinderBrand);
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
          water_temperature: recipe.waterTemperature,
          grinder_brand: recipe.grinderBrand,
          grinder_clicks: recipe.grinderClicks,
          paper_brand: recipe.paperBrand,
          coffee_bean_id: recipe.coffeeBeanId,
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

  const updateRecipe = async (recipe: Recipe) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para editar receitas');
      return false;
    }

    // Save custom grinder if it's a new one
    if (recipe.grinderBrand && !['Comandante', '1Zpresso JX-Pro', 'Baratza Encore', 'Hario Mini Mill Slim', 'Timemore C2', 'Timemore C3', 'Porlex Mini', 'Mazzer Mini', 'Fellow Ode', 'Wilfa Uniform', 'Hario Skerton', 'Rhinowares Hand Grinder', 'OE Lido 3', 'Orphan Espresso Pharos'].includes(recipe.grinderBrand)) {
      saveCustomGrinder(recipe.grinderBrand);
    }

    try {
      const { error } = await supabase
        .from('user_recipes')
        .update({
          name: recipe.name,
          description: recipe.description,
          coffee_ratio: recipe.coffeeRatio,
          water_ratio: recipe.waterRatio,
          water_temperature: recipe.waterTemperature,
          grinder_brand: recipe.grinderBrand,
          grinder_clicks: recipe.grinderClicks,
          paper_brand: recipe.paperBrand,
          coffee_bean_id: recipe.coffeeBeanId,
          steps: recipe.steps,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipe.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar receita:', error);
        toast.error('Erro ao atualizar receita');
        return false;
      }

      toast.success('Receita atualizada com sucesso!');
      loadUserRecipes();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
      toast.error('Erro ao atualizar receita');
      return false;
    }
  };

  const updateRecipeOrder = async (newOrderedRecipes: Recipe[]) => {
    if (!user || !isSupabaseConfigured) return false;

    try {
      // Update each recipe with new timestamp to maintain order
      const updates = newOrderedRecipes.map((recipe, index) => ({
        id: recipe.id,
        user_id: user.id,
        created_at: new Date(Date.now() + index * 1000).toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('user_recipes')
          .update({ created_at: update.created_at })
          .eq('id', update.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao reordenar receitas:', error);
          return false;
        }
      }

      setUserRecipes(newOrderedRecipes);
      toast.success('Ordem das receitas atualizada!');
      return true;
    } catch (error) {
      console.error('Erro ao reordenar receitas:', error);
      return false;
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para excluir receitas');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao excluir receita:', error);
        toast.error('Erro ao excluir receita');
        return false;
      }

      toast.success('Receita excluída com sucesso!');
      loadUserRecipes();
      return true;
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
      toast.error('Erro ao excluir receita');
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
          brewed_at: new Date().toISOString(),
          coffee_bean_id: recipe.coffeeBeanId,
          grinder_brand: recipe.grinderBrand,
          grinder_clicks: recipe.grinderClicks,
          paper_brand: recipe.paperBrand,
          water_temperature: recipe.waterTemperature,
          coffee_ratio: recipe.coffeeRatio,
          water_ratio: recipe.waterRatio
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
    console.log('useUserRecipes useEffect triggered - user:', user?.id, 'isSupabaseConfigured:', isSupabaseConfigured);
    
    if (user && isSupabaseConfigured) {
      console.log('Loading user data...');
      loadUserRecipes();
      loadBrewHistory();
    } else {
      console.log('Clearing user data...');
      setUserRecipes([]);
      setBrewHistory([]);
    }
  }, [user, isSupabaseConfigured]);

  return {
    userRecipes,
    brewHistory,
    loading,
    saveRecipe,
    updateRecipe,
    updateRecipeOrder,
    deleteRecipe,
    addToBrewHistory,
    loadUserRecipes,
    loadBrewHistory,
    getCustomGrinders,
    saveCustomGrinder
  };
};
