"use client"

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  PaperTradingService,
  type PaperWallet,
  type PaperTradingConfig,
  type PaperPosition,
  PaperOrder,
  PaperTransaction
} from '@/lib/services/paperTrading'
import { useBinance } from '@/lib/context/BinanceContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  ShoppingCart,
  RefreshCw,
  Settings,
  Wallet,
  LineChart,
  CandlestickChart,
  CircleDollarSign
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// Função para aumentar contraste baseado em nosso tema
const getHighContrastText = (isDarkMode = false) => {
  return isDarkMode ? 'text-white font-medium' : 'text-foreground font-medium';
};

// Constantes
const AVAILABLE_SYMBOLS = [
  { value: 'BTCUSDT', label: 'BTC/USDT' },
  { value: 'ETHUSDT', label: 'ETH/USDT' },
  { value: 'BNBUSDT', label: 'BNB/USDT' },
  { value: 'SOLUSDT', label: 'SOL/USDT' },
  { value: 'DOTUSDT', label: 'DOT/USDT' },
  { value: 'ADAUSDT', label: 'ADA/USDT' }
]

// Schema para formulário de configurações
const configFormSchema = z.object({
  initialCapital: z.number().min(10, { message: 'O capital inicial deve ser pelo menos 10 USDT' }),
  feePercentage: z.number().min(0, { message: 'A taxa deve ser maior ou igual a 0' }).max(10, { message: 'A taxa deve ser menor ou igual a 10%' }),
  defaultLeverageSpot: z.number().min(1, { message: 'A alavancagem spot deve ser pelo menos 1x' }).max(1, { message: 'A alavancagem spot deve ser no máximo 1x' }),
  defaultLeverageMargin: z.number().min(1, { message: 'A alavancagem de margem deve ser pelo menos 1x' }).max(100, { message: 'A alavancagem de margem deve ser no máximo 100x' }),
  enableMarginTrading: z.boolean(),
  defaultOrderSize: z.number().min(1, { message: 'O tamanho padrão da ordem deve ser pelo menos 1%' }).max(100, { message: 'O tamanho padrão da ordem deve ser no máximo 100%' }),
  stopLoss: z.number().min(0, { message: 'O stop loss deve ser maior ou igual a 0' }).max(100, { message: 'O stop loss deve ser menor ou igual a 100%' }),
  takeProfit: z.number().min(0, { message: 'O take profit deve ser maior ou igual a 0' }).max(500, { message: 'O take profit deve ser menor ou igual a 500%' })
})

// Schema para formulário de ordem
const orderFormSchema = z.object({
  symbol: z.string().min(1, { message: 'Selecione um par de trading' }),
  side: z.enum(['BUY', 'SELL']),
  orderSize: z.number().min(1, { message: 'O tamanho da ordem deve ser pelo menos 1%' }).max(100, { message: 'O tamanho da ordem deve ser no máximo 100%' }),
  leverage: z.number().min(1, { message: 'A alavancagem deve ser pelo menos 1x' }),
  stopLoss: z.number().min(0, { message: 'O stop loss deve ser maior ou igual a 0' }).max(100, { message: 'O stop loss deve ser menor ou igual a 100%' }),
  takeProfit: z.number().min(0, { message: 'O take profit deve ser maior ou igual a 0' }).max(500, { message: 'O take profit deve ser menor ou igual a 500%' })
})

// Schema para formulário de depósito/retirada
const fundFormSchema = z.object({
  amount: z.number().min(1, { message: 'O valor deve ser pelo menos 1 USDT' }),
  action: z.enum(['deposit', 'withdraw'])
})

