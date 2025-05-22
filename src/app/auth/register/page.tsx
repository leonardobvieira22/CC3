import Link from "next/link"
import { Button } from "@/components/ui/button"
import RegisterForm from "@/components/auth/RegisterForm"
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
}

export const metadata: Metadata = {
  title: 'Registro - AI Crypto Trading Platform',
  description: 'Registre-se para começar a usar o trading automatizado com IA',
}

export default function RegisterPage() {
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
                Crie sua conta
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Registre-se para começar a usar o trading automatizado com IA
              </p>
            </div>

            <RegisterForm />

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-highlight hover:text-blue-medium"
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
            <h2 className="text-3xl font-bold mb-4">Comece a operar em minutos</h2>
            <p className="text-lg mb-8 text-center">
              Registre-se, conecte sua conta da Binance e deixe nossos robôs de IA trabalharem para você 24/7.
            </p>
            <ul className="space-y-4 list-disc list-inside">
              <li className="flex items-start">
                <span className="text-blue-highlight text-xl mr-2">✓</span>
                <span>Configure robôs de IA com retornos simulados de 4-7% ao mês</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-highlight text-xl mr-2">✓</span>
                <span>Copy trading para replicar estratégias de traders experientes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-highlight text-xl mr-2">✓</span>
                <span>Bônus de indicação: 10% do investimento de cada amigo</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-highlight text-xl mr-2">✓</span>
                <span>Integração segura com Binance, sem acesso às suas chaves de saque</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-highlight text-xl mr-2">✓</span>
                <span>Dashboard completo com gráficos em tempo real e análises</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
