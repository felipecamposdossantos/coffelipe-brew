
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
  const [fullName, setFullName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    if (!isLogin && !fullName.trim()) {
      toast.error('Nome completo é obrigatório para cadastro')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        console.log('Iniciando processo de login')
        const { error } = await signIn(email, password)
        if (error) {
          console.error('Erro no login:', error)
          toast.error('Erro ao fazer login: ' + error.message)
        } else {
          console.log('Login realizado com sucesso')
          toast.success('Login realizado com sucesso!')
          setEmail('')
          setPassword('')
          setFullName('')
        }
      } else {
        console.log('Iniciando processo de cadastro')
        const { error } = await signUp(email, password, fullName)
        if (error) {
          console.error('Erro no cadastro:', error)
          toast.error('Erro ao criar conta: ' + error.message)
        } else {
          console.log('Cadastro realizado com sucesso')
          toast.success('Conta criada! Verifique seu email para confirmar.')
          setEmail('')
          setPassword('')
          setFullName('')
        }
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      toast.error('Erro inesperado')
    } finally {
      setLoading(false)
    }
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
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                required={!isLogin}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
              placeholder="Mínimo 6 caracteres"
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
            className="text-coffee-600 hover:text-coffee-700 text-sm underline"
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
