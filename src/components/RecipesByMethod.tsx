
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Coffee, Droplets, Clock, Play, Thermometer, Settings, FileText, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Recipe } from '@/pages/Index';

interface RecipesByMethodProps {
  recipes: Recipe[];
  methodName: string;
  onStartBrewing: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
  onMoveRecipeUp: (index: number) => void;
  onMoveRecipeDown: (index: number) => void;
}

export const RecipesByMethod = ({ 
  recipes, 
  methodName, 
  onStartBrewing, 
  onEditRecipe, 
  onDeleteRecipe,
  onMoveRecipeUp,
  onMoveRecipeDown 
}: RecipesByMethodProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const getCumulativeWaterAmount = (recipe: Recipe, stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-between cursor-pointer bg-coffee-100 p-3 rounded-lg hover:bg-coffee-150 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Coffee className="w-5 h-5 text-coffee-600" />
          <h3 className="text-lg font-semibold text-coffee-800">{methodName}</h3>
          <Badge variant="secondary" className="bg-coffee-200 text-coffee-700">
            {recipes.length} receita{recipes.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-coffee-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-coffee-600" />
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
          {recipes.map((recipe, index) => {
            const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);
            
            return (
              <Card key={recipe.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-coffee-200 relative">
                {/* Recipe Order Controls */}
                <div className="absolute -top-2 -right-2 flex flex-col gap-1 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveRecipeUp(index)}
                    disabled={index === 0}
                    className="bg-white shadow-md h-6 w-6 p-0 hover:bg-coffee-50"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveRecipeDown(index)}
                    disabled={index === recipes.length - 1}
                    className="bg-white shadow-md h-6 w-6 p-0 hover:bg-coffee-50"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>

                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-start justify-between text-coffee-800 gap-2 pr-8">
                    <span className="text-sm sm:text-base leading-tight">{recipe.name}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditRecipe(recipe)}
                        className="text-coffee-600 hover:text-coffee-700 h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="mx-4 sm:mx-0">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Receita</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a receita "{recipe.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteRecipe(recipe.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                  <p className="text-coffee-600 text-xs sm:text-sm leading-relaxed">{recipe.description}</p>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Ratio Info */}
                  <div className="flex items-center justify-between bg-coffee-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-coffee-600" />
                      <span className="text-xs sm:text-sm font-medium">{recipe.coffeeRatio}g café</span>
                    </div>
                    <div className="text-coffee-400">:</div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="text-xs sm:text-sm font-medium">{recipe.waterRatio}ml água</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-1 sm:space-y-2">
                    {recipe.waterTemperature && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-coffee-600">
                        <Thermometer className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{recipe.waterTemperature}°C</span>
                      </div>
                    )}
                    
                    {recipe.grinderBrand && recipe.grinderClicks && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-coffee-600">
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{recipe.grinderBrand}: {recipe.grinderClicks} clicks</span>
                      </div>
                    )}
                    
                    {recipe.paperBrand && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-coffee-600">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">Papel: {recipe.paperBrand}</span>
                      </div>
                    )}
                  </div>

                  {/* Steps Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-coffee-600" />
                      <span className="text-xs sm:text-sm font-medium text-coffee-700">
                        {recipe.steps.length} etapas • {formatTime(totalTime)}
                      </span>
                    </div>
                    
                    {/* Water amounts per step */}
                    {recipe.steps.some(step => step.waterAmount) && (
                      <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                        <span className="text-xs font-semibold text-blue-800 block mb-2">💧 Quantidades de Água por Etapa:</span>
                        <div className="grid grid-cols-2 gap-1">
                          {recipe.steps.map((step, index) => (
                            step.waterAmount ? (
                              <div key={index} className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                <strong>{step.name}:</strong> {step.waterAmount}ml 
                                <br />
                                <span className="text-blue-600">Total: {getCumulativeWaterAmount(recipe, index)}ml</span>
                              </div>
                            ) : null
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {recipe.steps.map((step, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs border-coffee-300 text-coffee-600"
                        >
                          {step.name} ({formatTime(step.duration)})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => onStartBrewing(recipe)}
                    className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
                    size="sm"
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Iniciar Preparo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
