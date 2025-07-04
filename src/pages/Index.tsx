import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeList } from "@/components/RecipeList";
import { UserRecipes } from "@/components/UserRecipes";
import { BrewingProcess } from "@/components/BrewingProcess";
import { AutoBrewingProcess } from "@/components/AutoBrewingProcess";
import { ManualBrewingProcess } from "@/components/ManualBrewingProcess";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { RecipeExportImport } from "@/components/RecipeExportImport";
import { Footer } from "@/components/Footer";
import { Timer } from "@/components/Timer";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { LazyWrapper, LazyRecipeAnalytics, LazySmartSuggestions, LazyRecipeComparison, LazyBrewHistory, LazyCoffeeBeansManager, LazyFilterPapersManager } from "@/components/LazyWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { useTheme } from "@/hooks/useTheme";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useAppPerformance } from "@/hooks/useAppPerformance";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { useIsMobile } from "@/hooks/use-mobile";
import { Coffee, Settings, Timer as TimerIcon, Moon, Sun, Download, Home } from "lucide-react";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { ExpertBrewingProcess } from "@/components/ExpertBrewingProcess";
import { BrewingScheduler } from "@/components/BrewingScheduler";
import { StockManager } from "@/components/StockManager";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { FocusMode } from "@/components/FocusMode";
import { MoreMenuDropdown } from "@/components/MoreMenuDropdown";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { LoadingStates } from "@/components/ui/loading-states";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";

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
  const { userRecipes, brewHistory, refreshUserRecipes } = useUserRecipes();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const deviceInfo = useDeviceDetection();
  const { cleanupMemory } = useAppPerformance();
  const { impactFeedback } = useHapticFeedback();
  const isMobile = useIsMobile();

  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [brewingMode, setBrewingMode] = useState<'auto' | 'manual' | 'expert'>('auto');
  const [activeTab, setActiveTab] = useState("recipes");
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);

  // Touch gestures para navegação
  const gestureRef = useTouchGestures({
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

  const handleMoreMenuSelect = (value: string) => {
    setActiveTab(value);
    impactFeedback('light');
  };

  const handleRefresh = async () => {
    await refreshUserRecipes();
    impactFeedback('success');
  };

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

  console.log('Index render - loading:', loading, 'user:', user?.email, 'activeTab:', activeTab);

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

  const handleQuickBrew = () => {
    // Implementar preparo rápido com receita padrão
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

  // Cleanup memory periodically on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(cleanupMemory, 10 * 60 * 1000); // 10 minutos
      return () => clearInterval(interval);
    }
  }, [isMobile, cleanupMemory]);

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
          <AnimatedContainer animation="fade-in">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
                  Preparando: {currentRecipe.name}
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant={brewingMode === 'auto' ? 'default' : 'outline'}
                    onClick={() => setBrewingMode('auto')}
                    className={brewingMode === 'auto' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                    size="sm"
                  >
                    Automático
                  </Button>
                  <Button
                    variant={brewingMode === 'manual' ? 'default' : 'outline'}
                    onClick={() => setBrewingMode('manual')}
                    className={brewingMode === 'manual' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                    size="sm"
                  >
                    Manual
                  </Button>
                  <Button
                    variant={brewingMode === 'expert' ? 'default' : 'outline'}
                    onClick={() => setBrewingMode('expert')}
                    className={brewingMode === 'expert' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                    size="sm"
                  >
                    Especialista
                  </Button>
                </div>
              </div>
              <Button 
                onClick={handleCompleteBrewing}
                variant="outline"
                size="sm"
              >
                Voltar
              </Button>
            </div>
          </AnimatedContainer>
          
          {brewingMode === 'auto' ? (
            <AutoBrewingProcess 
              recipe={currentRecipe} 
              onComplete={handleCompleteBrewing} 
            />
          ) : brewingMode === 'manual' ? (
            <ManualBrewingProcess 
              recipe={currentRecipe} 
              onComplete={handleCompleteBrewing} 
            />
          ) : (
            <ExpertBrewingProcess 
              recipe={currentRecipe} 
              onComplete={handleCompleteBrewing} 
            />
          )}

          {/* Modo Foco */}
          <FocusMode
            recipe={currentRecipe}
            isActive={focusModeActive}
            onToggle={() => setFocusModeActive(!focusModeActive)}
            currentStep={0}
            timeLeft={180}
            isRunning={true}
          />
        </div>
      </div>
    );
  }

  console.log('Index: Showing main tabs interface');

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div 
        ref={gestureRef}
        className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 ${isMobile ? 'pb-20' : ''}`}
      >
        <div className="container mx-auto px-4 py-8">
          <AnimatedContainer animation="fade-in">
            <div className="text-center mb-8">
              <div 
                className="flex items-center justify-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <Coffee className="w-10 h-10 sm:w-12 sm:h-12 text-coffee-600 dark:text-coffee-400" />
                <h1 className="text-3xl sm:text-4xl font-bold text-coffee-800 dark:text-coffee-200">TimerCoffee Brew</h1>
              </div>
              <p className="text-coffee-600 dark:text-coffee-300 text-base sm:text-lg">
                Seu aplicativo completo para preparo de café
              </p>
              
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </Button>
                
                {user && <RecipeExportImport />}
                
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                  >
                    Perf
                  </Button>
                )}
              </div>

              {showPerformanceMonitor && (
                <div className="mt-4 flex justify-center">
                  <PerformanceMonitor showDetails />
                </div>
              )}
            </div>
          </AnimatedContainer>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 h-auto">
                {user && (
                  <TabsTrigger value="dashboard" className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1">
                    <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                )}
                <TabsTrigger value="recipes" className="text-xs sm:text-sm p-2 sm:p-3">
                  Receitas
                </TabsTrigger>
                <TabsTrigger value="timer" className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1">
                  <TimerIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Timer</span>
                </TabsTrigger>
                {user && (
                  <TabsTrigger value="my-recipes" className="text-xs sm:text-sm p-2 sm:p-3">
                    Minhas
                  </TabsTrigger>
                )}
                {user ? (
                  <MoreMenuDropdown onMenuSelect={handleMoreMenuSelect} />
                ) : (
                  <TabsTrigger value="auth" className="text-xs sm:text-sm p-2 sm:p-3">
                    Login
                  </TabsTrigger>
                )}
              </TabsList>

              {user && (
                <TabsContent value="dashboard">
                  <Dashboard onStartBrewing={handleStartBrewing} />
                </TabsContent>
              )}

              <TabsContent value="recipes">
                <RecipeList onStartBrewing={handleStartBrewing} />
              </TabsContent>

              <TabsContent value="timer">
                <div className="flex justify-center">
                  <Timer />
                </div>
              </TabsContent>

              {user && (
                <TabsContent value="my-recipes">
                  <UserRecipes onStartBrewing={handleStartBrewing} />
                </TabsContent>
              )}

              {user && (
                <TabsContent value="analytics">
                  <LazyWrapper>
                    <LazyRecipeAnalytics recipes={userRecipes} brewHistory={brewHistory} />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="suggestions">
                  <LazyWrapper>
                    <LazySmartSuggestions 
                      recipes={userRecipes} 
                      brewHistory={brewHistory}
                      onStartBrewing={handleStartBrewing}
                    />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="smart-rec">
                  <SmartRecommendations onStartBrewing={handleStartBrewing} />
                </TabsContent>
              )}

              {user && (
                <TabsContent value="comparison">
                  <LazyWrapper>
                    <LazyRecipeComparison recipes={userRecipes} />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="coffee-beans">
                  <LazyWrapper>
                    <LazyCoffeeBeansManager />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="filter-papers">
                  <LazyWrapper>
                    <LazyFilterPapersManager />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="history">
                  <LazyWrapper>
                    <LazyBrewHistory />
                  </LazyWrapper>
                </TabsContent>
              )}

              {user && (
                <TabsContent value="advanced">
                  <AdvancedSettings />
                </TabsContent>
              )}

              {user && (
                <TabsContent value="scheduler">
                  <BrewingScheduler onStartBrewing={handleStartBrewing} />
                </TabsContent>
              )}

              {user && (
                <TabsContent value="stock">
                  <StockManager />
                </TabsContent>
              )}

              {user && (
                <TabsContent value="advanced-analytics">
                  <AdvancedAnalytics />
                </TabsContent>
              )}

              <TabsContent value="auth">
                {user ? <UserProfile /> : <LoginForm />}
              </TabsContent>
            </Tabs>
          )}

          {/* Mobile Content */}
          {isMobile && (
            <div className="w-full">
              {/* Render content based on active tab */}
              {activeTab === 'dashboard' && user && (
                <Dashboard onStartBrewing={handleStartBrewing} />
              )}
              
              {activeTab === 'recipes' && (
                <RecipeList onStartBrewing={handleStartBrewing} />
              )}
              
              {activeTab === 'timer' && (
                <div className="flex justify-center">
                  <Timer />
                </div>
              )}
              
              {activeTab === 'my-recipes' && user && (
                <UserRecipes onStartBrewing={handleStartBrewing} />
              )}
              
              {activeTab === 'auth' && (
                user ? <UserProfile /> : <LoginForm />
              )}

              {/* Other tab contents remain the same */}
              {activeTab === 'analytics' && user && (
                <LazyWrapper>
                  <LazyRecipeAnalytics recipes={userRecipes} brewHistory={brewHistory} />
                </LazyWrapper>
              )}

              {activeTab === 'suggestions' && user && (
                <LazyWrapper>
                  <LazySmartSuggestions 
                    recipes={userRecipes} 
                    brewHistory={brewHistory}
                    onStartBrewing={handleStartBrewing}
                  />
                </LazyWrapper>
              )}

              {activeTab === 'smart-rec' && user && (
                <SmartRecommendations onStartBrewing={handleStartBrewing} />
              )}

              {activeTab === 'comparison' && user && (
                <LazyWrapper>
                  <LazyRecipeComparison recipes={userRecipes} />
                </LazyWrapper>
              )}

              {activeTab === 'coffee-beans' && user && (
                <LazyWrapper>
                  <LazyCoffeeBeansManager />
                </LazyWrapper>
              )}

              {activeTab === 'filter-papers' && user && (
                <LazyWrapper>
                  <LazyFilterPapersManager />
                </LazyWrapper>
              )}

              {activeTab === 'history' && user && (
                <LazyWrapper>
                  <LazyBrewHistory />
                </LazyWrapper>
              )}

              {activeTab === 'advanced' && user && (
                <AdvancedSettings />
              )}

              {activeTab === 'scheduler' && user && (
                <BrewingScheduler onStartBrewing={handleStartBrewing} />
              )}

              {activeTab === 'stock' && user && (
                <StockManager />
              )}

              {activeTab === 'advanced-analytics' && user && (
                <AdvancedAnalytics />
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMoreMenuSelect={handleMoreMenuSelect}
          isAuthenticated={!!user}
        />

        {/* Floating Action Button */}
        <FloatingActionButton
          onStartQuickBrew={handleQuickBrew}
          onCreateRecipe={handleCreateRecipe}
          onOpenRecipes={handleOpenRecipes}
        />
        
        <Footer />
      </div>
    </PullToRefresh>
  );
};

export default Index;