export default function PaperTradingPanel() {
  // Estados
  const [activeTab, setActiveTab] = useState('overview')
  const [paperService, setPaperService] = useState<PaperTradingService | null>(null)
  const [wallet, setWallet] = useState<PaperWallet | null>(null)
  const [config, setConfig] = useState<PaperTradingConfig | null>(null)
  const [symbolPrices, setSymbolPrices] = useState<Record<string, number>>({})
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<PaperPosition | null>(null)

  // Para acessibilidade: tipo de tamanho de ordem (porcentagem ou valor fixo)
  const [orderSizeType, setOrderSizeType] = useState<'percentage' | 'fixed'>('percentage')

  // Context
  const { binanceService, isConnected } = useBinance()

  // Forms
  const configForm = useForm<z.infer<typeof configFormSchema>>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      initialCapital: 10000,
      feePercentage: 0.1,
      defaultLeverageSpot: 1,
      defaultLeverageMargin: 5,
      enableMarginTrading: false,
      defaultOrderSize: 10,
      stopLoss: 5,
      takeProfit: 15
    }
  })

  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      symbol: 'BTCUSDT',
      side: 'BUY',
      orderSize: 10,
      leverage: 1,
      stopLoss: 5,
      takeProfit: 15
    }
  })

  const fundForm = useForm<z.infer<typeof fundFormSchema>>({
    resolver: zodResolver(fundFormSchema),
    defaultValues: {
      amount: 1000,
      action: 'deposit'
    }
  })

  // Inicializar serviço de Paper Trading
  useEffect(() => {
    if (binanceService) {
      const service = new PaperTradingService(binanceService)
      setPaperService(service)
      setWallet(service.getWallet())
      setConfig(service.getConfig())

      // Atualizar carteira a cada 15 segundos
      const interval = setInterval(() => {
        if (service) {
          setWallet(service.getWallet())
        }
      }, 15000)

      // Cleanup
      return () => {
        clearInterval(interval)
        if (service) {
          service.cleanup()
        }
      }
    }
  }, [binanceService])

  // Atualizar formulário de configuração quando config mudar
  useEffect(() => {
    if (config) {
      configForm.reset(config)
    }
  }, [config, configForm])

  // Atualizar preços dos símbolos
  useEffect(() => {
    const updatePrices = async () => {
      if (!binanceService) return

      try {
        const prices: Record<string, number> = {}

        // Obter preços dos símbolos disponíveis
        for (const symbolObj of AVAILABLE_SYMBOLS) {
          try {
            const ticker = await binanceService.getTickerPrice(symbolObj.value)
            prices[symbolObj.value] = Number.parseFloat(ticker.price)
          } catch (error) {
            console.error(`Erro ao buscar preço para ${symbolObj.value}:`, error)
          }
        }

        setSymbolPrices(prices)
      } catch (error) {
        console.error('Erro ao atualizar preços:', error)
      }
    }

    updatePrices()

    // Atualizar preços a cada 30 segundos
    const interval = setInterval(updatePrices, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [binanceService])

  // Funções para manipular a carteira de paper trading
  const handleUpdateConfig = (values: z.infer<typeof configFormSchema>) => {
    if (!paperService) return

    try {
      paperService.updateConfig(values)
      setConfig(paperService.getConfig())
      toast.success('Configurações atualizadas com sucesso')
      setIsConfigDialogOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error('Erro ao atualizar configurações')
    }
  }

  const handleResetWallet = () => {
    if (!paperService) return

    if (window.confirm('Tem certeza que deseja resetar sua carteira? Esta ação não pode ser desfeita.')) {
      try {
        paperService.resetWallet()
        setWallet(paperService.getWallet())
        toast.success('Carteira resetada com sucesso')
      } catch (error) {
        console.error('Erro ao resetar carteira:', error)
        toast.error('Erro ao resetar carteira')
      }
    }
  }

  const handleCreateOrder = async (values: z.infer<typeof orderFormSchema>) => {
    if (!paperService) return

    try {
      const order = await paperService.createMarketOrder(
        values.symbol,
        values.side,
        undefined,
        values.orderSize,
        values.leverage,
        values.stopLoss,
        values.takeProfit
      )

      setWallet(paperService.getWallet())
      toast.success(`Ordem ${values.side === 'BUY' ? 'de compra' : 'de venda'} executada com sucesso`)
      setIsOrderDialogOpen(false)
    } catch (error: any) {
      console.error('Erro ao criar ordem:', error)
      toast.error(`Erro ao criar ordem: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const handleClosePosition = async (positionId: string) => {
    if (!paperService) return

    try {
      await paperService.closePosition(positionId)
      setWallet(paperService.getWallet())
      toast.success('Posição fechada com sucesso')
    } catch (error) {
      console.error('Erro ao fechar posição:', error)
      toast.error('Erro ao fechar posição')
    }
  }

  const handleFundOperation = async (values: z.infer<typeof fundFormSchema>) => {
    if (!paperService) return

    try {
      if (values.action === 'deposit') {
        paperService.deposit(values.amount)
      } else {
        paperService.withdraw(values.amount)
      }

      setWallet(paperService.getWallet())
      toast.success(`${values.action === 'deposit' ? 'Depósito' : 'Retirada'} realizado com sucesso`)
      setIsFundDialogOpen(false)
    } catch (error: any) {
      console.error(`Erro ao ${values.action === 'deposit' ? 'depositar' : 'retirar'} fundos:`, error)
      toast.error(`Erro: ${error.message || 'Erro desconhecido'}`)
    }
  }

  // Funções helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
  }

  // Se não estiver conectado ao serviço
  if (!isConnected || !binanceService) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Conexão Necessária</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Você precisa conectar sua conta Binance para usar o Paper Trading.
          Por favor, vá para as configurações e conecte sua conta.
        </p>
        <Button asChild>
          <a href="/dashboard/settings">Ir para Configurações</a>
        </Button>
      </div>
    )
  }

  // Renderizar loading state enquanto inicializa
  if (!paperService || !wallet || !config) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-highlight"></div>
          <p className="mt-4 text-sm text-muted-foreground">Inicializando Paper Trading...</p>
        </div>
      </div>
    )
  }

  // Calcular estatísticas
  const openPositions = wallet.positions.filter(p => p.status === 'OPEN')
  const closedPositions = wallet.positions.filter(p => p.status === 'CLOSED')
  const totalProfit = closedPositions.reduce((sum, p) => sum + p.pnl, 0)
  const totalTrades = closedPositions.length
  const winningTrades = closedPositions.filter(p => p.pnl > 0).length
  const losingTrades = closedPositions.filter(p => p.pnl <= 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
  const openPnl = openPositions.reduce((sum, p) => sum + p.pnl, 0)

  // Para acessibilidade: lista de pares disponíveis
  const availablePairs = AVAILABLE_SYMBOLS.map(s => s.value)

  // Função para submeter ordem com tipo de posição (LONG/SHORT)
  const handleOrderFormSubmit = async (side: 'LONG' | 'SHORT') => {
    // Adapta o side para o schema esperado ('BUY'/'SELL')
    const values = orderForm.getValues()
    const submitValues = {
      ...values,
      side: side === 'LONG' ? 'BUY' : 'SELL'
    }
    await handleCreateOrder(submitValues as z.infer<typeof orderFormSchema>)
  }

  // Para botões de direção: preço do símbolo selecionado
  const selectedSymbol = orderForm.watch('symbol')
  const price = symbolPrices[selectedSymbol]
  const symbol = selectedSymbol

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paper Trading</h2>
          <p className="text-muted-foreground">
            Pratique sua estratégia de trading sem arriscar dinheiro real
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsFundDialogOpen(true)}>
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Depósito/Retirada
          </Button>
          <Button variant="outline" onClick={() => setIsConfigDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Painel de visão geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Saldo Total</div>
            <div className="text-2xl font-bold">{formatCurrency(wallet.totalBalance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Disponível</div>
            <div className="text-2xl font-bold">{formatCurrency(wallet.availableBalance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Lucro Total</div>
            <div className={`text-2xl font-bold ${wallet.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(wallet.pnl)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">PnL Aberto</div>
            <div className={`text-2xl font-bold ${openPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(openPnl)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes seções */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="positions">Posições</TabsTrigger>
          <TabsTrigger value="orders">Ordens</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
              <CardDescription>Estatísticas do seu trading simulado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total de Trades</div>
                  <div className="text-2xl font-bold">{totalTrades}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Taxa de Acerto</div>
                  <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">
                    {winningTrades} ganhos / {losingTrades} perdas
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Taxas Pagas</div>
                  <div className="text-2xl font-bold text-red-500">{formatCurrency(wallet.totalFees)}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Posições Abertas</div>
                  <div className="text-2xl font-bold">{openPositions.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posições Abertas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Posições Abertas</CardTitle>
                <CardDescription>Suas posições de trading ativas</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Nova Ordem
              </Button>
            </CardHeader>
            <CardContent>
              {openPositions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Atual</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>PnL</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.symbol}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={position.side === 'LONG' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                              {position.side === 'LONG' ? 'COMPRA' : 'VENDA'}
                            </Badge>
                          </TableCell>
                          <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
                          <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                          <TableCell>{position.quantity.toFixed(4)}</TableCell>
                          <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            <div className="flex items-center">
                              {position.pnl >= 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                              )}
                              {formatPercentage(position.pnlPercentage)}
                            </div>
                            <div className="text-xs">{formatCurrency(position.pnl)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleClosePosition(position.id)}
                            >
                              Fechar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <CandlestickChart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Você não tem posições abertas</p>
                  <Button className="mt-4" onClick={() => setIsOrderDialogOpen(true)}>
                    Criar Nova Ordem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Últimas Transações */}
          <Card>
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallet.transactionHistory.slice(-5).reverse().map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{formatDate(tx.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            tx.type === 'TRADE' ? 'border-blue-500 text-blue-500' :
                            tx.type === 'FEE' ? 'border-red-500 text-red-500' :
                            tx.type === 'DEPOSIT' ? 'border-green-500 text-green-500' :
                            'border-amber-500 text-amber-500'
                          }>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{tx.description}</TableCell>
                        <TableCell className={`text-right ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {wallet.transactionHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhuma transação realizada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {wallet.transactionHistory.length > 5 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Mostrando as últimas 5 transações de {wallet.transactionHistory.length} no total
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Posições */}
        <TabsContent value="positions" className="space-y-6">
          {/* Posições Abertas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Posições Abertas</CardTitle>
                <CardDescription>Suas posições de trading ativas</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Nova Ordem
              </Button>
            </CardHeader>
            <CardContent>
              {openPositions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Atual</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Alavancagem</TableHead>
                        <TableHead>Stop Loss</TableHead>
                        <TableHead>Take Profit</TableHead>
                        <TableHead>PnL</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {openPositions.map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.symbol}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={position.side === 'LONG' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                              {position.side === 'LONG' ? 'COMPRA' : 'VENDA'}
                            </Badge>
                          </TableCell>
                          <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
                          <TableCell>${position.currentPrice.toFixed(2)}</TableCell>
                          <TableCell>{position.quantity.toFixed(4)}</TableCell>
                          <TableCell>{position.leverage}x</TableCell>
                          <TableCell>
                            {position.stopLoss ? `${position.stopLoss}%` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {position.takeProfit ? `${position.takeProfit}%` : 'N/A'}
                          </TableCell>
                          <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            <div className="flex items-center">
                              {position.pnl >= 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                              )}
                              {formatPercentage(position.pnlPercentage)}
                            </div>
                            <div className="text-xs">{formatCurrency(position.pnl)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleClosePosition(position.id)}
                            >
                              Fechar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <CandlestickChart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Você não tem posições abertas</p>
                  <Button className="mt-4" onClick={() => setIsOrderDialogOpen(true)}>
                    Criar Nova Ordem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posições Fechadas */}
          <Card>
            <CardHeader>
              <CardTitle>Posições Fechadas</CardTitle>
              <CardDescription>Histórico das suas posições encerradas</CardDescription>
            </CardHeader>
            <CardContent>
              {closedPositions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Saída</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>PnL</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {closedPositions.slice(-10).reverse().map((position) => (
                        <TableRow key={position.id}>
                          <TableCell className="font-medium">{position.symbol}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={position.side === 'LONG' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                              {position.side === 'LONG' ? 'COMPRA' : 'VENDA'}
                            </Badge>
                          </TableCell>
                          <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
                          <TableCell>${position.exitPrice?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell>{position.quantity.toFixed(4)}</TableCell>
                          <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(position.pnlPercentage)}
                            <div className="text-xs">{formatCurrency(position.pnl)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">{formatDate(position.entryTime)}</div>
                            <div className="text-xs">→ {position.exitTime ? formatDate(position.exitTime) : 'N/A'}</div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <LineChart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Você não tem posições fechadas</p>
                </div>
              )}

              {closedPositions.length > 10 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Mostrando as últimas 10 posições fechadas de {closedPositions.length} no total
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ordens */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Histórico de Ordens</CardTitle>
                <CardDescription>Ordens executadas e pendentes</CardDescription>
              </div>
              <Button onClick={() => setIsOrderDialogOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Nova Ordem
              </Button>
            </CardHeader>
            <CardContent>
              {wallet.orders.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Direção</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wallet.orders.slice(-20).reverse().map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{formatDate(order.createTime)}</TableCell>
                          <TableCell className="font-medium">{order.symbol}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={order.side === 'BUY' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                              {order.side}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.quantity.toFixed(4)}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'FILLED' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Você não realizou nenhuma ordem</p>
                  <Button className="mt-4" onClick={() => setIsOrderDialogOpen(true)}>
                    Criar Nova Ordem
                  </Button>
                </div>
              )}

              {wallet.orders.length > 20 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Mostrando as últimas 20 ordens de {wallet.orders.length} no total
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Histórico */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transações</CardTitle>
              <CardDescription>Histórico completo de transações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Símbolo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wallet.transactionHistory.slice(-30).reverse().map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{formatDate(tx.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            tx.type === 'TRADE' ? 'border-blue-500 text-blue-500' :
                            tx.type === 'FEE' ? 'border-red-500 text-red-500' :
                            tx.type === 'DEPOSIT' ? 'border-green-500 text-green-500' :
                            'border-amber-500 text-amber-500'
                          }>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">{tx.description}</TableCell>
                        <TableCell>{tx.symbol}</TableCell>
                        <TableCell className={`text-right ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {wallet.transactionHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhuma transação realizada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {wallet.transactionHistory.length > 30 && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Mostrando as últimas 30 transações de {wallet.transactionHistory.length} no total
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetWallet} className="text-red-500">
                Resetar Carteira
              </Button>
              <Button variant="outline" onClick={() => setIsFundDialogOpen(true)}>
                <CircleDollarSign className="mr-2 h-4 w-4" />
                Depósito/Retirada
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Configurações */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurações de Paper Trading</DialogTitle>
            <DialogDescription>
              Personalize sua experiência de Paper Trading
            </DialogDescription>
          </DialogHeader>

          <Form {...configForm}>
            <form onSubmit={configForm.handleSubmit(handleUpdateConfig)} className="space-y-4">
              <FormField
                control={configForm.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="initial-capital" className={getHighContrastText()}>
                      Capital Inicial (USDT)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="initial-capital"
                        type="number"
                        placeholder="10000"
                        {...field}
                        onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                        aria-describedby="initial-capital-desc"
                      />
                    </FormControl>
                    <FormDescription id="initial-capital-desc">
                      O montante inicial para começar o paper trading
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={configForm.control}
                name="feePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fee-percentage" className={getHighContrastText()}>
                      Taxa por Transação (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="fee-percentage"
                        type="number"
                        step="0.01"
                        placeholder="0.1"
                        {...field}
                        onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                        aria-describedby="fee-percentage-desc"
                      />
                    </FormControl>
                    <FormDescription id="fee-percentage-desc">
                      Simular taxas por operação (normalmente 0.1%)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={configForm.control}
                name="defaultOrderSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="default-order-size" className={getHighContrastText()}>
                      Tamanho Padrão de Ordem (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="default-order-size"
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                        aria-describedby="default-order-size-desc"
                      />
                    </FormControl>
                    <FormDescription id="default-order-size-desc">
                      Porcentagem do capital a ser usado em cada ordem
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={configForm.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="default-stop-loss" className={getHighContrastText()}>
                        Stop Loss Padrão (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="default-stop-loss"
                          type="number"
                          step="0.1"
                          placeholder="5"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          aria-describedby="default-stop-loss-desc"
                        />
                      </FormControl>
                      <FormDescription id="default-stop-loss-desc">
                        Limite de perda em percentual
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={configForm.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="default-take-profit" className={getHighContrastText()}>
                        Take Profit Padrão (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="default-take-profit"
                          type="number"
                          step="0.1"
                          placeholder="15"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          aria-describedby="default-take-profit-desc"
                        />
                      </FormControl>
                      <FormDescription id="default-take-profit-desc">
                        Alvo de lucro em percentual
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={configForm.control}
                name="enableMarginTrading"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="enable-margin-trading"
                        aria-label="Habilitar Trading de Margem"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="enable-margin-trading" className={getHighContrastText()}>
                        Habilitar Trading de Margem
                      </FormLabel>
                      <FormDescription>
                        Permite operações de venda a descoberto e alavancagem
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={configForm.control}
                  name="defaultLeverageSpot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="leverage-spot" className={getHighContrastText()}>
                        Alavancagem Spot
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="leverage-spot"
                          type="number"
                          min="1"
                          max="1"
                          step="1"
                          placeholder="1"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={true}
                          aria-describedby="leverage-spot-desc"
                        />
                      </FormControl>
                      <FormDescription id="leverage-spot-desc">
                        Sempre 1x para spot
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={configForm.control}
                  name="defaultLeverageMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="leverage-margin" className={getHighContrastText()}>
                        Alavancagem de Margem
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="leverage-margin"
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          placeholder="5"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={!configForm.watch('enableMarginTrading')}
                          aria-describedby="leverage-margin-desc"
                        />
                      </FormControl>
                      <FormDescription id="leverage-margin-desc">
                        Para operações de margem (1-100x)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Salvar Configurações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Nova Ordem */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Nova Ordem</DialogTitle>
            <DialogDescription>
              Crie uma nova ordem de mercado para paper trading
            </DialogDescription>
          </DialogHeader>

          <Form {...orderForm}>
            <form onSubmit={orderForm.handleSubmit(handleCreateOrder)} className="space-y-4">
              {/* Campo de seleção de par de trading com label apropriado */}
              <FormField
                control={orderForm.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="trading-pair" className={getHighContrastText()}>
                      Par de Trading
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger id="trading-pair" className="w-full" aria-label="Selecionar par de trading">
                          <SelectValue placeholder="Selecione um par" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_SYMBOLS.map((symbol) => (
                          <SelectItem key={symbol.value} value={symbol.value}>
                            {symbol.label} {symbolPrices[symbol.value] && `($${symbolPrices[symbol.value].toFixed(2)})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o par de criptomoedas para operar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Direção (compra/venda) com contraste e acessibilidade */}
              <FormField
                control={orderForm.control}
                name="side"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={getHighContrastText()}>Direção</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        className={`w-full ${field.value === 'BUY'
                          ? 'bg-success hover:bg-success/90 text-success-foreground border-2 border-success/20 shadow-md font-semibold'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-medium'}`}
                        onClick={() => field.onChange('BUY')}
                        aria-label="Comprar"
                      >
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Comprar {price ? `@${Number(price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: symbol.endsWith('USDT') ? 2 : 8,
                          maximumFractionDigits: symbol.endsWith('USDT') ? 2 : 8
                        })}` : ''}
                      </Button>
                      <Button
                        type="button"
                        className={`w-full ${field.value === 'SELL'
                          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-2 border-destructive/20 shadow-md font-semibold'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 font-medium'}`}
                        onClick={() => field.onChange('SELL')}
                        disabled={!config.enableMarginTrading && wallet.positions.filter(p =>
                          p.status === 'OPEN' &&
                          p.symbol === orderForm.getValues().symbol &&
                          p.side === 'LONG'
                        ).length === 0}
                        aria-label="Vender"
                      >
                        <ArrowDownRight className="mr-2 h-4 w-4" />
                        Vender {price ? `@${Number(price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: symbol.endsWith('USDT') ? 2 : 8,
                          maximumFractionDigits: symbol.endsWith('USDT') ? 2 : 8
                        })}` : ''}
                      </Button>
                    </div>
                    {!config.enableMarginTrading && field.value === 'SELL' && (
                      <FormDescription>
                        Você só pode vender se tiver uma posição aberta deste par
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tamanho da ordem com slider e label acessível */}
              <FormField
                control={orderForm.control}
                name="orderSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="order-size" className={getHighContrastText()}>
                      Tamanho da Ordem: {field.value}% do capital
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={100}
                        step={1}
                        onValueChange={(values) => field.onChange(values[0])}
                        aria-valuenow={field.value}
                        aria-valuemin={1}
                        aria-valuemax={100}
                        aria-label="Tamanho da ordem em porcentagem"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value}% do seu capital ({formatCurrency(wallet.availableBalance * field.value / 100)})
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alavancagem com slider e label acessível */}
              <FormField
                control={orderForm.control}
                name="leverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="leverage" className={getHighContrastText()}>
                      Alavancagem: {field.value}x
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={config.enableMarginTrading ? config.defaultLeverageMargin : 1}
                        step={1}
                        onValueChange={(values) => field.onChange(values[0])}
                        disabled={!config.enableMarginTrading}
                        aria-valuenow={field.value}
                        aria-valuemin={1}
                        aria-valuemax={config.enableMarginTrading ? config.defaultLeverageMargin : 1}
                        aria-label="Alavancagem"
                      />
                    </FormControl>
                    {!config.enableMarginTrading && (
                      <FormDescription>
                        Habilite o trading de margem nas configurações para usar alavancagem
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Opções para stop loss e take profit com melhores labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={orderForm.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="stop-loss" className={getHighContrastText()}>
                        Stop Loss (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="stop-loss"
                          type="number"
                          placeholder="5"
                          {...field}
                          onChange={(e) => {
                            const value = Number.parseFloat(e.target.value);
                            field.onChange(!isNaN(value) ? value : 0);
                          }}
                          aria-describedby="stop-loss-description"
                        />
                      </FormControl>
                      <FormDescription id="stop-loss-description">
                        Limite de perda em percentual (0 para desativar)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orderForm.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="take-profit" className={getHighContrastText()}>
                        Take Profit (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="take-profit"
                          type="number"
                          placeholder="15"
                          {...field}
                          onChange={(e) => {
                            const value = Number.parseFloat(e.target.value);
                            field.onChange(!isNaN(value) ? value : 0);
                          }}
                          aria-describedby="take-profit-description"
                        />
                      </FormControl>
                      <FormDescription id="take-profit-description">
                        Alvo de lucro em percentual (0 para desativar)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botões de compra/venda com alto contraste e foco visível */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  type="button"
                  className="flex-1 bg-success hover:bg-success/90 focus-visible:ring-success/70 h-12 text-lg font-medium border-2 border-success/20 shadow-md"
                  onClick={() => handleOrderFormSubmit('LONG')}
                  aria-label="Comprar - Posição Long"
                >
                  <ArrowUpRight className="mr-2 h-5 w-5" />
                  Comprar
                </Button>

                <Button
                  type="button"
                  className="flex-1 bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/70 h-12 text-lg font-medium border-2 border-destructive/20 shadow-md"
                  onClick={() => handleOrderFormSubmit('SHORT')}
                  aria-label="Vender - Posição Short"
                  disabled={!config.enableMarginTrading && wallet.positions.filter(p =>
                    p.status === 'OPEN' &&
                    p.symbol === orderForm.getValues().symbol &&
                    p.side === 'LONG'
                  ).length === 0}
                >
                  <ArrowDownRight className="mr-2 h-5 w-5" />
                  Vender
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Depósito/Retirada */}
      <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Depósito/Retirada</DialogTitle>
            <DialogDescription>
              Adicione ou retire fundos da sua carteira de paper trading
            </DialogDescription>
          </DialogHeader>

          <Form {...fundForm}>
            <form onSubmit={fundForm.handleSubmit(handleFundOperation)} className="space-y-4">
              <FormField
                control={fundForm.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={getHighContrastText()}>Ação</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        className={`w-full ${field.value === 'deposit' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => field.onChange('deposit')}
                        aria-label="Depositar"
                      >
                        Depositar
                      </Button>
                      <Button
                        type="button"
                        className={`w-full ${field.value === 'withdraw' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => field.onChange('withdraw')}
                        aria-label="Retirar"
                      >
                        Retirar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de entrada de quantidade com label apropriado */}
              <FormField
                control={fundForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="amount" className={getHighContrastText()}>
                      Valor (USDT)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={e => {
                          const value = Number.parseFloat(e.target.value);
                          field.onChange(!isNaN(value) ? value : '');
                        }}
                        aria-describedby="amount-description"
                      />
                    </FormControl>
                    {fundForm.watch('action') === 'withdraw' && (
                      <FormDescription id="amount-description" className="text-muted-foreground">
                        Saldo disponível: {formatCurrency(wallet.availableBalance)}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  className={fundForm.watch('action') === 'deposit' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}
                  disabled={
                    fundForm.watch('action') === 'withdraw' &&
                    fundForm.watch('amount') > wallet.availableBalance
                  }
                >
                  {fundForm.watch('action') === 'deposit' ? 'Depositar' : 'Retirar'} Fundos
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
