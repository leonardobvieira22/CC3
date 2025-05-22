"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Bell,
  Bot,
  Users,
  PieChart,
  BarChart3,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts"
import { BinanceService, type KlineData } from "@/lib/services/binance"
import { useBinanceWebSocket, type KlineTick } from "@/lib/services/binanceWebSocket"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useBinance } from "@/lib/context/BinanceContext"

// Tipos para os dados de candle
interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Utilitário para converter dados da Binance para o formato do gráfico
const formatCandlestickData = (klineData: KlineData[]) => {
  return klineData.map(candle => ({
    time: candle.openTime / 1000,
    open: Number.parseFloat(candle.open),
    high: Number.parseFloat(candle.high),
    low: Number.parseFloat(candle.low),
    close: Number.parseFloat(candle.close),
    volume: Number.parseFloat(candle.volume),
  }))
}

// Função para gerar dados de demonstração de velas aleatórias
const generateDemoData = (symbol: string, interval: string, count = 100) => {
  const now = new Date().getTime();
  const millisecondsPerCandle = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  }[interval] || 60 * 1000;

  // Preços iniciais para diferentes símbolos
  const basePrice = {
    'BTCUSDT': 50000,
    'ETHUSDT': 3000,
    'BNBUSDT': 400,
    'SOLUSDT': 100,
    'ADAUSDT': 1.5,
  }[symbol] || 50000;

  // Volatilidade para diferentes símbolos
  const volatility = {
    'BTCUSDT': 0.02,
    'ETHUSDT': 0.025,
    'BNBUSDT': 0.03,
    'SOLUSDT': 0.035,
    'ADAUSDT': 0.04,
  }[symbol] || 0.02;

  const data = [];
  let lastClose = basePrice;

  for (let i = 0; i < count; i++) {
    // Calcular o timestamp para esta vela
    const timestamp = now - (count - i) * millisecondsPerCandle;

    // Gerar variação aleatória para esta vela
    const changePercent = (Math.random() - 0.5) * volatility;
    const change = lastClose * changePercent;

    // Calcular valores de OHLC (Open, High, Low, Close)
    const open = lastClose;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = basePrice * (Math.random() * 10 + 5);

    // Adicionar vela ao array
    data.push({
      time: timestamp / 1000,
      open,
      high,
      low,
      close,
      volume,
    });

    // Atualizar o fechamento para a próxima vela
    lastClose = close;
  }

  return data;
};

