'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { useMediaQuery, breakpoints } from '@/lib/hooks/useMediaQuery'
import Link from 'next/link'

export default function EmailVerificationForm({ token, email }: { token: string; email: string }) {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | 'info' | null
    message: string | null
  }>({
    type: null,
    message: null,
  })

  // Verificar se estamos em um dispositivo móvel
  const isMobile = useMediaQuery(breakpoints.mobile)

  // Verificar token quando o componente é montado
  useEffect(() => {
    if (token) {
      verifyEmail()
    } else {
      setFormStatus({
        type: 'info',
        message: 'Para verificar seu email, clique no link enviado para o seu endereço de email.',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Contar regressivamente para permitir reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const verifyEmail = async () => {
    if (!token) {
      setFormStatus({
        type: 'error',
        message: 'Token de verificação não fornecido. Verifique o link em seu email.',
      })
      return
    }

    try {
      setIsVerifying(true)
      setHasAttemptedVerification(true)
      setFormStatus({ type: null, message: null })

      // Fazer a requisição para o backend
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Email verificado com sucesso! Você será redirecionado para a página de login.',
        })

        // Redirecionar para a página de login após 3 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Não foi possível verificar seu email. O link pode estar expirado ou ser inválido.',
        })
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      setFormStatus({
        type: 'error',
        message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const resendVerification = async () => {
    if (!email) {
      setFormStatus({
        type: 'error',
        message: 'Email não especificado. Por favor, certifique-se de usar o link correto ou faça login para reenviar o email de verificação.',
      })
      return
    }

    try {
      setIsResending(true)
      setFormStatus({ type: null, message: null })

      // Fazer a requisição para o backend
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Email de verificação reenviado com sucesso. Por favor, verifique sua caixa de entrada.',
        })
        setCountdown(60) // Iniciar contagem regressiva de 60 segundos
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Não foi possível reenviar o email de verificação.',
        })
      }
    } catch (error) {
      console.error('Erro ao reenviar verificação:', error)
      setFormStatus({
        type: 'error',
        message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      {formStatus.type && (
        <Alert
          className={`mb-6 ${
            formStatus.type === 'success' ? 'bg-green-50 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300' :
            formStatus.type === 'error' ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300' :
            'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          <AlertDescription className="text-sm sm:text-base">{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {!token && !hasAttemptedVerification && (
          <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-800 dark:text-gray-200 mb-6 text-sm sm:text-base">
              Por favor, verifique a caixa de entrada do email <strong>{email || "cadastrado"}</strong> e clique no link de verificação.
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-6 text-xs sm:text-sm">
              Se você não recebeu o email, verifique sua pasta de spam ou clique no botão abaixo para reenviar.
            </p>

            <Button
              type="button"
              onClick={resendVerification}
              disabled={isResending || countdown > 0}
              className="w-full text-sm sm:text-base py-3 h-auto sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reenviando...
                </>
              ) : countdown > 0 ? (
                `Reenviar em ${countdown}s`
              ) : (
                isMobile ? 'Reenviar email' : 'Reenviar email de verificação'
              )}
            </Button>

            <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Você já verificou seu email? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Faça login</Link>
              </p>
            </div>
          </div>
        )}

        {token && isVerifying && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-highlight mb-4" />
            <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-base">Verificando seu email...</p>
          </div>
        )}
      </div>
    </div>
  )
}
