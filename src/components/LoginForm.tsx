
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  // Verificar se o Supabase está configurado
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSupabaseConfigured) {
      toast.error('Configure as variáveis de ambiente do Supabase para usar o login')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error('Erro ao fazer login: ' + error.message)
        } else {
          toast.success('Login realizado com sucesso!')
        }
      } else {
        const { error } = await signUp(email, password)
        if (error) {
          toast.error('Erro ao criar conta: ' + error.message)
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar.')
        }
      }
    } catch (error) {
      toast.error('Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Configuração Necessária</CardTitle>
          <CardDescription>
            Para usar o sistema de login, configure as variáveis de ambiente do Supabase:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><code>VITE_SUPABASE_URL</code></p>
            <p><code>VITE_SUPABASE_ANON_KEY</code></p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? 'Entrar' : 'Criar Conta'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Entre com sua conta para salvar suas receitas' 
            : 'Crie uma conta para personalizar sua experiência'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-coffee-600 hover:bg-coffee-700"
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-coffee-600 hover:text-coffee-700 text-sm"
          >
            {isLogin 
              ? 'Não tem conta? Criar uma agora' 
              : 'Já tem conta? Fazer login'
            }
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
