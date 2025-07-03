
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
  Settings,
  Thermometer,
  FileText
} from "lucide-react";
import { Recipe } from "@/pages/Index";
import { WaterPourAnimation } from "@/components/WaterPourAnimation";
import { RecipeSettings } from "@/components/RecipeSettings";

interface BrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const BrewingProcess = ({ recipe, onComplete }: BrewingProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(recipe.steps[currentStep]?.duration || 0);
  }, [currentStep, recipe.steps]);

  // Calculate cumulative water amounts
  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const targetWaterAmount = getCumulativeWaterAmount(currentStep);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompletedSteps(prev => [...prev, currentStep]);
            setCurrentWaterAmount(targetWaterAmount);
            return 0;
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
  }, [isRunning, timeLeft, currentStep, targetWaterAmount]);

  // Update water amount during pouring
  useEffect(() => {
    if (isRunning && currentStep < recipe.steps.length) {
      const stepDuration = recipe.steps[currentStep]?.duration || 1;
      const stepWaterAmount = recipe.steps[currentStep]?.waterAmount || 0;
      const previousWaterAmount = getCumulativeWaterAmount(currentStep - 1);
      
      const progress = (stepDuration - timeLeft) / stepDuration;
      const currentStepWater = stepWaterAmount * progress;
      setCurrentWaterAmount(previousWaterAmount + currentStepWater);
    }
  }, [timeLeft, isRunning, currentStep, recipe.steps]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setIsRunning(false);
      setCurrentStep(currentStep + 1);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      setCurrentWaterAmount(getCumulativeWaterAmount(currentStep));
    } else {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handleBack = () => {
    onComplete();
  };

  const currentStepData = recipe.steps[currentStep];
  const progress = currentStepData ? ((currentStepData.duration - timeLeft) / currentStepData.duration) * 100 : 0;
  const overallProgress = ((currentStep + (completedSteps.includes(currentStep) ? 1 : progress / 100)) / recipe.steps.length) * 100;
  const isStepCompleted = completedSteps.includes(currentStep);
  const isAllCompleted = completedSteps.length === recipe.steps.length;

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

      {/* Overall Progress */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-coffee-600 dark:text-coffee-300">Progresso Geral</span>
              <span className="text-coffee-600 dark:text-coffee-300">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-center text-sm text-coffee-600 dark:text-coffee-300">
              Etapa {currentStep + 1} de {recipe.steps.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Animation */}
      {!isAllCompleted && currentStepData?.waterAmount && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-coffee-800 dark:text-coffee-200">
              Quantidade de Água - {currentStepData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <WaterPourAnimation 
              isPouring={isRunning}
              currentAmount={Math.round(currentWaterAmount)}
              targetAmount={targetWaterAmount}
            />
            <div className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 text-center">
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
      {!isAllCompleted && (
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
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="h-2 sm:h-3 mb-4" />
            </div>

            {/* Instruction */}
            <div className="bg-cream-50 dark:bg-coffee-900 p-3 sm:p-4 rounded-lg border border-cream-200 dark:border-coffee-700">
              <p className="text-coffee-700 dark:text-coffee-300 leading-relaxed text-sm sm:text-base">
                {currentStepData?.instruction}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2 flex-wrap">
              {!isStepCompleted && !isRunning && timeLeft > 0 && (
                <Button 
                  onClick={handleStart}
                  className="bg-coffee-600 hover:bg-coffee-700 text-white dark:bg-coffee-700 dark:hover:bg-coffee-600"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              )}
              
              {!isStepCompleted && isRunning && (
                <Button 
                  onClick={handlePause}
                  variant="outline"
                  className="border-coffee-600 text-coffee-600 hover:bg-coffee-50 dark:border-coffee-400 dark:text-coffee-400 dark:hover:bg-coffee-800"
                  size="sm"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              )}

              {(isStepCompleted || timeLeft === 0) && currentStep < recipe.steps.length - 1 && (
                <Button 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Próxima
                </Button>
              )}

              {(isStepCompleted || timeLeft === 0) && currentStep === recipe.steps.length - 1 && (
                <Button 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {isAllCompleted && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-200">
              Café Pronto! ☕
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm sm:text-base">
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
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-sm sm:text-base text-coffee-800 dark:text-coffee-200">Todas as Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {recipe.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border text-sm ${
                  index === currentStep 
                    ? 'bg-coffee-100 border-coffee-300 dark:bg-coffee-800 dark:border-coffee-600' 
                    : completedSteps.includes(index)
                    ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-coffee-600 text-white dark:bg-coffee-700'
                    : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-coffee-800 dark:text-coffee-200 truncate">{step.name}</div>
                  <div className="text-xs sm:text-sm text-coffee-600 dark:text-coffee-400 flex flex-wrap gap-2">
                    <span>{formatTime(step.duration)}</span>
                    {step.waterAmount && (
                      <span>• {step.waterAmount}ml (Total: {getCumulativeWaterAmount(index)}ml)</span>
                    )}
                  </div>
                </div>
                {index === currentStep && (
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
