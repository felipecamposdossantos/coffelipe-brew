
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (fullName: string) => Promise<{ error: any }>
  updateEmail: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        if (mounted) {
          try {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            console.log('Auth state updated successfully')
          } catch (error) {
            console.error('Error updating auth state:', error)
            setLoading(false)
          }
        }
      }
    )

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erro ao obter sessão:', error)
        } else {
          console.log('Initial session:', session?.user?.email)
        }
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          console.log('Initial session loaded successfully')
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email)
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('Resultado do login:', result)
      return { error: result.error }
    } catch (error) {
      console.error('Erro no login:', error)
      return { error: { message: 'Erro de conexão' } }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Tentando criar conta com:', email)
      const redirectUrl = `${window.location.origin}/`
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      })
      console.log('Resultado do cadastro:', result)
      return { error: result.error }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { error: { message: 'Erro de conexão' } }
    }
  }

  const signOut = async () => {
    try {
      console.log('Fazendo logout')
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const updateProfile = async (fullName: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      
      if (!error && user) {
        // Atualizar também na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: user.id, full_name: fullName })
        
        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError)
        }
      }
      
      return { error }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { error: { message: 'Erro de conexão' } }
    }
  }

  const updateEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email })
      return { error }
    } catch (error) {
      console.error('Erro ao atualizar email:', error)
      return { error: { message: 'Erro de conexão' } }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      return { error: { message: 'Erro de conexão' } }
    }
  }

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
  }

  console.log('AuthContext render - loading:', loading, 'user:', user?.email)

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
