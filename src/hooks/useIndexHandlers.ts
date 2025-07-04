
import { useWakeLock } from "./useWakeLock";
import { useUserRecipes } from "./useUserRecipes";
import { useHapticFeedback } from "./useHapticFeedback";
import { Recipe } from "@/pages/Index";

interface UseIndexHandlersProps {
  setCurrentRecipe: (recipe: Recipe | null) => void;
  setBrewingMode: (mode: 'auto' | 'manual' | 'expert') => void;
  setActiveTab: (tab: string) => void;
  user: any;
}

export const useIndexHandlers = ({
  setCurrentRecipe,
  setBrewingMode,
  setActiveTab,
  user
}: UseIndexHandlersProps) => {
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const { refreshUserRecipes } = useUserRecipes();
  const { impactFeedback } = useHapticFeedback();

  const handleStartBrewing = async (recipe: Recipe, mode: 'auto' | 'manual' | 'expert' = 'auto') => {
    console.log('Starting brewing with recipe:', recipe.name, 'mode:', mode);
    setCurrentRecipe(recipe);
    setBrewingMode(mode);
    impactFeedback('medium');
    
    // Ativar wake lock durante o preparo
    await requestWakeLock();
  };

  const handleCompleteBrewing = async () => {
    console.log('Completing brewing');
    setCurrentRecipe(null);
    impactFeedback('success');
    
    // Liberar wake lock
    await releaseWakeLock();
    
    if (user) {
      setActiveTab("dashboard");
    } else {
      setActiveTab("recipes");
    }
  };

  const handleLogoClick = () => {
    setCurrentRecipe(null);
    impactFeedback('light');
    if (user) {
      setActiveTab("dashboard");
    } else {
      setActiveTab("recipes");
    }
  };

  const handleMoreMenuSelect = (value: string) => {
    setActiveTab(value);
    impactFeedback('light');
  };

  const handleRefresh = async () => {
    await refreshUserRecipes();
    impactFeedback('success');
  };

  const handleQuickBrew = () => {
    console.log('Quick brew initiated');
    impactFeedback('medium');
  };

  const handleCreateRecipe = () => {
    setActiveTab('my-recipes');
    impactFeedback('light');
  };

  const handleOpenRecipes = () => {
    setActiveTab('recipes');
    impactFeedback('light');
  };

  return {
    handleStartBrewing,
    handleCompleteBrewing,
    handleLogoClick,
    handleMoreMenuSelect,
    handleRefresh,
    handleQuickBrew,
    handleCreateRecipe,
    handleOpenRecipes
  };
};
