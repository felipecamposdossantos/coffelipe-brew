
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Timer as TimerIcon } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { RecipeList } from "@/components/RecipeList";
import { Timer } from "@/components/Timer";
import { UserRecipes } from "@/components/UserRecipes";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { MoreMenuDropdown } from "@/components/MoreMenuDropdown";
import { LazyWrapper, LazyRecipeAnalytics, LazySmartSuggestions, LazyRecipeComparison, LazyBrewHistory, LazyCoffeeBeansManager, LazyFilterPapersManager } from "@/components/LazyWrapper";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { BrewingScheduler } from "@/components/BrewingScheduler";
import { StockManager } from "@/components/StockManager";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
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
          <MoreMenuDropdown onMenuSelect={onMoreMenuSelect} />
        ) : (
          <TabsTrigger value="auth" className="text-xs sm:text-sm p-2 sm:p-3">
            Login
          </TabsTrigger>
        )}
      </TabsList>

      {user && (
        <TabsContent value="dashboard">
          <Dashboard onStartBrewing={onStartBrewing} />
        </TabsContent>
      )}

      <TabsContent value="recipes">
        <RecipeList onStartBrewing={onStartBrewing} />
      </TabsContent>

      <TabsContent value="timer">
        <div className="flex justify-center">
          <Timer />
        </div>
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

      <TabsContent value="auth">
        {user ? <UserProfile /> : <LoginForm />}
      </TabsContent>
    </Tabs>
  );
};
