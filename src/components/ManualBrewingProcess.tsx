
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Coffee, 
  Droplets,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Thermometer,
  FileText
} from "lucide-react";
import { Recipe } from "@/pages/Index";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { useUserRecipes } from "@/hooks/useUserRecipes";

interface ManualBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
  timerState: any; // Shared timer state from useBrewingTimer
}

export const ManualBrewingProcess = ({ recipe, onComplete, timerState }: ManualBrewingProcessProps) => {
  const { addToBrewHistory } = useUserRecipes();

  const handleCompleteStep = () => {
    if (!timerState.completedSteps.includes(timerState.currentStep)) {
      timerState.setCompletedSteps(prev => [...prev, timerState.currentStep]);
    }
  };

  const handleCompleteRecipe = () => {
    if (!timerState.completedSteps.includes(timerState.currentStep)) {
      timerState.setCompletedSteps(prev => [...prev, timerState.currentStep]);
    }
    // Add to brew history when completing the recipe
    addToBrewHistory(recipe);
    onComplete();
  };

  const handleBack = () => {
    onComplete();
  };

  const handlePreviousStep = () => {
    if (timerState.currentStep > 0) {
      // For manual mode, we allow going back to previous steps
      const newStep = timerState.currentStep - 1;
      timerState.setCurrentStep(newStep);
    }
  };

  const handleNextStep = () => {
    if (timerState.currentStep < recipe.steps.length - 1) {
      if (!timerState.completedSteps.includes(timerState.currentStep)) {
        timerState.setCompletedSteps(prev => [...prev, timerState.currentStep]);
      }
      const newStep = timerState.currentStep + 1;
      timerState.setCurrentStep(newStep);
    }
  };

  const currentStepData = recipe.steps[timerState.currentStep];
  const isStepCompleted = timerState.completedSteps.includes(timerState.currentStep);
  const isLastStep = timerState.currentStep === recipe.steps.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="text-coffee-600 hover:bg-coffee-100 dark:text-coffee-300 dark:hover:bg-coffee-800"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-coffee-800 dark:text-coffee-200 text-center flex-1">
          {recipe.name}
        </h1>
        <div className="w-16 sm:w-20" />
      </div>

      {/* Recipe Info with Details */}
      <Card className="bg-coffee-50 border-coffee-200 dark:bg-coffee-900 dark:border-coffee-700">
        <CardContent className="pt-4 sm:pt-6 space-y-4">
          {/* Coffee and Water Ratio */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-coffee-600 dark:text-coffee-400" />
              <span className="font-medium text-coffee-800 dark:text-coffee-200">{recipe.coffeeRatio}g café</span>
            </div>
            <div className="text-coffee-400 text-xl sm:text-2xl">:</div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
              <span className="font-medium text-coffee-800 dark:text-coffee-200">{recipe.waterRatio}ml água</span>
            </div>
          </div>

          {/* Additional Recipe Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {recipe.waterTemperature && (
              <div className="flex items-center gap-2 text-coffee-600 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 p-2 rounded">
                <Thermometer className="w-4 h-4" />
                <span>Temperatura: {recipe.waterTemperature}°C</span>
              </div>
            )}
            
            {recipe.grinderBrand && recipe.grinderClicks && (
              <div className="flex items-center gap-2 text-coffee-600 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 p-2 rounded">
                <Settings className="w-4 h-4" />
                <span>{recipe.grinderBrand}: {recipe.grinderClicks} clicks</span>
              </div>
            )}
            
            {recipe.paperBrand && (
              <div className="flex items-center gap-2 text-coffee-600 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 p-2 rounded">
                <FileText className="w-4 h-4" />
                <span>Papel: {recipe.paperBrand}</span>
              </div>
            )}

            {recipe.method && (
              <div className="flex items-center gap-2 text-coffee-600 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 p-2 rounded">
                <Coffee className="w-4 h-4" />
                <span>Método: {recipe.method}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step Progress */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-4 sm:pt-6">
          <div className="text-center text-sm text-coffee-600 dark:text-coffee-300 mb-4">
            Etapa {timerState.currentStep + 1} de {recipe.steps.length}
          </div>
          <div className="flex justify-center gap-2">
            {recipe.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  timerState.completedSteps.includes(index)
                    ? 'bg-green-500'
                    : index === timerState.currentStep
                    ? 'bg-coffee-600 dark:bg-coffee-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Animation */}
      {currentStepData?.waterAmount && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-coffee-800 dark:text-coffee-200">
              Quantidade de Água - {currentStepData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <WaterPourAnimation 
              isPouring={false}
              currentAmount={timerState.getCumulativeWaterAmount(timerState.currentStep)}
              targetAmount={timerState.getCumulativeWaterAmount(timerState.currentStep)}
            />
            <div className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 text-center">
              <span>
                Adicionar: {currentStepData.waterAmount}ml • 
                Total acumulado: {timerState.getCumulativeWaterAmount(timerState.currentStep)}ml
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <Card className="bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-coffee-800 dark:text-coffee-200">{currentStepData?.name}</span>
            {isStepCompleted && (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-mono font-bold text-coffee-700 dark:text-coffee-300 mb-4">
              {timerState.formatTime(currentStepData?.duration || 0)}
            </div>
            <p className="text-sm text-coffee-600 dark:text-coffee-400">Tempo recomendado para esta etapa</p>
          </div>

          {/* Instruction */}
          <div className="bg-cream-50 dark:bg-coffee-900 p-3 sm:p-4 rounded-lg border border-cream-200 dark:border-coffee-700">
            <p className="text-coffee-700 dark:text-coffee-300 leading-relaxed text-sm sm:text-base">
              {currentStepData?.instruction}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 flex-wrap">
            {!isStepCompleted && (
              <Button 
                onClick={handleCompleteStep}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Concluída
              </Button>
            )}

            {isStepCompleted && !isLastStep && (
              <Button 
                onClick={handleNextStep}
                className="bg-coffee-600 hover:bg-coffee-700 text-white dark:bg-coffee-700 dark:hover:bg-coffee-600"
                size="sm"
              >
                Próxima Etapa
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {isStepCompleted && isLastStep && (
              <Button 
                onClick={handleCompleteRecipe}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Receita
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={timerState.currentStep === 0}
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <Button
              variant="outline"
              onClick={handleNextStep}
              disabled={timerState.currentStep === recipe.steps.length - 1}
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-sm sm:text-base text-coffee-800 dark:text-coffee-200">Todas as Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {recipe.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  index === timerState.currentStep 
                    ? 'bg-coffee-100 border-coffee-300 dark:bg-coffee-800 dark:border-coffee-600' 
                    : timerState.completedSteps.includes(index)
                    ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
                onClick={() => {
                  // Allow jumping to any step in manual mode
                  timerState.setCurrentStep(index);
                }}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  timerState.completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === timerState.currentStep
                    ? 'bg-coffee-600 text-white dark:bg-coffee-700'
                    : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {timerState.completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-coffee-800 dark:text-coffee-200 truncate">{step.name}</div>
                  <div className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 flex flex-wrap gap-2">
                    <span>{timerState.formatTime(step.duration)}</span>
                    {step.waterAmount && (
                      <span>• {step.waterAmount}ml (Total: {timerState.getCumulativeWaterAmount(index)}ml)</span>
                    )}
                  </div>
                </div>
                {index === timerState.currentStep && (
                  <Badge className="bg-coffee-600 text-white text-xs dark:bg-coffee-700">
                    Atual
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
