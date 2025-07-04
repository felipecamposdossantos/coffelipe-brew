
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Coffee, Droplets, Clock, Thermometer, Heart } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { RecipeRating } from "@/components/RecipeRating";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useAuth } from "@/contexts/AuthContext";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useUserFavorites();
  const totalTime = recipe.steps.reduce((total, step) => total + step.duration, 0);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMethodColor = (method?: string) => {
    const colorMap: { [key: string]: string } = {
      'V60': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Melita': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'French Press': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'AeroPress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Clever': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Chemex': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Kalita': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'UFO Dripper': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Moka': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colorMap[method || ''] || 'bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-200';
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    if (isFavorite(recipe.id)) {
      await removeFromFavorites(recipe.id);
    } else {
      await addToFavorites(recipe);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-coffee-800 dark:text-coffee-200 leading-tight">
            {recipe.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="p-1 h-8 w-8"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isFavorite(recipe.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`} 
                />
              </Button>
            )}
            {recipe.method && (
              <Badge className={`text-xs ${getMethodColor(recipe.method)}`}>
                {recipe.method}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-coffee-600 dark:text-coffee-300 text-sm leading-relaxed">
          {recipe.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-coffee-700 dark:text-coffee-300">
            <Coffee className="w-3 h-3" />
            <span className="font-medium">{recipe.coffeeRatio}g</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Droplets className="w-3 h-3" />
            <span className="font-medium">{recipe.waterRatio}ml</span>
          </div>
          <div className="flex items-center gap-1 text-coffee-600 dark:text-coffee-400">
            <Clock className="w-3 h-3" />
            <span className="font-medium">{formatTime(totalTime)}</span>
          </div>
          {recipe.waterTemperature && (
            <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
              <Thermometer className="w-3 h-3" />
              <span className="font-medium">{recipe.waterTemperature}°C</span>
            </div>
          )}
        </div>

        <RecipeRating 
          recipeId={recipe.id}
          showLabel={false}
        />

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onStartBrewing(recipe)} 
            className="flex-1 bg-coffee-600 hover:bg-coffee-700 text-white"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Preparar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
