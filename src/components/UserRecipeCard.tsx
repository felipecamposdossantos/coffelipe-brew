
import { Coffee, Clock, Thermometer, Star, Heart, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/pages/Index";
import { RecipeRating } from "./RecipeRating";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getMethodImage, getMethodImageAlt } from "@/utils/methodImages";

interface UserRecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const UserRecipeCard = ({ 
  recipe, 
  onStartBrewing, 
  onEdit, 
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: UserRecipeCardProps) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserFavorites();
  const totalTime = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = async () => {
    if (!user) {
      return;
    }
    
    if (isRecipeFavorite) {
      await removeFromFavorites(recipe.id);
    } else {
      await addToFavorites(recipe);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  // Obter imagem específica do método
  const methodImageSrc = getMethodImage(recipe.method || 'V60');
  const methodImageAlt = getMethodImageAlt(recipe.method || 'V60');

  return (
    <EnhancedCard
      variant="coffee"
      hover={true}
      interactive={false}
      className="h-full flex flex-col"
    >
      {/* Recipe Image */}
      <OptimizedImage
        src={methodImageSrc}
        alt={methodImageAlt}
        className="w-full h-32 rounded-t-lg mb-4"
        aspectRatio="video"
        placeholder="skeleton"
      />

      {/* Header with actions */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-coffee-800 dark:text-coffee-200 flex-1">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-1 ml-2">
          {/* Move buttons */}
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="p-1"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className={`p-1 ${isRecipeFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isRecipeFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Edit button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(recipe)}
            className="p-1 text-blue-500 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(recipe.id)}
            className="p-1 text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-coffee-600 dark:text-coffee-400 mb-4">
        {recipe.description}
      </p>

      {/* Recipe Info */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-coffee-600" />
          <span>{recipe.coffeeRatio}g : {recipe.waterRatio}ml</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-coffee-600" />
          <span>{formatTime(totalTime)}</span>
        </div>
        {recipe.waterTemperature && (
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-coffee-600" />
            <span>{recipe.waterTemperature}°C</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {recipe.method || 'V60'}
          </Badge>
        </div>
      </div>

      {/* Steps Preview */}
      <div className="mb-4 flex-1">
        <h4 className="font-medium text-coffee-700 dark:text-coffee-300 mb-2">Etapas:</h4>
        <div className="space-y-1">
          {recipe.steps.slice(0, 3).map((step, index) => (
            <div key={index} className="text-sm text-coffee-600 dark:text-coffee-400">
              {index + 1}. {step.name}
            </div>
          ))}
          {recipe.steps.length > 3 && (
            <div className="text-sm text-coffee-500 dark:text-coffee-500">
              +{recipe.steps.length - 3} etapa{recipe.steps.length - 3 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Recipe Rating */}
      <div className="mb-4">
        <RecipeRating recipeId={recipe.id} recipeName={recipe.name} />
      </div>

      {/* Action Button */}
      <Button 
        onClick={() => onStartBrewing(recipe)} 
        className="w-full bg-coffee-600 hover:bg-coffee-700 text-white touch-target"
      >
        Iniciar Preparo
      </Button>
    </EnhancedCard>
  );
};
