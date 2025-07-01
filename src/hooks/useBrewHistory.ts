
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
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

export const useBrewHistory = () => {
  const { user } = useAuth();
  const [brewHistory, setBrewHistory] = useState<BrewHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBrewHistory = async () => {
    if (!user || !isSupabaseConfigured) {
      console.log('loadBrewHistory: No user or Supabase not configured');
      return;
    }

    console.log('loadBrewHistory: Starting to load history for user:', user.id);
    try {
      const { data, error } = await supabase
        .from('brew_history')
        .select('*')
        .eq('user_id', user.id)
        .order('brewed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar histórico:', error);
        return;
      }

      console.log('loadBrewHistory: Raw data from DB:', data);

      if (data) {
        setBrewHistory(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const deleteBrewHistory = async (brewId: string) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para excluir histórico');
      return false;
    }

    try {
      const { error } = await supabase
        .from('brew_history')
        .delete()
        .eq('id', brewId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao excluir preparo do histórico:', error);
        toast.error('Erro ao excluir preparo do histórico');
        return false;
      }

      toast.success('Preparo excluído do histórico!');
      loadBrewHistory();
      return true;
    } catch (error) {
      console.error('Erro ao excluir preparo do histórico:', error);
      toast.error('Erro ao excluir preparo do histórico');
      return false;
    }
  };

  const addToBrewHistory = async (recipe: any) => {
    if (!user || !isSupabaseConfigured) {
      console.log('addToBrewHistory: No user or Supabase not configured');
      return;
    }

    console.log('addToBrewHistory: Saving brew history for recipe:', recipe.name);

    try {
      const historyData = {
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        user_id: user.id,
        brewed_at: new Date().toISOString(),
        coffee_bean_id: recipe.coffeeBeanId || null,
        grinder_brand: recipe.grinderBrand || null,
        grinder_clicks: recipe.grinderClicks || null,
        paper_brand: recipe.paperBrand || null,
        water_temperature: recipe.waterTemperature || null,
        coffee_ratio: recipe.coffeeRatio,
        water_ratio: recipe.waterRatio
      };

      console.log('addToBrewHistory: Data to insert:', historyData);

      const { data, error } = await supabase
        .from('brew_history')
        .insert(historyData)
        .select();

      if (error) {
        console.error('Erro ao salvar histórico:', error);
        toast.error('Erro ao salvar no histórico');
        return;
      }

      console.log('addToBrewHistory: Successfully saved:', data);
      await loadBrewHistory();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      toast.error('Erro ao salvar no histórico');
    }
  };

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      loadBrewHistory();
    } else {
      setBrewHistory([]);
    }
  }, [user, isSupabaseConfigured]);

  return {
    brewHistory,
    loading,
    deleteBrewHistory,
    addToBrewHistory,
    loadBrewHistory
  };
};
