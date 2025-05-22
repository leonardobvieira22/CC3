"use client"

import { create } from 'zustand'

// Tipos para os diferentes eventos WebSocket
export type KlineTick = {
  eventType: 'kline'
  eventTime: number
  symbol: string
  kline: {
    startTime: number
    endTime: number
    symbol: string
    interval: string
    firstTradeId: number
    lastTradeId: number
    open: string
    close: string
    high: string
    low: string
    volume: string
    trades: number
    final: boolean
    quoteVolume: string
    volumeActive: string
    quoteVolumeActive: string
  }
}

export type TickerTick = {
  eventType: 'ticker'
  eventTime: number
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvg: string
  prevDayClose: string
  curDayClose: string
  closeTradeQuantity: string
  bestBid: string
  bestBidQnt: string
  bestAsk: string
  bestAskQnt: string
  open: string
  high: string
  low: string
  volume: string
  volumeQuote: string
  openTime: number
  closeTime: number
  firstTradeId: number
  lastTradeId: number
  trades: number
}

export type TradeTick = {
  eventType: 'trade'
  eventTime: number
  symbol: string
  tradeId: number
  price: string
  quantity: string
  buyerOrderId: number
  sellerOrderId: number
  time: number
  isBuyerMaker: boolean
  isTradeMatchBest: boolean
}

export type DepthTick = {
  eventType: 'depthUpdate'
  eventTime: number
  symbol: string
  firstUpdateId: number
  finalUpdateId: number
  bids: [string, string][] // [price, quantity]
  asks: [string, string][] // [price, quantity]
}

// União de todos os tipos de eventos possíveis
export type WebSocketTick = KlineTick | TickerTick | TradeTick | DepthTick

// Callbacks para os diferentes tipos de eventos
export type WebSocketCallbacks = {
  onMessage?: (data: WebSocketTick) => void
  onKline?: (data: KlineTick) => void
  onTicker?: (data: TickerTick) => void
  onTrade?: (data: TradeTick) => void
  onDepth?: (data: DepthTick) => void
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
}

// Configurações para as streams
export type WebSocketConfig = {
  symbols: string[]
  interval?: string
  callbacks: WebSocketCallbacks
}

// Interface para o gerenciador de WebSockets
export interface BinanceWebSocketManager {
  connections: Map<string, WebSocket>
  subscribeKline: (config: WebSocketConfig) => void
  subscribeTicker: (config: WebSocketConfig) => void
  subscribeTrade: (config: WebSocketConfig) => void
  subscribeDepth: (config: WebSocketConfig) => void
  unsubscribe: (streamName: string) => void
  unsubscribeAll: () => void
  isConnected: (streamName: string) => boolean
}

