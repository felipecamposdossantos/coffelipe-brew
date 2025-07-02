
import { Coffee, Droplets, Clock, Thermometer, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/pages/Index";

interface RecipeInfoProps {
  recipe: Recipe;
  selectedPaper?: string;
  totalTime: number;
}

export const RecipeInfo = ({ recipe, selectedPaper, totalTime }: RecipeInfoProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-4">
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
        
        {(selectedPaper || recipe.paperBrand) && (
          <div className="flex items-center gap-2 text-sm text-coffee-600">
            <FileText className="w-4 h-4" />
            <span>Papel: {selectedPaper || recipe.paperBrand}</span>
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
    </div>
  );
};
