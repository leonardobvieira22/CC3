"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  Bot as Robot, // Substituindo Robot por Bot (que é o ícone equivalente na versão atual)
  Settings,
  PlusCircle,
  Play,
  Pause,
  Trash2,
  Lock,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRobot } from "@/lib/context/RobotContext"
import { useBinance } from "@/lib/context/BinanceContext"

export default function RobotsPage() {
  const { robots, loading, toggleRobotActive, updateRobotSettings, getRobotPerformance } = useRobot()
  const { isConnected } = useBinance()
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)
  const [robotToDelete, setRobotToDelete] = useState<string | null>(null)
  const [openConfigDialog, setOpenConfigDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [configSettings, setConfigSettings] = useState({
    allocationPerTrade: 5,
    maxOperations: 3,
    stopLoss: 2.5,
    takeProfit: 5
  })

  // Filtrar robôs ativos e disponíveis
  const activeRobots = robots.filter(robot => robot.isActive)
  const availableRobots = robots.filter(robot => !robot.isActive)

  // Calcular estatísticas gerais
  const totalOperations = robots.reduce((total, robot) => {
    const performance = getRobotPerformance(robot.id)
    return total + performance.totalTrades
  }, 0)

  const avgWinRate = robots.reduce((total, robot) => {
    const performance = getRobotPerformance(robot.id)
    return total + (performance.totalTrades > 0 ? performance.winRate : 0)
  }, 0) / (robots.length || 1)

  const monthlyReturn = robots.reduce((total, robot) => {
    if (robot.isActive) {
      const performance = getRobotPerformance(robot.id, 'month')
      return total + performance.returnPercentage
    }
    return total
  }, 0)

  // Manipuladores de eventos
  const handleToggleActive = (robotId: string, active: boolean) => {
    if (!isConnected && active) {
      toast.error("Conecte sua conta Binance antes de ativar um robô")
      return
    }

    toggleRobotActive(robotId, active)
  }

  const handleOpenConfig = (robotId: string) => {
    const robot = robots.find(r => r.id === robotId)
    if (robot) {
      setSelectedRobot(robotId)
      setConfigSettings({
        allocationPerTrade: robot.allocationPerTrade,
        maxOperations: robot.maxOperations,
        stopLoss: robot.stopLoss || 2.5,
        takeProfit: robot.takeProfit || 5
      })
      setOpenConfigDialog(true)
    }
  }

  const handleSaveConfig = () => {
    if (selectedRobot) {
      updateRobotSettings(selectedRobot, {
        allocationPerTrade: configSettings.allocationPerTrade,
        maxOperations: configSettings.maxOperations,
        stopLoss: configSettings.stopLoss,
        takeProfit: configSettings.takeProfit
      })
      setOpenConfigDialog(false)
    }
  }

  const handleOpenDelete = (robotId: string) => {
    setRobotToDelete(robotId)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (robotToDelete) {
      const robot = robots.find(r => r.id === robotToDelete)
      if (robot) {
        toggleRobotActive(robot.id, false)
        toast.success(`${robot.name} foi removido com sucesso`)
      }
      setOpenDeleteDialog(false)
    }
  }

  // Renderização condicional para carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-highlight"></div>
          <p className="text-lg text-muted-foreground">Carregando robôs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Robôs de Trading</h2>
          <p className="text-muted-foreground">
            Gerencie e configure seus robôs de trading automatizado com IA
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">Tutorial</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Robô
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Robô</DialogTitle>
                <DialogDescription>
                  Seu plano gratuito permite apenas 2 robôs ativos.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20 p-4 text-orange-800 dark:text-orange-300">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    <p className="font-medium">Limite de Plano Atingido</p>
                  </div>
                  <p className="text-sm mt-1">
                    Você já atingiu o limite de 2 robôs do plano gratuito. Faça upgrade para adicionar mais robôs.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Fazer Upgrade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!isConnected && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Conta Binance não conectada</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Conecte sua conta Binance para ativar os robôs e começar a operar automaticamente.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Conectar Binance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Desempenho</CardTitle>
          <CardDescription>
            Visão geral do desempenho dos seus robôs de trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Robôs Ativos</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{activeRobots.length}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ 2 disponíveis</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Operações Totais</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{totalOperations}</span>
                <span className="text-sm text-green-500 ml-2">+{Math.floor(totalOperations * 0.075)} (7 dias)</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate Médio</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{avgWinRate.toFixed(1)}%</span>
                <span className="text-sm text-green-500 ml-2">+2.3%</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Retorno Mensal</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold text-green-500">+{monthlyReturn.toFixed(1)}%</span>
                <ArrowUpRight className="h-4 w-4 text-green-500 ml-2" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Uso do Plano</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Robôs ({activeRobots.length}/2)</span>
                <span>{(activeRobots.length / 2 * 100).toFixed(0)}%</span>
              </div>
              <Progress value={activeRobots.length / 2 * 100} className="h-2" />
            </div>

            <div className="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <span className="text-sm text-blue-800 dark:text-blue-300">Faça upgrade para o plano Premium e adicione mais robôs</span>
              <Button size="sm">Upgrade</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Robôs Ativos</TabsTrigger>
          <TabsTrigger value="available">Robôs Disponíveis</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeRobots.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {activeRobots.map(robot => {
                const performance = getRobotPerformance(robot.id)
                return (
                  <Card key={robot.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{robot.name}</CardTitle>
                        <Badge
                          variant={robot.isActive ? "default" : "outline"}
                          className={robot.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {robot.isActive ? "Ativo" : "Pausado"}
                        </Badge>
                      </div>
                      <CardDescription>{robot.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-1 grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Retorno Mensal</p>
                          <p className="text-lg font-medium text-green-500">+{performance.returnPercentage.toFixed(1)}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Operações</p>
                          <p className="text-lg font-medium">{performance.totalTrades}</p>
                        </div>
                        <div className="space-y-1 mt-4">
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="text-lg font-medium">{performance.winRate.toFixed(0)}%</p>
                        </div>
                        <div className="space-y-1 mt-4">
                          <p className="text-sm text-muted-foreground">Perfil de Risco</p>
                          <Badge
                            className={`${
                              robot.riskProfile === "conservative" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" :
                              robot.riskProfile === "moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            } hover:bg-opacity-90`}
                            variant="outline"
                          >
                            {robot.riskProfile === "conservative" ? "Conservador" :
                             robot.riskProfile === "moderate" ? "Moderado" : "Agressivo"}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Pares Operados</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {robot.pairs.map(pair => (
                            <Badge key={pair} variant="outline">{pair.replace('USDT', '/USDT')}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(robot.id, !robot.isActive)}
                        disabled={!isConnected && !robot.isActive}
                      >
                        {robot.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenConfig(robot.id)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDelete(robot.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Robot className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum robô ativo</h3>
                <p className="text-muted-foreground text-center mt-1 mb-4">
                  Você não tem robôs ativos no momento. Ative um robô para começar a operar.
                </p>
                <Button>Ativar Robô</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableRobots.map(robot => {
              // Determinar se é um robô premium (os dois últimos são premium para demonstração)
              const isPremium = ["trend-hunter", "macd-pro"].includes(robot.id)
              const performance = getRobotPerformance(robot.id)

              return (
                <Card key={robot.id} className={isPremium ? "border-amber-200 dark:border-amber-800" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{robot.name}</CardTitle>
                      {isPremium && (
                        <Badge className="bg-amber-500">Premium</Badge>
                      )}
                    </div>
                    <CardDescription>{robot.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-1 grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Retorno Mensal</p>
                        <p className="text-lg font-medium text-green-500">+{performance.returnPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Operações</p>
                        <p className="text-lg font-medium">{performance.totalTrades}</p>
                      </div>
                      <div className="space-y-1 mt-4">
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-medium">{performance.winRate.toFixed(0)}%</p>
                      </div>
                      <div className="space-y-1 mt-4">
                        <p className="text-sm text-muted-foreground">Perfil de Risco</p>
                        <Badge
                          className={`${
                            robot.riskProfile === "conservative" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" :
                            robot.riskProfile === "moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          } hover:bg-opacity-90`}
                          variant="outline"
                        >
                          {robot.riskProfile === "conservative" ? "Conservador" :
                           robot.riskProfile === "moderate" ? "Moderado" : "Agressivo"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Pares Operados</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {robot.pairs.map(pair => (
                          <Badge key={pair} variant="outline">{pair.replace('USDT', '/USDT')}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isPremium ? (
                      <Button className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Desbloquear com Premium
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleToggleActive(robot.id, true)}
                        disabled={activeRobots.length >= 2 || !isConnected}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Ativar Robô
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de configurações */}
      <Dialog open={openConfigDialog} onOpenChange={setOpenConfigDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurar Robô</DialogTitle>
            <DialogDescription>
              Personalize as configurações do robô para otimizar seu desempenho
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium">Configurações de Alocação</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="allocation">Alocação por operação</Label>
                  <span className="text-sm">{configSettings.allocationPerTrade}% do capital</span>
                </div>
                <Slider
                  id="allocation"
                  min={1}
                  max={20}
                  step={1}
                  value={[configSettings.allocationPerTrade]}
                  onValueChange={(value) => setConfigSettings({...configSettings, allocationPerTrade: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Porcentagem do seu capital que será alocada em cada operação do robô
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="maxOperations">Operações simultâneas</Label>
                  <span className="text-sm">{configSettings.maxOperations}</span>
                </div>
                <Slider
                  id="maxOperations"
                  min={1}
                  max={10}
                  step={1}
                  value={[configSettings.maxOperations]}
                  onValueChange={(value) => setConfigSettings({...configSettings, maxOperations: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Número máximo de operações que o robô pode fazer ao mesmo tempo
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Gestão de Risco</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <span className="text-sm">{configSettings.stopLoss}%</span>
                </div>
                <Slider
                  id="stopLoss"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={[configSettings.stopLoss]}
                  onValueChange={(value) => setConfigSettings({...configSettings, stopLoss: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Limite de perda para encerrar automaticamente uma operação
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <span className="text-sm">{configSettings.takeProfit}%</span>
                </div>
                <Slider
                  id="takeProfit"
                  min={1}
                  max={20}
                  step={0.5}
                  value={[configSettings.takeProfit]}
                  onValueChange={(value) => setConfigSettings({...configSettings, takeProfit: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Limite de lucro para encerrar automaticamente uma operação
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações</Label>
                <p className="text-xs text-muted-foreground">
                  Receber alertas sobre operações
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfigDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Robô</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este robô?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Esta ação irá desativar o robô e remover todas as suas configurações. As operações em andamento serão encerradas.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Confirmar Remoção</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
