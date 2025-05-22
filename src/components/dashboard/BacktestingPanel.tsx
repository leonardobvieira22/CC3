"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
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
import { LineChart, BarChart, CandlestickChart, Settings, Play } from 'lucide-react'
import { type BacktestConfig, type BacktestResult, BacktestingService } from '@/lib/services/backtesting'
import { useBinance } from '@/lib/context/BinanceContext'
import {
  BollingerStrategy,
  MACDStrategy,
  RSIStrategy,
  TrendHunterStrategy
} from '@/lib/services/strategies'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { createChart, type IChartApi, ColorType } from 'lightweight-charts'

// Constantes
const AVAILABLE_SYMBOLS = [
  { value: 'BTCUSDT', label: 'BTC/USDT' },
  { value: 'ETHUSDT', label: 'ETH/USDT' },
  { value: 'BNBUSDT', label: 'BNB/USDT' },
  { value: 'SOLUSDT', label: 'SOL/USDT' },
  { value: 'DOTUSDT', label: 'DOT/USDT' },
  { value: 'ADAUSDT', label: 'ADA/USDT' }
]

const AVAILABLE_INTERVALS = [
  { value: '1m', label: '1 minuto' },
  { value: '5m', label: '5 minutos' },
  { value: '15m', label: '15 minutos' },
  { value: '30m', label: '30 minutos' },
  { value: '1h', label: '1 hora' },
  { value: '4h', label: '4 horas' },
  { value: '1d', label: '1 dia' },
  { value: '1w', label: '1 semana' }
]

const AVAILABLE_STRATEGIES = [
  { value: 'rsi', label: 'RSI Master', description: 'Estratégia baseada no Índice de Força Relativa' },
  { value: 'bollinger', label: 'Bollinger IA', description: 'Estratégia baseada nas Bandas de Bollinger' },
  { value: 'macd', label: 'MACD Pro', description: 'Estratégia baseada no MACD' },
  { value: 'trendhunter', label: 'Trend Hunter', description: 'Estratégia de detecção de tendências' }
]

// Schema de validação do formulário
const formSchema = z.object({
  symbol: z.string().min(1, { message: 'Selecione um par de trading' }),
  interval: z.string().min(1, { message: 'Selecione um intervalo' }),
  initialCapital: z.number().min(10, { message: 'O capital inicial deve ser pelo menos 10 USDT' }),
  feePercentage: z.number().min(0, { message: 'A taxa deve ser maior ou igual a 0' }).max(10, { message: 'A taxa deve ser menor ou igual a 10%' }),
  strategies: z.array(z.string()).min(1, { message: 'Selecione pelo menos uma estratégia' }),
  stopLoss: z.number().min(0, { message: 'O stop loss deve ser maior ou igual a 0' }).max(100, { message: 'O stop loss deve ser menor ou igual a 100%' }),
  takeProfit: z.number().min(0, { message: 'O take profit deve ser maior ou igual a 0' }).max(500, { message: 'O take profit deve ser menor ou igual a 500%' }),
  lookbackDays: z.number().min(1, { message: 'O período de análise deve ser pelo menos 1 dia' }).max(365, { message: 'O período máximo de análise é 365 dias' })
})

