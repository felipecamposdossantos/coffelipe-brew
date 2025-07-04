import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeList } from "@/components/RecipeList";
import { UserRecipes } from "@/components/UserRecipes";
import { CoffeeBeansManager } from "@/components/CoffeeBeansManager";
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
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { LazyWrapper, LazyRecipeAnalytics, LazySmartSuggestions, LazyRecipeComparison, LazyBrewHistory, LazyCoffeeBeansManager, LazyFilterPapersManager } from "@/components/LazyWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Coffee, Settings, Timer as TimerIcon, Moon, Sun, Zap, Download, Home, Crown } from "lucide-react";
import { FilterPapersManager } from "@/components/FilterPapersManager";
import { useTheme } from "@/hooks/useTheme";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { ExpertBrewingProcess } from "@/components/ExpertBrewingProcess";
import { BrewingScheduler } from "@/components/BrewingScheduler";
import { StockManager } from "@/components/StockManager";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { FocusMode } from "@/components/FocusMode";
import { MoreMenuDropdown } from "@/components/MoreMenuDropdown";
import { PremiumFeatures } from "@/components/PremiumFeatures";

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
  const { preferences } = useUserPreferences();
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [brewingMode, setBrewingMode] = useState<'auto' | 'manual' | 'expert'>('auto');
  const [activeTab, setActiveTab] = useState("recipes"); // Default to recipes for everyone
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);

  const handleMoreMenuSelect = (value: string) => {
    setActiveTab(value);
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

  // Verificar se deve mostrar onboarding
  useEffect(() => {
    if (user && preferences && !preferences.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user, preferences]);

  console.log('Index render - loading:', loading, 'user:', user?.email, 'activeTab:', activeTab);

  const handleStartBrewing = (recipe: Recipe, mode: 'auto' | 'manual' | 'expert' = 'auto') => {
    console.log('Starting brewing with recipe:', recipe.name, 'mode:', mode);
    setCurrentRecipe(recipe);
    setBrewingMode(mode);
  };

  const handleCompleteBrewing = () => {
    console.log('Completing brewing');
    setCurrentRecipe(null);
    if (user) {
      setActiveTab("dashboard");
    } else {
      setActiveTab("recipes");
    }
  };

  const handleLogoClick = () => {
    setCurrentRecipe(null);
    if (user) {
      setActiveTab("dashboard");
    } else {
      setActiveTab("recipes");
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    console.log('Index: Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-12 h-12 mx-auto text-coffee-600 animate-pulse mb-4" />
          <p className="text-coffee-600 dark:text-coffee-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (currentRecipe) {
    console.log('Index: Showing brewing process for recipe:', currentRecipe.name);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto py-8">
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
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
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 h-auto">
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
            {user && (
              <TabsTrigger value="premium" className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Premium</span>
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
            <TabsContent value="premium">
              <PremiumFeatures />
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
      </div>
      
      {/* Onboarding Flow - Removido as preferências */}
      
      <Footer />
    </div>
  );
};

export default Index;
