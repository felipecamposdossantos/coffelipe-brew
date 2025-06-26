
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, CheckCircle, Clock, Coffee, Droplets } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";

interface ManualBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const ManualBrewingProcess = ({ recipe, onComplete }: ManualBrewingProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const { addToBrewHistory } = useUserRecipes();

  // Calculate cumulative water amounts
  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const targetWaterAmount = getCumulativeWaterAmount(currentStep);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCurrentWaterAmount(targetWaterAmount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, targetWaterAmount]);

  // Update water amount during pouring
  useEffect(() => {
    if (isRunning && currentStep < recipe.steps.length) {
      const stepDuration = recipe.steps[currentStep]?.duration || 1;
      const stepWaterAmount = recipe.steps[currentStep]?.waterAmount || 0;
      const previousWaterAmount = getCumulativeWaterAmount(currentStep - 1);
      
      const progress = (stepDuration - timeRemaining) / stepDuration;
      const currentStepWater = stepWaterAmount * progress;
      setCurrentWaterAmount(previousWaterAmount + currentStepWater);
    }
  }, [timeRemaining, isRunning, currentStep, recipe.steps]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const skipStep = () => {
    setCurrentWaterAmount(targetWaterAmount);
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeRemaining(recipe.steps[currentStep + 1].duration);
      setIsRunning(false);
    } else {
      completeProcess();
    }
  };

  const nextStep = () => {
    setCurrentWaterAmount(targetWaterAmount);
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeRemaining(recipe.steps[currentStep + 1].duration);
      setIsRunning(false);
    } else {
      completeProcess();
    }
  };

  const completeProcess = async () => {
    setIsCompleted(true);
    setIsRunning(false);
    await addToBrewHistory(recipe);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = recipe.steps[currentStep];
  const progress = currentStepData ? ((currentStepData.duration - timeRemaining) / currentStepData.duration) * 100 : 100;
  const totalProgress = ((currentStep + (currentStepData ? (currentStepData.duration - timeRemaining) / currentStepData.duration : 1)) / recipe.steps.length) * 100;

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-green-50 border-green-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
          <CardTitle className="text-green-800 text-xl sm:text-2xl">Preparo Concluído!</CardTitle>
          <p className="text-green-600 text-sm sm:text-base">
            Seu {recipe.name} está pronto. Aproveite!
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
            Fazer Outro Café
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <Card className="bg-coffee-50 border-coffee-200">
        <CardContent className="pt-4 sm:pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-coffee-800">{recipe.name}</h2>
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-coffee-600">
              <div className="flex items-center gap-1">
                <Coffee className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{recipe.coffeeRatio}g</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{recipe.steps.reduce((acc, step) => acc + step.duration, 0)}s total</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-coffee-600">
              <span>Progresso Geral</span>
              <span>{currentStep + 1} de {recipe.steps.length} etapas</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
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
              isPouring={isRunning}
              currentAmount={Math.round(currentWaterAmount)}
              targetAmount={targetWaterAmount}
            />
            <div className="text-xs sm:text-sm text-coffee-600 text-center">
              {currentStepData.waterAmount && (
                <span>
                  Adicionar: {currentStepData.waterAmount}ml • 
                  Total acumulado: {targetWaterAmount}ml
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <Card className="border-coffee-300">
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-coffee-800 text-sm sm:text-base">
              Etapa {currentStep + 1}: {currentStepData?.name}
            </CardTitle>
            <Badge variant="outline" className="border-coffee-300 text-xs sm:text-sm">
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <Progress value={progress} className="h-2 sm:h-3" />
          
          <p className="text-coffee-700 leading-relaxed text-sm sm:text-base">
            {currentStepData?.instruction}
          </p>

          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                className="bg-coffee-600 hover:bg-coffee-700"
                disabled={timeRemaining === 0}
                size="sm"
              >
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {timeRemaining === 0 ? 'Etapa Concluída' : 'Iniciar'}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="outline"
                className="border-coffee-300"
                size="sm"
              >
                <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Pausar
              </Button>
            )}
            
            <Button
              onClick={skipStep}
              variant="outline"
              className="border-coffee-300"
              size="sm"
            >
              <SkipForward className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Pular
            </Button>

            {timeRemaining === 0 && (
              <Button
                onClick={nextStep}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {currentStep === recipe.steps.length - 1 ? 'Finalizar' : 'Próxima'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Steps Preview */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-coffee-800 text-sm sm:text-base">Todas as Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {recipe.steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  index === currentStep
                    ? 'bg-coffee-100 border border-coffee-300'
                    : index < currentStep
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  index === currentStep
                    ? 'bg-coffee-600 text-white'
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs sm:text-sm truncate">{step.name}</div>
                  <div className="text-xs text-gray-600 flex flex-wrap gap-1">
                    <span>{formatTime(step.duration)}</span>
                    {step.waterAmount && (
                      <span>• {step.waterAmount}ml (Total: {getCumulativeWaterAmount(index)}ml)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