// Componente para mostrar métricas de preço
const PriceMetrics = ({ data, symbol }: { data: CandleData[]; symbol: string }) => {
  if (!data || data.length === 0) return null

  const lastCandle = data[data.length - 1]
  const prevCandle = data.length > 1 ? data[data.length - 2] : null

  const currentPrice = lastCandle.close.toFixed(2)

  // Calcular variação
  const priceChange = prevCandle
    ? (lastCandle.close - prevCandle.close).toFixed(2)
    : "0.00"

  const priceChangePercent = prevCandle
    ? (((lastCandle.close - prevCandle.close) / prevCandle.close) * 100).toFixed(2)
    : "0.00"

  const isPositive = Number.parseFloat(priceChange) >= 0

  // Formatar volume para exibição
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`
    return volume.toFixed(2)
  }

  return (
    <div className="flex flex-wrap gap-8 mt-4">
      <div>
        <span className="text-sm text-muted-foreground">Preço</span>
        <div className="text-xl font-bold">${currentPrice}</div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Variação 24h</span>
        <div className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{priceChange} ({isPositive ? '+' : ''}{priceChangePercent}%)
        </div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Máxima 24h</span>
        <div className="text-xl font-bold">${lastCandle.high.toFixed(2)}</div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Mínima 24h</span>
        <div className="text-xl font-bold">${lastCandle.low.toFixed(2)}</div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">Volume 24h</span>
        <div className="text-xl font-bold">{formatVolume(lastCandle.volume)} {symbol.replace('USDT', '')}</div>
      </div>
    </div>
  )
}

// Componente para métricas de mercado adicionais
const MarketStats = ({ data }: { data: CandleData[] }) => {
  if (!data || data.length === 0) return null

  // Estatísticas simples de exemplo
  const closes = data.map((c: CandleData) => c.close)
  const highs = data.map((c: CandleData) => c.high)
  const lows = data.map((c: CandleData) => c.low)
  const volumes = data.map((c: CandleData) => c.volume)

  const avgPrice = (closes.reduce((a, b) => a + b, 0) / closes.length).toFixed(2)
  const maxPrice = Math.max(...highs).toFixed(2)
  const minPrice = Math.min(...lows).toFixed(2)
  const totalVolume = volumes.reduce((a, b) => a + b, 0)
  const avgVolume = (totalVolume / volumes.length).toFixed(2)

  // Formatar volume
  // Corrigido: garantir que a função formatVolume use o parâmetro correto
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`
    return volume.toFixed(2)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
      <div className="p-3 rounded-lg bg-muted/40 flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Preço Médio</span>
        <span className="font-semibold text-lg">${avgPrice}</span>
      </div>
      <div className="p-3 rounded-lg bg-muted/40 flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Máxima (período)</span>
        <span className="font-semibold text-lg">${maxPrice}</span>
      </div>
      <div className="p-3 rounded-lg bg-muted/40 flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Mínima (período)</span>
        <span className="font-semibold text-lg">${minPrice}</span>
      </div>
      <div className="p-3 rounded-lg bg-muted/40 flex flex-col items-start">
        <span className="text-xs text-muted-foreground">Volume Médio</span>
        <span className="font-semibold text-lg">{formatVolume(Number(avgVolume))}</span>
      </div>
    </div>
  )
}

