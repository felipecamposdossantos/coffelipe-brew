
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { EditRecipeForm } from '@/components/EditRecipeForm';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Coffee, Droplets, Clock, Play, Thermometer, Settings, FileText, Edit, Trash2 } from 'lucide-react';
import { Recipe } from '@/pages/Index';

interface UserRecipesProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const UserRecipes = ({ onStartBrewing }: UserRecipesProps) => {
  const { userRecipes, loading, deleteRecipe } = useUserRecipes();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowEditDialog(true);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    await deleteRecipe(recipeId);
  };

  const handleRecipeUpdated = () => {
    setEditingRecipe(null);
    setShowEditDialog(false);
  };

  const getCumulativeWaterAmount = (recipe: Recipe, stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
          <p className="text-coffee-600">Carregando suas receitas...</p>
        </div>
      </div>
    );
  }

  if (userRecipes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
          <p className="text-coffee-600 text-sm sm:text-base">
            Você ainda não salvou nenhuma receita. Vá para a aba "Receitas" e clique em "Adicionar Minha Receita" para começar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 mb-2">Minhas Receitas</h2>
        <p className="text-coffee-600 text-sm sm:text-base">
          {userRecipes.length} receita{userRecipes.length !== 1 ? 's' : ''} salva{userRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {userRecipes.map((recipe) => {
          const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);
          
          return (
            <Card key={recipe.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-coffee-200">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-start justify-between text-coffee-800 gap-2">
                  <span className="text-sm sm:text-base leading-tight">{recipe.name}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRecipe(recipe)}
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
                            onClick={() => handleDeleteRecipe(recipe.id)}
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
                    <div className="space-y-1">
                      <span className="text-xs text-coffee-600 font-medium">Quantidades de água:</span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.steps.map((step, index) => (
                          step.waterAmount ? (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs border-blue-300 text-blue-600"
                            >
                              {step.waterAmount}ml ({getCumulativeWaterAmount(recipe, index)}ml)
                            </Badge>
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
                        {step.name}
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

      {/* Edit Recipe Dialog */}
      {editingRecipe && (
        <EditRecipeForm
          recipe={editingRecipe}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onRecipeUpdated={handleRecipeUpdated}
        />
      )}
    </div>
  );
};
