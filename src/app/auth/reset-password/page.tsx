import Link from "next/link"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
}

export const metadata: Metadata = {
  title: 'Redefinir Senha - AI Crypto Trading Platform',
  description: 'Redefina sua senha na plataforma de trading automatizado com IA',
}

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || '';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8">
          <div className="max-w-md w-full space-y-6 sm:space-y-8">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight">
                  AI Crypto
                </h2>
              </Link>
              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Redefinir Senha
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Crie uma nova senha segura para sua conta
              </p>
            </div>

            <ResetPasswordForm token={token} />

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembrou sua senha?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-highlight hover:text-blue-medium"
                >
                  Voltar para o login
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
              "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/images/login-bg.jpg')",
          }}
        >
          <div className="h-full flex flex-col justify-center items-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Proteja sua conta</h2>
            <p className="text-lg mb-8 text-center">
              Crie uma senha forte e única para proteger seu acesso. Recomendamos usar uma combinação de letras, números e símbolos.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
              <h3 className="font-bold text-xl mb-4">Dicas para uma senha forte:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Use pelo menos 12 caracteres</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Combine letras maiúsculas e minúsculas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Inclua números e símbolos especiais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Evite informações pessoais ou palavras comuns</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
