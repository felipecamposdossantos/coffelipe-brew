
import { Dashboard } from "@/components/Dashboard";
import { RecipeList } from "@/components/RecipeList";
import { Timer } from "@/components/Timer";
import { UserRecipes } from "@/components/UserRecipes";
import { LoginForm } from "@/components/LoginForm";
import { UserProfile } from "@/components/UserProfile";
import { LazyWrapper, LazyRecipeAnalytics, LazySmartSuggestions, LazyRecipeComparison, LazyBrewHistory, LazyCoffeeBeansManager, LazyFilterPapersManager } from "@/components/LazyWrapper";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { AdvancedSettings } from "@/components/AdvancedSettings";
import { BrewingScheduler } from "@/components/BrewingScheduler";
import { StockManager } from "@/components/StockManager";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { Recipe } from "@/pages/Index";

interface MobileContentProps {
  activeTab: string;
  onStartBrewing: (recipe: Recipe, mode?: 'auto' | 'manual' | 'expert') => void;
  user: any;
  userRecipes: Recipe[];
  brewHistory: any[];
}

export const MobileContent = ({
  activeTab,
  onStartBrewing,
  user,
  userRecipes,
  brewHistory
}: MobileContentProps) => {
  return (
    <div className="w-full">
      {activeTab === 'dashboard' && user && (
        <Dashboard onStartBrewing={onStartBrewing} />
      )}
      
      {activeTab === 'recipes' && (
        <RecipeList onStartBrewing={onStartBrewing} />
      )}
      
      {activeTab === 'timer' && (
        <div className="flex justify-center">
          <Timer />
        </div>
      )}
      
      {activeTab === 'my-recipes' && user && (
        <UserRecipes onStartBrewing={onStartBrewing} />
      )}
      
      {activeTab === 'auth' && (
        user ? <UserProfile /> : <LoginForm />
      )}

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
            onStartBrewing={onStartBrewing}
          />
        </LazyWrapper>
      )}

      {activeTab === 'smart-rec' && user && (
        <SmartRecommendations onStartBrewing={onStartBrewing} />
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
        <BrewingScheduler onStartBrewing={onStartBrewing} />
      )}

      {activeTab === 'stock' && user && (
        <StockManager />
      )}

      {activeTab === 'advanced-analytics' && user && (
        <AdvancedAnalytics />
      )}
    </div>
  );
};
