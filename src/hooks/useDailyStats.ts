
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  total_brews: number;
  total_brewing_time: number;
  unique_methods_used: number;
  coffee_consumed_grams: number;
}

export const useDailyStats = () => {
  const { user } = useAuth();
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weekStats, setWeekStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTodayStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar estatísticas:', error);
        return;
      }

      setTodayStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do dia:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeekStats = async () => {
    if (!user) return;

    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar estatísticas da semana:', error);
        return;
      }

      setWeekStats(data || []);
    } catch (error) {
      console.error('Erro ao carregar estatísticas da semana:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  useEffect(() => {
    if (user) {
      loadTodayStats();
      loadWeekStats();
    } else {
      setTodayStats(null);
      setWeekStats([]);
    }
  }, [user]);

  return {
    todayStats,
    weekStats,
    loading,
    loadTodayStats,
    loadWeekStats,
    formatTime
  };
};