// Componente para o gráfico de trading com dados reais ou de demonstração
const TradingChart = ({ symbol = "BTCUSDT", interval = "1m" }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState(symbol)
  const [selectedInterval, setSelectedInterval] = useState(interval)
  const [candleData, setCandleData] = useState<any[]>([])
  const { binanceService, isDemoMode } = useBinance()
  const binanceWebSocket = useBinanceWebSocket()

  useEffect(() => {
    setSelectedSymbol(symbol)
  }, [symbol])
  useEffect(() => {
    setSelectedInterval(interval)
  }, [interval])

  // Função para carregar os dados históricos iniciais
  const loadHistoricalData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let candlestickData;

      // Verificar se estamos em modo de demonstração
      if (isDemoMode) {
        // Gerar dados de demonstração
        candlestickData = generateDemoData(selectedSymbol, selectedInterval, 100);
      } else {
        // Buscar dados históricos da API da Binance
        const klineData = await binanceService.getKlines(selectedSymbol, selectedInterval, 100)
        // Formatar dados para o gráfico
        candlestickData = formatCandlestickData(klineData)
      }

      // Atualizar o gráfico com os dados históricos
      if (seriesRef.current) {
        seriesRef.current.setData(candlestickData)
      }

      // Atualizar o estado com os dados para as métricas
      setCandleData(candlestickData)

      // Ajustar visualização do gráfico
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent()
      }
    } catch (error) {
      console.error('Erro ao carregar dados históricos:', error)

      // Se houve erro e não estamos em modo de demonstração, ativar o modo de demonstração
      if (!isDemoMode) {
        // Gerar dados de demonstração como fallback
        const demoData = generateDemoData(selectedSymbol, selectedInterval, 100);

        // Atualizar o gráfico com os dados de demonstração
        if (seriesRef.current) {
          seriesRef.current.setData(demoData)
        }

        // Atualizar o estado com os dados para as métricas
        setCandleData(demoData)

        // Ajustar visualização do gráfico
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent()
        }

        setError('Usando dados de demonstração pois não foi possível conectar à API da Binance.')
        toast.warning('Modo de demonstração ativado', {
          description: 'Usando dados simulados para visualização.'
        })
      } else {
        setError('Não foi possível carregar os dados do gráfico. Tente novamente mais tarde.')
        toast.error('Erro ao carregar dados', {
          description: 'Não foi possível carregar os dados do gráfico. Tente novamente mais tarde.'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [binanceService, selectedSymbol, selectedInterval, isDemoMode])

  // Handler para atualizações em tempo real via WebSocket ou simuladas
  const handleKlineUpdate = useCallback((data: KlineTick) => {
    if (!seriesRef.current) return

    // Formatar dados recebidos via WebSocket
    const update = {
      time: data.kline.startTime / 1000,
      open: Number.parseFloat(data.kline.open),
      high: Number.parseFloat(data.kline.high),
      low: Number.parseFloat(data.kline.low),
      close: Number.parseFloat(data.kline.close),
      volume: Number.parseFloat(data.kline.volume)
    }

    // Atualizar o estado com os dados para as métricas
    setCandleData(currentData => {
      // Se o candle atual já existe no array, substitua-o
      const newData = [...currentData]
      const lastIndex = newData.length - 1

      if (lastIndex >= 0 && newData[lastIndex].time === update.time) {
        newData[lastIndex] = update
      } else if (lastIndex >= 0) {
        // Adicionar um novo candle se o timestamp for diferente
        newData.push(update)
      }
      return newData
    })

    // Atualizar o último candle no gráfico
    seriesRef.current.update(update)
  }, [])

  // Simulação de atualizações em tempo real para o modo de demonstração
  useEffect(() => {
    if (!isDemoMode || !seriesRef.current || candleData.length === 0) return;

    // Intervalo para simular atualizações a cada segundo
    const updateInterval = setInterval(() => {
      // Pegar o último candle
      const lastCandle = candleData[candleData.length - 1];

      // Gerar uma pequena variação aleatória (entre -0.5% e +0.5%)
      const changePercent = (Math.random() - 0.5) * 0.01;
      const change = lastCandle.close * changePercent;

      // Criar um novo candle com os valores atualizados
      const updatedCandle = {
        time: lastCandle.time,
        open: lastCandle.open,
        close: lastCandle.close + change,
        high: Math.max(lastCandle.high, lastCandle.close + change),
        low: Math.min(lastCandle.low, lastCandle.close + change),
        volume: lastCandle.volume + (Math.random() * lastCandle.volume * 0.02)
      };

      // Atualizar o gráfico
      seriesRef.current.update(updatedCandle);

      // Atualizar o estado de dados para as métricas
      setCandleData(currentData => {
        const newData = [...currentData];
        newData[newData.length - 1] = updatedCandle;
        return newData;
      });
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [isDemoMode, candleData, seriesRef]);

  // Configurar/Limpar WebSocket quando o componente monta/desmonta
  useEffect(() => {
    // Só inscrevemos no WebSocket se não estamos em modo de demonstração
    if (!isDemoMode) {
      binanceWebSocket.subscribeKline({
        symbols: [selectedSymbol],
        interval: selectedInterval,
        callbacks: {
          onKline: handleKlineUpdate,
          onOpen: () => {
            console.log(`WebSocket conectado para ${selectedSymbol}@${selectedInterval}`)
          },
          onError: (event) => {
            console.error('Erro na conexão WebSocket:', event)
            setError('Erro na conexão em tempo real. Os dados podem estar desatualizados.')
          }
        }
      })

      return () => {
        const streamName = `${selectedSymbol.toLowerCase()}@kline_${selectedInterval}`
        binanceWebSocket.unsubscribe(streamName)
      }
    }
  }, [binanceWebSocket, selectedSymbol, selectedInterval, handleKlineUpdate, isDemoMode])

  // Criar e configurar o gráfico
  useEffect(() => {
    if (chartContainerRef.current) {
      try {
        // Verifica se o gráfico existe e não está disposto antes de tentar removê-lo
        if (chartRef.current && !chartRef.current.isDisposed?.()) {
          chartRef.current.remove()
        }
      } catch (error) {
        console.log('Chart já foi removido ou não existe')
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 360,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: 'rgba(42, 46, 57, 0.2)',
        },
        crosshair: {
          mode: 1,
        },
      })

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth
          })
        }
      }

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })

      chartRef.current = chart
      seriesRef.current = candlestickSeries

      loadHistoricalData()

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    }
  }, [loadHistoricalData])

  useEffect(() => {
    if (chartRef.current && seriesRef.current) {
      loadHistoricalData()
    }
  }, [selectedSymbol, selectedInterval, loadHistoricalData])

  if (isLoading && !seriesRef.current) {
    return (
      <div ref={chartContainerRef} className="w-full h-[360px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-highlight rounded-full border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Carregando dados do gráfico...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div ref={chartContainerRef} className="w-full h-[360px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <span className="text-red-500 text-4xl mb-2">!</span>
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => loadHistoricalData()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={chartContainerRef} className="w-full h-[360px]" />
      {!isLoading && !error && <PriceMetrics data={candleData} symbol={selectedSymbol} />}
      {!isLoading && !error && <MarketStats data={candleData} />}
    </div>
  )
}

// Componente para cards de desempenho de robôs
const RobotPerformanceCard = ({ name, return: returnValue, pairs, risk, active = true }: any) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {name}
        </CardTitle>
        <Badge
          variant={active ? "default" : "outline"}
          className={active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {active ? "Ativo" : "Inativo"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-highlight">
          {returnValue}
          <span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Pares: {pairs}
        </p>
        <div className="mt-2 flex items-center">
          <Badge
            className={`${
              risk === "Conservador" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" :
              risk === "Moderado" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            } hover:bg-opacity-90`}
            variant="outline"
          >
            {risk}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <Button variant="outline" size="sm" className="w-full">
          Configurar
        </Button>
      </CardFooter>
    </Card>
  )
}

// Componente principal do Dashboard
export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT")
  const [selectedInterval, setSelectedInterval] = useState("1m")

  // Opções para pares de moedas
  const tradingPairs = [
    { value: "BTCUSDT", label: "BTC/USDT" },
    { value: "ETHUSDT", label: "ETH/USDT" },
    { value: "BNBUSDT", label: "BNB/USDT" },
    { value: "SOLUSDT", label: "SOL/USDT" },
    { value: "ADAUSDT", label: "ADA/USDT" },
  ]

  // Opções para intervalos de tempo
  const timeIntervals = [
    { value: "1m", label: "1 min" },
    { value: "5m", label: "5 min" },
    { value: "15m", label: "15 min" },
    { value: "1h", label: "1 hora" },
    { value: "4h", label: "4 horas" },
    { value: "1d", label: "1 dia" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bem-vindo(a) de volta, João Silva
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button>
            Upgrade Premium
          </Button>
        </div>
      </div>

      {/* Resumo - Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Total
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,234.12</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12.5%</span>
              <span className="text-muted-foreground">desde o último mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lucro 24h
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$342.58</div>
            <div className="flex items-center space-x-2 text-sm text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>+3.2%</span>
              <span className="text-muted-foreground">das operações</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Robôs Ativos
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>de 2 disponíveis</span>
              <Badge variant="outline">Plano Gratuito</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operações Totais
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-green-500">78% lucrativas</span>
              <span className="text-muted-foreground">win rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico e Robôs */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Gráfico principal */}
        <Card className="md:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {tradingPairs.find(p => p.value === selectedPair)?.label || "BTC/USDT"}
              </CardTitle>
              <CardDescription>
                Dados do mercado em tempo real
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <select
                className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm"
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                {tradingPairs.map((pair) => (
                  <option key={pair.value} value={pair.value}>
                    {pair.label}
                  </option>
                ))}
              </select>
              <select
                className="bg-transparent border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm"
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
              >
                {timeIntervals.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <TradingChart symbol={selectedPair} interval={selectedInterval} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Mais Pares</Button>
            <Button>Ver Análise Detalhada</Button>
          </CardFooter>
        </Card>

        {/* Lista de robôs ativos */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Seus Robôs</CardTitle>
            <CardDescription>
              Performance dos robôs ativos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RobotPerformanceCard
              name="RSI Master"
              return="+5.8%"
              pairs="BTC, ETH, SOL"
              risk="Moderado"
              active={true}
            />
            <RobotPerformanceCard
              name="Bollinger IA"
              return="+4.2%"
              pairs="BTC, ETH, BNB"
              risk="Conservador"
              active={true}
            />
            <Button className="w-full">Adicionar Robô</Button>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Operações */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Todas Operações</TabsTrigger>
            <TabsTrigger value="buy">Compras</TabsTrigger>
            <TabsTrigger value="sell">Vendas</TabsTrigger>
          </TabsList>
          <Link href="/dashboard/history">
            <Button variant="link">Ver histórico completo</Button>
          </Link>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Operações Recentes</CardTitle>
              <CardDescription>
                Últimas operações realizadas pelos seus robôs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <div key={`recent-operation-${item}`} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-blue-dark/40 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item % 2 === 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {item % 2 === 0 ?
                          <ArrowUpRight className="h-5 w-5" /> :
                          <ArrowDownRight className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{item % 2 === 0 ? 'Compra' : 'Venda'} BTC/USDT</p>
                        <p className="text-xs text-muted-foreground">Há {20 + i * 12} minutos • RSI Master</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item % 2 === 0 ? '+' : '-'}0.0{item + 1} BTC</p>
                      <p className={`text-xs ${item % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item % 2 === 0 ? '+' : '-'}${(item + 1) * 120}.{item * 2}{item + 3}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="buy">
          <Card>
            <CardHeader>
              <CardTitle>Operações de Compra</CardTitle>
              <CardDescription>
                Últimas compras realizadas pelos seus robôs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 3, 5].map((item) => (
                  <div key={`buy-operation-${item}`} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-blue-dark/40 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Compra BTC/USDT</p>
                        <p className="text-xs text-muted-foreground">Há {20 + item * 12} minutos • RSI Master</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">+0.0{item + 1} BTC</p>
                      <p className="text-xs text-green-500">
                        +${(item + 1) * 120}.{item * 2}{item + 3}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sell">
          <Card>
            <CardHeader>
              <CardTitle>Operações de Venda</CardTitle>
              <CardDescription>
                Últimas vendas realizadas pelos seus robôs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[2, 4].map((item) => (
                  <div key={`sell-operation-${item}`} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-blue-dark/40 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Venda BTC/USDT</p>
                        <p className="text-xs text-muted-foreground">Há {20 + item * 12} minutos • Bollinger IA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">-0.0{item + 1} BTC</p>
                      <p className="text-xs text-red-500">
                        -${(item + 1) * 120}.{item * 2}{item + 3}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Copy Trading e Indicações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Copy Trading</CardTitle>
            <CardDescription>
              Copie estratégias de traders com bons resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={`copy-trader-${item}`} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-blue-dark/40 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Trader {["Alpha", "Beta", "Gamma"][item - 1]}</p>
                      <p className="text-xs text-muted-foreground">347 seguidores • Retorno: +{6 + (item - 1)}% /mês</p>
                    </div>
                  </div>
                  <Button>Copiar</Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver mais traders
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programa de Indicação</CardTitle>
            <CardDescription>
              Indique amigos e ganhe 10% do investimento deles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Seus bônus</p>
                  <p className="text-2xl font-bold text-green-500">$0.00</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Seu link de indicação</p>
                <div className="flex">
                  <input
                    type="text"
                    value="https://aicrypto.com/ref/joao123"
                    readOnly
                    className="flex-1 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-highlight dark:bg-blue-dark/40"
                  />
                  <Button className="rounded-l-none">Copiar</Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Como funciona?</p>
                <ul className="mt-2 ml-4 text-sm text-gray-600 dark:text-gray-300 list-disc">
                  <li>Compartilhe seu link com amigos</li>
                  <li>Eles recebem 5% de desconto na assinatura</li>
                  <li>Você ganha 10% do valor de investimentos deles</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Convidar amigos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
