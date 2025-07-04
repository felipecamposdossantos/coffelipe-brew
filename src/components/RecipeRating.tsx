
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecipeRatings } from '@/hooks/useRecipeRatings';

interface RecipeRatingProps {
  recipeId: string;
  recipeName: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const RecipeRating = ({ recipeId, recipeName, showLabel = true, compact = false }: RecipeRatingProps) => {
  const { user } = useAuth();
  const { userRating, averageRating, loading, submitRating, loadRatings } = useRecipeRatings(recipeId);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (recipeId) {
      loadRatings(recipeId);
    }
  }, [recipeId, loadRatings]);

  const handleRating = async (newRating: number) => {
    if (!user) {
      return;
    }

    await submitRating(recipeId, recipeName, newRating);
  };

  const totalRatings = Math.floor(averageRating * 10) || 1; // Simulação para display

  return (
    <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`transition-colors disabled:cursor-not-allowed touch-target ${
              compact ? 'p-0.5 min-h-[32px] min-w-[32px]' : 'p-0.5 min-h-[36px] min-w-[36px]'
            }`}
            disabled={!user || loading}
          >
            <Star
              className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} ${
                star <= (hoveredRating || (userRating?.rating || 0))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${user && !loading ? 'hover:text-yellow-400' : ''}`}
            />
          </button>
        ))}
      </div>
      
      {showLabel && averageRating > 0 && (
        <span className={`text-coffee-600 dark:text-coffee-400 ${compact ? 'text-xs' : ''}`}>
          {averageRating.toFixed(1)} ({totalRatings})
        </span>
      )}

      {!user && (
        <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>
          Faça login para avaliar
        </span>
      )}
    </div>
  );
};
