
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User, LogOut, Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

export const UserProfile = () => {
  const { user, signOut, updateProfile, updateEmail, updatePassword } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Nome não pode estar vazio')
      return
    }

    setLoading(true)
    try {
      const { error } = await updateProfile(fullName)
      if (error) {
        toast.error('Erro ao atualizar nome: ' + error.message)
      } else {
        toast.success('Nome atualizado com sucesso!')
        setIsEditingName(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async () => {
    if (!email.trim()) {
      toast.error('Email não pode estar vazio')
      return
    }

    setLoading(true)
    try {
      const { error } = await updateEmail(email)
      if (error) {
        toast.error('Erro ao atualizar email: ' + error.message)
      } else {
        toast.success('Email atualizado! Verifique sua caixa de entrada.')
        setIsEditingEmail(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { error } = await updatePassword(password)
      if (error) {
        toast.error('Erro ao atualizar senha: ' + error.message)
      } else {
        toast.success('Senha atualizada com sucesso!')
        setIsEditingPassword(false)
        setPassword('')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Perfil do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nome */}
        <div className="space-y-2">
          <Label>Nome Completo:</Label>
          {isEditingName ? (
            <div className="flex gap-2">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
              />
              <Button 
                size="sm"
                onClick={handleUpdateProfile}
                disabled={loading}
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setIsEditingName(false)
                  setFullName(user?.user_metadata?.full_name || '')
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium">{user?.user_metadata?.full_name || 'Nome não informado'}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditingName(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Email */}
        <div className="space-y-2">
          <Label>Email:</Label>
          {isEditingEmail ? (
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
              <Button 
                size="sm"
                onClick={handleUpdateEmail}
                disabled={loading}
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setIsEditingEmail(false)
                  setEmail(user?.email || '')
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium">{user.email}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditingEmail(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Senha */}
        <div className="space-y-2">
          <Label>Senha:</Label>
          {isEditingPassword ? (
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                minLength={6}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={handleUpdatePassword}
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsEditingPassword(false)
                    setPassword('')
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-medium">••••••••</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditingPassword(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </CardContent>
    </Card>
  )
}
