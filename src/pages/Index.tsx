
import { useEffect } from "react";
import { Coffee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { useTheme } from "@/hooks/useTheme";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useAppPerformance } from "@/hooks/useAppPerformance";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIndexState } from "@/hooks/useIndexState";
import { useIndexHandlers } from "@/hooks/useIndexHandlers";
import { MainHeader } from "@/components/MainHeader";
import { BrewingInterface } from "@/components/BrewingInterface";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileContent } from "@/components/MobileContent";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { AnimatedContainer } from "@/components/ui/animated-container";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  coffeeRatio: number;
  waterRatio: number;
  waterTemperature?: number;
  grinderBrand?: string;
  grinderClicks?: number;
  paperBrand?: string;
  coffeeBeanId?: string;
  filterPaperId?: string;
  method?: string;
  steps: Array<{
    name: string;
    duration: number;
    instruction: string;
    waterAmount?: number;
  }>;
}

const Index = () => {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { userRecipes, brewHistory } = useUserRecipes();
  const deviceInfo = useDeviceDetection();
  const { cleanupMemory } = useAppPerformance();
  const { impactFeedback } = useHapticFeedback();
  const isMobile = useIsMobile();

  const {
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
  } = useIndexState(user, loading);

  const {
    handleStartBrewing,
    handleCompleteBrewing,
    handleLogoClick,
    handleMoreMenuSelect,
    handleRefresh,
    handleQuickBrew,
    handleCreateRecipe,
    handleOpenRecipes
  } = useIndexHandlers({
    setCurrentRecipe,
    setBrewingMode,
    setActiveTab,
    user
  });

  // Touch gestures para navegação - desabilitar durante scroll
  const gestureRef = useTouchGestures({
    enabled: !currentRecipe, // Only enable when not brewing
    onSwipeLeft: () => {
      if (isMobile && !currentRecipe) {
        const tabs = user ? ['dashboard', 'recipes', 'timer', 'my-recipes'] : ['recipes', 'timer', 'auth'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
          impactFeedback('light');
        }
      }
    },
    onSwipeRight: () => {
      if (isMobile && !currentRecipe) {
        const tabs = user ? ['dashboard', 'recipes', 'timer', 'my-recipes'] : ['recipes', 'timer', 'auth'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
          impactFeedback('light');
        }
      }
    }
  });

  // Cleanup memory periodically on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(cleanupMemory, 10 * 60 * 1000); // 10 minutos
      return () => clearInterval(interval);
    }
  }, [isMobile, cleanupMemory]);

  console.log('Index render - loading:', loading, 'user:', user?.email, 'activeTab:', activeTab);

  if (loading) {
    console.log('Index: Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <AnimatedContainer animation="bounce-in">
          <div className="text-center">
            <Coffee className="w-12 h-12 mx-auto text-coffee-600 animate-pulse mb-4" />
            <p className="text-coffee-600 dark:text-coffee-300">Carregando...</p>
          </div>
        </AnimatedContainer>
      </div>
    );
  }

  if (currentRecipe) {
    console.log('Index: Showing brewing process for recipe:', currentRecipe.name);
    return (
      <BrewingInterface
        recipe={currentRecipe}
        brewingMode={brewingMode}
        onBrewingModeChange={setBrewingMode}
        onComplete={handleCompleteBrewing}
        focusModeActive={focusModeActive}
        onToggleFocusMode={() => setFocusModeActive(!focusModeActive)}
      />
    );
  }

  console.log('Index: Showing main tabs interface');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-br from-amber-50/95 to-orange-100/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <MainHeader
              theme={theme}
              toggleTheme={toggleTheme}
              onLogoClick={handleLogoClick}
              user={user}
              showPerformanceMonitor={showPerformanceMonitor}
              onTogglePerformanceMonitor={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            />
          </div>
        </div>

        {/* Content with normal scroll */}
        <div className="flex-1 overflow-y-auto">
          <div 
            ref={gestureRef} 
            className="container mx-auto px-4 py-4"
          >
            {/* Desktop Navigation */}
            {!isMobile && (
              <DesktopNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onMoreMenuSelect={handleMoreMenuSelect}
                onStartBrewing={handleStartBrewing}
                user={user}
                userRecipes={userRecipes}
                brewHistory={brewHistory}
              />
            )}

            {/* Mobile Content */}
            {isMobile && (
              <MobileContent
                activeTab={activeTab}
                onStartBrewing={handleStartBrewing}
                user={user}
                userRecipes={userRecipes}
                brewHistory={brewHistory}
              />
            )}
          </div>
          
          {/* Spacing for fixed bottom navigation */}
          {isMobile && <div className="h-32" />}
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <MobileBottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onMoreMenuSelect={handleMoreMenuSelect}
                isAuthenticated={!!user}
              />
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton
          onStartQuickBrew={handleQuickBrew}
          onCreateRecipe={handleCreateRecipe}
          onOpenRecipes={handleOpenRecipes}
        />
      </div>
    </div>
  );
};

export default Index;
