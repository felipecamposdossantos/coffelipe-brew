
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Recipe } from '@/pages/Index';
import { toast } from 'sonner';
import { useCustomGrinders } from './useCustomGrinders';
import { useBrewHistory } from './useBrewHistory';

export const useUserRecipes = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { getCustomGrinders, saveCustomGrinder } = useCustomGrinders();
  const { brewHistory, deleteBrewHistory, addToBrewHistory, loadBrewHistory } = useBrewHistory();

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

  const saveRecipe = async (recipe: Recipe) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para salvar receitas');
      return false;
    }

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

  useEffect(() => {
    console.log('useUserRecipes useEffect triggered - user:', user?.id, 'isSupabaseConfigured:', isSupabaseConfigured);
    
    if (user && isSupabaseConfigured) {
      console.log('Loading user data...');
      loadUserRecipes();
    } else {
      console.log('Clearing user data...');
      setUserRecipes([]);
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
    deleteBrewHistory,
    loadUserRecipes,
    loadBrewHistory,
    getCustomGrinders,
    saveCustomGrinder
  };
};
