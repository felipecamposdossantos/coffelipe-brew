
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface RecipeRating {
  id: string;
  user_id: string;
  recipe_id: string;
  recipe_name: string;
  rating: number;
  comment?: string;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export const useRecipeRatings = (recipeId?: string) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RecipeRating[]>([]);
  const [userRating, setUserRating] = useState<RecipeRating | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadRatings = async (targetRecipeId?: string) => {
    if (!targetRecipeId && !recipeId) return;
    
    const id = targetRecipeId || recipeId;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('recipe_ratings')
        .select('*')
        .eq('recipe_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar avaliações:', error);
        return;
      }

      setRatings(data || []);
      
      // Calcular média
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }

      // Encontrar avaliação do usuário atual
      if (user) {
        const userRatingData = data?.find(r => r.user_id === user.id);
        setUserRating(userRatingData || null);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (targetRecipeId: string, recipeName: string, rating: number, comment?: string) => {
    if (!user) {
      toast.error('Faça login para avaliar receitas');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('recipe_ratings')
        .upsert({
          user_id: user.id,
          recipe_id: targetRecipeId,
          recipe_name: recipeName,
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar avaliação:', error);
        toast.error('Erro ao salvar avaliação');
        return false;
      }

      toast.success('Avaliação salva com sucesso!');
      loadRatings(targetRecipeId);
      return true;
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('Erro ao salvar avaliação');
      return false;
    }
  };

  useEffect(() => {
    if (recipeId) {
      loadRatings();
    }
  }, [recipeId, user]);

  return {
    ratings,
    userRating,
    averageRating,
    loading,
    submitRating,
    loadRatings
  };
};
