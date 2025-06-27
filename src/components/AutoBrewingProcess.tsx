
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
import { useToast } from "@/hooks/use-toast";

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
  const [autoProgressEnabled, setAutoProgressEnabled] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToBrewHistory } = useUserRecipes();
  const { toast } = useToast();

  // Auto-start first step
  useEffect(() => {
    if (currentStep === 0 && !isRunning && !isPaused) {
      setTimeout(() => {
        setIsRunning(true);
        toast({
          title: "Receita Iniciada!",
          description: `Começando: ${recipe.steps[0]?.name}`,
        });
      }, 1000);
    }
  }, []);

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
              toast({
                title: "Etapa Concluída!",
                description: `${recipe.steps[currentStep]?.name} finalizada`,
              });

              // Check if it's the last step
              if (currentStep === recipe.steps.length - 1) {
                setIsRunning(false);
                return 0;
              }

              // Auto-progress to next step if enabled
              if (autoProgressEnabled) {
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
                    
                    toast({
                      title: "Próxima Etapa",
                      description: `Iniciando: ${recipe.steps[currentStep + 1]?.name}`,
                    });
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
  }, [isRunning, isPaused, timeLeft, currentStep, targetWaterAmount, isOvertime, autoProgressEnabled]);

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

  // Handle overtime
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !completedSteps.includes(currentStep)) {
      setIsOvertime(true);
    }
  }, [timeLeft, isRunning, currentStep, completedSteps]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatOvertimeDisplay = () => {
    if (isOvertime) {
      return `+${formatTime(overtimeSeconds)}`;
    }
    return formatTime(timeLeft);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      toast({
        title: "Pausado",
        description: "Cronômetro pausado",
      });
    } else {
      toast({
        title: "Retomado",
        description: "Cronômetro retomado",
      });
    }
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

  const handleFinishRecipe = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setIsRunning(false);
    addToBrewHistory(recipe);
    
    toast({
      title: "Receita Finalizada! ☕",
      description: `${recipe.name} foi salva no seu histórico`,
    });
    
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
  const isAllCompleted = completedSteps.length === recipe.steps.length;
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
      {!isAllCompleted && currentStepData?.waterAmount && (
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
      {!isAllCompleted && (
        <Card className={`bg-white shadow-lg ${isOvertime ? 'border-orange-300' : ''}`}>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-coffee-800">{currentStepData?.name}</span>
              <div className="flex items-center gap-2">
                {isOvertime && (
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
              
              {isOvertime && (
                <div className="text-orange-600 text-sm mb-2 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tempo excedido
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
              {/* Pause/Resume button */}
              {isRunning && !isStepCompleted && (
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
              {!isStepCompleted && !isLastStep && (
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

              {/* Next step button (after completion or overtime) */}
              {(isStepCompleted || isOvertime) && !isLastStep && (
                <Button 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Próxima Etapa
                </Button>
              )}

              {/* Finish recipe button (last step) */}
              {(isStepCompleted || isOvertime || timeLeft === 0) && isLastStep && (
                <Button 
                  onClick={handleFinishRecipe}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar Receita
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {isAllCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-800">
              Café Pronto! ☕
            </h3>
            <p className="text-green-700 text-sm sm:text-base">
              Seu {recipe.name} está pronto para ser degustado. 
              Aproveite o aroma e o sabor do café perfeitamente preparado!
            </p>
            <Button 
              onClick={onComplete}
              className="bg-coffee-600 hover:bg-coffee-700 text-white"
            >
              Fazer Outro Café
            </Button>
          </CardContent>
        </Card>
      )}

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

      {/* Auto-progress toggle */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-coffee-700">Progressão Automática</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoProgressEnabled(!autoProgressEnabled)}
              className={autoProgressEnabled ? 'bg-green-50 border-green-300' : ''}
            >
              {autoProgressEnabled ? 'Ativada' : 'Desativada'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
