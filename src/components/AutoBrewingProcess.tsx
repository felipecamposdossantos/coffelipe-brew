import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { useBrewingTimer } from "@/hooks/useBrewingTimer";
import { BrewingControls } from "@/components/BrewingControls";
import { RecipeInfoDisplay } from "@/components/RecipeInfoDisplay";
import { StepsOverview } from "@/components/StepsOverview";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { Recipe } from "@/pages/Index";
import { toast } from "sonner";

interface AutoBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const AutoBrewingProcess = ({ recipe, onComplete }: AutoBrewingProcessProps) => {
  const { addToBrewHistory } = useUserRecipes();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const {
    currentStep,
    timeLeft,
    isRunning,
    isPaused,
    isStepCompleted,
    isLastStep,
    isOvertime,
    startTimer,
    pauseTimer,
    nextStep,
    formatTime
  } = useBrewingTimer(recipe.steps);

  useEffect(() => {
    if (isStepCompleted && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      
      if (isLastStep) {
        const endTime = new Date();
        const totalTimeMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
        const totalTimeSeconds = Math.floor(totalTimeMs / 1000);
        
        console.log('Finalizando preparo e salvando no histórico');
        handleFinish(totalTimeSeconds);
      }
    }
  }, [isStepCompleted, currentStep, completedSteps, isLastStep, startTime]);

  const handleStart = () => {
    console.log('Iniciando primeira etapa');
    setHasStarted(true);
    setStartTime(new Date());
    startTimer();
  };

  const handlePause = () => {
    console.log('Pausando/Retomando timer');
    pauseTimer();
  };

  const handleNextStep = () => {
    console.log('Pulando para próxima etapa');
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    nextStep();
  };

  const handleFinish = async (totalExtractionTime?: number) => {
    console.log('Finalizando preparo - salvando histórico');
    
    try {
      await addToBrewHistory(recipe);
      
      const totalTime = totalExtractionTime || recipe.steps.reduce((acc, step) => acc + step.duration, 0);
      const totalMinutes = Math.floor(totalTime / 60);
      const totalSeconds = totalTime % 60;
      
      toast.success(
        `Preparo finalizado! Receita "${recipe.name}" salva no histórico. ` +
        `Tempo total: ${totalMinutes > 0 ? `${totalMinutes}min ` : ''}${totalSeconds}s`
      );
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      toast.error('Erro ao salvar no histórico, mas o preparo foi concluído!');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const currentStepData = recipe.steps[currentStep];
  const progress = currentStepData ? ((currentStepData.duration - timeLeft) / currentStepData.duration) * 100 : 0;
  const totalSteps = recipe.steps.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <RecipeInfoDisplay recipe={recipe} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Current Step */}
        <Card className="order-1">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center justify-between text-coffee-800">
              <span className="text-base sm:text-lg">
                Etapa {currentStep + 1} de {totalSteps}
              </span>
              {isStepCompleted && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluída
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {currentStepData && (
              <>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-coffee-800 mb-2">
                    {currentStepData.name}
                  </h3>
                  <p className="text-coffee-600 text-sm sm:text-base mb-4">
                    {currentStepData.instruction}
                  </p>
                  
                  {currentStepData.waterAmount && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-medium">
                        💧 Adicionar: <span className="font-bold">{currentStepData.waterAmount}ml</span> de água
                      </p>
                      <p className="text-blue-600 text-sm">
                        Total acumulado: <span className="font-semibold">{getCumulativeWaterAmount(currentStep)}ml</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-coffee-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-coffee-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>de {formatTime(currentStepData.duration)}</span>
                  </div>
                </div>

                <Progress value={progress} className="h-2 sm:h-3" />

                {isOvertime && (
                  <div className="text-center text-red-600 font-medium animate-pulse">
                    ⏰ Tempo extra! Você pode finalizar quando quiser.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Water Pour Animation */}
        <Card className="order-2">
          <CardContent className="pt-4 sm:pt-6 flex items-center justify-center h-40 sm:h-48">
            <WaterPourAnimation isPouring={isRunning && !isPaused} />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <BrewingControls
        hasStarted={hasStarted}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isRunning={isRunning}
        isPaused={isPaused}
        isStepCompleted={isStepCompleted}
        isLastStep={isLastStep}
        isOvertime={isOvertime}
        onStart={handleStart}
        onPause={handlePause}
        onNextStep={handleNextStep}
        onFinish={() => handleFinish()}
      />

      {/* Steps Overview */}
      <StepsOverview
        recipe={recipe}
        currentStep={currentStep}
        completedSteps={completedSteps}
        getCumulativeWaterAmount={getCumulativeWaterAmount}
        formatTime={formatTime}
      />
    </div>
  );
};
