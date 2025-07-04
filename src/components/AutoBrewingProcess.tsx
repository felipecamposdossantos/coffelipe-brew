
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
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
  timerState: any; // Shared timer state from useBrewingTimer
}

export const AutoBrewingProcess = ({ recipe, onComplete, timerState }: AutoBrewingProcessProps) => {
  const { addToBrewHistory } = useUserRecipes();
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Derived values from timer state
  const isStepCompleted = timerState.completedSteps.includes(timerState.currentStep);
  const isLastStep = timerState.currentStep === recipe.steps.length - 1;

  const handleStartBrewing = () => {
    console.log('Iniciando primeira etapa');
    setStartTime(new Date());
    timerState.handleStart();
  };

  const handleFinishBrewing = async () => {
    const endTime = new Date();
    const totalTimeMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
    const totalTimeSeconds = Math.floor(totalTimeMs / 1000);
    
    console.log('Finalizando preparo e salvando no histórico');
    
    try {
      await timerState.handleFinish();
      await addToBrewHistory(recipe);
      
      const totalTime = totalTimeSeconds || recipe.steps.reduce((acc, step) => acc + step.duration, 0);
      const totalMinutes = Math.floor(totalTime / 60);
      const totalSecondsRemainder = totalTime % 60;
      
      toast.success(
        `Preparo finalizado! Receita "${recipe.name}" salva no histórico. ` +
        `Tempo total: ${totalMinutes > 0 ? `${totalMinutes}min ` : ''}${totalSecondsRemainder}s`
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

  const currentStepData = recipe.steps[timerState.currentStep];
  const progress = currentStepData ? ((currentStepData.duration - timerState.timeLeft) / currentStepData.duration) * 100 : 0;
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
                Etapa {timerState.currentStep + 1} de {totalSteps}
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
                        Total acumulado: <span className="font-semibold">{timerState.getCumulativeWaterAmount(timerState.currentStep)}ml</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-coffee-800 mb-2">
                    {timerState.formatOvertimeDisplay()}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-coffee-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>de {timerState.formatTime(currentStepData.duration)}</span>
                  </div>
                </div>

                <Progress value={timerState.isOvertime ? 100 : progress} className="h-2 sm:h-3" />

                {timerState.isOvertime && (
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
            <WaterPourAnimation 
              isPouring={timerState.isRunning && !timerState.isPaused} 
              currentAmount={Math.round(timerState.currentWaterAmount)}
              targetAmount={timerState.targetWaterAmount}
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <BrewingControls
        hasStarted={timerState.hasStarted}
        currentStep={timerState.currentStep}
        totalSteps={totalSteps}
        isRunning={timerState.isRunning}
        isPaused={timerState.isPaused}
        isStepCompleted={isStepCompleted}
        isLastStep={isLastStep}
        isOvertime={timerState.isOvertime}
        onStart={handleStartBrewing}
        onPause={timerState.handlePause}
        onNextStep={timerState.handleNextStep}
        onFinish={handleFinishBrewing}
      />

      {/* Steps Overview */}
      <StepsOverview
        recipe={recipe}
        currentStep={timerState.currentStep}
        completedSteps={timerState.completedSteps}
        getCumulativeWaterAmount={timerState.getCumulativeWaterAmount}
        formatTime={timerState.formatTime}
      />
    </div>
  );
};
