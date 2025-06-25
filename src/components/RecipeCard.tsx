
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Droplets, Clock, Play, Thermometer, Settings, FileText } from "lucide-react";
import { Recipe } from "@/pages/Index";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-coffee-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-coffee-800">
          <span>{recipe.name}</span>
          <Coffee className="w-5 h-5 text-coffee-600" />
        </CardTitle>
        <p className="text-coffee-600 text-sm">{recipe.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ratio Info */}
        <div className="flex items-center justify-between bg-coffee-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-coffee-600" />
            <span className="text-sm font-medium">{recipe.coffeeRatio}g café</span>
          </div>
          <div className="text-coffee-400">:</div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{recipe.waterRatio}ml água</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          {recipe.waterTemperature && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <Thermometer className="w-4 h-4" />
              <span>{recipe.waterTemperature}°C</span>
            </div>
          )}
          
          {recipe.grinderBrand && recipe.grinderClicks && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <Settings className="w-4 h-4" />
              <span>{recipe.grinderBrand}: {recipe.grinderClicks} clicks</span>
            </div>
          )}
          
          {recipe.paperBrand && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <FileText className="w-4 h-4" />
              <span>Papel: {recipe.paperBrand}</span>
            </div>
          )}
        </div>

        {/* Steps Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-coffee-600" />
            <span className="text-sm font-medium text-coffee-700">
              {recipe.steps.length} etapas • {formatTime(totalTime)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {recipe.steps.map((step, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-coffee-300 text-coffee-600"
              >
                {step.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onStartBrewing(recipe)}
          className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Iniciar Preparo
        </Button>
      </CardContent>
    </Card>
  );
};
