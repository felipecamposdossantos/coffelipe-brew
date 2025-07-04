
import { useEffect } from 'react';
import { Clock, Coffee, Star, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ActivityFeed = () => {
  const { activities, loading, loadActivities } = useActivityFeed();

  useEffect(() => {
    loadActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'brew':
        return <Coffee className="w-4 h-4" />;
      case 'rating':
        return <Star className="w-4 h-4" />;
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'challenge':
        return <Target className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'brew':
        return 'bg-coffee-100 text-coffee-600 dark:bg-coffee-900 dark:text-coffee-300';
      case 'rating':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'achievement':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'challenge':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feed de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-coffee-600 dark:text-coffee-400">Carregando atividades...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Feed de Atividades
        </CardTitle>
        <CardDescription>
          Acompanhe as atividades da comunidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
            Nenhuma atividade ainda. Comece preparando um café!
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-coffee-50 dark:bg-coffee-900/50"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                {getActivityIcon(activity.activity_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-coffee-800 dark:text-coffee-200">
                  {activity.activity_title}
                </h4>
                {activity.activity_description && (
                  <p className="text-sm text-coffee-600 dark:text-coffee-400 mt-1">
                    {activity.activity_description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.activity_type}
                  </Badge>
                  <span className="text-xs text-coffee-500 dark:text-coffee-500">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
