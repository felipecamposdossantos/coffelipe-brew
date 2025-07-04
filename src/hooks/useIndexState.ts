
import { useState } from "react";
import { Recipe } from "@/types/recipe";

export const useIndexState = () => {
  const [currentTab, setCurrentTab] = useState("recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isBrewingActive, setIsBrewingActive] = useState(false);
  const [brewingMode, setBrewingMode] = useState<'auto' | 'manual' | 'expert'>('auto');
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBrewingScheduler, setShowBrewingScheduler] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedBeans, setSelectedBeans] = useState<string[]>([]);

  return {
    currentTab,
    selectedRecipe,
    isBrewingActive,
    brewingMode,
    focusModeActive,
    showMobileMenu,
    showBrewingScheduler,
    searchQuery,
    selectedMethods,
    selectedBeans,
    setCurrentTab,
    setSelectedRecipe,
    setIsBrewingActive,
    setBrewingMode,
    setFocusModeActive,
    setShowMobileMenu,
    setShowBrewingScheduler,
    setSearchQuery,
    setSelectedMethods,
    setSelectedBeans,
  };
};
