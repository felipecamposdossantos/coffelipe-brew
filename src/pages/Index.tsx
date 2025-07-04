
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

  // Touch gestures para navegação
  const gestureRef = useTouchGestures({
    enabled: !currentRecipe && isMobile,
    onSwipeLeft: () => {
      const tabs = user ? ['dashboard', 'recipes', 'timer', 'my-recipes'] : ['recipes', 'timer', 'auth'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
        impactFeedback('light');
      }
    },
    onSwipeRight: () => {
      const tabs = user ? ['dashboard', 'recipes', 'timer', 'my-recipes'] : ['recipes', 'timer', 'auth'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
        impactFeedback('light');
      }
    }
  });

  // Cleanup memory periodically on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(cleanupMemory, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isMobile, cleanupMemory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center safe-area-inset-top safe-area-inset-bottom">
        <AnimatedContainer animation="bounce-in">
          <div className="text-center px-4">
            <Coffee className="w-12 h-12 mx-auto text-coffee-600 animate-pulse mb-4" />
            <p className="text-coffee-600 dark:text-coffee-300 text-lg">Carregando...</p>
          </div>
        </AnimatedContainer>
      </div>
    );
  }

  if (currentRecipe) {
    return (
      <div className="min-h-screen safe-area-inset-top safe-area-inset-bottom">
        <BrewingInterface
          recipe={currentRecipe}
          brewingMode={brewingMode}
          onBrewingModeChange={setBrewingMode}
          onComplete={handleCompleteBrewing}
          focusModeActive={focusModeActive}
          onToggleFocusMode={() => setFocusModeActive(!focusModeActive)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 safe-area-inset-top safe-area-inset-bottom">
      <div className="flex flex-col min-h-screen">
        {/* Optimized Header - Compact for mobile */}
        <div className="sticky top-0 z-50 bg-gradient-to-br from-amber-50/95 to-orange-100/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
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

        {/* Main Content - Optimized scroll */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={gestureRef} 
            className="h-full overflow-y-auto overscroll-behavior-y-contain"
          >
            <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 pb-24 sm:pb-4">
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
          </div>
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2">
                <MobileBottomNavigation
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onMoreMenuSelect={handleMoreMenuSelect}
                  isAuthenticated={!!user}
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button - Repositioned */}
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
