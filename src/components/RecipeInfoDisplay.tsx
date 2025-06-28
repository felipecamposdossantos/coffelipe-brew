
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Droplets } from "lucide-react";
import { Recipe } from "@/pages/Index";

interface RecipeInfoDisplayProps {
  recipe: Recipe;
}

export const RecipeInfoDisplay = ({ recipe }: RecipeInfoDisplayProps) => {
  return (
    <Card className="bg-coffee-50 border-coffee-200">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-coffee-600" />
            <span className="font-medium">{recipe.coffeeRatio}g café</span>
          </div>
          <div className="text-coffee-400 text-xl sm:text-2xl">:</div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <span className="font-medium">{recipe.waterRatio}ml água</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
