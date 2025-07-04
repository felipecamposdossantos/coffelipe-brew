
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  coffee_intensity: number;
  acidity_preference: number;
  bitterness_preference: number;
  preferred_method: string;
  daily_coffee_goal: number;
  onboarding_completed: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar preferências:', error);
        return;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Criar preferências padrão se não existirem
        const defaultPrefs = {
          coffee_intensity: 3,
          acidity_preference: 3,
          bitterness_preference: 3,
          preferred_method: 'V60',
          daily_coffee_goal: 2,
          onboarding_completed: false
        };
        
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert({ ...defaultPrefs, user_id: user.id })
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao criar preferências:', insertError);
        } else {
          setPreferences(newPrefs);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return false;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar preferências:', error);
        toast.error('Erro ao salvar preferências');
        return false;
      }

      setPreferences({ ...preferences, ...updates });
      toast.success('Preferências atualizadas!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast.error('Erro ao salvar preferências');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(null);
    }
  }, [user]);

  return {
    preferences,
    loading,
    updatePreferences,
    loadPreferences
  };
};
