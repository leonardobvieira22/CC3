import Link from "next/link"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
}

export const metadata: Metadata = {
  title: 'Recuperar Senha - AI Crypto Trading Platform',
  description: 'Solicite a recuperação de sua senha na plataforma de trading automatizado com IA',
}

export default function ForgotPasswordPage() {
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
                Recuperar Senha
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Informe seu e-mail para receber instruções de recuperação
              </p>
            </div>

            <ForgotPasswordForm />

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
            <h2 className="text-3xl font-bold mb-4">Recupere seu acesso</h2>
            <p className="text-lg mb-8 text-center">
              Entendemos que às vezes senhas são esquecidas. Informe seu email e enviaremos instruções para criar uma nova senha de forma segura.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg w-full max-w-md">
              <h3 className="font-bold text-xl mb-4">Dicas de segurança:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Nunca compartilhe sua senha com outras pessoas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Crie senhas fortes e únicas para cada serviço</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Use um gerenciador de senhas para maior segurança</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-highlight text-xl mr-2">✓</span>
                  <span>Ative a autenticação em duas etapas sempre que possível</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
