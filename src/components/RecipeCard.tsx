
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { RecipeSettings } from "./RecipeSettings";
import { RecipeInfo } from "./RecipeInfo";
import { RecipeActions } from "./RecipeActions";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe, mode?: 'auto' | 'manual') => void;
}

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const [selectedGrinder, setSelectedGrinder] = useState(recipe.grinderBrand || "");
  const [selectedClicks, setSelectedClicks] = useState(recipe.grinderClicks || 15);
  const [selectedCoffeeBeanId, setSelectedCoffeeBeanId] = useState(recipe.coffeeBeanId || "none");
  const [selectedFilterPaperId, setSelectedFilterPaperId] = useState(recipe.filterPaperId || "none");
  const [selectedPaper, setSelectedPaper] = useState(recipe.paperBrand || "");

  const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);

  const handleGrinderChange = (grinder: string, clicks: number) => {
    setSelectedGrinder(grinder);
    setSelectedClicks(clicks);
  };

  const handleStartBrewing = (mode: 'auto' | 'manual') => {
    const updatedRecipe = {
      ...recipe,
      grinderBrand: selectedGrinder || recipe.grinderBrand,
      grinderClicks: selectedClicks || recipe.grinderClicks,
      coffeeBeanId: selectedCoffeeBeanId === "none" ? undefined : selectedCoffeeBeanId || recipe.coffeeBeanId,
      filterPaperId: selectedFilterPaperId === "none" ? undefined : selectedFilterPaperId || recipe.filterPaperId,
      paperBrand: selectedPaper || recipe.paperBrand
    };
    onStartBrewing(updatedRecipe, mode);
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
        <RecipeInfo 
          recipe={recipe} 
          selectedPaper={selectedPaper}
          totalTime={totalTime}
        />

        <RecipeSettings
          selectedCoffeeBeanId={selectedCoffeeBeanId}
          selectedFilterPaperId={selectedFilterPaperId}
          selectedPaper={selectedPaper}
          selectedGrinder={selectedGrinder}
          selectedClicks={selectedClicks}
          onCoffeeBeanChange={setSelectedCoffeeBeanId}
          onFilterPaperChange={setSelectedFilterPaperId}
          onPaperChange={setSelectedPaper}
          onGrinderChange={handleGrinderChange}
        />

        <RecipeActions onStartBrewing={handleStartBrewing} />
      </CardContent>
    </Card>
  );
};
