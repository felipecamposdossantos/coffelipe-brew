
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Clock, Target, TrendingUp, Play, Heart } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useDailyStats } from "@/hooks/useDailyStats";
import { useUserFavorites } from "@/hooks/useUserFavorites";
import { useBrewHistory } from "@/hooks/useBrewHistory";
import { Recipe } from "@/pages/Index";

interface DashboardProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const Dashboard = ({ onStartBrewing }: DashboardProps) => {
  const { preferences } = useUserPreferences();
  const { todayStats, formatTime } = useDailyStats();
  const { favorites } = useUserFavorites();
  const { brewHistory } = useBrewHistory();

  // Receitas mais usadas (top 3)
  const getTopRecipes = () => {
    const recipeCount = brewHistory.reduce((acc, brew) => {
      acc[brew.recipe_id] = (acc[brew.recipe_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(recipeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([recipeId, count]) => {
        const brew = brewHistory.find(b => b.recipe_id === recipeId);
        return {
          id: recipeId,
          name: brew?.recipe_name || 'Receita',
          count,
          lastUsed: brew?.brewed_at || ''
        };
      });
  };

  const topRecipes = getTopRecipes();
  const goal = preferences?.daily_coffee_goal || 2;
  const todayBrews = todayStats?.total_brews || 0;
  const goalProgress = Math.min((todayBrews / goal) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Boas vindas */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-800 dark:text-coffee-200 mb-2">
          Dashboard
        </h2>
        <p className="text-coffee-600 dark:text-coffee-300">
          Bem-vindo ao seu painel personalizado de café
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cafés Hoje</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBrews}</div>
            <p className="text-xs text-muted-foreground">
              Meta: {goal} por dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(todayStats?.total_brewing_time || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tempo de preparo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Diária</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalProgress.toFixed(0)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-coffee-600 h-2 rounded-full transition-all"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Café Consumido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(todayStats?.coffee_consumed_grams || 0).toFixed(0)}g
            </div>
            <p className="text-xs text-muted-foreground">
              Grãos utilizados hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receitas Favoritas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Receitas Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {favorites.slice(0, 3).map((favorite) => (
              <div key={favorite.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium">{favorite.recipe_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {favorite.recipe_data.method || 'V60'}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onStartBrewing(favorite.recipe_data)}
                  className="bg-coffee-600 hover:bg-coffee-700"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {favorites.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma receita favorita ainda. Vá para a aba Receitas e adicione algumas!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Receitas Mais Usadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Mais Preparadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRecipes.map((recipe, index) => (
              <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <div>
                    <h4 className="font-medium">{recipe.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {recipe.count} preparo{recipe.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {topRecipes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Prepare algumas receitas para ver suas estatísticas aqui!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recomendação do Dia */}
      {preferences && (
        <Card>
          <CardHeader>
            <CardTitle>☀️ Receita do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
              <Coffee className="h-12 w-12 mx-auto text-coffee-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {preferences.preferred_method} Clássico
              </h3>
              <p className="text-muted-foreground mb-4">
                Baseado no seu método preferido, recomendamos um preparo equilibrado para começar o dia.
              </p>
              <Badge className="bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-200">
                Intensidade {preferences.coffee_intensity}/5
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
