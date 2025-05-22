'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { isValidEmail } from '@/lib/utils/validation'
import { Loader2 } from 'lucide-react'
import { useMediaQuery, breakpoints } from '@/lib/hooks/useMediaQuery'

// Esquema de validação do formulário
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .refine((email) => isValidEmail(email), { message: 'Formato de email inválido' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null
    message: string | null
  }>({
    type: null,
    message: null,
  })

  // Inicializar o formulário
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  // Handler de submissão
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true)
      setFormStatus({ type: null, message: null })

      // Fazer a requisição para o backend
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Email enviado com sucesso. Verifique sua caixa de entrada.',
        })
        // Limpar o formulário
        form.reset()
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

  // Usar o hook para verificar se estamos em um dispositivo móvel
  const isMobile = useMediaQuery(breakpoints.mobile)

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {formStatus.type && (
        <Alert
          className={`mb-6 ${
            formStatus.type === 'success' ? 'bg-green-50 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300'
          }`}
        >
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu.email@exemplo.com"
                    {...field}
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Melhorar o contraste do botão de enviar */}
          <Button
            type="submit"
            className="w-full text-sm sm:text-base py-2 h-auto sm:h-10 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              isMobile ? 'Enviar link' : 'Enviar link de recuperação'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
