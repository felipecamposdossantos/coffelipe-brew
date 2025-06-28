import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  ArrowLeft, 
  Coffee, 
  Droplets,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Recipe } from "@/pages/Index";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { toast } from "sonner";

interface AutoBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const AutoBrewingProcess = ({ recipe, onComplete }: AutoBrewingProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToBrewHistory } = useUserRecipes();

  useEffect(() => {
    setTimeLeft(recipe.steps[currentStep]?.duration || 0);
    setIsOvertime(false);
    setOvertimeSeconds(0);
  }, [currentStep, recipe.steps]);

  // Calculate cumulative water amounts
  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const targetWaterAmount = getCumulativeWaterAmount(currentStep);

  // Main timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Step completed
            if (!isOvertime) {
              setCompletedSteps(prevCompleted => [...prevCompleted, currentStep]);
              setCurrentWaterAmount(targetWaterAmount);
              
              // Show step completion notification
              toast.success(`Etapa Concluída: ${recipe.steps[currentStep]?.name}`);

              // Check if it's the last step
              if (currentStep === recipe.steps.length - 1) {
                // For last step, enter overtime mode but keep running
                setIsOvertime(true);
                setOvertimeSeconds(0);
                return 0;
              }

              // Auto-progress to next step (only after first step)
              if (hasStarted) {
                setCountdown(3);
                setIsRunning(false);
                
                // Countdown for next step
                let countdownValue = 3;
                const countdownInterval = setInterval(() => {
                  countdownValue--;
                  setCountdown(countdownValue);
                  
                  if (countdownValue <= 0) {
                    clearInterval(countdownInterval);
                    setCurrentStep(currentStep + 1);
                    setIsRunning(true);
                    setCountdown(0);
                    
                    toast.info(`Próxima Etapa: ${recipe.steps[currentStep + 1]?.name}`);
                  }
                }, 1000);
                
                return 0;
              } else {
                setIsRunning(false);
                return 0;
              }
            } else {
              // Continue overtime
              setOvertimeSeconds(prev => prev + 1);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, currentStep, targetWaterAmount, isOvertime, hasStarted]);

  // Update water amount during pouring
  useEffect(() => {
    if (isRunning && !isPaused && currentStep < recipe.steps.length) {
      const stepDuration = recipe.steps[currentStep]?.duration || 1;
      const stepWaterAmount = recipe.steps[currentStep]?.waterAmount || 0;
      const previousWaterAmount = getCumulativeWaterAmount(currentStep - 1);
      
      if (!isOvertime) {
        const progress = Math.min(1, (stepDuration - timeLeft) / stepDuration);
        const currentStepWater = stepWaterAmount * progress;
        setCurrentWaterAmount(previousWaterAmount + currentStepWater);
      }
    }
  }, [timeLeft, isRunning, isPaused, currentStep, recipe.steps, isOvertime]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatOvertimeDisplay = () => {
    if (isOvertime && currentStep === recipe.steps.length - 1) {
      return `+${formatTime(overtimeSeconds)}`;
    }
    return formatTime(timeLeft);
  };

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
    toast.success(`Receita Iniciada: ${recipe.steps[0]?.name}`);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Cronômetro retomado" : "Cronômetro pausado");
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      setIsRunning(true);
      setIsPaused(false);
      setIsOvertime(false);
      setOvertimeSeconds(0);
      setCurrentWaterAmount(getCumulativeWaterAmount(currentStep));
    }
  };

  const handleFinishRecipe = async () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setIsRunning(false);
    setIsOvertime(false);
    
    // Calculate total extraction time including overtime
    const totalExtractionTime = recipe.steps.reduce((total, step) => total + step.duration, 0) + overtimeSeconds;
    
    // Save to brew history with total time
    await addToBrewHistory({
      ...recipe,
      extractionTime: totalExtractionTime
    });
    
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
          <div className="flex justify-center gap-2 flex-wrap">
            {/* Start button (only for first step if not started) */}
            {!hasStarted && currentStep === 0 && (
              <Button 
                onClick={handleStart}
                className="bg-coffee-600 hover:bg-coffee-700 text-white"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Primeira Etapa
              </Button>
            )}

            {/* Pause/Resume button */}
            {isRunning && (
              <Button 
                onClick={handlePause}
                variant="outline"
                className="border-coffee-600 text-coffee-600 hover:bg-coffee-50"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? 'Retomar' : 'Pausar'}
              </Button>
            )}

            {/* Skip step button */}
            {hasStarted && !isStepCompleted && !isLastStep && (
              <Button 
                onClick={handleNextStep}
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
                size="sm"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Pular Etapa
              </Button>
            )}

            {/* Finish recipe button (last step - show when completed OR in overtime) */}
            {isLastStep && (isStepCompleted || isOvertime) && (
              <Button 
                onClick={handleFinishRecipe}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar e Salvar
              </Button>
            )}
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
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-sm ${
                  index === currentStep 
                    ? 'bg-coffee-100 border-coffee-300' 
                    : completedSteps.includes(index)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
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
                      <span>• <strong>{step.waterAmount}ml</strong> (Total: <strong>{getCumulativeWaterAmount(index)}ml</strong>)</span>
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
