
import { useState, useEffect, useRef } from "react";
import { Recipe } from "@/pages/Index";
import { toast } from "sonner";

export const useTimerLogic = (recipe: Recipe, currentStep: number, setCurrentStep: (step: number) => void, setCompletedSteps: (fn: (prev: number[]) => number[]) => void) => {
  const [timeLeft, setTimeLeft] = useState(recipe.steps[0]?.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(recipe.steps[currentStep]?.duration || 0);
    setIsOvertime(false);
    setOvertimeSeconds(0);
  }, [currentStep, recipe.steps]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!isOvertime) {
              setCompletedSteps(prevCompleted => [...prevCompleted, currentStep]);
              toast.success(`Etapa Concluída: ${recipe.steps[currentStep]?.name}`);

              if (currentStep === recipe.steps.length - 1) {
                setIsOvertime(true);
                setOvertimeSeconds(0);
                return 0;
              } else {
                setCurrentStep(currentStep + 1);
                toast.info(`Próxima Etapa: ${recipe.steps[currentStep + 1]?.name}`);
                return recipe.steps[currentStep + 1]?.duration || 0;
              }
            } else {
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
  }, [isRunning, isPaused, timeLeft, currentStep, isOvertime, recipe.steps, setCurrentStep, setCompletedSteps]);

  return {
    timeLeft,
    isRunning,
    isPaused,
    isOvertime,
    overtimeSeconds,
    setIsRunning,
    setIsPaused,
    setIsOvertime,
    setOvertimeSeconds
  };
};
