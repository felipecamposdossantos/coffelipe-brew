
import { Coffee, Clock, Thermometer, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/pages/Index";
import { RecipeRating } from "./RecipeRating";
import { useUserFavorites } from "@/hooks/useUserFavorites";

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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-coffee-800 dark:text-coffee-200">
            {recipe.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className={`p-1 ${isRecipeFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Star className={`w-4 h-4 ${isRecipeFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-coffee-600 dark:text-coffee-400">
          {recipe.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Recipe Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
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
        <div>
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
        <RecipeRating recipeId={recipe.id} />
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onStartBrewing(recipe)} 
          className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
        >
          Iniciar Preparo
        </Button>
      </CardFooter>
    </Card>
  );
};
