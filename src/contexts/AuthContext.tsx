
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  updateEmail: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthStateChange = useCallback((event: any, session: Session | null) => {
    console.info('Auth state changed:', event, session?.user?.id);
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.info('AuthContext: Setting up auth listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.info('Initial session:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.info('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error('Erro ao fazer login: ' + error.message);
      } else {
        toast.success('Login realizado com sucesso!');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error('Erro ao criar conta: ' + error.message);
      } else {
        toast.success('Conta criada! Verifique seu email.');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Erro ao sair: ' + error.message);
      } else {
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: data
      });
      
      if (error) {
        console.error('Update profile error:', error);
        toast.error('Erro ao atualizar perfil: ' + error.message);
      } else {
        toast.success('Perfil atualizado com sucesso!');
      }
      
      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const updateEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email
      });
      
      if (error) {
        console.error('Update email error:', error);
        toast.error('Erro ao atualizar email: ' + error.message);
      } else {
        toast.success('Email atualizado com sucesso!');
      }
      
      return { error };
    } catch (error) {
      console.error('Update email error:', error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Update password error:', error);
        toast.error('Erro ao atualizar senha: ' + error.message);
      } else {
        toast.success('Senha atualizada com sucesso!');
      }
      
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
