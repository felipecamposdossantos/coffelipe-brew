
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Eye, EyeOff, Timer, Droplets, Play, Pause, SkipForward, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Recipe } from '@/pages/Index';
import { Progress } from '@/components/ui/progress';

interface FocusModeProps {
  recipe: Recipe;
  isActive: boolean;
  onToggle: () => void;
  timerState: any; // Timer state from useBrewingTimer
}

export const FocusMode = ({ recipe, isActive, onToggle, timerState }: FocusModeProps) => {
  const [breathingAnimation, setBreathingAnimation] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isActive) return;
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isActive, timerState.currentStep, timerState.isRunning, timerState.isPaused]);

  // Breathing animation when timer is running
  useEffect(() => {
    if (isActive && timerState.isRunning && !timerState.isPaused) {
      const interval = setInterval(() => {
        setBreathingAnimation(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, timerState.isRunning, timerState.isPaused]);

  const handleScreenTap = () => {
    if (!isActive) return;
    
    // Show controls temporarily
    setShowControls(true);
    
    // If timer is running, toggle pause/resume
    if (timerState.hasStarted) {
      timerState.handlePause();
    }
  };

  const handleStart = () => {
    timerState.handleStart();
    setShowControls(false);
  };

  const handleNextStep = () => {
    timerState.handleNextStep();
    setShowControls(false);
  };

  const handleFinish = () => {
    timerState.handleFinish();
  };

  const currentStepData = recipe.steps[timerState.currentStep];
  const progress = currentStepData ? ((currentStepData.duration - timerState.timeLeft) / currentStepData.duration) * 100 : 0;
  const overallProgress = ((timerState.currentStep + 1) / recipe.steps.length) * 100;
  const isStepCompleted = timerState.completedSteps.includes(timerState.currentStep);
  const isLastStep = timerState.currentStep === recipe.steps.length - 1;

  if (!isActive) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="bg-coffee-600 hover:bg-coffee-700 text-white rounded-full p-3 shadow-lg"
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-900 z-50 flex items-center justify-center cursor-pointer"
      onClick={handleScreenTap}
    >
      {/* Header with controls - only show when showControls is true */}
      <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          variant="ghost"
          className="text-coffee-200 hover:text-white hover:bg-coffee-700/50"
        >
          <EyeOff className="w-5 h-5 mr-2" />
          Sair do Foco
        </Button>
        
        <div className="flex items-center gap-2 text-coffee-200">
          <span className="text-sm">Toque na tela para pausar</span>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center max-w-2xl mx-auto px-6" onClick={(e) => e.stopPropagation()}>
        {/* Animated coffee icon */}
        <div className="mb-8">
          <div 
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-coffee-600/20 border-4 border-coffee-400 transition-transform duration-2000 ${
              breathingAnimation ? 'scale-110' : 'scale-100'
            }`}
          >
            <Coffee className="w-16 h-16 text-coffee-200" />
          </div>
        </div>

        {/* Recipe and current step */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-coffee-100 mb-2">
            {recipe.name}
          </h1>
          <p className="text-coffee-300 text-lg">
            Etapa {timerState.currentStep + 1} de {recipe.steps.length}
          </p>
        </div>

        {/* Main timer display */}
        <div className="mb-8">
          <div className="text-6xl sm:text-8xl font-mono font-bold text-coffee-100 mb-4">
            {timerState.formatOvertimeDisplay()}
          </div>
          <div className="flex items-center justify-center gap-2 text-coffee-300">
            <Timer className={`w-5 h-5 ${timerState.isRunning && !timerState.isPaused ? 'animate-pulse' : ''}`} />
            <span>
              {timerState.isRunning && !timerState.isPaused ? 'Em andamento...' : 
               timerState.isPaused ? 'Pausado' : 
               timerState.isOvertime ? 'Tempo extra!' : 'Pronto para iniciar'}
            </span>
          </div>
        </div>

        {/* Current step progress */}
        <div className="mb-6">
          <Progress 
            value={timerState.isOvertime ? 100 : progress} 
            className="h-3 mb-2" 
          />
          <div className="text-coffee-400 text-sm">
            Progresso da etapa atual: {Math.round(timerState.isOvertime ? 100 : progress)}%
          </div>
        </div>

        {/* Current step info */}
        {currentStepData && (
          <Card className="bg-coffee-800/50 border-coffee-600 backdrop-blur-sm mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-coffee-100 mb-3">
                {currentStepData.name}
              </h2>
              <p className="text-coffee-200 text-lg mb-4 leading-relaxed">
                {currentStepData.instruction}
              </p>
              
              {currentStepData.waterAmount && (
                <div className="flex items-center justify-center gap-2 text-coffee-300">
                  <Droplets className="w-5 h-5" />
                  <span>{currentStepData.waterAmount}ml de água</span>
                  <span className="text-coffee-400">
                    • Total: {timerState.getCumulativeWaterAmount(timerState.currentStep)}ml
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Control buttons - show when controls are visible or when user needs to take action */}
        <div className={`flex justify-center gap-4 flex-wrap mb-6 transition-opacity duration-300 ${showControls || !timerState.hasStarted || timerState.isOvertime ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Start button */}
          {!timerState.hasStarted && (
            <Button 
              onClick={handleStart}
              className="bg-coffee-600 hover:bg-coffee-700 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar
            </Button>
          )}

          {/* Pause/Resume button */}
          {timerState.hasStarted && !timerState.isOvertime && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                timerState.handlePause();
              }}
              variant="outline"
              className="border-coffee-400 text-coffee-100 hover:bg-coffee-700/50"
              size="lg"
            >
              {timerState.isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
              {timerState.isPaused ? 'Retomar' : 'Pausar'}
            </Button>
          )}

          {/* Skip step button */}
          {timerState.hasStarted && !isLastStep && !isStepCompleted && (
            <Button 
              onClick={handleNextStep}
              variant="outline"
              className="border-coffee-400 text-coffee-100 hover:bg-coffee-700/50"
              size="lg"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Pular Etapa
            </Button>
          )}

          {/* Finish button */}
          {isLastStep && (isStepCompleted || timerState.isOvertime) && (
            <Button 
              onClick={handleFinish}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Finalizar
            </Button>
          )}
        </div>

        {/* Overall progress indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {recipe.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  timerState.completedSteps.includes(index)
                    ? 'bg-green-500'
                    : index === timerState.currentStep
                    ? 'bg-coffee-400 animate-pulse'
                    : 'bg-coffee-700'
                }`}
              />
            ))}
          </div>
          <p className="text-coffee-400 text-sm">
            Progresso geral: {Math.round(overallProgress)}%
          </p>
        </div>

        {/* Breathing guidance */}
        {timerState.isRunning && !timerState.isPaused && (
          <div className="mt-12">
            <div className={`text-coffee-300 transition-opacity duration-2000 ${
              breathingAnimation ? 'opacity-100' : 'opacity-50'
            }`}>
              <p className="text-sm">
                {breathingAnimation ? '🫁 Inspire...' : '💨 Expire...'}
              </p>
              <p className="text-xs mt-1">Respire com calma enquanto o café prepara</p>
            </div>
          </div>
        )}

        {/* Instructions when paused or overtime */}
        {timerState.isPaused && (
          <div className="mt-6 text-coffee-300 text-sm">
            <p>Timer pausado - toque na tela para retomar</p>
          </div>
        )}

        {timerState.isOvertime && (
          <div className="mt-6 text-orange-300 text-sm animate-pulse">
            <p>⏰ Tempo extra! Você pode finalizar quando quiser</p>
          </div>
        )}
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-coffee-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-coffee-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-coffee-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
