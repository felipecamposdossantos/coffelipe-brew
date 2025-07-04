import { useState } from 'react';
import { Coffee, TrendingUp, Calendar, Trophy, Target, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDailyStats } from '@/hooks/useDailyStats';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { useAchievements } from '@/hooks/useAchievements';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { Recipe } from '@/pages/Index';
import { RecipeCard } from './RecipeCard';
import { ActivityFeed } from './ActivityFeed';
import { ChallengesPanel } from './ChallengesPanel';
import { AchievementBadge } from './AchievementBadge';

interface DashboardProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const Dashboard = ({ onStartBrewing }: DashboardProps) => {
  const { todayStats, weekStats, formatTime } = useDailyStats();
  const { favorites } = useUserFavorites();
  const { achievements, streak, totalPoints } = useAchievements();
  const { brewHistory } = useUserRecipes();

  const totalBrews = weekStats.reduce((sum, day) => sum + day.total_brews, 0);
  const totalCoffee = weekStats.reduce((sum, day) => sum + day.coffee_consumed_grams, 0);
  const avgBrewingTime = totalBrews > 0 ? formatTime(weekStats.reduce((sum, day) => sum + day.total_brewing_time, 0) / totalBrews) : '0min 0s';

  const mostBrewedRecipe = brewHistory.reduce((acc, curr) => {
    acc[curr.recipe_name] = (acc[curr.recipe_name] || 0) + 1;
    return acc;
  }, {});

  const topRecipeName = Object.keys(mostBrewedRecipe).length > 0 ? Object.keys(mostBrewedRecipe).reduce((a, b) => mostBrewedRecipe[a] > mostBrewedRecipe[b] ? a : b) : 'Nenhuma';

  const recentAchievements = achievements.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800 dark:text-coffee-200">
            Dashboard
          </h1>
          <p className="text-coffee-600 dark:text-coffee-400">
            Acompanhe seu progresso e descubra novas receitas
          </p>
        </div>
        <div className="flex items-center gap-4">
          {streak && (
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="font-bold text-lg">{streak.current_streak}</div>
                  <div className="text-xs text-coffee-600 dark:text-coffee-400">
                    dias seguidos
                  </div>
                </div>
              </div>
            </Card>
          )}
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-bold text-lg">{totalPoints}</div>
                <div className="text-xs text-coffee-600 dark:text-coffee-400">
                  pontos
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Preparos Hoje</CardTitle>
                <Coffee className="h-4 w-4 text-coffee-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats?.total_brews || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-coffee-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(todayStats?.total_brewing_time || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Métodos Únicos</CardTitle>
                <Target className="h-4 w-4 text-coffee-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats?.unique_methods_used || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Café Consumido</CardTitle>
                <Coffee className="h-4 w-4 text-coffee-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats?.coffee_consumed_grams || 0}g</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Conquistas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentAchievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Favorite Recipes */}
            <Card>
              <CardHeader>
                <CardTitle>Receitas Favoritas</CardTitle>
                <CardDescription>
                  Acesso rápido às suas receitas preferidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
                    Nenhuma receita favorita ainda
                  </p>
                ) : (
                  <div className="space-y-2">
                    {favorites.slice(0, 3).map((favorite) => (
                      <div
                        key={favorite.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-coffee-50 dark:bg-coffee-900/50"
                      >
                        <span className="font-medium">{favorite.recipe_name}</span>
                        <Button
                          size="sm"
                          onClick={() => onStartBrewing(favorite.recipe_data)}
                        >
                          Preparar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso da Semana</CardTitle>
                <CardDescription>
                  Estatísticas dos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total de preparos</span>
                    <span className="font-medium">
                      {weekStats.reduce((sum, day) => sum + day.total_brews, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo total</span>
                    <span className="font-medium">
                      {formatTime(weekStats.reduce((sum, day) => sum + day.total_brewing_time, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Café consumido</span>
                    <span className="font-medium">
                      {weekStats.reduce((sum, day) => sum + day.coffee_consumed_grams, 0)}g
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Suas Conquistas
                </CardTitle>
                <CardDescription>
                  {achievements.length} conquista{achievements.length !== 1 ? 's' : ''} desbloqueada{achievements.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {achievements.length === 0 ? (
                  <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
                    Nenhuma conquista ainda. Comece preparando um café!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-coffee-50 dark:bg-coffee-900/50"
                      >
                        <div className="text-2xl">{achievement.achievement_icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.achievement_name}</h4>
                          <p className="text-sm text-coffee-600 dark:text-coffee-400">
                            {achievement.achievement_description}
                          </p>
                        </div>
                        <Badge variant="secondary">+{achievement.points_earned}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Pontos</span>
                  <span className="text-2xl font-bold text-yellow-600">{totalPoints}</span>
                </div>
                
                {streak && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Sequência Atual</span>
                      <span className="text-lg font-semibold">{streak.current_streak} dias</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Melhor Sequência</span>
                      <span className="text-lg font-semibold">{streak.longest_streak} dias</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span>Total de Preparos</span>
                  <span className="text-lg font-semibold">{brewHistory.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <ChallengesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
