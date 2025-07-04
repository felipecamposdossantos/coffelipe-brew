
import { useAuth } from "@/contexts/AuthContext";
import { useIndexState } from "@/hooks/useIndexState";
import { useIndexHandlers } from "@/hooks/useIndexHandlers";
import { MobileContent } from "@/components/MobileContent";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { BrewingInterface } from "@/components/BrewingInterface";
import { FocusMode } from "@/components/FocusMode";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Recipe } from "@/types/recipe";

const Index = () => {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  
  const {
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
  } = useIndexState();

  const {
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
  } = useIndexHandlers();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-coffee-100 flex items-center justify-center safe-area-top safe-area-bottom">
        <div className="text-center p-8">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-coffee-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-coffee-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-coffee-200 rounded w-24 mx-auto"></div>
          </div>
          <p className="text-coffee-600 mt-4 text-sm">Carregando TimerCoffee...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-coffee-100 to-coffee-200 safe-area-top safe-area-bottom">
      <PWAInstallPrompt />
      <Toaster />
      <Sonner />
      
      {/* Focus Mode Overlay */}
      {focusModeActive && selectedRecipe && (
        <FocusMode
          recipe={selectedRecipe}
          isActive={focusModeActive}
          onToggle={handleToggleFocusMode}
          timerState={null}
        />
      )}

      {/* Brewing Interface */}
      {isBrewingActive && selectedRecipe && !focusModeActive && (
        <BrewingInterface
          recipe={selectedRecipe}
          brewingMode={brewingMode}
          onBrewingModeChange={setBrowingMode}
          onComplete={() => {
            setIsBrewingActive(false);
            setSelectedRecipe(null);
          }}
          onToggleFocusMode={handleToggleFocusMode}
          focusModeActive={focusModeActive}
        />
      )}

      {/* Main Content */}
      {!isBrewingActive && !focusModeActive && (
        <>
          {isMobile ? (
            <MobileContent
              activeTab={currentTab}
              onStartBrewing={handleStartBrewing}
              user={user}
              userRecipes={[]}
              brewHistory={[]}
            />
          ) : (
            <DesktopNavigation
              activeTab={currentTab}
              onTabChange={setCurrentTab}
              onMoreMenuSelect={setCurrentTab}
              onStartBrewing={handleStartBrewing}
              user={user}
              userRecipes={[]}
              brewHistory={[]}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
export type { Recipe };
