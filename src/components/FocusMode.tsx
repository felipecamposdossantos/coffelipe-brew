
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Eye, EyeOff, Timer, Droplets } from 'lucide-react';
import { Recipe } from '@/pages/Index';

interface FocusModeProps {
  recipe: Recipe;
  isActive: boolean;
  onToggle: () => void;
  currentStep: number;
  timeLeft: number;
  isRunning: boolean;
}

export const FocusMode = ({ recipe, isActive, onToggle, currentStep, timeLeft, isRunning }: FocusModeProps) => {
  const [breathingAnimation, setBreathingAnimation] = useState(false);

  useEffect(() => {
    if (isActive && isRunning) {
      const interval = setInterval(() => {
        setBreathingAnimation(prev => !prev);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive, isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = recipe.steps[currentStep];

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
    <div className="fixed inset-0 bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-900 z-50 flex items-center justify-center">
      {/* Botão para sair do modo foco */}
      <Button
        onClick={onToggle}
        variant="ghost"
        className="absolute top-4 right-4 text-coffee-200 hover:text-white hover:bg-coffee-700/50"
      >
        <EyeOff className="w-5 h-5" />
      </Button>

      {/* Conteúdo principal */}
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Ícone animado */}
        <div className="mb-8">
          <div 
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-coffee-600/20 border-4 border-coffee-400 transition-transform duration-2000 ${
              breathingAnimation ? 'scale-110' : 'scale-100'
            }`}
          >
            <Coffee className="w-16 h-16 text-coffee-200" />
          </div>
        </div>

        {/* Receita e etapa atual */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-coffee-100 mb-2">
            {recipe.name}
          </h1>
          <p className="text-coffee-300 text-lg">
            Etapa {currentStep + 1} de {recipe.steps.length}
          </p>
        </div>

        {/* Timer principal */}
        <div className="mb-8">
          <div className="text-6xl sm:text-8xl font-mono font-bold text-coffee-100 mb-4">
            {formatTime(timeLeft)}
          </div>
          {isRunning && (
            <div className="flex items-center justify-center gap-2 text-coffee-300">
              <Timer className="w-5 h-5 animate-pulse" />
              <span>Em andamento...</span>
            </div>
          )}
        </div>

        {/* Etapa atual */}
        <Card className="bg-coffee-800/50 border-coffee-600 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-coffee-100 mb-3">
              {currentStepData?.name}
            </h2>
            <p className="text-coffee-200 text-lg mb-4 leading-relaxed">
              {currentStepData?.instruction}
            </p>
            
            {/* Informações da etapa */}
            {currentStepData?.waterAmount && (
              <div className="flex items-center justify-center gap-2 text-coffee-300">
                <Droplets className="w-5 h-5" />
                <span>{currentStepData.waterAmount}ml de água</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progresso visual */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-2">
            {recipe.steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-coffee-400 animate-pulse'
                    : 'bg-coffee-700'
                }`}
              />
            ))}
          </div>
          <p className="text-coffee-400 text-sm mt-2">
            Progresso: {Math.round(((currentStep + 1) / recipe.steps.length) * 100)}%
          </p>
        </div>

        {/* Dica de respiração */}
        {isRunning && (
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
      </div>

      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-coffee-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-coffee-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-coffee-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
