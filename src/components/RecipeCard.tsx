
import { Coffee, Clock, Thermometer, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/pages/Index";
import { RecipeRating } from "./RecipeRating";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserFavorites();
  const totalTime = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = () => {
    if (isRecipeFavorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  return (
    <EnhancedCard
      variant="coffee"
      hover={true}
      interactive={false}
      className="h-full flex flex-col"
    >
      {/* Recipe Image */}
      <OptimizedImage
        src="/lovable-uploads/49af2e43-3983-4eab-85c9-d3cd8c4e7deb.png"
        alt={recipe.name}
        className="w-full h-32 rounded-t-lg mb-4"
        aspectRatio="video"
        placeholder="skeleton"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-coffee-800 dark:text-coffee-200 flex-1">
          {recipe.name}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavoriteClick}
          className={`p-1 ml-2 ${isRecipeFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Star className={`w-4 h-4 ${isRecipeFavorite ? 'fill-current' : ''}`} />
        </Button>
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
        <RecipeRating recipeId={recipe.id} />
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
