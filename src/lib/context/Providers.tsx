"use client"

import type React from 'react'
import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { BinanceProvider } from './BinanceContext'
import { RobotProvider } from './RobotContext'
import { AuthProvider } from './AuthContext'
import { Toaster } from "sonner"
import { CookieConsent } from '@/components/CookieConsent'
import { useNotificationStore, setupPushNotifications } from '@/lib/services/notificationService'
import { reportWebVitals } from '@/lib/utils/webVitals'

export function Providers({ children }: { children: React.ReactNode }) {
  // Inicializar notificações push quando o componente montar
  useEffect(() => {
    setupPushNotifications().then(enabled => {
      if (enabled) {
        console.log('Notificações push habilitadas')
      }
    })

    // Iniciar monitoramento de Core Web Vitals
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Carregamento dinâmico do módulo web-vitals
      import('web-vitals').then(() => {
        reportWebVitals()
      }).catch(err => {
        console.error('Erro ao carregar web-vitals:', err)
      })
    }
  }, [])

  // Configurar verificação de alertas de preço quando novos dados de ticker chegarem
  // Isso seria conectado a WebSockets em uma implementação real
  useEffect(() => {
    // Exemplo: a cada 30 segundos, simular uma verificação de preço
    const checkInterval = setInterval(() => {
      const { checkPriceAlerts } = useNotificationStore.getState()

      // Símbolos e preços simulados para teste
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']
      symbols.forEach(symbol => {
        // Gerar um preço aleatório para teste
        const basePrice = symbol === 'BTCUSDT' ? 50000 : symbol === 'ETHUSDT' ? 3000 : 500
        const randomChange = (Math.random() - 0.5) * 0.02 // ±1%
        const price = basePrice * (1 + randomChange)

        // Verificar alertas para este símbolo e preço
        checkPriceAlerts(symbol, price)
      })
    }, 30000)

    return () => clearInterval(checkInterval)
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        storageKey="ai-crypto-theme"
        themes={['light', 'dark']}
      >
        <AuthProvider>
          <BinanceProvider>
            <RobotProvider>
              {children}
              <Toaster
                richColors
                closeButton
                position="top-right"
                theme="system" // Usa o tema do sistema
                toastOptions={{
                  // Melhorando acessibilidade dos toasts
                  className: "group",
                  descriptionClassName: "text-muted-foreground text-sm",
                  duration: 5000,
                  // Garantir que o toast seja anunciado por leitores de tela
                  role: "status",
                  ariaLive: "polite",
                }}
              />
              <CookieConsent />
            </RobotProvider>
          </BinanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
