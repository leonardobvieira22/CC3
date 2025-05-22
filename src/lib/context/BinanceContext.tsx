"use client"

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { BinanceService } from '@/lib/services/binance'
import { toast } from 'sonner'
import { getBinanceCredentials } from '@/lib/config/api-keys'
import { useAuth } from '@/lib/context/AuthContext'

type BinanceContextType = {
  binanceService: BinanceService
  isConnected: boolean
  isConnecting: boolean
  isDemoMode: boolean
  connectBinance: (apiKey: string, apiSecret: string) => Promise<boolean>
  disconnectBinance: () => void
  toggleDemoMode: () => void
}

const BinanceContext = createContext<BinanceContextType | undefined>(undefined)

export const BinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [binanceService] = useState(() => new BinanceService())
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false) // Começa sem modo de demonstração
  const { isAuthenticated } = useAuth() // NOVO: pega estado de autenticação

  // Inicializar o contexto
  useEffect(() => {
    if (!isAuthenticated) {
      setIsDemoMode(true)
      setIsConnected(false)
      return
    }
    // Tentar usar credenciais salvas
    const credentials = getBinanceCredentials()
    if (credentials.apiKey && credentials.apiSecret) {
      // Tentar conectar usando credenciais salvas
      connectBinance(credentials.apiKey, credentials.apiSecret).catch(error => {
        console.error('Falha ao conectar com a Binance:', error)
        setIsDemoMode(true) // Apenas em caso de erro ativa o modo de demonstração
      })
    } else {
      // Se não há credenciais, usa modo de demonstração
      setIsDemoMode(true)
      setIsConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // Conectar à API da Binance
  const connectBinance = async (apiKey: string, apiSecret: string): Promise<boolean> => {
    setIsConnecting(true)

    try {
      binanceService.setCredentials(apiKey, apiSecret)

      // Testar a conexão buscando informações da conta
      const pingSuccess = await binanceService.ping()

      if (!pingSuccess) {
        throw new Error("Não foi possível conectar à API da Binance")
      }

      // Se chegar aqui, a conexão foi bem-sucedida
      localStorage.setItem('binance_api_key', apiKey)
      localStorage.setItem('binance_api_secret', apiSecret)
      setIsConnected(true)
      setIsDemoMode(false) // Desativa o modo de demonstração se a conexão for bem-sucedida

      toast.success("Conexão estabelecida", {
        description: "Sua conta Binance foi conectada com sucesso."
      })

      return true
    } catch (error) {
      console.error('Erro ao conectar com a Binance:', error)

      // Ativar modo de demonstração caso haja erro
      setIsDemoMode(true)
      setIsConnected(false)

      toast.error("Falha na conexão", {
        description: "Não foi possível conectar à API da Binance. Verifique suas credenciais."
      })

      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Desconectar da API da Binance
  const disconnectBinance = () => {
    binanceService.setCredentials('', '')
    localStorage.removeItem('binance_api_key')
    localStorage.removeItem('binance_api_secret')
    setIsConnected(false)
    setIsDemoMode(true) // Ativa o modo de demonstração ao desconectar

    toast.success("Desconectado", {
      description: "Sua conta Binance foi desconectada."
    })
  }

  // Alternar modo de demonstração
  const toggleDemoMode = () => {
    // Verificar se pode desativar o modo de demonstração
    if (isDemoMode && !isConnected) {
      toast.error("Não é possível desativar o modo de demonstração", {
        description: "Conecte-se à API da Binance para usar dados reais."
      })
      return
    }

    setIsDemoMode(!isDemoMode)

    if (!isDemoMode) {
      toast.info("Modo de demonstração ativado", {
        description: "Usando dados simulados para fins de visualização."
      })
    } else {
      toast.info("Modo de demonstração desativado", {
        description: "Usando dados reais da API da Binance."
      })
    }
  }

  return (
    <BinanceContext.Provider
      value={{
        binanceService,
        isConnected,
        isConnecting,
        isDemoMode,
        connectBinance,
        disconnectBinance,
        toggleDemoMode
      }}
    >
      {children}
    </BinanceContext.Provider>
  )
}

export const useBinance = (): BinanceContextType => {
  const context = useContext(BinanceContext)
  if (!context) {
    throw new Error('useBinance must be used within a BinanceProvider')
  }
  return context
}
