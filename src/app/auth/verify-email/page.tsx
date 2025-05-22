import EmailVerificationForm from "@/components/auth/EmailVerificationForm"
import Link from "next/link"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
}

export const metadata: Metadata = {
  title: 'Verificar Email - AI Crypto Trading Platform',
  description: 'Verifique seu endereço de email para ativar sua conta na plataforma de trading automatizado com IA',
}

export default function VerifyEmailPage({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  const token = searchParams.token || '';
  const email = searchParams.email || '';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8">
          <div className="max-w-md w-full space-y-6 sm:space-y-8">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                  AI Crypto
                </h2>
              </Link>
              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Verificação de Email
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Verifique seu email para ativar sua conta
              </p>
            </div>

            <EmailVerificationForm token={token} email={email} />

            <div className="text-center mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Já verificou seu email?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Background Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/images/register-bg.jpg')",
          }}
        >
          <div className="h-full flex flex-col justify-center items-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Quase lá!</h2>
            <p className="text-lg mb-8 text-center">
              A verificação do seu email é um passo importante para garantir a segurança da sua conta e permitir que você aproveite todos os recursos da nossa plataforma.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
              <h3 className="font-bold text-xl mb-4">Benefícios da verificação:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Maior segurança para sua conta</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Acesso a todas as funcionalidades da plataforma</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Recebimento de alertas e notificações importantes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Proteção contra atividades não autorizadas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
