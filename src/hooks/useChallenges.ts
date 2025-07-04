
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  requirements: any;
  rewards: any;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: any;
  completed: boolean;
  completed_at?: string;
  joined_at: string;
}

export const useChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar desafios:', error);
        return;
      }

      setChallenges(data || []);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserChallenges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao carregar desafios do usuário:', error);
        return;
      }

      setUserChallenges(data || []);
    } catch (error) {
      console.error('Erro ao carregar desafios do usuário:', error);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error('Faça login para participar de desafios');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          progress: {}
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Você já está participando deste desafio');
        } else {
          console.error('Erro ao participar do desafio:', error);
          toast.error('Erro ao participar do desafio');
        }
        return false;
      }

      toast.success('Desafio aceito com sucesso!');
      loadUserChallenges();
      return true;
    } catch (error) {
      console.error('Erro ao participar do desafio:', error);
      toast.error('Erro ao participar do desafio');
      return false;
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_challenges')
        .update({ progress })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

      if (error) {
        console.error('Erro ao atualizar progresso:', error);
        return;
      }

      loadUserChallenges();
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  const isUserInChallenge = (challengeId: string) => {
    return userChallenges.some(uc => uc.challenge_id === challengeId);
  };

  const getChallengeProgress = (challengeId: string) => {
    const userChallenge = userChallenges.find(uc => uc.challenge_id === challengeId);
    return userChallenge?.progress || {};
  };

  useEffect(() => {
    loadChallenges();
    if (user) {
      loadUserChallenges();
    }
  }, [user]);

  return {
    challenges,
    userChallenges,
    loading,
    joinChallenge,
    updateChallengeProgress,
    isUserInChallenge,
    getChallengeProgress,
    loadChallenges,
    loadUserChallenges
  };
};
