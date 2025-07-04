
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

interface RecipeRatingProps {
  recipeId: string;
  showLabel?: boolean;
}

export const RecipeRating = ({ recipeId, showLabel = true }: RecipeRatingProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const loadRating = async () => {
    if (!user || !isSupabaseConfigured) return;

    try {
      // Carregar avaliação do usuário
      const { data: userRating } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)
        .single();

      if (userRating) {
        setRating(userRating.rating);
      }

      // Carregar média e total de avaliações
      const { data: ratings } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId);

      if (ratings && ratings.length > 0) {
        const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        setAverageRating(avg);
        setTotalRatings(ratings.length);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
    }
  };

  const handleRating = async (newRating: number) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para avaliar receitas');
      return;
    }

    try {
      const { error } = await supabase
        .from('recipe_ratings')
        .upsert({
          recipe_id: recipeId,
          user_id: user.id,
          rating: newRating
        });

      if (error) {
        console.error('Erro ao salvar avaliação:', error);
        toast.error('Erro ao salvar avaliação');
        return;
      }

      setRating(newRating);
      toast.success('Avaliação salva!');
      loadRating(); // Recarregar para atualizar média
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      toast.error('Erro ao salvar avaliação');
    }
  };

  useEffect(() => {
    loadRating();
  }, [recipeId, user]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-0.5 transition-colors"
            disabled={!user}
          >
            <Star
              className={`w-4 h-4 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${user ? 'hover:text-yellow-400' : ''}`}
            />
          </button>
        ))}
      </div>
      
      {showLabel && totalRatings > 0 && (
        <span className="text-coffee-600 dark:text-coffee-400">
          {averageRating.toFixed(1)} ({totalRatings})
        </span>
      )}
    </div>
  );
};
