
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coffee, Clock, CheckCircle, ArrowRight, Pause, Play, Square, Thermometer, Settings, FileText } from "lucide-react";
import { Recipe } from "@/pages/Index";

interface AutoBrewingProcessProps {
  recipe: Recipe;
  onComplete: () => void;
}

export const AutoBrewingProcess = ({ recipe, onComplete }: AutoBrewingProcessProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStep = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;
  const completedSteps = currentStepIndex;

  // Criar um beep de notificação usando Web Audio API
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Não foi possível reproduzir o som de notificação');
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const stopProcess = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onComplete();
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeRemaining(recipe.steps[nextIndex].duration);
      setIsRunning(true);
      setIsPaused(false);
      playNotificationSound();
    } else {
      setIsComplete(true);
      setIsRunning(false);
      playNotificationSound();
    }
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Tempo acabou, próximo passo automaticamente
            setTimeout(nextStep, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, currentStepIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentStep) return 0;
    return ((currentStep.duration - timeRemaining) / currentStep.duration) * 100;
  };

  const getOverallProgress = () => {
    const totalDuration = recipe.steps.reduce((acc, step) => acc + step.duration, 0);
    const completedDuration = recipe.steps
      .slice(0, currentStepIndex)
      .reduce((acc, step) => acc + step.duration, 0);
    const currentStepProgress = currentStep ? ((currentStep.duration - timeRemaining) / currentStep.duration) * currentStep.duration : 0;
    
    return ((completedDuration + currentStepProgress) / totalDuration) * 100;
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Preparo Concluído!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-coffee-700">
            Seu {recipe.name} está pronto! Aproveite seu café.
          </p>
          <Button 
            onClick={onComplete}
            className="bg-coffee-600 hover:bg-coffee-700"
          >
            Finalizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              {recipe.name}
            </span>
            <span className="text-sm text-coffee-600">
              Etapa {currentStepIndex + 1} de {totalSteps}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações da Receita */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-coffee-50 rounded-lg">
            <div className="text-center">
              <Coffee className="w-5 h-5 mx-auto mb-1 text-coffee-600" />
              <p className="text-sm font-medium">{recipe.coffeeRatio}g</p>
              <p className="text-xs text-coffee-600">Café</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <p className="text-sm font-medium">{recipe.waterRatio}ml</p>
              <p className="text-xs text-coffee-600">Água</p>
            </div>
            {recipe.waterTemperature && (
              <div className="text-center">
                <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-sm font-medium">{recipe.waterTemperature}°C</p>
                <p className="text-xs text-coffee-600">Temperatura</p>
              </div>
            )}
            {recipe.grinderBrand && recipe.grinderClicks && (
              <div className="text-center">
                <Settings className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-sm font-medium">{recipe.grinderClicks}</p>
                <p className="text-xs text-coffee-600">{recipe.grinderBrand}</p>
              </div>
            )}
          </div>

          {recipe.paperBrand && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">Papel: {recipe.paperBrand}</span>
            </div>
          )}

          {/* Progresso Geral */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-coffee-600">Progresso Geral</span>
              <span className="text-coffee-800">{Math.round(getOverallProgress())}%</span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
          </div>

          {/* Etapa Atual */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-coffee-800 mb-2">
                {currentStep?.name}
              </h3>
              <div className="text-4xl font-bold text-coffee-700 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <Progress value={getProgress()} className="h-3 mb-4" />
            </div>

            <div className="p-4 bg-cream-50 rounded-lg border border-coffee-200">
              <p className="text-coffee-800 text-center">
                {currentStep?.instruction}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3 justify-center">
            {!isRunning && !isPaused ? (
              <Button 
                onClick={startTimer}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            ) : isRunning ? (
              <Button 
                onClick={pauseTimer}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            ) : (
              <Button 
                onClick={startTimer}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            )}
            
            <Button 
              onClick={stopProcess}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Square className="w-4 h-4 mr-2" />
              Parar
            </Button>
          </div>

          {/* Próximas Etapas */}
          {currentStepIndex < totalSteps - 1 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-coffee-700 mb-3">Próximas etapas:</h4>
              <div className="space-y-2">
                {recipe.steps.slice(currentStepIndex + 1, currentStepIndex + 3).map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{step.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatTime(step.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
