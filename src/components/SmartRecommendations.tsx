
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, Coffee, Thermometer, Clock } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Recipe } from '@/pages/Index';

interface SmartRecommendationsProps {
  onStartBrewing: (recipe: Recipe) => void;
}

interface Recommendation {
  id: string;
  type: 'temperature' | 'grind' | 'time' | 'recipe' | 'method';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  recipeId?: string;
  adjustment?: {
    field: string;
    current: any;
    suggested: any;
    reason: string;
  };
}

export const SmartRecommendations = ({ onStartBrewing }: SmartRecommendationsProps) => {
  const { brewHistory, userRecipes } = useUserRecipes();
  const { preferences } = useUserPreferences();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [brewHistory, userRecipes, preferences]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    const recs: Recommendation[] = [];

    // Análise de histórico de preparos
    if (brewHistory.length > 0) {
      // Recomendação de temperatura baseada em métodos
      const methodTemps = brewHistory.reduce((acc, brew) => {
        const method = brew.grinder_brand || 'Unknown';
        if (!acc[method]) acc[method] = [];
        acc[method].push(brew.water_temperature || 94);
        return acc;
      }, {} as Record<string, number[]>);

      Object.entries(methodTemps).forEach(([method, temps]) => {
        const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
        if (avgTemp < 85) {
          recs.push({
            id: `temp-${method}`,
            type: 'temperature',
            title: 'Temperatura muito baixa',
            description: `Para ${method}, tente aumentar a temperatura para 85-95°C para melhor extração`,
            confidence: 0.7,
            actionable: true,
            adjustment: {
              field: 'temperature',
              current: Math.round(avgTemp),
              suggested: '85-95°C',
              reason: 'Temperatura baixa pode resultar em subextração'
            }
          });
        }
      });

      // Recomendação de receitas populares não testadas
      const triedRecipes = new Set(brewHistory.map(b => b.recipe_id));
      const untried = userRecipes.filter(r => !triedRecipes.has(r.id));
      
      if (untried.length > 0 && preferences) {
        const matchingRecipes = untried.filter(recipe => {
          return recipe.method === preferences.preferred_method;
        });

        if (matchingRecipes.length > 0) {
          const recipe = matchingRecipes[0];
          recs.push({
            id: `recipe-${recipe.id}`,
            type: 'recipe',
            title: 'Nova receita recomendada',
            description: `Experimente "${recipe.name}" - combina com suas preferências`,
            confidence: 0.8,
            actionable: true,
            recipeId: recipe.id
          });
        }
      }
    }

    // Recomendações baseadas em preferências
    if (preferences) {
      if (preferences.coffee_intensity > 3) {
        recs.push({
          id: 'grind-intensity',
          type: 'grind',
          title: 'Moagem mais fina recomendada',
          description: 'Para intensidade maior, experimente uma moagem mais fina',
          confidence: 0.6,
          actionable: true,
          adjustment: {
            field: 'grind',
            current: 'Atual',
            suggested: 'Mais fina',
            reason: 'Moagem mais fina extrai mais sabores intensos'
          }
        });
      }

      if (preferences.acidity_preference < 3) {
        recs.push({
          id: 'temp-acidity',
          type: 'temperature',
          title: 'Temperatura mais alta para menos acidez',
          description: 'Temperaturas mais altas (95-96°C) reduzem a acidez percebida',
          confidence: 0.7,
          actionable: true,
          adjustment: {
            field: 'temperature',
            current: '90-94°C',
            suggested: '95-96°C',
            reason: 'Temperatura mais alta equilibra a acidez'
          }
        });
      }
    }

    // Recomendações gerais baseadas em padrões
    const recentBrews = brewHistory.slice(-5);
    if (recentBrews.length >= 3) {
      const avgTime = recentBrews.reduce((sum, brew) => {
        return sum + (brew.recipe_name ? 240 : 180); // Estimativa de tempo
      }, 0) / recentBrews.length;

      if (avgTime > 300) {
        recs.push({
          id: 'time-optimization',
          type: 'time',
          title: 'Otimize o tempo de preparo',
          description: 'Experimente métodos mais rápidos para o dia a dia',
          confidence: 0.5,
          actionable: true,
          adjustment: {
            field: 'method',
            current: 'Métodos longos',
            suggested: 'AeroPress ou V60 rápido',
            reason: 'Economia de tempo mantendo qualidade'
          }
        });
      }
    }

    setRecommendations(recs);
    setLoading(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-4 h-4" />;
      case 'time': return <Clock className="w-4 h-4" />;
      case 'recipe': return <Coffee className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  };

  const handleApplyRecommendation = (rec: Recommendation) => {
    if (rec.recipeId) {
      const recipe = userRecipes.find(r => r.id === rec.recipeId);
      if (recipe) {
        onStartBrewing(recipe as Recipe);
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recomendações Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-coffee-600 dark:text-coffee-400">Analisando seus dados...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recomendações Inteligentes
          </CardTitle>
          <CardDescription>
            Sugestões baseadas no seu histórico e preferências
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
              Continue preparando café para receber recomendações personalizadas!
            </p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 border rounded-lg bg-gradient-to-r from-coffee-50 to-orange-50 dark:from-coffee-900/50 dark:to-orange-900/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getIconForType(rec.type)}
                      <h3 className="font-semibold text-coffee-800 dark:text-coffee-200">
                        {rec.title}
                      </h3>
                    </div>
                    <Badge className={getConfidenceColor(rec.confidence)}>
                      {Math.round(rec.confidence * 100)}% confiança
                    </Badge>
                  </div>

                  <p className="text-coffee-600 dark:text-coffee-400 mb-3">
                    {rec.description}
                  </p>

                  {rec.adjustment && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border mb-3">
                      <div className="text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-red-600 dark:text-red-400">Atual:</span>
                          <span>{rec.adjustment.current}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-600 dark:text-green-400">Sugerido:</span>
                          <span>{rec.adjustment.suggested}</span>
                        </div>
                        <p className="text-xs text-coffee-600 dark:text-coffee-400">
                          {rec.adjustment.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {rec.actionable && (
                    <Button
                      onClick={() => handleApplyRecommendation(rec)}
                      size="sm"
                      className="w-full"
                    >
                      {rec.type === 'recipe' ? 'Preparar Receita' : 'Aplicar Sugestão'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
