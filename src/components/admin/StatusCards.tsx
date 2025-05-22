"use client"

import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Database,
  Server,
  Shield,
  Globe,
  Cpu,
  ArrowRightLeft,
  MessageSquare,
  Bot,
  LineChart,
  Clock
} from 'lucide-react'

// Dados de exemplo para o status dos serviços
const serviceStatus = [
  {
    id: 'api_gateway',
    name: 'API Gateway',
    status: 'operational',
    icon: <Globe className="h-5 w-5" />,
    responseTime: 24,
    uptime: 99.99,
    lastIncident: null
  },
  {
    id: 'auth_service',
    name: 'Serviço de Autenticação',
    status: 'operational',
    icon: <Shield className="h-5 w-5" />,
    responseTime: 42,
    uptime: 99.98,
    lastIncident: '2024-04-12T14:32:00Z'
  },
  {
    id: 'trading_engine',
    name: 'Motor de Trading',
    status: 'operational',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    responseTime: 18,
    uptime: 99.95,
    lastIncident: null
  },
  {
    id: 'binance_integration',
    name: 'Integração Binance',
    status: 'degraded',
    icon: <LineChart className="h-5 w-5" />,
    responseTime: 156,
    uptime: 98.72,
    lastIncident: '2024-05-18T09:15:00Z',
    message: 'Performance reduzida em algumas operações'
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    status: 'operational',
    icon: <Database className="h-5 w-5" />,
    responseTime: 32,
    uptime: 99.99,
    lastIncident: null
  },
  {
    id: 'ai_service',
    name: 'Serviço de IA',
    status: 'operational',
    icon: <Bot className="h-5 w-5" />,
    responseTime: 87,
    uptime: 99.90,
    lastIncident: '2024-04-23T18:45:00Z'
  },
  {
    id: 'notifications',
    name: 'Serviço de Notificações',
    status: 'operational',
    icon: <MessageSquare className="h-5 w-5" />,
    responseTime: 53,
    uptime: 99.97,
    lastIncident: null
  },
  {
    id: 'scheduler',
    name: 'Agendador de Tarefas',
    status: 'operational',
    icon: <Clock className="h-5 w-5" />,
    responseTime: 41,
    uptime: 99.95,
    lastIncident: null
  },
  {
    id: 'websocket',
    name: 'WebSocket',
    status: 'incident',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    responseTime: 210,
    uptime: 97.42,
    lastIncident: '2024-05-19T10:25:00Z',
    message: 'Atualizações em tempo real estão enfrentando interrupções intermitentes'
  },
  {
    id: 'worker_nodes',
    name: 'Nós de Processamento',
    status: 'operational',
    icon: <Cpu className="h-5 w-5" />,
    responseTime: 35,
    uptime: 99.98,
    lastIncident: null
  }
]

export const StatusCards: React.FC = () => {
  // Função para formatar o status do serviço
  const formatStatus = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Operacional
          </Badge>
        )
      case 'degraded':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Desempenho Reduzido
          </Badge>
        )
      case 'incident':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            Incidente
          </Badge>
        )
      case 'maintenance':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            Manutenção
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  // Função para formatar o tempo de resposta
  const formatResponseTime = (ms: number) => {
    if (ms <= 50) {
      return (
        <span className="text-green-600 dark:text-green-400">{ms}ms</span>
      )
    } else if (ms <= 100) {
      return (
        <span className="text-yellow-600 dark:text-yellow-400">{ms}ms</span>
      )
    } else {
      return (
        <span className="text-red-600 dark:text-red-400">{ms}ms</span>
      )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {serviceStatus.map((service) => (
        <Card key={service.id} className={`overflow-hidden border ${
          service.status === 'operational' ? 'border-green-200 dark:border-green-900/40' :
          service.status === 'degraded' ? 'border-yellow-200 dark:border-yellow-900/40' :
          service.status === 'incident' ? 'border-red-200 dark:border-red-900/40' :
          'border-gray-200 dark:border-gray-800'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                service.status === 'operational' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                service.status === 'degraded' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                service.status === 'incident' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {service.icon}
              </div>
              <div className="mt-1">
                {formatStatus(service.status)}
              </div>
            </div>

            <div className="mt-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{service.name}</h3>
              {service.message && (
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{service.message}</p>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <div className="font-medium mb-1">Tempo de Resposta</div>
                <div>{formatResponseTime(service.responseTime)}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Uptime</div>
                <div className="text-green-600 dark:text-green-400">{service.uptime}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
