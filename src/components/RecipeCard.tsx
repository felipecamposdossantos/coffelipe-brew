import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, Droplets, Clock, Play, Thermometer, Settings, FileText } from "lucide-react";
import { Recipe } from "@/pages/Index";
import { useCoffeeBeans } from "@/hooks/useCoffeeBeans";
import { useFilterPapers } from "@/hooks/useFilterPapers";

interface RecipeCardProps {
  recipe: Recipe;
  onStartBrewing: (recipe: Recipe, mode?: 'auto' | 'manual') => void;
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
  { brand: "Wilfa Uniform", defaultClicks: 12 }
];

export const RecipeCard = ({ recipe, onStartBrewing }: RecipeCardProps) => {
  const [selectedGrinder, setSelectedGrinder] = useState(recipe.grinderBrand || "");
  const [selectedClicks, setSelectedClicks] = useState(recipe.grinderClicks || 15);
  const [selectedCoffeeBeanId, setSelectedCoffeeBeanId] = useState(recipe.coffeeBeanId || "none");
  const [selectedFilterPaperId, setSelectedFilterPaperId] = useState(recipe.filterPaperId || "none");
  const [selectedPaper, setSelectedPaper] = useState(recipe.paperBrand || "");
  const [customGrinder, setCustomGrinder] = useState("");
  const [customClicks, setCustomClicks] = useState(15);
  const [useCustomGrinder, setUseCustomGrinder] = useState(false);

  const { coffeeBeans } = useCoffeeBeans();
  const { filterPapers } = useFilterPapers();

  const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const handleGrinderChange = (value: string) => {
    if (value === "custom") {
      setUseCustomGrinder(true);
      setSelectedGrinder("");
    } else {
      setUseCustomGrinder(false);
      setSelectedGrinder(value);
      const grinder = grinderOptions.find(g => g.brand === value);
      if (grinder) {
        setSelectedClicks(grinder.defaultClicks);
      }
    }
  };

  const handleStartBrewing = (mode: 'auto' | 'manual') => {
    const finalGrinder = useCustomGrinder ? customGrinder : selectedGrinder;
    const finalClicks = useCustomGrinder ? customClicks : selectedClicks;
    
    const updatedRecipe = {
      ...recipe,
      grinderBrand: finalGrinder || recipe.grinderBrand,
      grinderClicks: finalClicks || recipe.grinderClicks,
      coffeeBeanId: selectedCoffeeBeanId === "none" ? undefined : selectedCoffeeBeanId || recipe.coffeeBeanId,
      filterPaperId: selectedFilterPaperId === "none" ? undefined : selectedFilterPaperId || recipe.filterPaperId,
      paperBrand: selectedPaper || recipe.paperBrand
    };
    onStartBrewing(updatedRecipe, mode);
  };

  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-coffee-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-coffee-800">
          <span>{recipe.name}</span>
          <Coffee className="w-5 h-5 text-coffee-600" />
        </CardTitle>
        <p className="text-coffee-600 text-sm">{recipe.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ratio Info */}
        <div className="flex items-center justify-between bg-coffee-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-coffee-600" />
            <span className="text-sm font-medium">{recipe.coffeeRatio}g café</span>
          </div>
          <div className="text-coffee-400">:</div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{recipe.waterRatio}ml água</span>
          </div>
        </div>

        {/* Coffee Bean Selection */}
        {coffeeBeans.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-700">Grão de Café</Label>
            <Select value={selectedCoffeeBeanId} onValueChange={setSelectedCoffeeBeanId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione seu grão de café" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Usar grão padrão</SelectItem>
                {coffeeBeans.map((bean) => (
                  <SelectItem key={bean.id} value={bean.id}>
                    {bean.name} - {bean.brand} ({bean.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Filter Paper Selection */}
        {filterPapers.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-700">Papel de Filtro</Label>
            <Select value={selectedFilterPaperId} onValueChange={setSelectedFilterPaperId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione seu papel de filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Usar papel padrão</SelectItem>
                {filterPapers.map((paper) => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.name} - {paper.brand} {paper.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Paper Brand Selection - fallback if no filter papers are registered */}
        {filterPapers.length === 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-700">Marca do Papel</Label>
            <Input
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              placeholder={recipe.paperBrand || "Digite a marca do papel"}
              className="w-full"
            />
          </div>
        )}

        {/* Grinder Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-coffee-700">Moedor</Label>
          <Select value={useCustomGrinder ? "custom" : selectedGrinder || "none"} onValueChange={handleGrinderChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu moedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum moedor selecionado</SelectItem>
              {grinderOptions.map((grinder) => (
                <SelectItem key={grinder.brand} value={grinder.brand}>
                  {grinder.brand} ({grinder.defaultClicks} clicks)
                </SelectItem>
              ))}
              <SelectItem value="custom">Moedor personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {useCustomGrinder && (
            <div className="space-y-2">
              <Input
                value={customGrinder}
                onChange={(e) => setCustomGrinder(e.target.value)}
                placeholder="Nome do seu moedor"
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Label className="text-sm">Clicks:</Label>
                <Input
                  type="number"
                  value={customClicks}
                  onChange={(e) => setCustomClicks(Number(e.target.value))}
                  className="w-20"
                  min="1"
                  max="50"
                />
              </div>
            </div>
          )}
          
          {(selectedGrinder || useCustomGrinder) && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <Settings className="w-4 h-4" />
              <span>Clicks: {useCustomGrinder ? customClicks : selectedClicks}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          {recipe.waterTemperature && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <Thermometer className="w-4 h-4" />
              <span>{recipe.waterTemperature}°C</span>
            </div>
          )}
          
          {(selectedPaper || recipe.paperBrand) && (
            <div className="flex items-center gap-2 text-sm text-coffee-600">
              <FileText className="w-4 h-4" />
              <span>Papel: {selectedPaper || recipe.paperBrand}</span>
            </div>
          )}
        </div>

        {/* Steps Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-coffee-600" />
            <span className="text-sm font-medium text-coffee-700">
              {recipe.steps.length} etapas • {formatTime(totalTime)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {recipe.steps.map((step, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-coffee-300 text-coffee-600"
              >
                {step.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={() => handleStartBrewing('auto')}
            className="w-full bg-coffee-600 hover:bg-coffee-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Preparo Automático
          </Button>
          <Button 
            onClick={() => handleStartBrewing('manual')}
            variant="outline"
            className="w-full border-coffee-300 text-coffee-600 hover:bg-coffee-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Preparo Manual
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
