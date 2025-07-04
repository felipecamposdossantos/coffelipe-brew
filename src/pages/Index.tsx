
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
import { useMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { user, loading } = useAuth();
  const isMobile = useMobile();
  
  const {
    currentTab,
    selectedRecipe,
    isBrewingActive,
    currentStep,
    timeLeft,
    isRunning,
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
    setCurrentStep,
    setTimeLeft,
    setIsRunning,
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
          currentStep={currentStep}
          timeLeft={timeLeft}
          isRunning={isRunning}
        />
      )}

      {/* Brewing Interface */}
      {isBrewingActive && selectedRecipe && !focusModeActive && (
        <BrewingInterface
          recipe={selectedRecipe}
          onClose={() => {
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
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onStartBrewing={handleStartBrewing}
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
              showBrewingScheduler={showBrewingScheduler}
              setShowBrewingScheduler={setShowBrewingScheduler}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMethods={selectedMethods}
              setSelectedMethods={setSelectedMethods}
              selectedBeans={selectedBeans}
              setSelectedBeans={setSelectedBeans}
            />
          ) : (
            <DesktopNavigation
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onStartBrewing={handleStartBrewing}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMethods={selectedMethods}
              setSelectedMethods={setSelectedMethods}
              selectedBeans={selectedBeans}
              setSelectedBeans={setSelectedBeans}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