export default function BacktestingPanel() {
  // Estados
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Context
  const { binanceService, isConnected } = useBinance()

  // Refs
  const equityChartRef = React.useRef<HTMLDivElement>(null)
  const equityChartInstance = React.useRef<IChartApi | null>(null)

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: 'BTCUSDT',
      interval: '1h',
      initialCapital: 1000,
      feePercentage: 0.1,
      strategies: ['rsi', 'trendhunter'],
      stopLoss: 5,
      takeProfit: 15,
      lookbackDays: 30
    }
  })

  // Função para executar o backtesting
  const runBacktest = async (values: z.infer<typeof formSchema>) => {
    if (!binanceService) {
      toast.error('Serviço da Binance não disponível')
      return
    }

    try {
      setIsRunning(true)
      toast.info('Iniciando backtesting...')

      // Criar estratégias selecionadas
      const selectedStrategies = []
      if (values.strategies.includes('rsi')) selectedStrategies.push(new RSIStrategy())
      if (values.strategies.includes('bollinger')) selectedStrategies.push(new BollingerStrategy())
      if (values.strategies.includes('macd')) selectedStrategies.push(new MACDStrategy())
      if (values.strategies.includes('trendhunter')) selectedStrategies.push(new TrendHunterStrategy())

      // Configurar datas
      const endTime = Date.now()
      const startTime = endTime - (values.lookbackDays * 24 * 60 * 60 * 1000)

      // Criar configuração do backtest
      const config: BacktestConfig = {
        symbol: values.symbol,
        interval: values.interval,
        startTime,
        endTime,
        initialCapital: values.initialCapital,
        feePercentage: values.feePercentage,
        strategies: selectedStrategies,
        stopLoss: values.stopLoss,
        takeProfit: values.takeProfit
      }

      // Executar backtest
      const backtestingService = new BacktestingService(binanceService)
      const result = await backtestingService.runBacktest(config)

      setResult(result)
      setActiveTab('overview')
      toast.success('Backtesting concluído com sucesso!')

      // Renderizar o gráfico de patrimônio após o backtesting
      setTimeout(() => {
        renderEquityChart(result.equityCurve)
      }, 100)
    } catch (error) {
      console.error('Erro ao executar backtesting:', error)
      toast.error('Erro ao executar backtesting')
    } finally {
      setIsRunning(false)
    }
  }

  // Função para renderizar o gráfico de patrimônio
  const renderEquityChart = (equityCurve: { time: number; equity: number }[]) => {
    if (!equityChartRef.current) return

    // Limpar gráfico anterior se existir
    if (equityChartInstance.current) {
      equityChartInstance.current.remove()
      equityChartInstance.current = null
    }

    // Criar novo gráfico
    const chart = createChart(equityChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      width: equityChartRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    equityChartInstance.current = chart

    // Adicionar série de linha
    const lineSeries = chart.addLineSeries({
      color: '#4ade80',
      lineWidth: 2,
    })

    // Configurar dados
    const formattedData = equityCurve.map(point => ({
      time: point.time / 1000, // Converter para formato Unix em segundos
      value: point.equity
    }))

    lineSeries.setData(formattedData)

    // Ajustar visualização
    chart.timeScale().fitContent()

    // Adicionar handler de redimensionamento
    const handleResize = () => {
      if (equityChartRef.current && equityChartInstance.current) {
        equityChartInstance.current.applyOptions({
          width: equityChartRef.current.clientWidth
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // Formatar número como moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Formatar data
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM/yyyy HH:mm')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Backtesting</h2>
          <p className="text-muted-foreground">
            Teste suas estratégias contra dados históricos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de configuração */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>
              Configure os parâmetros para testar suas estratégias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(runBacktest)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Par de Trading</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isRunning}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um par" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AVAILABLE_SYMBOLS.map((symbol) => (
                            <SelectItem key={symbol.value} value={symbol.value}>
                              {symbol.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intervalo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isRunning}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um intervalo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AVAILABLE_INTERVALS.map((interval) => (
                            <SelectItem key={interval.value} value={interval.value}>
                              {interval.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialCapital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital Inicial (USDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={isRunning}
                        />
                      </FormControl>
                      <FormDescription>
                        Montante inicial para o teste
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lookbackDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Análise (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="30"
                          {...field}
                          onChange={e => field.onChange(Number.parseInt(e.target.value))}
                          disabled={isRunning}
                        />
                      </FormControl>
                      <FormDescription>
                        Quantidade de dias para analisar (histórico)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa por Transação (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.1"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={isRunning}
                        />
                      </FormControl>
                      <FormDescription>
                        Taxa cobrada por transação (normalmente 0.1%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop Loss (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="5"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={isRunning}
                        />
                      </FormControl>
                      <FormDescription>
                        Porcentagem de perda para encerrar posição
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take Profit (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="15"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                          disabled={isRunning}
                        />
                      </FormControl>
                      <FormDescription>
                        Porcentagem de lucro para encerrar posição
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="strategies"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Estratégias</FormLabel>
                        <FormDescription>
                          Selecione uma ou mais estratégias para testar
                        </FormDescription>
                      </div>
                      {AVAILABLE_STRATEGIES.map((strategy) => (
                        <FormField
                          key={strategy.value}
                          control={form.control}
                          name="strategies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={strategy.value}
                                className="flex flex-row items-start space-x-3 space-y-0 mb-2 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Switch
                                    checked={field.value?.includes(strategy.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, strategy.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== strategy.value
                                            )
                                          )
                                    }}
                                    disabled={isRunning}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {strategy.label}
                                  </FormLabel>
                                  <FormDescription>
                                    {strategy.description}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isRunning || !isConnected}
                >
                  {isRunning ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executando
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Executar Backtesting
                    </>
                  )}
                </Button>

                {!isConnected && (
                  <p className="text-red-500 text-sm text-center">
                    Conecte sua conta Binance para usar o backtesting
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Painel de resultados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Análise de desempenho da estratégia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum resultado disponível</h3>
                <p className="text-muted-foreground max-w-md">
                  Configure os parâmetros e clique em "Executar Backtesting" para ver os resultados da simulação.
                </p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="equity">Patrimônio</TabsTrigger>
                  <TabsTrigger value="trades">Operações</TabsTrigger>
                  <TabsTrigger value="signals">Sinais</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Estatísticas principais */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Resultado</div>
                        <div className={`text-2xl font-bold ${result.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {result.profitLoss >= 0 ? '+' : ''}{formatCurrency(result.profitLoss)}
                        </div>
                        <div className={`text-sm ${result.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {result.profitLossPercentage >= 0 ? '+' : ''}{result.profitLossPercentage.toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Operações</div>
                        <div className="text-2xl font-bold">{result.totalTrades}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.winningTrades} ganhos / {result.losingTrades} perdas
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Taxa de Acerto</div>
                        <div className="text-2xl font-bold">{result.winRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          Eficiência das operações
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Drawdown Máx</div>
                        <div className="text-2xl font-bold text-amber-500">
                          {result.maxDrawdown.toFixed(2)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Queda máxima
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Detalhes */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Detalhes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Par</span>
                            <span className="font-medium">{result.symbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Intervalo</span>
                            <span className="font-medium">{result.interval}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Período</span>
                            <span className="font-medium">
                              {formatDate(result.startTime)} - {formatDate(result.endTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capital Inicial</span>
                            <span className="font-medium">{formatCurrency(result.initialCapital)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capital Final</span>
                            <span className={`font-medium ${result.finalCapital >= result.initialCapital ? 'text-green-500' : 'text-red-500'}`}>
                              {formatCurrency(result.finalCapital)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lucro Médio</span>
                            <span className="font-medium text-green-500">{formatCurrency(result.avgProfit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Perda Média</span>
                            <span className="font-medium text-red-500">{formatCurrency(result.avgLoss)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sharpe Ratio</span>
                            <span className="font-medium">{result.sharpeRatio.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Últimas operações */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Últimas Operações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                          {result.trades.slice(-5).reverse().map((trade, index) => (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={trade.type === 'LONG' ? 'bg-green-500' : 'bg-red-500'}>
                                    {trade.type === 'LONG' ? 'COMPRA' : 'VENDA'}
                                  </Badge>
                                  <span className="text-sm font-medium">{trade.strategy}</span>
                                </div>
                                <span className={`text-sm font-bold ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {trade.profit >= 0 ? '+' : ''}{trade.profitPercentage.toFixed(2)}%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Entrada: {formatDate(trade.entryTime)}</span>
                                {trade.exitTime && (
                                  <span>Saída: {formatDate(trade.exitTime)}</span>
                                )}
                              </div>
                            </div>
                          ))}

                          {result.trades.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              Nenhuma operação realizada
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="equity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do Patrimônio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div ref={equityChartRef} className="w-full h-[400px]" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trades">
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Operações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Entrada</TableHead>
                              <TableHead>Saída</TableHead>
                              <TableHead>Preço Entrada</TableHead>
                              <TableHead>Preço Saída</TableHead>
                              <TableHead>Resultado</TableHead>
                              <TableHead>Estratégia</TableHead>
                              <TableHead>Motivo Saída</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.trades.slice(-20).reverse().map((trade, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Badge variant="outline" className={trade.type === 'LONG' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                                    {trade.type === 'LONG' ? 'COMPRA' : 'VENDA'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(trade.entryTime)}</TableCell>
                                <TableCell>{trade.exitTime ? formatDate(trade.exitTime) : '-'}</TableCell>
                                <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                                <TableCell>{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}</TableCell>
                                <TableCell className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                                  {trade.profit >= 0 ? '+' : ''}{trade.profitPercentage.toFixed(2)}%
                                </TableCell>
                                <TableCell>{trade.strategy}</TableCell>
                                <TableCell>
                                  {trade.exitReason === 'SIGNAL' && 'Sinal Contrário'}
                                  {trade.exitReason === 'STOP_LOSS' && 'Stop Loss'}
                                  {trade.exitReason === 'TAKE_PROFIT' && 'Take Profit'}
                                  {trade.exitReason === 'END_OF_TEST' && 'Fim do Teste'}
                                  {!trade.exitReason && '-'}
                                </TableCell>
                              </TableRow>
                            ))}

                            {result.trades.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                  Nenhuma operação realizada
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {result.trades.length > 20 && (
                        <div className="text-center text-sm text-muted-foreground mt-2">
                          Mostrando as últimas 20 operações de {result.trades.length} no total
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signals">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sinais Gerados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Preço</TableHead>
                              <TableHead>Estratégia</TableHead>
                              <TableHead>Confiança</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.signals.slice(-50).reverse().map((signal, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(signal.time)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={signal.type === 'BUY' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'}>
                                    {signal.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                                  </Badge>
                                </TableCell>
                                <TableCell>${signal.price.toFixed(2)}</TableCell>
                                <TableCell>{signal.strategy}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div
                                        className={`h-2.5 rounded-full ${signal.confidence > 80 ? 'bg-green-500' : signal.confidence > 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                        style={{ width: `${signal.confidence}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs">{signal.confidence.toFixed(0)}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}

                            {result.signals.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                  Nenhum sinal gerado
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {result.signals.length > 50 && (
                        <div className="text-center text-sm text-muted-foreground mt-2">
                          Mostrando os últimos 50 sinais de {result.signals.length} no total
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
