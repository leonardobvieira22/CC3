import Link from "next/link"
import { Button } from "@/components/ui/button"
import LoginForm from "@/components/auth/LoginForm"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
}

export const metadata: Metadata = {
  title: 'Login - AI Crypto Trading Platform',
  description: 'Acesse sua conta para começar a usar o trading automatizado com IA',
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight">
                  AI Crypto
                </h2>
              </Link>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Entre na sua conta
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Acesse sua conta para começar a usar o trading automatizado com IA
              </p>
            </div>

            <LoginForm />

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-highlight hover:text-blue-medium"
                >
                  Registre-se agora
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
            <h2 className="text-3xl font-bold mb-4">Maximize seus lucros com IA</h2>
            <p className="text-lg mb-8 text-center">
              Nossa plataforma utiliza algoritmos avançados de IA para analisar o mercado e executar trades com precisão.
            </p>
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">+5.000</h3>
                <p className="text-sm">Traders ativos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">4-7%</h3>
                <p className="text-sm">Retorno mensal</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">120+</h3>
                <p className="text-sm">Pares de trading</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">99.9%</h3>
                <p className="text-sm">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
