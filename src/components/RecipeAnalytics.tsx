
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Coffee, 
  Droplets, 
  Thermometer,
  BarChart3,
  Target,
  Timer
} from 'lucide-react';
import { Recipe } from '@/pages/Index';
import { BrewHistory } from '@/hooks/useBrewHistory';

interface RecipeAnalyticsProps {
  recipes: Recipe[];
  brewHistory: BrewHistory[];
}

export const RecipeAnalytics = ({ recipes, brewHistory }: RecipeAnalyticsProps) => {
  const analytics = useMemo(() => {
    // Análise de receitas mais usadas
    const recipeCounts = brewHistory.reduce((acc, brew) => {
      acc[brew.recipe_id] = (acc[brew.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedRecipes = Object.entries(recipeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([recipeId, count]) => {
        const recipe = recipes.find(r => r.id === recipeId);
        return { recipe, count };
      })
      .filter(item => item.recipe);

    // Análise de métodos
    const methodCounts = recipes.reduce((acc, recipe) => {
      const method = recipe.method || 'Sem Método';
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise de ratios
    const ratios = recipes.map(r => r.coffeeRatio / r.waterRatio);
    const avgRatio = ratios.length > 0 ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 0;

    // Análise de temperaturas
    const temperatures = recipes.filter(r => r.waterTemperature).map(r => r.waterTemperature!);
    const avgTemp = temperatures.length > 0 ? temperatures.reduce((a, b) => a + b, 0) / temperatures.length : 0;

    // Análise de tempo total por receita
    const recipeTimes = recipes.map(recipe => ({
      name: recipe.name,
      totalTime: recipe.steps.reduce((total, step) => total + step.duration, 0)
    }));

    // Atividade recente
    const recentActivity = brewHistory
      .sort((a, b) => new Date(b.brewed_at).getTime() - new Date(a.brewed_at).getTime())
      .slice(0, 10);

    return {
      mostUsedRecipes,
      methodCounts,
      avgRatio,
      avgTemp,
      recipeTimes,
      recentActivity,
      totalBrews: brewHistory.length,
      totalRecipes: recipes.length
    };
  }, [recipes, brewHistory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
          Analytics & Insights
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300">
          Análise detalhada das suas receitas e preparos
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-coffee-50 to-coffee-100 dark:from-coffee-900/20 dark:to-coffee-800/30 border-coffee-200 dark:border-coffee-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-coffee-700 dark:text-coffee-300 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Total de Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coffee-800 dark:text-coffee-200">
              {analytics.totalRecipes}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total de Preparos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {analytics.totalBrews}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ratio Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              1:{analytics.avgRatio > 0 ? (1/analytics.avgRatio).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temp. Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">
              {analytics.avgTemp > 0 ? `${analytics.avgTemp.toFixed(0)}°C` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas mais usadas */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Receitas Mais Preparadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.mostUsedRecipes.length > 0 ? (
              analytics.mostUsedRecipes.map(({ recipe, count }, index) => (
                <div key={recipe!.id} className="flex items-center justify-between p-3 bg-coffee-50 dark:bg-coffee-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-coffee-600 dark:bg-coffee-400 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-coffee-800 dark:text-coffee-200">{recipe!.name}</div>
                      <div className="text-sm text-coffee-600 dark:text-coffee-400">{recipe!.method}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-coffee-200 dark:bg-coffee-700 text-coffee-800 dark:text-coffee-200">
                    {count}x
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-coffee-600 dark:text-coffee-400">
                Nenhum preparo registrado ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* Métodos de preparo */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Distribuição por Método
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(analytics.methodCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([method, count]) => {
                const percentage = (count / analytics.totalRecipes) * 100;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-coffee-700 dark:text-coffee-300">{method}</span>
                      <span className="text-coffee-600 dark:text-coffee-400">{count} receita{count !== 1 ? 's' : ''}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Tempo de preparo */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Tempo de Preparo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.recipeTimes
              .sort((a, b) => b.totalTime - a.totalTime)
              .slice(0, 5)
              .map((recipe, index) => (
                <div key={recipe.name} className="flex items-center justify-between p-2 bg-coffee-50 dark:bg-coffee-900/20 rounded">
                  <div className="font-medium text-coffee-800 dark:text-coffee-200 truncate">
                    {recipe.name}
                  </div>
                  <Badge variant="outline" className="border-coffee-300 dark:border-coffee-600 text-coffee-700 dark:text-coffee-300">
                    {formatTime(recipe.totalTime)}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Atividade recente */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-coffee-700">
          <CardHeader>
            <CardTitle className="text-coffee-800 dark:text-coffee-200 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.slice(0, 5).map((brew) => (
                <div key={brew.id} className="flex items-center justify-between p-2 bg-coffee-50 dark:bg-coffee-900/20 rounded">
                  <div>
                    <div className="font-medium text-coffee-800 dark:text-coffee-200">{brew.recipe_name}</div>
                    <div className="text-xs text-coffee-600 dark:text-coffee-400">
                      {new Date(brew.brewed_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-coffee-600 dark:text-coffee-400">
                    <Coffee className="w-3 h-3" />
                    {brew.coffee_ratio}g
                    <Droplets className="w-3 h-3 ml-1" />
                    {brew.water_ratio}ml
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-coffee-600 dark:text-coffee-400">
                Nenhuma atividade recente
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
