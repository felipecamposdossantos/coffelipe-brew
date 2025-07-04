
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/pages/Index';
import { toast } from 'sonner';

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  recipe_name: string;
  recipe_data: Recipe;
  favorited_at: string;
}

export const useUserFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('favorited_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar favoritos:', error);
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (recipe: Recipe) => {
    if (!user) {
      toast.error('Faça login para salvar favoritos');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          recipe_id: recipe.id,
          recipe_name: recipe.name,
          recipe_data: recipe
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Receita já está nos favoritos');
        } else {
          console.error('Erro ao adicionar favorito:', error);
          toast.error('Erro ao adicionar aos favoritos');
        }
        return false;
      }

      toast.success('Adicionado aos favoritos!');
      loadFavorites();
      return true;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      toast.error('Erro ao adicionar aos favoritos');
      return false;
    }
  };

  const removeFromFavorites = async (recipeId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) {
        console.error('Erro ao remover favorito:', error);
        toast.error('Erro ao remover dos favoritos');
        return false;
      }

      toast.success('Removido dos favoritos');
      loadFavorites();
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover dos favoritos');
      return false;
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(fav => fav.recipe_id === recipeId);
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites
  };
};
