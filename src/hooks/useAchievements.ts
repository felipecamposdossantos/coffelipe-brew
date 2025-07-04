
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description?: string;
  achievement_icon?: string;
  points_earned: number;
  unlocked_at: string;
}

export interface BrewingStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_brew_date: string;
  streak_start_date: string;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState<BrewingStreak | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadAchievements = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar conquistas:', error);
        return;
      }

      setAchievements(data || []);
      const points = data?.reduce((sum, achievement) => sum + (achievement.points_earned || 0), 0) || 0;
      setTotalPoints(points);
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStreak = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('brewing_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar streak:', error);
        return;
      }

      setStreak(data);
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    }
  };

  const checkAndUnlockAchievements = async () => {
    if (!user) return;

    try {
      // Verificar primeiro preparo
      const { data: brewCount } = await supabase
        .from('brew_history')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (brewCount && brewCount.length === 1) {
        await unlockAchievement('first_brew', 'Primeiro Preparo', 'Preparou seu primeiro café!', '☕', 10);
      }

      // Verificar streak de 7 dias
      if (streak && streak.current_streak >= 7) {
        await unlockAchievement('streak_7', 'Consistência', 'Preparou café por 7 dias seguidos!', '🔥', 25);
      }

      // Verificar streak de 30 dias
      if (streak && streak.current_streak >= 30) {
        await unlockAchievement('streak_30', 'Dedicação', 'Preparou café por 30 dias seguidos!', '💪', 100);
      }

      // Verificar explorador (5 métodos diferentes)
      const { data: methods } = await supabase
        .from('brew_history')
        .select('grinder_brand')
        .eq('user_id', user.id);

      if (methods) {
        const uniqueMethods = new Set(methods.map(m => m.grinder_brand).filter(Boolean));
        if (uniqueMethods.size >= 5) {
          await unlockAchievement('explorer', 'Explorador', 'Experimentou 5 métodos diferentes!', '🗺️', 50);
        }
      }

    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  };

  const unlockAchievement = async (
    type: string,
    name: string,
    description: string,
    icon: string,
    points: number
  ) => {
    if (!user) return;

    try {
      // Verificar se já possui a conquista
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', user.id)
        .eq('achievement_type', type)
        .single();

      if (existing) return; // Já possui

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_name: name,
          achievement_description: description,
          achievement_icon: icon,
          points_earned: points
        });

      if (error) {
        console.error('Erro ao desbloquear conquista:', error);
        return;
      }

      toast.success(`🎉 Conquista desbloqueada: ${name}!`);
      loadAchievements();
    } catch (error) {
      console.error('Erro ao desbloquear conquista:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadAchievements();
      loadStreak();
    } else {
      setAchievements([]);
      setStreak(null);
      setTotalPoints(0);
    }
  }, [user]);

  return {
    achievements,
    streak,
    totalPoints,
    loading,
    checkAndUnlockAchievements,
    loadAchievements,
    loadStreak
  };
};