// Estado global para gerenciar as conexões WebSocket
export const useBinanceWebSocket = create<BinanceWebSocketManager>((set, get) => ({
  connections: new Map<string, WebSocket>(),

  subscribeKline: (config: WebSocketConfig) => {
    const { symbols, interval = '1m', callbacks } = config

    symbols.forEach(symbol => {
      const streamName = `${symbol.toLowerCase()}@kline_${interval}`
      const socket = get().connections.get(streamName)

      // Se já existir uma conexão ativa para este stream, não faz nada
      if (socket?.readyState === WebSocket.OPEN) return

      // Cria uma nova conexão para o stream
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = (event) => {
        callbacks.onOpen?.(event)
      }

      ws.onclose = (event) => {
        callbacks.onClose?.(event)
        // Remove a conexão do mapa quando fechar
        const connections = get().connections
        connections.delete(streamName)
        set({ connections: new Map(connections) })
      }

      ws.onerror = (event) => {
        callbacks.onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as KlineTick
          callbacks.onMessage?.(data)

          if (data.eventType === 'kline') {
            callbacks.onKline?.(data)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error)
        }
      }

      // Adiciona a nova conexão ao mapa
      const connections = get().connections
      connections.set(streamName, ws)
      set({ connections: new Map(connections) })
    })
  },

  subscribeTicker: (config: WebSocketConfig) => {
    const { symbols, callbacks } = config

    symbols.forEach(symbol => {
      const streamName = `${symbol.toLowerCase()}@ticker`
      const socket = get().connections.get(streamName)

      // Se já existir uma conexão ativa para este stream, não faz nada
      if (socket?.readyState === WebSocket.OPEN) return

      // Cria uma nova conexão para o stream
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = (event) => {
        callbacks.onOpen?.(event)
      }

      ws.onclose = (event) => {
        callbacks.onClose?.(event)
        // Remove a conexão do mapa quando fechar
        const connections = get().connections
        connections.delete(streamName)
        set({ connections: new Map(connections) })
      }

      ws.onerror = (event) => {
        callbacks.onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as TickerTick
          callbacks.onMessage?.(data)

          if (data.eventType === 'ticker') {
            callbacks.onTicker?.(data)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error)
        }
      }

      // Adiciona a nova conexão ao mapa
      const connections = get().connections
      connections.set(streamName, ws)
      set({ connections: new Map(connections) })
    })
  },

  subscribeTrade: (config: WebSocketConfig) => {
    const { symbols, callbacks } = config

    symbols.forEach(symbol => {
      const streamName = `${symbol.toLowerCase()}@trade`
      const socket = get().connections.get(streamName)

      // Se já existir uma conexão ativa para este stream, não faz nada
      if (socket?.readyState === WebSocket.OPEN) return

      // Cria uma nova conexão para o stream
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = (event) => {
        callbacks.onOpen?.(event)
      }

      ws.onclose = (event) => {
        callbacks.onClose?.(event)
        // Remove a conexão do mapa quando fechar
        const connections = get().connections
        connections.delete(streamName)
        set({ connections: new Map(connections) })
      }

      ws.onerror = (event) => {
        callbacks.onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as TradeTick
          callbacks.onMessage?.(data)

          if (data.eventType === 'trade') {
            callbacks.onTrade?.(data)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error)
        }
      }

      // Adiciona a nova conexão ao mapa
      const connections = get().connections
      connections.set(streamName, ws)
      set({ connections: new Map(connections) })
    })
  },

  subscribeDepth: (config: WebSocketConfig) => {
    const { symbols, callbacks } = config

    symbols.forEach(symbol => {
      const streamName = `${symbol.toLowerCase()}@depth`
      const socket = get().connections.get(streamName)

      // Se já existir uma conexão ativa para este stream, não faz nada
      if (socket?.readyState === WebSocket.OPEN) return

      // Cria uma nova conexão para o stream
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = (event) => {
        callbacks.onOpen?.(event)
      }

      ws.onclose = (event) => {
        callbacks.onClose?.(event)
        // Remove a conexão do mapa quando fechar
        const connections = get().connections
        connections.delete(streamName)
        set({ connections: new Map(connections) })
      }

      ws.onerror = (event) => {
        callbacks.onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as DepthTick
          callbacks.onMessage?.(data)

          if (data.eventType === 'depthUpdate') {
            callbacks.onDepth?.(data)
          }
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error)
        }
      }

      // Adiciona a nova conexão ao mapa
      const connections = get().connections
      connections.set(streamName, ws)
      set({ connections: new Map(connections) })
    })
  },

  unsubscribe: (streamName: string) => {
    const connections = get().connections
    const socket = connections.get(streamName)

    if (socket) {
      socket.close()
      connections.delete(streamName)
      set({ connections: new Map(connections) })
    }
  },

  unsubscribeAll: () => {
    const connections = get().connections

    connections.forEach((socket, streamName) => {
      socket.close()
    })

    set({ connections: new Map() })
  },

  isConnected: (streamName: string) => {
    const socket = get().connections.get(streamName)
    return socket?.readyState === WebSocket.OPEN
  }
}))

// Função auxiliar para formatar nome da stream
export const formatStreamName = (symbol: string, type: 'kline' | 'ticker' | 'trade' | 'depth', interval?: string) => {
  switch (type) {
    case 'kline':
      return `${symbol.toLowerCase()}@kline_${interval || '1m'}`
    case 'ticker':
      return `${symbol.toLowerCase()}@ticker`
    case 'trade':
      return `${symbol.toLowerCase()}@trade`
    case 'depth':
      return `${symbol.toLowerCase()}@depth`
  }
}
