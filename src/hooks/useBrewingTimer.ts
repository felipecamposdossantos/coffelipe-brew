
import { useState, useEffect } from "react";
import { Recipe } from "@/pages/Index";
import { toast } from "sonner";
import { useWakeLock } from "./useWakeLock";
import { useTimerLogic } from "./useTimerLogic";
import { usePWANotifications } from "./usePWANotifications";
import { useUserRecipes } from "./useUserRecipes";
import { useHapticFeedback } from "./useHapticFeedback";
import { showEnhancedToast } from "@/components/ui/enhanced-toast";

export const useBrewingTimer = (recipe: Recipe) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { showTimerNotification } = usePWANotifications();
  const { addToBrewHistory } = useUserRecipes();
  const { impactFeedback } = useHapticFeedback();
  const {
    timeLeft,
    isRunning,
    isPaused,
    isOvertime,
    overtimeSeconds,
    setIsRunning,
    setIsPaused,
    setIsOvertime,
    setOvertimeSeconds
  } = useTimerLogic(recipe, currentStep, setCurrentStep, setCompletedSteps);

  const getCumulativeWaterAmount = (stepIndex: number) => {
    return recipe.steps.slice(0, stepIndex + 1).reduce((total, step) => {
      return total + (step.waterAmount || 0);
    }, 0);
  };

  const targetWaterAmount = getCumulativeWaterAmount(currentStep);

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

  // Enhanced notifications with better UX
  useEffect(() => {
    if (completedSteps.length > 0) {
      const lastCompletedStep = Math.max(...completedSteps);
      const stepName = recipe.steps[lastCompletedStep]?.name;
      if (stepName) {
        showTimerNotification(stepName, true);
        impactFeedback('success');
      }
    }
  }, [completedSteps, recipe.steps, showTimerNotification, impactFeedback]);

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
    
    // Enhanced toast notification
    showEnhancedToast({
      title: `Receita Iniciada: ${recipe.steps[0]?.name}`,
      description: 'Cronômetro iniciado com sucesso',
      variant: 'info'
    });
    
    impactFeedback('medium');
    showTimerNotification(recipe.steps[0]?.name, false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    
    // Enhanced toast notification
    showEnhancedToast({
      title: isPaused ? "Cronômetro retomado" : "Cronômetro pausado",
      variant: 'info'
    });
    
    impactFeedback('light');
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
      impactFeedback('medium');
      
      // Show notification for next step
      const nextStepName = recipe.steps[currentStep + 1]?.name;
      if (nextStepName) {
        showTimerNotification(nextStepName, false);
      }
    }
  };

  const handleFinish = async () => {
    setIsRunning(false);
    await releaseWakeLock();
    impactFeedback('success');
    
    // Passar a receita completa para o histórico
    try {
      await addToBrewHistory(recipe);
      
      showEnhancedToast({
        title: 'Preparo finalizado!',
        description: 'Adicionado ao histórico com sucesso',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar no histórico:', error);
      showEnhancedToast({
        title: 'Preparo finalizado!',
        description: 'Erro ao salvar no histórico, mas o preparo foi concluído',
        variant: 'default'
      });
    }
  };

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
    setCompletedSteps,
    setCurrentStep
  };
};
