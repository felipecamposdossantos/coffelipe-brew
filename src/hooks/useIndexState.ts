
import { useState, useEffect } from "react";
import { Recipe } from "@/pages/Index";

export const useIndexState = (user: any, loading: boolean) => {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [brewingMode, setBrewingMode] = useState<'auto' | 'manual' | 'expert'>('auto');
  const [activeTab, setActiveTab] = useState("recipes");
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);

  // Set default tab based on authentication status
  useEffect(() => {
    if (!loading) {
      if (user) {
        setActiveTab("dashboard");
      } else {
        setActiveTab("recipes");
      }
    }
  }, [user, loading]);

  return {
    currentRecipe,
    setCurrentRecipe,
    brewingMode,
    setBrewingMode,
    activeTab,
    setActiveTab,
    focusModeActive,
    setFocusModeActive,
    showPerformanceMonitor,
    setShowPerformanceMonitor
  };
};
