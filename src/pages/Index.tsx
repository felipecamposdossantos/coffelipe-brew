
import { useState } from "react";
import { Timer } from "@/components/Timer";
import { RecipeList } from "@/components/RecipeList";
import { BrewingProcess } from "@/components/BrewingProcess";
import { Coffee, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  coffeeRatio: number; // gramas de café
  waterRatio: number; // ml de água
  steps: {
    name: string;
    duration: number; // em segundos
    instruction: string;
  }[];
}

const Index = () => {
  const [activeView, setActiveView] = useState<'recipes' | 'timer' | 'brewing'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleStartBrewing = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('brewing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100">
      {/* Header */}
      <header className="bg-coffee-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="h-8 w-8 text-cream-300" />
              <h1 className="text-3xl font-bold">Cafelipe Brew</h1>
            </div>
            <p className="text-cream-200 hidden md:block">
              Seu guia para o café perfeito
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-coffee-700 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <Button
              variant={activeView === 'recipes' ? 'default' : 'ghost'}
              className={`rounded-none border-0 ${
                activeView === 'recipes' 
                  ? 'bg-coffee-600 text-white' 
                  : 'text-cream-200 hover:bg-coffee-600 hover:text-white'
              }`}
              onClick={() => setActiveView('recipes')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Receitas
            </Button>
            <Button
              variant={activeView === 'timer' ? 'default' : 'ghost'}
              className={`rounded-none border-0 ${
                activeView === 'timer' 
                  ? 'bg-coffee-600 text-white' 
                  : 'text-cream-200 hover:bg-coffee-600 hover:text-white'
              }`}
              onClick={() => setActiveView('timer')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Timer
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeView === 'recipes' && (
          <RecipeList onStartBrewing={handleStartBrewing} />
        )}
        
        {activeView === 'timer' && (
          <div className="flex justify-center">
            <Timer />
          </div>
        )}
        
        {activeView === 'brewing' && selectedRecipe && (
          <BrewingProcess 
            recipe={selectedRecipe} 
            onComplete={() => setActiveView('recipes')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
