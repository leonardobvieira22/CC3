"use client"

import React, { useState } from 'react'
import { UserTable } from '@/components/admin/UserTable'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart } from '@/components/admin/Charts'
import {
  Search,
  Filter,
  Download,
  UserPlus,
  BarChart2,
  PieChart as PieChartIcon,
  Users,
  UserMinus,
  Clock,
  UserCheck,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Dados de exemplo para os gráficos
const userGrowthData = [
  { date: '2023-12-01', newUsers: 124 },
  { date: '2024-01-01', newUsers: 245 },
  { date: '2024-02-01', newUsers: 312 },
  { date: '2024-03-01', newUsers: 287 },
  { date: '2024-04-01', newUsers: 345 },
  { date: '2024-05-01', newUsers: 410 }
]

const userPlanData = [
  { name: 'Premium', value: 1420, color: '#2563eb' },
  { name: 'Standard', value: 2105, color: '#7c3aed' },
  { name: 'Gratuito', value: 2295, color: '#64748b' }
]

const userActivityData = [
  { name: 'Ativos', value: 4250, color: '#16a34a' },
  { name: 'Inativos', value: 1350, color: '#d1d5db' },
  { name: 'Suspensos', value: 220, color: '#ef4444' }
]

const userRetentionData = [
  { date: '2023-12-01', retention: 92 },
  { date: '2024-01-01', retention: 88 },
  { date: '2024-02-01', retention: 91 },
  { date: '2024-03-01', retention: 87 },
  { date: '2024-04-01', retention: 90 },
  { date: '2024-05-01', retention: 93 }
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('todos')

  // Métrica simples
  const userStats = {
    total: 5820,
    active: 4250,
    inactive: 1350,
    suspended: 220,
    premium: 1420,
    standard: 2105,
    free: 2295,
    growth: '+18%',
    retention: '93%'
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie todos os usuários da plataforma AI Crypto Trading.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Cartões de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <span>{userStats.growth}</span>
              <span className="text-muted-foreground">em 30 dias</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Ativos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.active.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-500">{((userStats.active / userStats.total) * 100).toFixed(1)}%</span>
              <span className="text-muted-foreground">do total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Premium
            </CardTitle>
            <Badge className="bg-blue-600 hover:bg-blue-700">PRO</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.premium.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-blue-600 dark:text-blue-400">{((userStats.premium / userStats.total) * 100).toFixed(1)}%</span>
              <span className="text-muted-foreground">do total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Retenção
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.retention}</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <span>+2.3%</span>
              <span className="text-muted-foreground">do mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de usuários */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>
                Novos usuários registrados por mês
              </CardDescription>
            </div>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={userGrowthData}
                xField="date"
                series={[
                  { name: 'Novos Usuários', value: 'newUsers', color: '#2563eb' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Taxa de Retenção</CardTitle>
              <CardDescription>
                Percentual de usuários ativos por mês
              </CardDescription>
            </div>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart
                data={userRetentionData}
                xField="date"
                series={[
                  { name: 'Retenção (%)', value: 'retention', color: '#16a34a' }
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de usuários */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
            <CardDescription>
              Número de usuários por tipo de plano
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex justify-center space-x-4 mb-6">
                {userPlanData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{((item.value / userStats.total) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              <div className="h-[200px] flex items-center justify-center">
                <div className="w-48 h-48 relative rounded-full overflow-hidden flex items-center justify-center">
                  {userPlanData.map((item, index) => {
                    const total = userPlanData.reduce((acc, curr) => acc + curr.value, 0)
                    const percentage = (item.value / total) * 100
                    let rotation = 0
                    for (let i = 0; i < index; i++) {
                      rotation += (userPlanData[i].value / total) * 360
                    }

                    return (
                      <div
                        key={item.name}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                          backgroundColor: item.color,
                          clipPath: `conic-gradient(from ${rotation}deg, transparent 0%, transparent 0%, currentColor 0%, currentColor 100%)`,
                          color: item.color,
                          transform: `rotate(${rotation}deg)`,
                          transformOrigin: 'center',
                          WebkitClipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((percentage * 3.6 * Math.PI) / 180)}% ${50 - 50 * Math.sin((percentage * 3.6 * Math.PI) / 180)}%, 50% 50%)`
                        }}
                      />
                    )
                  })}
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
                    <span className="text-xl font-bold">{userStats.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6">
                {userPlanData.map((item) => (
                  <Card key={item.name} className="p-2">
                    <div className="text-center">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-2xl font-bold mt-1" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status de Atividade</CardTitle>
            <CardDescription>
              Distribuição dos usuários por status de atividade
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex justify-center space-x-4 mb-6">
                {userActivityData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{((item.value / userStats.total) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              <div className="h-[200px] flex items-center justify-center">
                <div className="w-48 h-48 relative rounded-full overflow-hidden flex items-center justify-center">
                  {userActivityData.map((item, index) => {
                    const total = userActivityData.reduce((acc, curr) => acc + curr.value, 0)
                    const percentage = (item.value / total) * 100
                    let rotation = 0
                    for (let i = 0; i < index; i++) {
                      rotation += (userActivityData[i].value / total) * 360
                    }

                    return (
                      <div
                        key={item.name}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                          backgroundColor: item.color,
                          clipPath: `conic-gradient(from ${rotation}deg, transparent 0%, transparent 0%, currentColor 0%, currentColor 100%)`,
                          color: item.color,
                          transform: `rotate(${rotation}deg)`,
                          transformOrigin: 'center',
                          WebkitClipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((percentage * 3.6 * Math.PI) / 180)}% ${50 - 50 * Math.sin((percentage * 3.6 * Math.PI) / 180)}%, 50% 50%)`
                        }}
                      />
                    )
                  })}
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
                    <span className="text-xl font-bold">{userStats.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6">
                {userActivityData.map((item) => (
                  <Card key={item.name} className="p-2">
                    <div className="text-center">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-2xl font-bold mt-1" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de usuários com filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                Gerencie todos os usuários registrados na plataforma
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar usuários..."
                  className="w-full md:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Ativos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserMinus className="mr-2 h-4 w-4" />
                        <span>Inativos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Todos</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filtrar por Plano</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <span className="mr-2 text-blue-600 dark:text-blue-400 font-bold">P</span>
                        <span>Premium</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="mr-2 text-purple-600 dark:text-purple-400 font-bold">S</span>
                        <span>Standard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="mr-2 text-gray-600 dark:text-gray-400 font-bold">F</span>
                        <span>Gratuito</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="todos" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="ativos">Ativos</TabsTrigger>
              <TabsTrigger value="inativos">Inativos</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <UserTable />
            </TabsContent>
            <TabsContent value="ativos">
              <UserTable />
            </TabsContent>
            <TabsContent value="inativos">
              <UserTable />
            </TabsContent>
            <TabsContent value="premium">
              <UserTable />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">1-10</span> de <span className="font-medium">{userStats.total}</span> usuários
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              ...
            </Button>
            <Button variant="outline" size="sm">
              42
            </Button>
            <Button variant="outline" size="sm">
              Próximo
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}