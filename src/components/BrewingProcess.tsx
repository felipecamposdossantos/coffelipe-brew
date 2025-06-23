
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
  CheckCircle
} from "lucide-react";
import { Recipe } from "@/pages/Index";

interface BrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const BrewingProcess = ({ recipe, onComplete }: BrewingProcessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(recipe.steps[currentStep]?.duration || 0);
  }, [currentStep, recipe.steps]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompletedSteps(prev => [...prev, currentStep]);
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
  }, [isRunning, timeLeft, currentStep]);

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
    } else {
      // All steps completed
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="text-coffee-600 hover:bg-coffee-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-coffee-800">{recipe.name}</h1>
        <div className="w-20"> {/* Spacer */}</div>
      </div>

      {/* Recipe Info */}
      <Card className="bg-coffee-50 border-coffee-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-coffee-600" />
              <span className="font-medium">{recipe.coffeeRatio}g café</span>
            </div>
            <div className="text-coffee-400 text-2xl">:</div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{recipe.waterRatio}ml água</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
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

      {/* Current Step */}
      {!isAllCompleted && (
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-coffee-800">{currentStepData?.name}</span>
              {isStepCompleted && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-5xl font-mono font-bold text-coffee-700 mb-4">
                {formatTime(timeLeft)}
              </div>
              <Progress value={progress} className="h-3 mb-4" />
            </div>

            {/* Instruction */}
            <div className="bg-cream-50 p-4 rounded-lg border border-cream-200">
              <p className="text-coffee-700 leading-relaxed">
                {currentStepData?.instruction}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
              {!isStepCompleted && !isRunning && timeLeft > 0 && (
                <Button 
                  onClick={handleStart}
                  className="bg-coffee-600 hover:bg-coffee-700 text-white"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              )}
              
              {!isStepCompleted && isRunning && (
                <Button 
                  onClick={handlePause}
                  variant="outline"
                  className="border-coffee-600 text-coffee-600 hover:bg-coffee-50"
                  size="lg"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              )}

              {(isStepCompleted || timeLeft === 0) && currentStep < recipe.steps.length - 1 && (
                <Button 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Próxima Etapa
                </Button>
              )}

              {(isStepCompleted || timeLeft === 0) && currentStep === recipe.steps.length - 1 && (
                <Button 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
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
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-800">
              Café Pronto! ☕
            </h3>
            <p className="text-green-700">
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
        <CardHeader>
          <CardTitle className="text-coffee-800">Todas as Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recipe.steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  index === currentStep 
                    ? 'bg-coffee-100 border-coffee-300' 
                    : completedSteps.includes(index)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-coffee-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {completedSteps.includes(index) ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-coffee-800">{step.name}</div>
                  <div className="text-sm text-coffee-600">
                    {formatTime(step.duration)}
                  </div>
                </div>
                {index === currentStep && (
                  <Badge className="bg-coffee-600 text-white">
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
