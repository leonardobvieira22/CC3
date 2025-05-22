"use client"

import React, { useEffect, useRef, useState } from 'react'
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  type SeriesType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesOptions,
  type DeepPartial,
  type ChartOptions
} from 'lightweight-charts'
import {
  useBinanceWebSocket,
  type KlineTick,
  type TradeTick,
  WebSocketTick
} from '@/lib/services/binanceWebSocket'
import { useBinance } from '@/lib/context/BinanceContext'
import { BinanceService } from '@/lib/services/binance'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  ChevronDown,
  BarChart2,
  Layers,
  Share2,
  CandlestickChart,
  LineChart
} from 'lucide-react'
import { toast } from 'sonner'

// Tipos de dados
type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type Trade = {
  id: number;
  time: number;
  price: number;
  quantity: number;
  isBuyerMaker: boolean;
}

type OrderType = 'LIMIT' | 'MARKET'
type OrderSide = 'BUY' | 'SELL'

// Constantes
const DEFAULT_SYMBOL = 'BTCUSDT'
const DEFAULT_INTERVAL = '1m'
const AVAILABLE_INTERVALS = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1d' },
  { value: '1w', label: '1w' }
]

const AVAILABLE_SYMBOLS = [
  { value: 'BTCUSDT', label: 'BTC/USDT' },
  { value: 'ETHUSDT', label: 'ETH/USDT' },
  { value: 'BNBUSDT', label: 'BNB/USDT' },
  { value: 'SOLUSDT', label: 'SOL/USDT' },
  { value: 'DOTUSDT', label: 'DOT/USDT' },
  { value: 'ADAUSDT', label: 'ADA/USDT' }
]

