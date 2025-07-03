
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Thermometer,
  Coffee,
  Target,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Recipe } from '@/pages/Index';
import { BrewHistory } from '@/hooks/useBrewHistory';

interface SmartSuggestionsProps {
  recipes: Recipe[];
  brewHistory: BrewHistory[];
  onStartBrewing?: (recipe: Recipe) => void;
}

export const SmartSuggestions = ({ recipes, brewHistory, onStartBrewing }: SmartSuggestionsProps) => {
  const suggestions = useMemo(() => {
    const suggestions = [];

    // Análise de receitas não utilizadas
    const usedRecipeIds = new Set(brewHistory.map(brew => brew.recipe_id));
    const unusedRecipes = recipes.filter(recipe => !usedRecipeIds.has(recipe.id));

    if (unusedRecipes.length > 0) {
      suggestions.push({
        type: 'unused',
        icon: <Coffee className="w-5 h-5" />,
        title: 'Receitas não testadas',
        description: `Você tem ${unusedRecipes.length} receita${unusedRecipes.length !== 1 ? 's' : ''} que ainda não foi${unusedRecipes.length !== 1 ? 'am' : ''} testada${unusedRecipes.length !== 1 ? 's' : ''}`,
        action: 'Experimentar',
        color: 'blue',
        recipes: unusedRecipes.slice(0, 3)
      });
    }

    // Análise de receitas populares
    const recipeCounts = brewHistory.reduce((acc, brew) => {
      acc[brew.recipe_id] = (acc[brew.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularRecipes = Object.entries(recipeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([recipeId]) => recipes.find(r => r.id === recipeId))
      .filter(Boolean) as Recipe[];

    if (popularRecipes.length > 0) {
      suggestions.push({
        type: 'popular',
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Suas receitas favoritas',
        description: 'Baseado no seu histórico de preparos',
        action: 'Preparar novamente',
        color: 'green',
        recipes: popularRecipes
      });
    }

    // Análise de receitas rápidas
    const quickRecipes = recipes
      .filter(recipe => {
        const totalTime = recipe.steps.reduce((total, step) => total + step.duration, 0);
        return totalTime <= 300; // 5 minutos ou menos
      })
      .slice(0, 3);

    if (quickRecipes.length > 0) {
      suggestions.push({
        type: 'quick',
        icon: <Clock className="w-5 h-5" />,
        title: 'Receitas rápidas',
        description: 'Para quando você tem pouco tempo',
        action: 'Preparar rápido',
        color: 'orange',
        recipes: quickRecipes
      });
    }

    // Análise de receitas com alta temperatura
    const hotRecipes = recipes
      .filter(recipe => recipe.waterTemperature && recipe.waterTemperature >= 90)
      .slice(0, 3);

    if (hotRecipes.length > 0 && new Date().getHours() < 12) {
      suggestions.push({
        type: 'hot',
        icon: <Thermometer className="w-5 h-5" />,
        title: 'Café da manhã',
        description: 'Receitas com temperatura alta para começar o dia',
        action: 'Começar o dia',
        color: 'red',
        recipes: hotRecipes
      });
    }

    // Análise de ratios balanceados
    const balancedRecipes = recipes
      .filter(recipe => {
        const ratio = recipe.coffeeRatio / recipe.waterRatio;
        return ratio >= 0.055 && ratio <= 0.07; // Ratio entre 1:14 e 1:18
      })
      .slice(0, 3);

    if (balancedRecipes.length > 0) {
      suggestions.push({
        type: 'balanced',
        icon: <Target className="w-5 h-5" />,
        title: 'Receitas balanceadas',
        description: 'Com ratios ideais para extração equilibrada',
        action: 'Experimentar',
        color: 'purple',
        recipes: balancedRecipes
      });
    }

    // Sugestão baseada no dia da semana
    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    
    if (isWeekend) {
      const longRecipes = recipes
        .filter(recipe => {
          const totalTime = recipe.steps.reduce((total, step) => total + step.duration, 0);
          return totalTime > 600; // Mais de 10 minutos
        })
        .slice(0, 3);

      if (longRecipes.length > 0) {
        suggestions.push({
          type: 'weekend',
          icon: <Zap className="w-5 h-5" />,
          title: 'Especial de fim de semana',
          description: 'Receitas mais elaboradas para quando você tem tempo',
          action: 'Relaxar e saborear',
          color: 'indigo',
          recipes: longRecipes
        });
      }
    }

    return suggestions;
  }, [recipes, brewHistory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300',
      green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
      orange: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300',
      red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300',
      purple: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300',
      indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (suggestions.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
        <CardContent className="text-center py-12">
          <Lightbulb className="w-12 h-12 mx-auto text-coffee-400 dark:text-coffee-600 mb-4" />
          <p className="text-coffee-600 dark:text-coffee-400">
            Continue preparando receitas para receber sugestões personalizadas!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
          Sugestões Inteligentes
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300">
          Recomendações personalizadas baseadas no seu perfil
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className={`bg-gradient-to-br ${getColorClasses(suggestion.color)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {suggestion.icon}
                {suggestion.title}
              </CardTitle>
              <p className="text-sm opacity-80">{suggestion.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestion.recipes.map((recipe) => {
                const totalTime = recipe.steps.reduce((total, step) => total + step.duration, 0);
                const ratio = (1 / (recipe.coffeeRatio / recipe.waterRatio)).toFixed(1);
                
                return (
                  <div key={recipe.id} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{recipe.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {recipe.method}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Coffee className="w-3 h-3" />
                        {recipe.coffeeRatio}g
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        1:{ratio}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(totalTime)}
                      </span>
                      {recipe.waterTemperature && (
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {recipe.waterTemperature}°C
                        </span>
                      )}
                    </div>

                    {onStartBrewing && (
                      <Button
                        onClick={() => onStartBrewing(recipe)}
                        size="sm"
                        className="w-full mt-2"
                        variant="outline"
                      >
                        {suggestion.action}
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
