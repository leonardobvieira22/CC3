'use client'

import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Tipo para o contexto de autenticação
type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
  } | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Provedor do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Verificar se o usuário está autenticado
  const isAuthenticated = status === 'authenticated'

  // Verificar se o usuário é administrador
  const isAdmin = session?.user?.role === 'ADMIN'

  // Extrair dados do usuário
  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role || 'USER',
  } : null

  // Função para login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        // Verificar se é um erro de email não verificado
        if (result.error === 'email_not_verified') {
          toast.error('É necessário verificar seu email antes de fazer login. Verifique sua caixa de entrada ou solicite um novo email de verificação.')
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
          return { success: false, error: 'email_not_verified' }
        }

        // Para outros erros
        const errorMessage = result.error === 'CredentialsSignin'
          ? 'Email ou senha incorretos. Verifique suas credenciais.'
          : result.error

        toast.error(errorMessage)
        return { success: false, error: result.error }
      }

      toast.success('Login realizado com sucesso')
      return { success: true }
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error)

      // Verificar se é um erro de email não verificado
      if ((error as Error)?.message === 'email_not_verified') {
        toast.error('É necessário verificar seu email antes de fazer login. Verifique sua caixa de entrada ou solicite um novo email de verificação.')
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
        return { success: false, error: 'email_not_verified' }
      }

      toast.error('Ocorreu um erro ao tentar fazer login')
      return { success: false, error: (error as Error)?.message || 'unknown_error' }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para registro
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Chamada para API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Ocorreu um erro ao tentar registrar')
        return { success: false, error: data.message || 'register_failed' }
      }

      // Login automático após registro bem-sucedido
      return await login(email, password)
    } catch (error: unknown) {
      console.error('Erro ao registrar:', error)
      toast.error('Ocorreu um erro ao tentar registrar')
      return { success: false, error: (error as Error)?.message || 'unknown_error' }
    } finally {
      setIsLoading(false)
    }
  }

  // Função para logout
  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    toast.success('Logout realizado com sucesso')
  }

  // Valor do contexto
  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
