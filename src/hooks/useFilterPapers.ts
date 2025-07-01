
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export interface FilterPaper {
  id: string;
  name: string;
  brand: string;
  model: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useFilterPapers = () => {
  const { user } = useAuth();
  const [filterPapers, setFilterPapers] = useState<FilterPaper[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFilterPapers = async () => {
    if (!user || !isSupabaseConfigured) {
      console.log('loadFilterPapers: No user or Supabase not configured');
      return;
    }

    console.log('loadFilterPapers: Starting to load filter papers for user:', user.id);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('filter_papers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar papéis de filtro:', error);
        toast.error('Erro ao carregar papéis de filtro');
        return;
      }

      console.log('loadFilterPapers: Data loaded:', data);
      setFilterPapers(data || []);
    } catch (error) {
      console.error('Erro ao carregar papéis de filtro:', error);
      toast.error('Erro ao carregar papéis de filtro');
    } finally {
      setLoading(false);
    }
  };

  const saveFilterPaper = async (filterPaper: Omit<FilterPaper, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para salvar papéis de filtro');
      return false;
    }

    try {
      const { error } = await supabase
        .from('filter_papers')
        .insert({
          ...filterPaper,
          user_id: user.id
        });

      if (error) {
        console.error('Erro ao salvar papel de filtro:', error);
        toast.error('Erro ao salvar papel de filtro');
        return false;
      }

      toast.success('Papel de filtro salvo com sucesso!');
      loadFilterPapers();
      return true;
    } catch (error) {
      console.error('Erro ao salvar papel de filtro:', error);
      toast.error('Erro ao salvar papel de filtro');
      return false;
    }
  };

  const updateFilterPaper = async (id: string, filterPaper: Partial<FilterPaper>) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para editar papéis de filtro');
      return false;
    }

    try {
      const { error } = await supabase
        .from('filter_papers')
        .update({
          ...filterPaper,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar papel de filtro:', error);
        toast.error('Erro ao atualizar papel de filtro');
        return false;
      }

      toast.success('Papel de filtro atualizado com sucesso!');
      loadFilterPapers();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar papel de filtro:', error);
      toast.error('Erro ao atualizar papel de filtro');
      return false;
    }
  };

  const deleteFilterPaper = async (id: string) => {
    if (!user || !isSupabaseConfigured) {
      toast.error('Faça login para excluir papéis de filtro');
      return false;
    }

    try {
      const { error } = await supabase
        .from('filter_papers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao excluir papel de filtro:', error);
        toast.error('Erro ao excluir papel de filtro');
        return false;
      }

      toast.success('Papel de filtro excluído com sucesso!');
      loadFilterPapers();
      return true;
    } catch (error) {
      console.error('Erro ao excluir papel de filtro:', error);
      toast.error('Erro ao excluir papel de filtro');
      return false;
    }
  };

  useEffect(() => {
    console.log('useFilterPapers useEffect triggered - user:', user?.id, 'isSupabaseConfigured:', isSupabaseConfigured);
    
    if (user && isSupabaseConfigured) {
      console.log('Loading filter papers...');
      loadFilterPapers();
    } else {
      console.log('Clearing filter papers...');
      setFilterPapers([]);
    }
  }, [user, isSupabaseConfigured]);

  return {
    filterPapers,
    loading,
    saveFilterPaper,
    updateFilterPaper,
    deleteFilterPaper,
    loadFilterPapers
  };
};
