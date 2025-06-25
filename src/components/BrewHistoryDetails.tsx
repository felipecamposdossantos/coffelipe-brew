
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUserRecipes, BrewHistory } from '@/hooks/useUserRecipes';
import { useCoffeeBeans } from '@/hooks/useCoffeeBeans';
import { Coffee, Droplets, Clock, Thermometer, Settings, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Recipe } from '@/pages/Index';

interface BrewHistoryDetailsProps {
  brew: BrewHistory;
}

export const BrewHistoryDetails = ({ brew }: BrewHistoryDetailsProps) => {
  const { userRecipes } = useUserRecipes();
  const { coffeeBeans } = useCoffeeBeans();
  
  // Buscar a receita completa pelo ID
  const recipe = userRecipes.find(r => r.id === brew.recipe_id);
  
  // Buscar o grão de café se existir
  const coffeeBean = recipe?.coffeeBeanId ? 
    coffeeBeans.find(bean => bean.id === recipe.coffeeBeanId) : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  if (!recipe) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Preparo</DialogTitle>
          </DialogHeader>
          <div className="text-center text-coffee-600">
            Receita não encontrada. Pode ter sido excluída.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalTime = recipe.steps.reduce((acc, step) => acc + step.duration, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-coffee-600" />
            Detalhes do Preparo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{recipe.name}</CardTitle>
              <p className="text-coffee-600 text-sm">{recipe.description}</p>
              <p className="text-sm text-coffee-500">
                Preparado em {format(new Date(brew.brewed_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ratio */}
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

              {/* Grão de Café */}
              {coffeeBean && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-coffee-800 mb-2">Grão de Café Utilizado</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Nome:</strong> {coffeeBean.name}</p>
                    <p className="text-sm"><strong>Marca:</strong> {coffeeBean.brand}</p>
                    <p className="text-sm"><strong>Tipo:</strong> {coffeeBean.type}</p>
                    {coffeeBean.notes && (
                      <p className="text-sm"><strong>Notas:</strong> {coffeeBean.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Configurações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.waterTemperature && (
                  <div className="flex items-center gap-2 text-sm text-coffee-600">
                    <Thermometer className="w-4 h-4" />
                    <span>{recipe.waterTemperature}°C</span>
                  </div>
                )}
                
                {recipe.grinderBrand && recipe.grinderClicks && (
                  <div className="flex items-center gap-2 text-sm text-coffee-600">
                    <Settings className="w-4 h-4" />
                    <span>{recipe.grinderBrand}: {recipe.grinderClicks} clicks</span>
                  </div>
                )}
                
                {recipe.paperBrand && (
                  <div className="flex items-center gap-2 text-sm text-coffee-600">
                    <FileText className="w-4 h-4" />
                    <span>Papel: {recipe.paperBrand}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-coffee-600">
                  <Clock className="w-4 h-4" />
                  <span>Tempo total: {formatTime(totalTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etapas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Etapas do Preparo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="p-3 border border-coffee-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-coffee-800">{step.name}</h4>
                      <Badge variant="outline" className="text-coffee-600">
                        {formatTime(step.duration)}
                      </Badge>
                    </div>
                    <p className="text-sm text-coffee-600">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
