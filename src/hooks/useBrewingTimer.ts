
import { useState, useEffect, useRef } from "react";
import { Recipe } from "@/pages/Index";
import { toast } from "sonner";

export const useBrewingTimer = (recipe: Recipe) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Calculate cumulative water amounts
  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const targetWaterAmount = getCumulativeWaterAmount(currentStep);

  // Wake Lock para manter a tela ligada
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('Wake lock ativado - tela permanecerá ligada');
      }
    } catch (err) {
      console.log('Wake lock não suportado ou falhou:', err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake lock liberado');
      } catch (err) {
        console.log('Erro ao liberar wake lock:', err);
      }
    }
  };

  useEffect(() => {
    setTimeLeft(recipe.steps[currentStep]?.duration || 0);
    setIsOvertime(false);
    setOvertimeSeconds(0);
  }, [currentStep, recipe.steps]);

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
                // For last step, enter overtime mode and keep running
                setIsOvertime(true);
                setOvertimeSeconds(0);
                return 0;
              } else {
                // Auto-progress to next step immediately (removed countdown)
                setCurrentStep(currentStep + 1);
                toast.info(`Próxima Etapa: ${recipe.steps[currentStep + 1]?.name}`);
                return recipe.steps[currentStep + 1]?.duration || 0;
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
  }, [isRunning, isPaused, timeLeft, currentStep, targetWaterAmount, isOvertime]);

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

  const handleStart = async () => {
    setIsRunning(true);
    setHasStarted(true);
    await requestWakeLock();
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

  const handleFinish = async () => {
    setIsRunning(false);
    await releaseWakeLock();
  };

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return {
    currentStep,
    timeLeft,
    isRunning,
    isPaused,
    completedSteps,
    currentWaterAmount,
    isOvertime,
    overtimeSeconds,
    hasStarted,
    targetWaterAmount,
    getCumulativeWaterAmount,
    formatTime,
    formatOvertimeDisplay,
    handleStart,
    handlePause,
    handleNextStep,
    handleFinish,
    setIsRunning,
    setIsOvertime,
    setCompletedSteps
  };
};
