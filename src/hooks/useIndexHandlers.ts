
import { useState } from "react";
import { Recipe } from "@/types/recipe";

export const useIndexHandlers = () => {
  const [currentTab, setCurrentTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isBrewingActive, setIsBrewingActive] = useState(false);
  const [brewingMode, setBrowingMode] = useState<'auto' | 'manual' | 'expert'>('auto');
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBrewingScheduler, setShowBrewingScheduler] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedBeans, setSelectedBeans] = useState<string[]>([]);

  const handleStartBrewing = (recipe: Recipe, mode: 'auto' | 'manual' | 'expert' = 'auto') => {
    setSelectedRecipe(recipe);
    setBrowingMode(mode);
    setIsBrewingActive(true);
  };

  const handleToggleFocusMode = () => {
    setFocusModeActive(!focusModeActive);
  };

  return {
    setCurrentTab,
    setSelectedRecipe,
    setIsBrewingActive,
    setBrowingMode,
    setFocusModeActive,
    setShowMobileMenu,
    setShowBrewingScheduler,
    setSearchQuery,
    setSelectedMethods,
    setSelectedBeans,
    handleStartBrewing,
    handleToggleFocusMode,
  };
};