export default function TradingPanel() {
  // Estados do componente
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL)
  const [interval, setInterval] = useState<string>(DEFAULT_INTERVAL)
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles')
  const [candles, setCandles] = useState<Candle[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
  const [lastPrice, setLastPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY')
  const [orderType, setOrderType] = useState<OrderType>('LIMIT')
  const [orderPrice, setOrderPrice] = useState<string>('')
  const [orderQuantity, setOrderQuantity] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Referências para o gráfico
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | null>(null)

  // Para selects responsivos
  const SYMBOLS = AVAILABLE_SYMBOLS
  const INTERVALS = AVAILABLE_INTERVALS
  const selectedSymbol = symbol
  const selectedInterval = interval

  // Funções de manipulação
  const handleSymbolChange = (value: string) => {
    setSymbol(value)
  }
  const handleIntervalChange = (value: string) => {
    setInterval(value)
  }

  // Função para atualizar dados (mock)
  const refreshData = () => {
    // Aqui você pode disparar um fetch dos candles/trades
    toast.info('Atualizando dados...')
    // Simular loading
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  // Efeito para buscar candles iniciais (mock)
  useEffect(() => {
    setIsLoading(true)
    // Simular fetch
    setTimeout(() => {
      // Mock de candles
      const now = Math.floor(Date.now() / 1000)
      const mockCandles: Candle[] = Array.from({ length: 100 }, (_, i) => ({
        time: now - (99 - i) * 60,
        open: 60000 + Math.random() * 1000,
        high: 60500 + Math.random() * 1000,
        low: 59500 + Math.random() * 1000,
        close: 60000 + Math.random() * 1000,
        volume: Math.random() * 10,
      }))
      setCandles(mockCandles)
      setIsLoading(false)
    }, 800)
  }, [symbol, interval])

  // Efeito para criar e atualizar o gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return

    // Substitua a altura fixa por uma altura responsiva
    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      width: chartContainerRef.current.clientWidth,
      // Altura responsiva baseada no tamanho da tela
      height: Math.min(
        Math.max(
          window.innerWidth < 640
            ? Math.min(window.innerHeight * 0.7, 400)
            : 600,
          300
        ),
        600
      ),
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(42, 46, 57, 0.2)',
        rightOffset: 5,
      },
      rightPriceScale: {
        borderColor: 'rgba(42, 46, 57, 0.2)',
      },
    }

    // Limpar gráfico anterior
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    // Criar novo gráfico
    const chart = createChart(chartContainerRef.current, chartOptions)
    chartRef.current = chart

    let series: ISeriesApi<'Candlestick'> | ISeriesApi<'Line'>
    if (chartType === 'candles') {
      series = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })
      if (candles.length > 0) {
        series.setData(
          candles.map((c) => ({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
        )
      }
    } else {
      series = chart.addLineSeries({
        color: '#26a69a',
        lineWidth: 2,
      })
      if (candles.length > 0) {
        series.setData(
          candles.map((c) => ({
            time: c.time,
            value: c.close,
          }))
        )
      }
    }
    seriesRef.current = series

    // Responsividade ao redimensionar
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: Math.min(
            Math.max(
              window.innerWidth < 640
                ? Math.min(window.innerHeight * 0.7, 400)
                : 600,
              300
            ),
            600
          ),
        })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, chartType])

  // Layout principal responsivo
  return (
    <div className="w-full">
      {/* Barra superior com pares e intervalos */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedSymbol}
            onValueChange={handleSymbolChange}
          >
            <SelectTrigger className="w-[140px] h-9" aria-label="Selecionar par de trading">
              <SelectValue placeholder="Selecione um par" />
            </SelectTrigger>
            <SelectContent>
              {SYMBOLS.map((symbol) => (
                <SelectItem key={symbol.value} value={symbol.value}>
                  {symbol.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedInterval}
            onValueChange={handleIntervalChange}
          >
            <SelectTrigger className="w-[100px] h-9" aria-label="Selecionar intervalo">
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent>
              {INTERVALS.map((interval) => (
                <SelectItem key={interval.value} value={interval.value}>
                  {interval.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={chartType === 'candles' ? 'default' : 'outline'}
              className="h-9 px-3"
              onClick={() => setChartType('candles')}
              aria-label="Modo velas"
            >
              <CandlestickChart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Velas</span>
            </Button>
            <Button
              size="sm"
              variant={chartType === 'line' ? 'default' : 'outline'}
              className="h-9 px-3"
              onClick={() => setChartType('line')}
              aria-label="Modo linha"
            >
              <LineChart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Linha</span>
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-9 px-3"
            onClick={refreshData}
            aria-label="Atualizar dados"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Layout principal com grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {/* Container do gráfico */}
        <div className="lg:col-span-3 rounded-md border bg-card">
          <div
            ref={chartContainerRef}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
          >
            {candles.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Carregando dados do mercado...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Painel lateral */}
        <div className="space-y-3 md:space-y-4">
          {/* Tabs para Book de Ordens, Trades e Trading */}
          <Tabs defaultValue="trading" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="trading">
                <span className="hidden sm:inline">Trading</span>
                <Settings className="sm:hidden h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="orderbook">
                <span className="hidden sm:inline">Book</span>
                <Layers className="sm:hidden h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="trades">
                <span className="hidden sm:inline">Trades</span>
                <BarChart2 className="sm:hidden h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo para cada tab... manter o conteúdo existente */}
            <TabsContent value="trading" className="p-3 border rounded-md mt-3">
              {/* Trading form content */}
              {/* ... existing content ... */}
              <div>
                <p className="text-muted-foreground">Formulário de trading aqui...</p>
              </div>
            </TabsContent>

            <TabsContent value="orderbook" className="p-3 border rounded-md mt-3">
              {/* Orderbook content */}
              {/* ... existing content ... */}
              <div>
                <p className="text-muted-foreground">Orderbook aqui...</p>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="p-3 border rounded-md mt-3">
              {/* Trades content */}
              {/* ... existing content ... */}
              <div>
                <p className="text-muted-foreground">Trades recentes aqui...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
