
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RecipeRatingProps {
  recipeId: string;
  currentRating?: number;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
}

export const RecipeRating = ({ 
  recipeId, 
  currentRating = 0, 
  onRatingChange,
  showLabel = true 
}: RecipeRatingProps) => {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    onRatingChange?.(newRating);
    
    // Save to localStorage for now (could be expanded to save to database)
    const savedRatings = JSON.parse(localStorage.getItem('recipe-ratings') || '{}');
    savedRatings[recipeId] = newRating;
    localStorage.setItem('recipe-ratings', JSON.stringify(savedRatings));
    
    toast.success(`Receita avaliada com ${newRating} estrela${newRating !== 1 ? 's' : ''}!`);
  };

  // Load saved rating on component mount
  useState(() => {
    const savedRatings = JSON.parse(localStorage.getItem('recipe-ratings') || '{}');
    if (savedRatings[recipeId]) {
      setRating(savedRatings[recipeId]);
    }
  });

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-sm text-coffee-600 dark:text-coffee-300">Avaliação:</span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-0 w-6 h-6 hover:bg-transparent"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRating(star)}
          >
            <Star
              className={`w-4 h-4 ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } transition-colors`}
            />
          </Button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-xs text-coffee-500 dark:text-coffee-400">
          ({rating}/5)
        </span>
      )}
    </div>
  );
};
