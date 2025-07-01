
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { BrewHistoryDetails } from '@/components/BrewHistoryDetails';
import { Clock, Coffee, Calendar, Thermometer, Droplets, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BrewHistory = () => {
  const { brewHistory, loading, deleteBrewHistory } = useUserRecipes();

  const handleDeleteBrew = async (brewId: string, recipeName: string) => {
    await deleteBrewHistory(brewId);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico de Preparos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-coffee-600">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (brewHistory.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico de Preparos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-coffee-600">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nenhum preparo registrado ainda</p>
            <p className="text-sm">Comece preparando uma receita para ver seu histórico aqui!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Preparos
          <span className="text-sm font-normal text-coffee-600">
            ({brewHistory.length} preparo{brewHistory.length !== 1 ? 's' : ''})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brewHistory.map((brew) => (
            <Card key={brew.id} className="bg-coffee-50 border-coffee-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Coffee className="w-5 h-5 text-coffee-600 flex-shrink-0" />
                      <h3 className="font-semibold text-coffee-800 text-lg">{brew.recipe_name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-coffee-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(brew.brewed_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>

                    {/* Informações do preparo */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {(brew.coffee_ratio && brew.water_ratio) && (
                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-coffee-200">
                          <div className="flex items-center gap-1">
                            <Coffee className="w-3 h-3 text-coffee-600" />
                            <span>{brew.coffee_ratio}g</span>
                          </div>
                          <span className="text-coffee-400">:</span>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            <span>{brew.water_ratio}ml</span>
                          </div>
                        </div>
                      )}
                      
                      {brew.water_temperature && (
                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-coffee-200">
                          <Thermometer className="w-3 h-3 text-orange-500" />
                          <span>{brew.water_temperature}°C</span>
                        </div>
                      )}
                      
                      {brew.grinder_brand && brew.grinder_clicks && (
                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-coffee-200 truncate">
                          <span className="text-xs">⚙️</span>
                          <span className="truncate">{brew.grinder_brand}: {brew.grinder_clicks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <BrewHistoryDetails brew={brew} />
                    
                    {/* Delete button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 sm:mx-0">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Preparo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este preparo da receita "{brew.recipe_name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBrew(brew.id, brew.recipe_name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
