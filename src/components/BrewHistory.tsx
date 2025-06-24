
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { Clock, Coffee } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BrewHistory = () => {
  const { brewHistory, loading } = useUserRecipes();

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico de Preparos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-coffee-600">
            Nenhum preparo registrado ainda. Comece preparando uma receita!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Preparos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {brewHistory.map((brew) => (
            <div
              key={brew.id}
              className="flex items-center justify-between p-3 bg-coffee-50 rounded-lg border border-coffee-200"
            >
              <div className="flex items-center gap-3">
                <Coffee className="w-4 h-4 text-coffee-600" />
                <div>
                  <p className="font-medium text-coffee-800">{brew.recipe_name}</p>
                  <p className="text-sm text-coffee-600">
                    {format(new Date(brew.brewed_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
