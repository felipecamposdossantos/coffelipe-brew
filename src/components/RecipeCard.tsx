
import { Coffee, Clock, Thermometer, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { RecipeRating } from "./RecipeRating";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getMethodImage, getMethodImageAlt } from "@/utils/methodImages";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserFavorites();
  const isMobile = useIsMobile();
  const totalTime = recipe.steps.reduce((sum, step) => sum + step.duration, 0);
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (isRecipeFavorite) {
      await removeFromFavorites(recipe.id);
    } else {
      await addToFavorites(recipe);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min` : `${secs}s`;
  };

  const methodImageSrc = getMethodImage(recipe.method || 'V60');
  const methodImageAlt = getMethodImageAlt(recipe.method || 'V60');

  return (
    <EnhancedCard
      variant="coffee"
      hover={true}
      interactive={false}
      className={`h-full flex flex-col ${isMobile ? 'max-w-full' : ''}`}
    >
      {/* Recipe Image - Optimized for mobile */}
      <OptimizedImage
        src={methodImageSrc}
        alt={methodImageAlt}
        className={`w-full rounded-t-lg mb-3 ${isMobile ? 'h-24' : 'h-32'}`}
        aspectRatio="video"
        placeholder="skeleton"
      />

      {/* Header - Mobile optimized */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className={`font-semibold text-coffee-800 dark:text-coffee-200 flex-1 leading-tight ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          {recipe.name}
        </h3>
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className={`p-1 flex-shrink-0 touch-target min-h-[44px] min-w-[44px] ${
              isRecipeFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isRecipeFavorite ? 'fill-current' : ''}`} />
          </Button>
        )}
      </div>

      {/* Description - Truncated for mobile */}
      <p className={`text-coffee-600 dark:text-coffee-400 mb-3 line-clamp-2 ${
        isMobile ? 'text-sm' : 'text-sm'
      }`}>
        {recipe.description}
      </p>

      {/* Recipe Info - Simplified for mobile */}
      <div className={`grid gap-2 mb-3 ${isMobile ? 'grid-cols-2 text-xs' : 'grid-cols-2 text-sm'}`}>
        <div className="flex items-center gap-1">
          <Coffee className="w-3 h-3 text-coffee-600 flex-shrink-0" />
          <span className="truncate">{recipe.coffeeRatio}g : {recipe.waterRatio}ml</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-coffee-600 flex-shrink-0" />
          <span>{formatTime(totalTime)}</span>
        </div>
        {recipe.waterTemperature && (
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-coffee-600 flex-shrink-0" />
            <span>{recipe.waterTemperature}°C</span>
          </div>
        )}
        <div className="flex items-center justify-start">
          <Badge variant="outline" className="text-xs px-2 py-1">
            {recipe.method || 'V60'}
          </Badge>
        </div>
      </div>

      {/* Steps Preview - Compact for mobile */}
      {!isMobile && (
        <div className="mb-3 flex-1">
          <h4 className="font-medium text-coffee-700 dark:text-coffee-300 mb-2 text-sm">Etapas:</h4>
          <div className="space-y-1">
            {recipe.steps.slice(0, 2).map((step, index) => (
              <div key={index} className="text-xs text-coffee-600 dark:text-coffee-400 truncate">
                {index + 1}. {step.name}
              </div>
            ))}
            {recipe.steps.length > 2 && (
              <div className="text-xs text-coffee-500 dark:text-coffee-500">
                +{recipe.steps.length - 2} etapa{recipe.steps.length - 2 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recipe Rating - Compact */}
      <div className="mb-3">
        <RecipeRating recipeId={recipe.id} recipeName={recipe.name} compact={isMobile} />
      </div>

      {/* Action Button - Touch optimized */}
      <Button 
        onClick={() => onStartBrewing(recipe)} 
        className={`w-full bg-coffee-600 hover:bg-coffee-700 text-white touch-target transition-all duration-200 ${
          isMobile ? 'min-h-[48px] text-sm' : 'min-h-[44px]'
        }`}
      >
        <span>Iniciar</span>
        {!isMobile && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </EnhancedCard>
  );
};
