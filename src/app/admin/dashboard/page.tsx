"use client"

import React from 'react'
import {
  Users,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Bot,
  BarChart3,
  Bell,
  Activity,
  Clock,
  TrendingUp,
  LineChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AreaChart, BarChart, LineChart as LineChartComponent } from '@/components/admin/Charts'
import { UserTable } from '@/components/admin/UserTable'
import { RecentTransactions } from '@/components/admin/RecentTransactions'
import { StatusCards } from '@/components/admin/StatusCards'

export default function AdminDashboard() {
  // Dados de exemplo para os gráficos
  const userGrowthData = [
    { date: '2023-06-01', users: 854 },
    { date: '2023-07-01', users: 1244 },
    { date: '2023-08-01', users: 1498 },
    { date: '2023-09-01', users: 1835 },
    { date: '2023-10-01', users: 2255 },
    { date: '2023-11-01', users: 2687 },
    { date: '2023-12-01', users: 3012 },
    { date: '2024-01-01', users: 3486 },
    { date: '2024-02-01', users: 4102 },
    { date: '2024-03-01', users: 4731 },
    { date: '2024-04-01', users: 5210 },
    { date: '2024-05-01', users: 5820 }
  ]

  const tradingVolumeData = [
    { date: '2023-12-01', volume: 12450000 },
    { date: '2023-12-08', volume: 14320000 },
    { date: '2023-12-15', volume: 13100000 },
    { date: '2023-12-22', volume: 15800000 },
    { date: '2023-12-29', volume: 17650000 },
    { date: '2024-01-05', volume: 19300000 },
    { date: '2024-01-12', volume: 18200000 },
    { date: '2024-01-19', volume: 21500000 },
    { date: '2024-01-26', volume: 24300000 },
    { date: '2024-02-02', volume: 23100000 },
    { date: '2024-02-09', volume: 25400000 },
    { date: '2024-02-16', volume: 27800000 },
    { date: '2024-02-23', volume: 29100000 },
    { date: '2024-03-01', volume: 31500000 },
    { date: '2024-03-08', volume: 34200000 },
    { date: '2024-03-15', volume: 32800000 },
    { date: '2024-03-22', volume: 35600000 },
    { date: '2024-03-29', volume: 38100000 },
    { date: '2024-04-05', volume: 41200000 },
    { date: '2024-04-12', volume: 43500000 },
    { date: '2024-04-19', volume: 45800000 },
    { date: '2024-04-26', volume: 48200000 },
    { date: '2024-05-03', volume: 52100000 },
    { date: '2024-05-10', volume: 55800000 },
    { date: '2024-05-17', volume: 58200000 }
  ]

  const revenueData = [
    { date: '2024-01-01', revenueFromSubscriptions: 45000, revenueFromTrading: 78000, totalRevenue: 123000 },
    { date: '2024-02-01', revenueFromSubscriptions: 52000, revenueFromTrading: 85000, totalRevenue: 137000 },
    { date: '2024-03-01', revenueFromSubscriptions: 63000, revenueFromTrading: 95000, totalRevenue: 158000 },
    { date: '2024-04-01', revenueFromSubscriptions: 68000, revenueFromTrading: 110000, totalRevenue: 178000 },
    { date: '2024-05-01', revenueFromSubscriptions: 79000, revenueFromTrading: 135000, totalRevenue: 214000 }
  ]

  const popularRobotsData = [
    { name: 'RSI Master', trades: 4862, winRate: 76, users: 1243 },
    { name: 'Bollinger IA', trades: 3975, winRate: 72, users: 955 },
    { name: 'MACD Strategy', trades: 3421, winRate: 68, users: 842 },
    { name: 'Smart Algo', trades: 2983, winRate: 81, users: 765 },
    { name: 'Momentum Pro', trades: 2510, winRate: 74, users: 612 }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Painel Administrativo</h2>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle da AI Crypto Trading.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Tabs defaultValue="today" className="w-[240px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Hoje</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cartões de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Totais
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,820</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+17%</span>
              <span className="text-muted-foreground">em relação ao mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total (Maio)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$214,000</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+20.2%</span>
              <span className="text-muted-foreground">crescimento mensal</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Robôs Ativos
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+3</span>
              <span className="text-muted-foreground">novos este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Volume de Trading
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$58.2M</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+4.3%</span>
              <span className="text-muted-foreground">esta semana</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Crescimento de Usuários</CardTitle>
            <CardDescription>
              Número total de usuários registrados por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <AreaChart
                data={userGrowthData}
                xField="date"
                yField="users"
                color="#2563eb"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Volume de Trading</CardTitle>
            <CardDescription>
              Volume total de transações em USD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChartComponent
                data={tradingVolumeData}
                xField="date"
                yField="volume"
                color="#16a34a"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de receitas e robôs populares */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Receita por Canal</CardTitle>
            <CardDescription>
              Assinaturas vs. Taxas de Trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={revenueData}
                xField="date"
                series={[
                  { name: 'Assinaturas', value: 'revenueFromSubscriptions', color: '#2563eb' },
                  { name: 'Trading Fees', value: 'revenueFromTrading', color: '#16a34a' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Robôs mais Populares</CardTitle>
              <CardDescription>
                Baseado no número de usuários
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {popularRobotsData.map((robot) => (
                <div key={robot.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      robot.name === 'RSI Master' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500' :
                      robot.name === 'Bollinger IA' ? 'bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400' :
                      robot.name === 'MACD Strategy' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500' :
                      'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      <span className="text-sm font-bold">#{popularRobotsData.findIndex(r => r.name === robot.name) + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{robot.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Activity className="mr-1 h-3 w-3" />
                        <span>{robot.trades} trades</span>
                        <span className="mx-2">•</span>
                        <span className={robot.winRate >= 75 ? "text-green-500" : robot.winRate >= 70 ? "text-lime-500" : "text-yellow-500"}>
                          {robot.winRate}% win rate
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={`${robot.name}-avatar-${j}`} className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">+{robot.users}</div>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Gerenciar Robôs
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Seção de novos usuários e transações recentes */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Novos Usuários</CardTitle>
            <CardDescription>
              Usuários mais recentes cadastrados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserTable limit={5} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Exportar Lista</Button>
            <Button>Ver Todos os Usuários</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-full md:col-span-3">
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas movimentações financeiras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions limit={5} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Histórico Completo
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Cards de status de serviços */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Serviços</CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos serviços da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatusCards />
        </CardContent>
      </Card>
    </div>
  )
}