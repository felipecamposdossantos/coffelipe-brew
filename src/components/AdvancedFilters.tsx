
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  X, 
  Coffee, 
  Clock, 
  Thermometer,
  Target,
  RotateCcw
} from 'lucide-react';
import { Recipe } from '@/pages/Index';

interface FilterState {
  methods: string[];
  coffeeRange: [number, number];
  waterRange: [number, number];
  timeRange: [number, number];
  temperatureRange: [number, number];
  hasTemperature: boolean;
  hasGrinder: boolean;
}

interface AdvancedFiltersProps {
  recipes: Recipe[];
  onFilteredRecipes: (filtered: Recipe[]) => void;
  availableMethods: string[];
}

export const AdvancedFilters = ({ recipes, onFilteredRecipes, availableMethods }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    methods: availableMethods,
    coffeeRange: [0, 100],
    waterRange: [0, 1000],
    timeRange: [0, 1800], // 30 minutos
    temperatureRange: [60, 100],
    hasTemperature: false,
    hasGrinder: false
  });

  // Calcular ranges baseados nos dados reais
  const ranges = {
    coffee: {
      min: Math.min(...recipes.map(r => r.coffeeRatio)),
      max: Math.max(...recipes.map(r => r.coffeeRatio))
    },
    water: {
      min: Math.min(...recipes.map(r => r.waterRatio)),
      max: Math.max(...recipes.map(r => r.waterRatio))
    },
    time: {
      min: Math.min(...recipes.map(r => r.steps.reduce((total, step) => total + step.duration, 0))),
      max: Math.max(...recipes.map(r => r.steps.reduce((total, step) => total + step.duration, 0)))
    },
    temperature: {
      min: Math.min(...recipes.filter(r => r.waterTemperature).map(r => r.waterTemperature!)),
      max: Math.max(...recipes.filter(r => r.waterTemperature).map(r => r.waterTemperature!))
    }
  };

  const applyFilters = () => {
    const filtered = recipes.filter(recipe => {
      // Filtro por método
      if (!filters.methods.includes(recipe.method || 'Sem Método')) {
        return false;
      }

      // Filtro por quantidade de café
      if (recipe.coffeeRatio < filters.coffeeRange[0] || recipe.coffeeRatio > filters.coffeeRange[1]) {
        return false;
      }

      // Filtro por quantidade de água
      if (recipe.waterRatio < filters.waterRange[0] || recipe.waterRatio > filters.waterRange[1]) {
        return false;
      }

      // Filtro por tempo
      const totalTime = recipe.steps.reduce((total, step) => total + step.duration, 0);
      if (totalTime < filters.timeRange[0] || totalTime > filters.timeRange[1]) {
        return false;
      }

      // Filtro por temperatura
      if (filters.hasTemperature && !recipe.waterTemperature) {
        return false;
      }
      if (recipe.waterTemperature && (
        recipe.waterTemperature < filters.temperatureRange[0] || 
        recipe.waterTemperature > filters.temperatureRange[1]
      )) {
        return false;
      }

      // Filtro por moedor
      if (filters.hasGrinder && !recipe.grinderBrand) {
        return false;
      }

      return true;
    });

    onFilteredRecipes(filtered);
  };

  const resetFilters = () => {
    setFilters({
      methods: availableMethods,
      coffeeRange: [ranges.coffee.min, ranges.coffee.max],
      waterRange: [ranges.water.min, ranges.water.max],
      timeRange: [ranges.time.min, ranges.time.max],
      temperatureRange: [ranges.temperature.min || 60, ranges.temperature.max || 100],
      hasTemperature: false,
      hasGrinder: false
    });
    onFilteredRecipes(recipes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.methods.length !== availableMethods.length) count++;
    if (filters.coffeeRange[0] !== ranges.coffee.min || filters.coffeeRange[1] !== ranges.coffee.max) count++;
    if (filters.waterRange[0] !== ranges.water.min || filters.waterRange[1] !== ranges.water.max) count++;
    if (filters.timeRange[0] !== ranges.time.min || filters.timeRange[1] !== ranges.time.max) count++;
    if (filters.hasTemperature) count++;
    if (filters.hasGrinder) count++;
    return count;
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros Avançados
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Avançados
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métodos */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-coffee-700 dark:text-coffee-300">
            Métodos de Preparo
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={method}
                  checked={filters.methods.includes(method)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters(prev => ({
                        ...prev,
                        methods: [...prev.methods, method]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        methods: prev.methods.filter(m => m !== method)
                      }));
                    }
                  }}
                />
                <Label htmlFor={method} className="text-sm cursor-pointer">
                  {method}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Quantidade de café */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-coffee-700 dark:text-coffee-300 flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            Quantidade de Café: {filters.coffeeRange[0]}g - {filters.coffeeRange[1]}g
          </Label>
          <Slider
            value={filters.coffeeRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, coffeeRange: value as [number, number] }))}
            min={ranges.coffee.min}
            max={ranges.coffee.max}
            step={1}
            className="w-full"
          />
        </div>

        {/* Quantidade de água */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-coffee-700 dark:text-coffee-300">
            Quantidade de Água: {filters.waterRange[0]}ml - {filters.waterRange[1]}ml
          </Label>
          <Slider
            value={filters.waterRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, waterRange: value as [number, number] }))}
            min={ranges.water.min}
            max={ranges.water.max}
            step={10}
            className="w-full"
          />
        </div>

        {/* Tempo de preparo */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-coffee-700 dark:text-coffee-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Tempo de Preparo: {formatTime(filters.timeRange[0])} - {formatTime(filters.timeRange[1])}
          </Label>
          <Slider
            value={filters.timeRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value as [number, number] }))}
            min={ranges.time.min}
            max={ranges.time.max}
            step={30}
            className="w-full"
          />
        </div>

        {/* Temperatura */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTemperature"
              checked={filters.hasTemperature}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasTemperature: !!checked }))}
            />
            <Label htmlFor="hasTemperature" className="text-sm cursor-pointer flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Apenas receitas com temperatura definida
            </Label>
          </div>
          {filters.hasTemperature && (
            <>
              <Label className="text-sm font-medium text-coffee-700 dark:text-coffee-300">
                Temperatura: {filters.temperatureRange[0]}°C - {filters.temperatureRange[1]}°C
              </Label>
              <Slider
                value={filters.temperatureRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, temperatureRange: value as [number, number] }))}
                min={ranges.temperature.min || 60}
                max={ranges.temperature.max || 100}
                step={1}
                className="w-full"
              />
            </>
          )}
        </div>

        {/* Moedor */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasGrinder"
              checked={filters.hasGrinder}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasGrinder: !!checked }))}
            />
            <Label htmlFor="hasGrinder" className="text-sm cursor-pointer flex items-center gap-2">
              <Target className="w-4 h-4" />
              Apenas receitas com moedor definido
            </Label>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 pt-4">
          <Button onClick={applyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
