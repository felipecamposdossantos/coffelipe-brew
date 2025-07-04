
import { useState } from 'react';
import { Target, Calendar, Gift, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChallenges } from '@/hooks/useChallenges';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ChallengesPanel = () => {
  const {
    challenges,
    userChallenges,
    loading,
    joinChallenge,
    isUserInChallenge,
    getChallengeProgress
  } = useChallenges();

  const [joiningChallenge, setJoiningChallenge] = useState<string | null>(null);

  const handleJoinChallenge = async (challengeId: string) => {
    setJoiningChallenge(challengeId);
    await joinChallenge(challengeId);
    setJoiningChallenge(null);
  };

  const calculateProgress = (challenge: any, progress: any) => {
    const requirements = challenge.requirements;
    
    if (requirements.consecutive_days) {
      return Math.min((progress.consecutive_days || 0) / requirements.consecutive_days * 100, 100);
    }
    
    if (requirements.different_methods) {
      return Math.min((progress.methods_used || 0) / requirements.different_methods * 100, 100);
    }
    
    if (requirements.ratings_count) {
      return Math.min((progress.ratings_count || 0) / requirements.ratings_count * 100, 100);
    }
    
    return 0;
  };

  const getProgressText = (challenge: any, progress: any) => {
    const requirements = challenge.requirements;
    
    if (requirements.consecutive_days) {
      return `${progress.consecutive_days || 0}/${requirements.consecutive_days} dias`;
    }
    
    if (requirements.different_methods) {
      return `${progress.methods_used || 0}/${requirements.different_methods} métodos`;
    }
    
    if (requirements.ratings_count) {
      return `${progress.ratings_count || 0}/${requirements.ratings_count} avaliações`;
    }
    
    return '0%';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desafios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-coffee-600 dark:text-coffee-400">Carregando desafios...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Desafios Ativos
        </CardTitle>
        <CardDescription>
          Participe dos desafios e ganhe recompensas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length === 0 ? (
          <p className="text-coffee-600 dark:text-coffee-400 text-center py-4">
            Nenhum desafio ativo no momento.
          </p>
        ) : (
          challenges.map((challenge) => {
            const userInChallenge = isUserInChallenge(challenge.id);
            const progress = getChallengeProgress(challenge.id);
            const progressPercent = calculateProgress(challenge, progress);
            const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id);
            
            return (
              <div
                key={challenge.id}
                className="p-4 border rounded-lg bg-gradient-to-r from-coffee-50 to-orange-50 dark:from-coffee-900/50 dark:to-orange-900/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-coffee-800 dark:text-coffee-200">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-coffee-600 dark:text-coffee-400 mt-1">
                      {challenge.description}
                    </p>
                  </div>
                  <Badge
                    variant={challenge.challenge_type === 'monthly' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {challenge.challenge_type}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-coffee-600 dark:text-coffee-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Termina {formatDistanceToNow(new Date(challenge.end_date), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  {challenge.rewards && (
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      <span>{challenge.rewards.points} pontos</span>
                    </div>
                  )}
                </div>

                {userInChallenge ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-coffee-600 dark:text-coffee-400">
                        Progresso: {getProgressText(challenge, progress)}
                      </span>
                      <span className="font-medium text-coffee-800 dark:text-coffee-200">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    {userChallenge?.completed && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        ✅ Completado!
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={joiningChallenge === challenge.id}
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {joiningChallenge === challenge.id ? 'Participando...' : 'Participar'}
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
