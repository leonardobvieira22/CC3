'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

// Componente de loading que será mostrado enquanto os parâmetros são carregados
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="h-7 w-7 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-5 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />
          <div className="flex flex-col gap-3 mt-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente interno que usa useSearchParams
function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>('Ocorreu um erro durante o processo de autenticação.')

  useEffect(() => {
    const error = searchParams.get('error')

    // Mapear os tipos de erro para mensagens mais amigáveis
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setErrorMessage('Credenciais inválidas. Verifique seu email e senha.')
          break
        case 'OAuthAccountNotLinked':
          setErrorMessage('Este email já está associado a uma conta existente. Faça login com suas credenciais ou outro provedor.')
          break
        case 'OAuthSignin':
          setErrorMessage('Ocorreu um erro ao tentar fazer login com o provedor social.')
          break
        case 'Callback':
          setErrorMessage('Erro na autenticação. Tente novamente mais tarde.')
          break
        case 'EmailCreateAccount':
          setErrorMessage('Não foi possível criar uma conta. O email pode já estar em uso.')
          break
        case 'Configuration':
          setErrorMessage('Ocorreu um erro na configuração da autenticação. Contate o suporte.')
          break
        case 'AccessDenied':
          setErrorMessage('Acesso negado. Você não tem permissão para acessar este recurso.')
          break
        case 'SessionRequired':
          setErrorMessage('Esta página requer autenticação. Faça login para continuar.')
          break
        default:
          setErrorMessage(`Ocorreu um erro durante a autenticação: ${error}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-300" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Erro de Autenticação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">{errorMessage}</p>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              asChild
              variant="default"
              className="w-full"
            >
              <Link href="/auth/login">
                Voltar para o Login
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a Página Inicial
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>Precisa de ajuda? <a href="mailto:support@aicrypto.com" className="text-primary hover:underline">Contate o suporte</a></p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Componente principal que envolve tudo em um Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthErrorContent />
    </Suspense>
  )
}
