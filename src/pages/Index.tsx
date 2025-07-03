import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeList } from "@/components/RecipeList";
import { UserRecipes } from "@/components/UserRecipes";
import { CoffeeBeansManager } from "@/components/CoffeeBeansManager";
import { BrewingProcess } from "@/components/BrewingProcess";
import { AutoBrewingProcess } from "@/components/AutoBrewingProcess";
import { ManualBrewingProcess } from "@/components/ManualBrewingProcess";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { BrewHistory } from "@/components/BrewHistory";
import { RecipeAnalytics } from "@/components/RecipeAnalytics";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { RecipeComparison } from "@/components/RecipeComparison";
import { Footer } from "@/components/Footer";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { Coffee, Settings, Timer as TimerIcon, Moon, Sun } from "lucide-react";
import { FilterPapersManager } from "@/components/FilterPapersManager";
import { useTheme } from "@/hooks/useTheme";

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
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [brewingMode, setBrewingMode] = useState<'auto' | 'manual'>('auto');
  const [activeTab, setActiveTab] = useState("recipes");

  console.log('Index render - loading:', loading, 'user:', user?.email, 'activeTab:', activeTab);

  const handleStartBrewing = (recipe: Recipe, mode: 'auto' | 'manual' = 'auto') => {
    console.log('Starting brewing with recipe:', recipe.name, 'mode:', mode);
    setCurrentRecipe(recipe);
    setBrewingMode(mode);
  };

  const handleCompleteBrewing = () => {
    console.log('Completing brewing');
    setCurrentRecipe(null);
    setActiveTab("recipes");
  };

  const handleLogoClick = () => {
    setCurrentRecipe(null);
    setActiveTab("recipes");
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
          ) : (
            <ManualBrewingProcess 
              recipe={currentRecipe} 
              onComplete={handleCompleteBrewing} 
            />
          )}
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
            Seu site de gerenciamento de receitas
          </p>
          
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-9 mb-8 h-auto">
            <TabsTrigger value="recipes" className="text-xs sm:text-sm p-2 sm:p-3">
              Receitas
            </TabsTrigger>
            <TabsTrigger value="timer" className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1">
              <TimerIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
            {user && (
              <TabsTrigger value="my-recipes" className="text-xs sm:text-sm p-2 sm:p-3">
                Minhas Receitas
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="analytics" className="text-xs sm:text-sm p-2 sm:p-3">
                Analytics
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="suggestions" className="text-xs sm:text-sm p-2 sm:p-3">
                Sugestões
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="comparison" className="text-xs sm:text-sm p-2 sm:p-3">
                Comparar
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="coffee-beans" className="text-xs sm:text-sm p-2 sm:p-3">
                Grãos
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="filter-papers" className="text-xs sm:text-sm p-2 sm:p-3">
                Filtros
              </TabsTrigger>
            )}
            {user && (
              <TabsTrigger value="history" className="text-xs sm:text-sm p-2 sm:p-3">
                Histórico
              </TabsTrigger>
            )}
            <TabsTrigger value="auth" className="text-xs sm:text-sm p-2 sm:p-3">
              {user ? <Settings className="w-4 h-4" /> : "Login"}
            </TabsTrigger>
          </TabsList>

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
              <RecipeAnalytics recipes={userRecipes} brewHistory={brewHistory} />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="suggestions">
              <SmartSuggestions 
                recipes={userRecipes} 
                brewHistory={brewHistory}
                onStartBrewing={handleStartBrewing}
              />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="comparison">
              <RecipeComparison recipes={userRecipes} />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="coffee-beans">
              <CoffeeBeansManager />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="filter-papers">
              <FilterPapersManager />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="history">
              <BrewHistory />
            </TabsContent>
          )}

          <TabsContent value="auth">
            {user ? <UserProfile /> : <LoginForm />}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
