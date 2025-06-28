
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Coffee, 
  Droplets,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Recipe } from "@/pages/Index";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { RecipeInfoDisplay } from "@/components/RecipeInfoDisplay";
import { BrewingControls } from "@/components/BrewingControls";
import { StepsOverview } from "@/components/StepsOverview";
import { useBrewingTimer } from "@/hooks/useBrewingTimer";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { toast } from "sonner";

interface AutoBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const AutoBrewingProcess = ({ recipe, onComplete }: AutoBrewingProcessProps) => {
  const {
    currentStep,
    timeLeft,
    isRunning,
    isPaused,
    completedSteps,
    currentWaterAmount,
    isOvertime,
    overtimeSeconds,
    countdown,
    hasStarted,
    targetWaterAmount,
    getCumulativeWaterAmount,
    formatTime,
    formatOvertimeDisplay,
    handleStart,
    handlePause,
    handleNextStep,
    setIsRunning,
    setIsOvertime,
    setCompletedSteps
  } = useBrewingTimer(recipe);

  const { addToBrewHistory } = useUserRecipes();

  const handleFinishRecipe = async () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setIsRunning(false);
    setIsOvertime(false);
    
    // Calculate total extraction time including overtime
    const totalExtractionTime = recipe.steps.reduce((total, step) => total + step.duration, 0) + overtimeSeconds;
    
    // Save to brew history with original recipe (no modifications to recipe object)
    await addToBrewHistory(recipe);
    
    const overtimeDisplay = overtimeSeconds > 0 ? ` (tempo total: ${formatTime(totalExtractionTime)})` : '';
    toast.success(`Receita Finalizada! ${recipe.name} foi salva no seu histórico ☕${overtimeDisplay}`);
    
    onComplete();
  };

  const handleBack = () => {
    onComplete();
  };

  const currentStepData = recipe.steps[currentStep];
  const progress = currentStepData && !isOvertime ? 
    ((currentStepData.duration - timeLeft) / currentStepData.duration) * 100 : 
    100;
  const overallProgress = ((currentStep + (completedSteps.includes(currentStep) ? 1 : progress / 100)) / recipe.steps.length) * 100;
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
      <RecipeInfoDisplay recipe={recipe} />

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-coffee-600">Progresso Geral</span>
              <span className="text-coffee-600">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-center text-sm text-coffee-600">
              Etapa {currentStep + 1} de {recipe.steps.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countdown Display */}
      {countdown > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {countdown}
            </div>
            <p className="text-yellow-700">
              Próxima etapa iniciando em...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Water Animation */}
      {currentStepData?.waterAmount && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-coffee-800 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              {currentStepData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <WaterPourAnimation 
              isPouring={isRunning && !isPaused}
              currentAmount={Math.round(currentWaterAmount)}
              targetAmount={targetWaterAmount}
            />
            <div className="text-xs sm:text-sm text-coffee-600 text-center">
              {currentStepData.waterAmount && (
                <span>
                  Adicionar: <strong>{currentStepData.waterAmount}ml</strong> • 
                  Total acumulado: <strong>{targetWaterAmount}ml</strong>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <Card className={`bg-white shadow-lg ${isOvertime ? 'border-orange-300' : ''}`}>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-coffee-800">{currentStepData?.name}</span>
            <div className="flex items-center gap-2">
              {isOvertime && isLastStep && (
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              )}
              {isStepCompleted && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`text-3xl sm:text-5xl font-mono font-bold mb-4 ${
              isOvertime ? 'text-orange-600' : 'text-coffee-700'
            }`}>
              {formatOvertimeDisplay()}
            </div>
            
            {isOvertime && isLastStep && (
              <div className="text-orange-600 text-sm mb-2 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Tempo excedido - Cronômetro em execução
              </div>
            )}
            
            {!isOvertime && (
              <Progress value={progress} className="h-2 sm:h-3 mb-4" />
            )}
          </div>

          {/* Instruction */}
          <div className="bg-cream-50 p-3 sm:p-4 rounded-lg border border-cream-200">
            <p className="text-coffee-700 leading-relaxed text-sm sm:text-base">
              {currentStepData?.instruction}
            </p>
          </div>

          {/* Controls */}
          <BrewingControls
            hasStarted={hasStarted}
            currentStep={currentStep}
            totalSteps={recipe.steps.length}
            isRunning={isRunning}
            isPaused={isPaused}
            isStepCompleted={isStepCompleted}
            isLastStep={isLastStep}
            isOvertime={isOvertime}
            onStart={handleStart}
            onPause={handlePause}
            onNextStep={handleNextStep}
            onFinish={handleFinishRecipe}
          />
        </CardContent>
      </Card>

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
