
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { useUserRecipes } from "@/hooks/useUserRecipes";
import { useCoffeeBeans } from "@/hooks/useCoffeeBeans";
import { toast } from "sonner";

interface AddRecipeFormProps {
  onAddRecipe: (recipe: Recipe) => void;
  onCancel: () => void;
}

interface RecipeStep {
  name: string;
  duration: number;
  instruction: string;
  waterAmount?: number;
}

const grinderOptions = [
  { brand: "Comandante", defaultClicks: 18 },
  { brand: "1Zpresso JX-Pro", defaultClicks: 15 },
  { brand: "Baratza Encore", defaultClicks: 30 },
  { brand: "Hario Mini Mill Slim", defaultClicks: 12 },
  { brand: "Timemore C2", defaultClicks: 20 },
  { brand: "Timemore C3", defaultClicks: 18 },
  { brand: "Porlex Mini", defaultClicks: 10 },
  { brand: "Mazzer Mini", defaultClicks: 8 },
  { brand: "Fellow Ode", defaultClicks: 5 },
  { brand: "Wilfa Uniform", defaultClicks: 12 },
  { brand: "Outro", defaultClicks: 15 }
];

export const AddRecipeForm = ({ onAddRecipe, onCancel }: AddRecipeFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coffeeRatio, setCoffeeRatio] = useState(20);
  const [waterRatio, setWaterRatio] = useState(300);
  const [waterTemperature, setWaterTemperature] = useState(94);
  const [grinderBrand, setGrinderBrand] = useState("none");
  const [customGrinderBrand, setCustomGrinderBrand] = useState("");
  const [grinderClicks, setGrinderClicks] = useState(15);
  const [paperBrand, setPaperBrand] = useState("");
  const [coffeeBeanId, setCoffeeBeanId] = useState("none");
  const [steps, setSteps] = useState<RecipeStep[]>([
    { name: "Pré-infusão", duration: 30, instruction: "Molhe o café com água quente", waterAmount: 40 }
  ]);

  const { saveRecipe } = useUserRecipes();
  const { coffeeBeans } = useCoffeeBeans();

  const addStep = () => {
    setSteps([...steps, { name: "", duration: 30, instruction: "", waterAmount: 0 }]);
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

  const handleGrinderChange = (value: string) => {
    setGrinderBrand(value);
    if (value !== "Outro") {
      const grinder = grinderOptions.find(g => g.brand === value);
      if (grinder) {
        setGrinderClicks(grinder.defaultClicks);
      }
      setCustomGrinderBrand("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || steps.some(step => !step.name.trim() || !step.instruction.trim())) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const finalGrinderBrand = grinderBrand === "Outro" ? customGrinderBrand : (grinderBrand === "none" ? undefined : grinderBrand);

    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name,
      description,
      coffeeRatio,
      waterRatio,
      waterTemperature,
      grinderBrand: finalGrinderBrand || undefined,
      grinderClicks: finalGrinderBrand ? grinderClicks : undefined,
      paperBrand: paperBrand || undefined,
      coffeeBeanId: coffeeBeanId === "none" ? undefined : coffeeBeanId || undefined,
      steps
    };

    const success = await saveRecipe(newRecipe);
    if (success) {
      onAddRecipe(newRecipe);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="text-coffee-600 border-coffee-300 hover:bg-coffee-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-coffee-800">Nova Receita</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Receita *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: V60 Especial"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva sua receita..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Grão de Café */}
        {coffeeBeans.length > 0 && (
          <Card className="border-coffee-200">
            <CardHeader>
              <CardTitle className="text-coffee-800">Grão de Café</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="coffeeBean">Grão de Café</Label>
                <Select value={coffeeBeanId} onValueChange={setCoffeeBeanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grão de café" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum grão selecionado</SelectItem>
                    {coffeeBeans.map((bean) => (
                      <SelectItem key={bean.id} value={bean.id}>
                        {bean.name} - {bean.brand} ({bean.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proporções e Temperatura */}
        <Card className="border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800">Proporções e Temperatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div>
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={waterTemperature}
                  onChange={(e) => setWaterTemperature(Number(e.target.value))}
                  min="80"
                  max="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipamentos */}
        <Card className="border-coffee-200">
          <CardHeader>
            <CardTitle className="text-coffee-800">Equipamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Moedor */}
            <div>
              <Label htmlFor="grinder">Moedor</Label>
              <Select value={grinderBrand} onValueChange={handleGrinderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o moedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum moedor selecionado</SelectItem>
                  {grinderOptions.map((grinder) => (
                    <SelectItem key={grinder.brand} value={grinder.brand}>
                      {grinder.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {grinderBrand === "Outro" && (
              <div>
                <Label htmlFor="customGrinder">Nome do Moedor</Label>
                <Input
                  id="customGrinder"
                  value={customGrinderBrand}
                  onChange={(e) => setCustomGrinderBrand(e.target.value)}
                  placeholder="Digite o nome do seu moedor"
                />
              </div>
            )}

            {grinderBrand && grinderBrand !== "none" && (
              <div>
                <Label htmlFor="clicks">Clicks do Moedor</Label>
                <Input
                  id="clicks"
                  type="number"
                  value={grinderClicks}
                  onChange={(e) => setGrinderClicks(Number(e.target.value))}
                  min="1"
                />
              </div>
            )}

            {/* Papel */}
            <div>
              <Label htmlFor="paper">Marca do Papel</Label>
              <Input
                id="paper"
                value={paperBrand}
                onChange={(e) => setPaperBrand(e.target.value)}
                placeholder="Ex: Hario V60, Chemex Original, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Etapas */}
        <Card className="border-coffee-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-coffee-800">Etapas de Preparo *</CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="border border-coffee-100">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        </div>

                        <div>
                          <Label htmlFor={`step-water-${index}`}>Quantidade de Água (ml)</Label>
                          <Input
                            id={`step-water-${index}`}
                            type="number"
                            value={step.waterAmount || 0}
                            onChange={(e) => updateStep(index, 'waterAmount', Number(e.target.value))}
                            min="0"
                            placeholder="Digite a quantidade em ml"
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
          </CardContent>
        </Card>

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
    </div>
  );
};
