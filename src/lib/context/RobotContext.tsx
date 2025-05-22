"use client"

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { RobotManager, type Robot, type RobotPerformance, type TradeHistory } from '@/lib/services/robotManager'
import { useBinance } from './BinanceContext'
import { toast } from 'sonner'

type RobotContextType = {
  robotManager: RobotManager
  robots: Robot[]
  loading: boolean
  toggleRobotActive: (id: string, active: boolean) => boolean
  updateRobotSettings: (id: string, updates: Partial<Robot>) => boolean
  getTradeHistory: (robotId?: string, limit?: number) => TradeHistory[]
  getRobotPerformance: (robotId: string, period?: 'day' | 'week' | 'month' | 'year' | 'all') => RobotPerformance
}

const RobotContext = createContext<RobotContextType | undefined>(undefined)

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { binanceService, isConnected } = useBinance()
  const [robotManager] = useState(() => new RobotManager(binanceService))
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)

  // Inicializar os robôs
  useEffect(() => {
    // Inicializar os robôs padrão
    robotManager.initDefaultRobots()

    // Atualizar a lista de robôs
    setRobots(robotManager.getRobots())
    setLoading(false)

    // Carregar configurações salvas no localStorage
    loadRobotSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ativar/desativar robôs automaticamente quando a conexão Binance mudar
  useEffect(() => {
    if (!loading) {
      // Se a conexão Binance for perdida, desativar todos os robôs
      if (!isConnected) {
        // Usar robotManager.getRobots() em vez de confiar no estado
        const currentRobots = robotManager.getRobots();

        currentRobots.forEach(robot => {
          if (robot.isActive) {
            robotManager.toggleRobotActive(robot.id, false);

            toast.error("Robô desativado", {
              description: `${robot.name} foi desativado devido à desconexão da Binance.`
            });
          }
        });

        // Atualizar a lista de robôs
        setRobots(robotManager.getRobots());
      }
    }
  }, [isConnected, loading, robotManager])

  // Carregar configurações salvas
  const loadRobotSettings = () => {
    try {
      const savedSettings = localStorage.getItem('robot_settings')

      if (savedSettings) {
        const settings = JSON.parse(savedSettings)

        // Aplicar configurações a cada robô
        settings.forEach((setting: Robot) => {
          const { id, isActive, allocationPerTrade, maxOperations, stopLoss, takeProfit } = setting

          robotManager.updateRobot(id, {
            isActive,
            allocationPerTrade,
            maxOperations,
            stopLoss,
            takeProfit
          })

          // Ativar/desativar o robô se a Binance estiver conectada
          if (isConnected && isActive) {
            robotManager.toggleRobotActive(id, true)
          }
        })

        // Atualizar a lista de robôs
        setRobots(robotManager.getRobots())
      }
    } catch (error) {
      console.error('Erro ao carregar configurações dos robôs:', error)
    }
  }

  // Salvar configurações dos robôs
  const saveRobotSettings = () => {
    try {
      const settings = robots.map(robot => ({
        id: robot.id,
        isActive: robot.isActive,
        allocationPerTrade: robot.allocationPerTrade,
        maxOperations: robot.maxOperations,
        stopLoss: robot.stopLoss,
        takeProfit: robot.takeProfit
      }))

      localStorage.setItem('robot_settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Erro ao salvar configurações dos robôs:', error)
    }
  }

  // Ativar/desativar um robô
  const toggleRobotActive = (id: string, active: boolean): boolean => {
    // Verificar se a Binance está conectada
    if (active && !isConnected) {
      toast.error("Conexão necessária", {
        description: "Conecte sua conta Binance antes de ativar um robô."
      })
      return false
    }

    // Ativar/desativar o robô
    const result = robotManager.toggleRobotActive(id, active)

    if (result) {
      // Atualizar a lista de robôs
      setRobots(robotManager.getRobots())

      // Salvar configurações
      saveRobotSettings()

      // Mostrar notificação
      toast.success(active ? "Robô ativado" : "Robô desativado", {
        description: `${robotManager.getRobot(id)?.name} foi ${active ? 'ativado' : 'desativado'} com sucesso.`
      })
    }

    return result
  }

  // Atualizar configurações de um robô
  const updateRobotSettings = (id: string, updates: Partial<Robot>): boolean => {
    const result = robotManager.updateRobot(id, updates)

    if (result) {
      // Atualizar a lista de robôs
      setRobots(robotManager.getRobots())

      // Salvar configurações
      saveRobotSettings()

      // Mostrar notificação
      toast.success("Configurações atualizadas", {
        description: `As configurações de ${robotManager.getRobot(id)?.name} foram atualizadas com sucesso.`
      })
    }

    return result
  }

  // Obter histórico de trades
  const getTradeHistory = (robotId?: string, limit?: number): TradeHistory[] => {
    return robotManager.getTradeHistory(robotId, limit)
  }

  // Obter desempenho de um robô
  const getRobotPerformance = (
    robotId: string,
    period: 'day' | 'week' | 'month' | 'year' | 'all' = 'all'
  ): RobotPerformance => {
    return robotManager.calculatePerformance(robotId, period)
  }

  return (
    <RobotContext.Provider
      value={{
        robotManager,
        robots,
        loading,
        toggleRobotActive,
        updateRobotSettings,
        getTradeHistory,
        getRobotPerformance
      }}
    >
      {children}
    </RobotContext.Provider>
  )
}

export const useRobot = (): RobotContextType => {
  const context = useContext(RobotContext)
  if (!context) {
    throw new Error('useRobot must be used within a RobotProvider')
  }
  return context
}
