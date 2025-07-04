
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  activity_type: string;
  activity_title: string;
  activity_description?: string;
  activity_data?: any;
  is_public: boolean;
  created_at: string;
}

export const useActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao carregar feed:', error);
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (
    type: string,
    title: string,
    description?: string,
    data?: any,
    isPublic: boolean = true
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: type,
          activity_title: title,
          activity_description: description,
          activity_data: data,
          is_public: isPublic
        });

      if (error) {
        console.error('Erro ao criar atividade:', error);
        return;
      }

      loadActivities();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return {
    activities,
    loading,
    createActivity,
    loadActivities
  };
};
