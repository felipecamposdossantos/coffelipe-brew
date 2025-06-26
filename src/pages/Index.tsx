
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
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Settings } from "lucide-react";

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
  steps: Array<{
    name: string;
    duration: number;
    instruction: string;
  }>;
}

const Index = () => {
  const { user, loading } = useAuth();
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

  if (loading) {
    console.log('Index: Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-12 h-12 mx-auto text-coffee-600 animate-pulse mb-4" />
          <p className="text-coffee-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (currentRecipe) {
    console.log('Index: Showing brewing process for recipe:', currentRecipe.name);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="container mx-auto py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-coffee-800 mb-2">
                Preparando: {currentRecipe.name}
              </h1>
              <div className="flex gap-2">
                <Button
                  variant={brewingMode === 'auto' ? 'default' : 'outline'}
                  onClick={() => setBrewingMode('auto')}
                  className={brewingMode === 'auto' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                >
                  Automático
                </Button>
                <Button
                  variant={brewingMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => setBrewingMode('manual')}
                  className={brewingMode === 'manual' ? 'bg-coffee-600 hover:bg-coffee-700' : ''}
                >
                  Manual
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleCompleteBrewing}
              variant="outline"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coffee className="w-8 h-8 text-coffee-600" />
            <h1 className="text-4xl font-bold text-coffee-800">CofFelipe Brew</h1>
          </div>
          <p className="text-coffee-600 text-lg">
            Seu companheiro para o café perfeito
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="recipes">Receitas</TabsTrigger>
            {user && <TabsTrigger value="my-recipes">Minhas Receitas</TabsTrigger>}
            {user && <TabsTrigger value="coffee-beans">Grãos</TabsTrigger>}
            {user && <TabsTrigger value="history">Histórico</TabsTrigger>}
            <TabsTrigger value="auth">
              {user ? <Settings className="w-4 h-4" /> : "Login"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <RecipeList onStartBrewing={handleStartBrewing} />
          </TabsContent>

          {user && (
            <TabsContent value="my-recipes">
              <UserRecipes onStartBrewing={handleStartBrewing} />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="coffee-beans">
              <CoffeeBeansManager />
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
