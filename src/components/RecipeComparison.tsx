
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Coffee, 
  Droplets, 
  Clock, 
  Thermometer, 
  FileText,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { Recipe } from '@/pages/Index';

interface RecipeComparisonProps {
  recipes: Recipe[];
}

export const RecipeComparison = ({ recipes }: RecipeComparisonProps) => {
  const [recipe1Id, setRecipe1Id] = useState<string>('');
  const [recipe2Id, setRecipe2Id] = useState<string>('');

  const recipe1 = recipes.find(r => r.id === recipe1Id);
  const recipe2 = recipes.find(r => r.id === recipe2Id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const getTotalTime = (recipe: Recipe) => {
    return recipe.steps.reduce((total, step) => total + step.duration, 0);
  };

  const getRatio = (recipe: Recipe) => {
    return (1 / (recipe.coffeeRatio / recipe.waterRatio)).toFixed(1);
  };

  const ComparisonItem = ({ 
    icon, 
    label, 
    value1, 
    value2, 
    unit = '' 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value1: string | number; 
    value2: string | number; 
    unit?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-coffee-700 dark:text-coffee-300">
        {icon}
        {label}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/20 rounded-lg">
          <div className="text-lg font-bold text-coffee-800 dark:text-coffee-200">
            {value1}{unit}
          </div>
        </div>
        <div className="text-center p-3 bg-coffee-50 dark:bg-coffee-900/20 rounded-lg">
          <div className="text-lg font-bold text-coffee-800 dark:text-coffee-200">
            {value2}{unit}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
          Comparação de Receitas
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300">
          Compare duas receitas lado a lado
        </p>
      </div>

      {/* Seletores de receita */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 text-lg">Receita 1</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={recipe1Id} onValueChange={setRecipe1Id}>
              <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Selecione uma receita" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                {recipes.map((recipe) => (
                  <SelectItem 
                    key={recipe.id} 
                    value={recipe.id}
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={recipe.id === recipe2Id}
                  >
                    {recipe.name} ({recipe.method})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 text-lg">Receita 2</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={recipe2Id} onValueChange={setRecipe2Id}>
              <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Selecione uma receita" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                {recipes.map((recipe) => (
                  <SelectItem 
                    key={recipe.id} 
                    value={recipe.id}
                    className="dark:text-gray-200 dark:hover:bg-gray-700"
                    disabled={recipe.id === recipe1Id}
                  >
                    {recipe.name} ({recipe.method})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Comparação */}
      {recipe1 && recipe2 && (
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Comparação Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nomes das receitas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-coffee-800 dark:text-coffee-200">{recipe1.name}</h3>
                <Badge variant="outline" className="border-coffee-300 dark:border-coffee-600">
                  {recipe1.method}
                </Badge>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-coffee-800 dark:text-coffee-200">{recipe2.name}</h3>
                <Badge variant="outline" className="border-coffee-300 dark:border-coffee-600">
                  {recipe2.method}
                </Badge>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            {/* Comparações */}
            <div className="space-y-4">
              <ComparisonItem
                icon={<Coffee className="w-4 h-4" />}
                label="Café"
                value1={recipe1.coffeeRatio}
                value2={recipe2.coffeeRatio}
                unit="g"
              />

              <ComparisonItem
                icon={<Droplets className="w-4 h-4" />}
                label="Água"
                value1={recipe1.waterRatio}
                value2={recipe2.waterRatio}
                unit="ml"
              />

              <ComparisonItem
                icon={<Zap className="w-4 h-4" />}
                label="Ratio (1:X)"
                value1={getRatio(recipe1)}
                value2={getRatio(recipe2)}
              />

              <ComparisonItem
                icon={<Clock className="w-4 h-4" />}
                label="Tempo Total"
                value1={formatTime(getTotalTime(recipe1))}
                value2={formatTime(getTotalTime(recipe2))}
              />

              {(recipe1.waterTemperature || recipe2.waterTemperature) && (
                <ComparisonItem
                  icon={<Thermometer className="w-4 h-4" />}
                  label="Temperatura"
                  value1={recipe1.waterTemperature || 'N/A'}
                  value2={recipe2.waterTemperature || 'N/A'}
                  unit="°C"
                />
              )}

              <ComparisonItem
                icon={<FileText className="w-4 h-4" />}
                label="Número de Etapas"
                value1={recipe1.steps.length}
                value2={recipe2.steps.length}
              />
            </div>

            {/* Etapas lado a lado */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Comparação de Etapas
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-coffee-700 dark:text-coffee-300">{recipe1.name}</h5>
                  {recipe1.steps.map((step, index) => (
                    <div key={index} className="p-3 bg-coffee-50 dark:bg-coffee-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-coffee-800 dark:text-coffee-200">{step.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatTime(step.duration)}
                        </Badge>
                      </div>
                      <p className="text-sm text-coffee-600 dark:text-coffee-400">{step.instruction}</p>
                      {step.waterAmount && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          💧 {step.waterAmount}ml
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-coffee-700 dark:text-coffee-300">{recipe2.name}</h5>
                  {recipe2.steps.map((step, index) => (
                    <div key={index} className="p-3 bg-coffee-50 dark:bg-coffee-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-coffee-800 dark:text-coffee-200">{step.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatTime(step.duration)}
                        </Badge>
                      </div>
                      <p className="text-sm text-coffee-600 dark:text-coffee-400">{step.instruction}</p>
                      {step.waterAmount && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          💧 {step.waterAmount}ml
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(!recipe1 || !recipe2) && (
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardContent className="text-center py-12">
            <ArrowUpDown className="w-12 h-12 mx-auto text-coffee-400 dark:text-coffee-600 mb-4" />
            <p className="text-coffee-600 dark:text-coffee-400">
              Selecione duas receitas para comparar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
