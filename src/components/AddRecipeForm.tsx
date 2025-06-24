
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRecipes } from "@/hooks/useUserRecipes";

interface AddRecipeFormProps {
  onAddRecipe: (recipe: Recipe) => void;
  onCancel: () => void;
}

interface RecipeStep {
  name: string;
  duration: number;
  instruction: string;
}

export const AddRecipeForm = ({ onAddRecipe, onCancel }: AddRecipeFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coffeeRatio, setCoffeeRatio] = useState<number>(20);
  const [waterRatio, setWaterRatio] = useState<number>(300);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { name: "", duration: 30, instruction: "" }
  ]);

  const { user } = useAuth();
  const { saveRecipe } = useUserRecipes();

  const addStep = () => {
    setSteps([...steps, { name: "", duration: 30, instruction: "" }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: keyof RecipeStep, value: string | number) => {
    const updatedSteps = steps.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );
    setSteps(updatedSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || steps.some(step => !step.name.trim() || !step.instruction.trim())) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newRecipe: Recipe = {
      id: `custom-${Date.now()}`,
      name,
      description,
      coffeeRatio,
      waterRatio,
      steps
    };

    // Se o usuário estiver logado, salvar no banco
    if (user) {
      const saved = await saveRecipe(newRecipe);
      if (saved) {
        onAddRecipe(newRecipe);
      }
    } else {
      // Se não estiver logado, apenas adicionar localmente
      onAddRecipe(newRecipe);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-coffee-800">Adicionar Nova Receita</CardTitle>
        {!user && (
          <p className="text-sm text-amber-600">
            ⚠️ Faça login para salvar suas receitas permanentemente
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Receita *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Meu V60 Especial"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva seu método de preparo..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coffee">Café (gramas) *</Label>
              <Input
                id="coffee"
                type="number"
                value={coffeeRatio}
                onChange={(e) => setCoffeeRatio(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="water">Água (ml) *</Label>
              <Input
                id="water"
                type="number"
                value={waterRatio}
                onChange={(e) => setWaterRatio(Number(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Etapas de Preparo *</Label>
              <Button
                type="button"
                onClick={addStep}
                size="sm"
                className="bg-coffee-600 hover:bg-coffee-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Etapa
              </Button>
            </div>
            
            {steps.map((step, index) => (
              <Card key={index} className="border-coffee-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label htmlFor={`step-name-${index}`}>Nome da Etapa</Label>
                        <Input
                          id={`step-name-${index}`}
                          value={step.name}
                          onChange={(e) => updateStep(index, 'name', e.target.value)}
                          placeholder="Ex: Pré-infusão"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`step-duration-${index}`}>Duração (segundos)</Label>
                        <Input
                          id={`step-duration-${index}`}
                          type="number"
                          value={step.duration}
                          onChange={(e) => updateStep(index, 'duration', Number(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`step-instruction-${index}`}>Instruções</Label>
                        <Textarea
                          id={`step-instruction-${index}`}
                          value={step.instruction}
                          onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                          placeholder="Descreva o que fazer nesta etapa..."
                          required
                        />
                      </div>
                    </div>
                    
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeStep(index)}
                        size="sm"
                        variant="outline"
                        className="mt-6 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-coffee-600 hover:bg-coffee-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Receita
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
