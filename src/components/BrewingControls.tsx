
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, CheckCircle } from "lucide-react";

interface BrewingControlsProps {
  hasStarted: boolean;
  currentStep: number;
  totalSteps: number;
  isRunning: boolean;
  isPaused: boolean;
  isStepCompleted: boolean;
  isLastStep: boolean;
  isOvertime: boolean;
  onStart: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onFinish: () => void;
}

export const BrewingControls = ({
  hasStarted,
  currentStep,
  totalSteps,
  isRunning,
  isPaused,
  isStepCompleted,
  isLastStep,
  isOvertime,
  onStart,
  onPause,
  onNextStep,
  onFinish
}: BrewingControlsProps) => {
  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {/* Start button (only for first step if not started) */}
      {!hasStarted && currentStep === 0 && (
        <Button 
          onClick={onStart}
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
          onClick={onPause}
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
          onClick={onNextStep}
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
          onClick={onFinish}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Finalizar e Salvar
        </Button>
      )}
    </div>
  );
};
