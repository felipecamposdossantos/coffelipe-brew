
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Timer as TimerIcon } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { RecipeList } from "@/components/RecipeList";
import { Timer } from "@/components/Timer";
import { UserRecipes } from "@/components/UserRecipes";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { SupportProject } from "@/components/SupportProject";
import { MoreMenuDropdown } from "@/components/MoreMenuDropdown";
import { LazyWrapper, LazyRecipeAnalytics, LazySmartSuggestions, LazyRecipeComparison, LazyBrewHistory, LazyCoffeeBeansManager, LazyFilterPapersManager } from "@/components/LazyWrapper";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { BrewingScheduler } from "@/components/BrewingScheduler";
import { StockManager } from "@/components/StockManager";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Recipe } from "@/pages/Index";

interface DesktopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreMenuSelect: (value: string) => void;
  onStartBrewing: (recipe: Recipe, mode?: 'auto' | 'manual' | 'expert') => void;
  user: any;
  userRecipes: Recipe[];
  brewHistory: any[];
}

export const DesktopNavigation = ({
  activeTab,
  onTabChange,
  onMoreMenuSelect,
  onStartBrewing,
  user,
  userRecipes,
  brewHistory
}: DesktopNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <AnimatedContainer animation="fade-in">
        <TabsList className="grid w-full grid-cols-5 mb-8 h-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-coffee-200/20 dark:border-coffee-700/20">
          {user && (
            <TabsTrigger 
              value="dashboard" 
              className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1 transition-all duration-300 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 data-[state=active]:bg-coffee-100 dark:data-[state=active]:bg-coffee-800/30"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="recipes" 
            className="text-xs sm:text-sm p-2 sm:p-3 transition-all duration-300 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 data-[state=active]:bg-coffee-100 dark:data-[state=active]:bg-coffee-800/30"
          >
            Receitas
          </TabsTrigger>
          <TabsTrigger 
            value="timer" 
            className="text-xs sm:text-sm p-2 sm:p-3 flex items-center gap-1 transition-all duration-300 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 data-[state=active]:bg-coffee-100 dark:data-[state=active]:bg-coffee-800/30"
          >
            <TimerIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Timer</span>
          </TabsTrigger>
          {user && (
            <TabsTrigger 
              value="my-recipes" 
              className="text-xs sm:text-sm p-2 sm:p-3 transition-all duration-300 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 data-[state=active]:bg-coffee-100 dark:data-[state=active]:bg-coffee-800/30"
            >
              Minhas
            </TabsTrigger>
          )}
          {user ? (
            <MoreMenuDropdown onMenuSelect={onMoreMenuSelect} />
          ) : (
            <TabsTrigger 
              value="auth" 
              className="text-xs sm:text-sm p-2 sm:p-3 transition-all duration-300 hover:bg-coffee-50 dark:hover:bg-coffee-900/20 data-[state=active]:bg-coffee-100 dark:data-[state=active]:bg-coffee-800/30"
            >
              Login
            </TabsTrigger>
          )}
        </TabsList>
      </AnimatedContainer>

      <div className="w-full">
        {user && (
          <TabsContent value="dashboard">
            <AnimatedContainer animation="fade-in">
              <Dashboard onStartBrewing={onStartBrewing} />
            </AnimatedContainer>
          </TabsContent>
        )}

        <TabsContent value="recipes">
          <AnimatedContainer animation="fade-in">
            <RecipeList onStartBrewing={onStartBrewing} />
          </AnimatedContainer>
        </TabsContent>

        <TabsContent value="timer">
          <AnimatedContainer animation="fade-in">
            <div className="flex justify-center">
              <Timer />
            </div>
          </AnimatedContainer>
        </TabsContent>

        {user && (
          <TabsContent value="my-recipes">
            <UserRecipes onStartBrewing={onStartBrewing} />
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
                onStartBrewing={onStartBrewing}
              />
            </LazyWrapper>
          </TabsContent>
        )}

        {user && (
          <TabsContent value="smart-rec">
            <SmartRecommendations onStartBrewing={onStartBrewing} />
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
            <BrewingScheduler onStartBrewing={onStartBrewing} />
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

        <TabsContent value="support">
          <AnimatedContainer animation="fade-in">
            <SupportProject />
          </AnimatedContainer>
        </TabsContent>

        <TabsContent value="auth">
          <AnimatedContainer animation="fade-in">
            {user ? <UserProfile /> : <LoginForm />}
          </AnimatedContainer>
        </TabsContent>
      </div>
    </Tabs>
  );
};
