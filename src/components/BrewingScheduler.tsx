
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Coffee, Plus, Clock, CheckCircle } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { Recipe } from '@/pages/Index';

interface ScheduledBrew {
  id: string;
  recipeId: string;
  recipeName: string;
  scheduledTime: string;
  completed: boolean;
  notes?: string;
}

interface BrewingSchedulerProps {
  onStartBrewing: (recipe: Recipe) => void;
}

export const BrewingScheduler = ({ onStartBrewing }: BrewingSchedulerProps) => {
  const { userRecipes } = useUserRecipes();
  const [scheduledBrews, setScheduledBrews] = useState<ScheduledBrew[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    // Carregar preparos agendados do localStorage
    const saved = localStorage.getItem('scheduledBrews');
    if (saved) {
      setScheduledBrews(JSON.parse(saved));
    }
  }, []);

  const saveScheduledBrews = (brews: ScheduledBrew[]) => {
    setScheduledBrews(brews);
    localStorage.setItem('scheduledBrews', JSON.stringify(brews));
  };

  const addScheduledBrew = () => {
    if (!selectedRecipe || !scheduledTime) return;

    const recipe = userRecipes.find(r => r.id === selectedRecipe);
    if (!recipe) return;

    const newBrew: ScheduledBrew = {
      id: Date.now().toString(),
      recipeId: selectedRecipe,
      recipeName: recipe.name,
      scheduledTime,
      completed: false
    };

    saveScheduledBrews([...scheduledBrews, newBrew]);
    setSelectedRecipe('');
    setScheduledTime('');
  };

  const markCompleted = (id: string) => {
    const updated = scheduledBrews.map(brew => 
      brew.id === id ? { ...brew, completed: true } : brew
    );
    saveScheduledBrews(updated);
  };

  const startScheduledBrew = (brew: ScheduledBrew) => {
    const recipe = userRecipes.find(r => r.id === brew.recipeId);
    if (recipe) {
      onStartBrewing(recipe);
      markCompleted(brew.id);
    }
  };

  const getUpcomingBrews = () => {
    const now = new Date();
    return scheduledBrews
      .filter(brew => !brew.completed && new Date(brew.scheduledTime) > now)
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  };

  const getTodayBrews = () => {
    const today = new Date().toDateString();
    return scheduledBrews.filter(brew => 
      new Date(brew.scheduledTime).toDateString() === today
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-coffee-50 to-cream-50 dark:from-coffee-900/50 dark:to-coffee-800/50 border-coffee-200 dark:border-coffee-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-coffee-800 dark:text-coffee-200">
            <Calendar className="w-5 h-5" />
            Planejamento de Preparos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recipe">Receita</Label>
              <select
                id="recipe"
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
                className="w-full p-2 border border-coffee-300 dark:border-coffee-600 rounded-md bg-white dark:bg-coffee-800 text-coffee-800 dark:text-coffee-200"
              >
                <option value="">Selecione uma receita</option>
                {userRecipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="time">Data e Hora</Label>
              <Input
                id="time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addScheduledBrew} className="w-full bg-coffee-600 hover:bg-coffee-700">
                <Plus className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preparos de Hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Preparos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getTodayBrews().length === 0 ? (
            <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
              Nenhum preparo agendado para hoje
            </p>
          ) : (
            <div className="space-y-3">
              {getTodayBrews().map(brew => (
                <div key={brew.id} className="flex items-center justify-between p-3 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                  <div>
                    <div className="font-medium text-coffee-800 dark:text-coffee-200">
                      {brew.recipeName}
                    </div>
                    <div className="text-sm text-coffee-600 dark:text-coffee-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(brew.scheduledTime).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {brew.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => startScheduledBrew(brew)}
                        className="bg-coffee-600 hover:bg-coffee-700"
                      >
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Próximos Preparos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Preparos</CardTitle>
        </CardHeader>
        <CardContent>
          {getUpcomingBrews().length === 0 ? (
            <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
              Nenhum preparo agendado
            </p>
          ) : (
            <div className="space-y-3">
              {getUpcomingBrews().slice(0, 5).map(brew => (
                <div key={brew.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{brew.recipeName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(brew.scheduledTime).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
