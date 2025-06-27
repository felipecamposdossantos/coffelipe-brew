
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Coffee, 
  Droplets,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Recipe } from "@/pages/Index";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { useUserRecipes } from "@/hooks/useUserRecipes";

interface ManualBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const ManualBrewingProcess = ({ recipe, onComplete }: ManualBrewingProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { addToBrewHistory } = useUserRecipes();

  // Calculate cumulative water amounts
  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCompleteStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handleCompleteRecipe = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    // Add to brew history when completing the recipe
    addToBrewHistory(recipe);
    onComplete();
  };

  const handleBack = () => {
    onComplete();
  };

  const currentStepData = recipe.steps[currentStep];
  const isStepCompleted = completedSteps.includes(currentStep);
  const isLastStep = currentStep === recipe.steps.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="text-coffee-600 hover:bg-coffee-100"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-coffee-800 text-center flex-1">
          {recipe.name}
        </h1>
        <div className="w-16 sm:w-20" />
      </div>

      {/* Recipe Info */}
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

      {/* Step Progress */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="text-center text-sm text-coffee-600 mb-4">
            Etapa {currentStep + 1} de {recipe.steps.length}
          </div>
          <div className="flex justify-center gap-2">
            {recipe.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  completedSteps.includes(index)
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-coffee-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Animation */}
      {currentStepData?.waterAmount && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-coffee-800">
              Quantidade de Água - {currentStepData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <WaterPourAnimation 
              isPouring={false}
              currentAmount={getCumulativeWaterAmount(currentStep)}
              targetAmount={getCumulativeWaterAmount(currentStep)}
            />
            <div className="text-xs sm:text-sm text-coffee-600 text-center">
              <span>
                Adicionar: {currentStepData.waterAmount}ml • 
                Total acumulado: {getCumulativeWaterAmount(currentStep)}ml
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-coffee-800">{currentStepData?.name}</span>
            {isStepCompleted && (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-mono font-bold text-coffee-700 mb-4">
              {formatTime(currentStepData?.duration || 0)}
            </div>
            <p className="text-sm text-coffee-600">Tempo recomendado para esta etapa</p>
          </div>

          {/* Instruction */}
          <div className="bg-cream-50 p-3 sm:p-4 rounded-lg border border-cream-200">
            <p className="text-coffee-700 leading-relaxed text-sm sm:text-base">
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
                className="bg-coffee-600 hover:bg-coffee-700 text-white"
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
              disabled={currentStep === 0}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <Button
              variant="outline"
              onClick={handleNextStep}
              disabled={currentStep === recipe.steps.length - 1}
              size="sm"
            >
              Próxima
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-sm sm:text-base text-coffee-800">Todas as Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {recipe.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-sm cursor-pointer hover:bg-gray-50 ${
                  index === currentStep 
                    ? 'bg-coffee-100 border-coffee-300' 
                    : completedSteps.includes(index)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-coffee-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-coffee-800 truncate">{step.name}</div>
                  <div className="text-xs sm:text-sm text-coffee-600 flex flex-wrap gap-2">
                    <span>{formatTime(step.duration)}</span>
                    {step.waterAmount && (
                      <span>• {step.waterAmount}ml (Total: {getCumulativeWaterAmount(index)}ml)</span>
                    )}
                  </div>
                </div>
                {index === currentStep && (
                  <Badge className="bg-coffee-600 text-white text-xs">
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
