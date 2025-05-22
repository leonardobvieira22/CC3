'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { calculatePasswordStrength } from '@/lib/utils/validation'
import { useMediaQuery, breakpoints } from '@/lib/hooks/useMediaQuery'

// Esquema de validação do formulário
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [tokenValid, setTokenValid] = useState(true)
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null
    message: string | null
  }>({
    type: null,
    message: null,
  })

  // Inicializar o formulário
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Verificar a força da senha quando ela mudar
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'password' && value.password) {
        setPasswordStrength(calculatePasswordStrength(value.password as string))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Verificar se o token é válido ao montar o componente
  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setFormStatus({
        type: 'error',
        message: 'Token inválido ou não fornecido. Solicite um novo link de recuperação de senha.',
      })
    }
  }, [token])

  // Handler de submissão
  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setFormStatus({
        type: 'error',
        message: 'Token inválido ou não fornecido.',
      })
      return
    }

    try {
      setIsSubmitting(true)
      setFormStatus({ type: null, message: null })

      // Fazer a requisição para o backend
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Senha redefinida com sucesso. Você será redirecionado para a página de login.',
        })

        // Redirecionar para a página de login após 3 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Ocorreu um erro. Tente novamente mais tarde.',
        })
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setFormStatus({
        type: 'error',
        message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Fraca'
    if (passwordStrength <= 3) return 'Média'
    return 'Forte'
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  // Verificar se estamos em um dispositivo móvel
  const isMobile = useMediaQuery(breakpoints.mobile)

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {formStatus.type && (
        <Alert
          className={`mb-6 ${
            formStatus.type === 'success' ? 'bg-green-50 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          <AlertDescription className="text-sm sm:text-base">{formStatus.message}</AlertDescription>
        </Alert>
      )}

      {tokenValid && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  {field.value && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        Força da senha: <span className="font-medium">{getPasswordStrengthText()}</span>
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-sm sm:text-base py-2 h-auto sm:h-10 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isMobile ? 'Redefinindo...' : 'Redefinindo senha...'}
                </>
              ) : (
                'Redefinir senha'
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
