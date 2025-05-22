import './globals.css'
import { Providers } from '@/lib/context/Providers'
import { A11ySkipLink } from '@/components/shared/A11ySkipLink'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F1115' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'AI Crypto Trading Platform',
  description: 'A plataforma de trading automatizado com inteligência artificial mais avançada do mercado',
  metadataBase: new URL('https://ai-crypto-trading.com'),
  applicationName: 'AI Crypto Trading',
  authors: [{ name: 'AI Crypto Team' }],
  keywords: ['trading', 'crypto', 'IA', 'algoritmo', 'bitcoin', 'investimento', 'automação'],
  twitter: {
    card: 'summary_large_image',
    title: 'AI Crypto Trading Platform',
    description: 'A plataforma de trading automatizado com inteligência artificial mais avançada do mercado',
  },
  openGraph: {
    type: 'website',
    title: 'AI Crypto Trading Platform',
    description: 'A plataforma de trading automatizado com inteligência artificial mais avançada do mercado',
    siteName: 'AI Crypto Trading',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Metas de segurança */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https://*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      </head>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        {/* Skip link para acessibilidade por teclado */}
        <A11ySkipLink />

        <Providers>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
