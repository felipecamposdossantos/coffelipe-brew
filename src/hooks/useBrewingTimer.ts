import { useState, useEffect } from "react";
import { Recipe } from "@/pages/Index";
import { toast } from "sonner";
import { useWakeLock } from "./useWakeLock";
import { useTimerLogic } from "./useTimerLogic";
import { usePWANotifications } from "./usePWANotifications";
import { useUserRecipes } from "./useUserRecipes";
import { useAchievements } from "./useAchievements";

export const useBrewingTimer = (recipe: Recipe) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWaterAmount, setCurrentWaterAmount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { showTimerNotification } = usePWANotifications();
  const { addToBrewHistory } = useUserRecipes();
  const { checkAndUnlockAchievements } = useAchievements();
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

  // Show notification when step completes
  useEffect(() => {
    if (completedSteps.length > 0) {
      const lastCompletedStep = Math.max(...completedSteps);
      const stepName = recipe.steps[lastCompletedStep]?.name;
      if (stepName) {
        showTimerNotification(stepName, true);
      }
    }
  }, [completedSteps, recipe.steps, showTimerNotification]);

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
    
    // Show notification when starting
    showTimerNotification(recipe.steps[0]?.name, false);
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
    
    // Adicionar ao histórico quando finalizar
    await addToBrewHistory({
      recipe_id: recipe.id,
      recipe_name: recipe.name,
      coffee_ratio: recipe.coffeeRatio,
      water_ratio: recipe.waterRatio,
      water_temperature: recipe.waterTemperature,
      grinder_brand: recipe.grinderBrand,
      grinder_clicks: recipe.grinderClicks,
      paper_brand: recipe.paperBrand,
      coffee_bean_id: recipe.coffeeBeanId
    });
    
    // Verificar e desbloquear conquistas
    setTimeout(() => {
      checkAndUnlockAchievements();
    }, 1000);
    
    toast.success('Preparo finalizado! Adicionado ao histórico.');
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
    setCompletedSteps
  };
};
