import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { AddRecipeForm } from "@/components/AddRecipeForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Recipe } from "@/pages/Index";

interface RecipeListProps {
  onStartBrewing: (recipe: Recipe) => void;
}

const defaultRecipes: Recipe[] = [
  {
    id: "v60-classic",
    name: "V60 Clássico",
    description: "Método tradicional para um café limpo e aromático",
    coffeeRatio: 20,
    waterRatio: 300,
    steps: [
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Molhe o café com 40ml de água e aguarde a florada"
      },
      {
        name: "Primeira despejo",
        duration: 30,
        instruction: "Despeje 100ml de água em movimentos circulares"
      },
      {
        name: "Segunda despejo",
        duration: 45,
        instruction: "Adicione mais 80ml de água mantendo o fluxo constante"
      },
      {
        name: "Despejo final",
        duration: 45,
        instruction: "Complete com os 80ml restantes e aguarde drenar"
      }
    ]
  },
  {
    id: "french-press",
    name: "French Press",
    description: "Café encorpado com 4 minutos de infusão",
    coffeeRatio: 30,
    waterRatio: 500,
    steps: [
      {
        name: "Infusão",
        duration: 240,
        instruction: "Adicione toda a água quente e deixe em infusão por 4 minutos"
      },
      {
        name: "Misturar",
        duration: 10,
        instruction: "Mexa delicadamente para homogeneizar"
      },
      {
        name: "Pressionar",
        duration: 20,
        instruction: "Pressione o pistão lentamente até o fundo"
      }
    ]
  },
  {
    id: "aeropress",
    name: "AeroPress",
    description: "Método rápido para um café concentrado e suave",
    coffeeRatio: 15,
    waterRatio: 200,
    steps: [
      {
        name: "Pré-infusão",
        duration: 30,
        instruction: "Adicione 50ml de água e mexa por 10 segundos"
      },
      {
        name: "Adição de água",
        duration: 15,
        instruction: "Complete com o restante da água até 200ml"
      },
      {
        name: "Infusão",
        duration: 60,
        instruction: "Aguarde 1 minuto sem mexer"
      },
      {
        name: "Pressão",
        duration: 30,
        instruction: "Pressione firmemente por 30 segundos"
      }
    ]
  },
  {
    id: "chemex",
    name: "Chemex",
    description: "Café limpo e bem filtrado com notas delicadas",
    coffeeRatio: 25,
    waterRatio: 400,
    steps: [
      {
        name: "Bloom",
        duration: 45,
        instruction: "Molhe o café com 50ml de água e observe a florada"
      },
      {
        name: "Primeiro despejo",
        duration: 60,
        instruction: "Despeje 150ml em espiral do centro para fora"
      },
      {
        name: "Segundo despejo",
        duration: 60,
        instruction: "Adicione mais 100ml mantendo o nível da água"
      },
      {
        name: "Despejo final",
        duration: 90,
        instruction: "Complete com 100ml e aguarde a drenagem completa"
      }
    ]
  }
];

export const RecipeList = ({ onStartBrewing }: RecipeListProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes([...recipes, newRecipe]);
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddRecipeForm
        onAddRecipe={handleAddRecipe}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-coffee-800 mb-2">
          Receitas de Café
        </h2>
        <p className="text-coffee-600">
          Escolha seu método preferido e siga as etapas cronometradas
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-coffee-600 hover:bg-coffee-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Minha Receita
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onStartBrewing={onStartBrewing}
          />
        ))}
      </div>
      
      <div className="bg-coffee-100 p-6 rounded-lg border border-coffee-200">
        <h3 className="font-semibold text-coffee-800 mb-2">
          💡 Dica do Mestre do Café
        </h3>
        <p className="text-coffee-700 text-sm">
          A temperatura ideal da água é entre 90-96°C. Use sempre café recém moído 
          para obter o melhor sabor. Cada método extrai diferentes características 
          do grão, experimente todos para descobrir seu favorito!
        </p>
      </div>
    </div>
  );
};
