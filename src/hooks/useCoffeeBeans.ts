
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CoffeeBean {
  id: string;
  user_id: string;
  name: string;
  brand: string;
  type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useCoffeeBeans = () => {
  const { user } = useAuth();
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCoffeeBeans = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coffee_beans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar grãos:', error);
        toast.error('Erro ao carregar grãos de café');
        return;
      }

      if (data) {
        setCoffeeBeans(data);
      }
    } catch (error) {
      console.error('Erro ao carregar grãos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCoffeeBean = async (bean: Omit<CoffeeBean, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('Faça login para salvar grãos');
      return false;
    }

    try {
      const { error } = await supabase
        .from('coffee_beans')
        .insert({
          ...bean,
          user_id: user.id
        });

      if (error) {
        console.error('Erro ao salvar grão:', error);
        toast.error('Erro ao salvar grão de café');
        return false;
      }

      toast.success('Grão de café salvo com sucesso!');
      loadCoffeeBeans();
      return true;
    } catch (error) {
      console.error('Erro ao salvar grão:', error);
      toast.error('Erro ao salvar grão de café');
      return false;
    }
  };

  const deleteCoffeeBean = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('coffee_beans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar grão:', error);
        toast.error('Erro ao deletar grão de café');
        return false;
      }

      toast.success('Grão de café removido com sucesso!');
      loadCoffeeBeans();
      return true;
    } catch (error) {
      console.error('Erro ao deletar grão:', error);
      toast.error('Erro ao deletar grão de café');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadCoffeeBeans();
    } else {
      setCoffeeBeans([]);
    }
  }, [user]);

  return {
    coffeeBeans,
    loading,
    saveCoffeeBean,
    deleteCoffeeBean,
    loadCoffeeBeans
  };
};
