"use client"

import { type BinanceService, KlineData } from './binance';
import {
  type Strategy,
  type Signal,
  SignalType,
  RSIStrategy,
  BollingerStrategy,
  MACDStrategy,
  TrendHunterStrategy,
  combineSignals
} from './strategies';
import type { CandleData } from './indicators';

// Tipos de operações (mais detalhados que os sinais)
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT'
}

export enum OrderStatus {
  NEW = 'NEW',
  FILLED = 'FILLED',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

// Interface para uma ordem
export interface Order {
  id: string;
  robotId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: string;
  price?: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  filledQuantity?: string;
  filledPrice?: string;
  signal?: Signal;
}

// Interface para um robô de trading
export interface Robot {
  id: string;
  name: string;
  description: string;
  strategy: Strategy;
  isActive: boolean;
  pairs: string[];
  maxOperations: number;
  allocationPerTrade: number; // porcentagem do capital
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  stopLoss?: number; // porcentagem
  takeProfit?: number; // porcentagem
  createdAt: number;
  updatedAt: number;
  lastSignal?: Signal;
  openOrders: Order[];
}

// Dados de desempenho do robô
export interface RobotPerformance {
  robotId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  returnPercentage: number;
  bestTrade: number;
  worstTrade: number;
  averageTrade: number;
  startBalance: number;
  currentBalance: number;
  period: 'day' | 'week' | 'month' | 'year' | 'all';
}

// Interface para um histórico de operação
export interface TradeHistory {
  id: string;
  robotId: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: string;
  side: OrderSide;
  profit: number;
  profitPercentage: number;
  entryTime: number;
  exitTime: number;
  duration: number;
  strategy: string;
}

// Classe para gerenciar os robôs de trading
export class RobotManager {
  private binanceService: BinanceService;
  private robots: Map<string, Robot> = new Map();
  private tradeHistory: TradeHistory[] = [];
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private updateInterval = 60000; // 1 minuto por padrão
  private balanceCache: { asset: string, free: string, locked: string }[] = [];
  private lastBalanceUpdate = 0;

  constructor(binanceService: BinanceService) {
    this.binanceService = binanceService;
  }

  // Inicializar os robôs disponíveis no sistema
  initDefaultRobots() {
    // Robô RSI
    const rsiRobot: Robot = {
      id: 'rsi-master',
      name: 'RSI Master',
      description: 'Utiliza o Índice de Força Relativa com IA para identificar sobrecompras e sobrevendas no mercado.',
      strategy: new RSIStrategy(),
      isActive: false,
      pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
      maxOperations: 3,
      allocationPerTrade: 5, // 5% do capital por operação
      riskProfile: 'moderate',
      stopLoss: 2.5, // 2.5% de stop loss
      takeProfit: 5, // 5% de take profit
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openOrders: []
    };

    // Robô Bollinger
    const bollingerRobot: Robot = {
      id: 'bollinger-ia',
      name: 'Bollinger IA',
      description: 'Identifica volatilidade e reversões com Bandas de Bollinger aprimoradas por IA.',
      strategy: new BollingerStrategy(),
      isActive: false,
      pairs: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
      maxOperations: 3,
      allocationPerTrade: 4, // 4% do capital por operação
      riskProfile: 'conservative',
      stopLoss: 2, // 2% de stop loss
      takeProfit: 4, // 4% de take profit
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openOrders: []
    };

    // Robô MACD
    const macdRobot: Robot = {
      id: 'macd-pro',
      name: 'MACD Pro',
      description: 'Análise avançada de convergência/divergência com filtros de IA.',
      strategy: new MACDStrategy(),
      isActive: false,
      pairs: ['BTCUSDT', 'ETHUSDT', 'DOTUSDT'],
      maxOperations: 3,
      allocationPerTrade: 5, // 5% do capital por operação
      riskProfile: 'moderate',
      stopLoss: 3, // 3% de stop loss
      takeProfit: 6, // 6% de take profit
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openOrders: []
    };

    // Robô Trend Hunter
    const trendRobot: Robot = {
      id: 'trend-hunter',
      name: 'Trend Hunter',
      description: 'Algoritmo de detecção de tendências com análise profunda de mercado.',
      strategy: new TrendHunterStrategy(),
      isActive: false,
      pairs: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
      maxOperations: 3,
      allocationPerTrade: 7, // 7% do capital por operação
      riskProfile: 'aggressive',
      stopLoss: 4, // 4% de stop loss
      takeProfit: 8, // 8% de take profit
      createdAt: Date.now(),
      updatedAt: Date.now(),
      openOrders: []
    };

    // Adicionar robôs ao mapa
    this.robots.set(rsiRobot.id, rsiRobot);
    this.robots.set(bollingerRobot.id, bollingerRobot);
    this.robots.set(macdRobot.id, macdRobot);
    this.robots.set(trendRobot.id, trendRobot);
  }

  // Obter todos os robôs
  getRobots(): Robot[] {
    return Array.from(this.robots.values());
  }

  // Obter um robô específico
  getRobot(id: string): Robot | undefined {
    return this.robots.get(id);
  }

  // Atualizar configurações de um robô
  updateRobot(id: string, updates: Partial<Robot>): boolean {
    const robot = this.robots.get(id);
    if (!robot) return false;

    Object.assign(robot, { ...updates, updatedAt: Date.now() });
    this.robots.set(id, robot);
    return true;
  }

  // Ativar ou desativar um robô
  toggleRobotActive(id: string, active: boolean): boolean {
    const robot = this.robots.get(id);
    if (!robot) return false;

    robot.isActive = active;
    robot.updatedAt = Date.now();
    this.robots.set(id, robot);

    // Iniciar o loop de trading se algum robô estiver ativo
    this.updateTradingLoop();

    return true;
  }

  // Verificar se precisa iniciar ou parar o loop de trading
  private updateTradingLoop() {
    const hasActiveRobots = Array.from(this.robots.values()).some(robot => robot.isActive);

    if (hasActiveRobots && !this.isRunning) {
      this.startTradingLoop();
    } else if (!hasActiveRobots && this.isRunning) {
      this.stopTradingLoop();
    }
  }

  // Iniciar o loop de trading
  startTradingLoop() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => this.processTradingCycle(), this.updateInterval);

    // Executar imediatamente a primeira vez
    this.processTradingCycle();
  }

  // Parar o loop de trading
  stopTradingLoop() {
    if (!this.isRunning || !this.intervalId) return;

    clearInterval(this.intervalId);
    this.isRunning = false;
    this.intervalId = null;
  }

  // Alterar o intervalo de atualização
  setUpdateInterval(intervalMs: number) {
    this.updateInterval = intervalMs;

    // Reiniciar o loop se já estiver rodando
    if (this.isRunning) {
      this.stopTradingLoop();
      this.startTradingLoop();
    }
  }

  // Processar um ciclo de trading
  private async processTradingCycle() {
    try {
      // Verificar se o serviço Binance está configurado
      if (!this.binanceService.hasCredentials()) {
        console.warn('Binance API não configurada. Trading desativado.');
        return;
      }

      // Atualizar saldo (cache a cada 5 minutos)
      if (Date.now() - this.lastBalanceUpdate > 300000) {
        await this.updateBalance();
      }

      // Processar apenas robôs ativos
      const activeRobots = Array.from(this.robots.values()).filter(robot => robot.isActive);

      for (const robot of activeRobots) {
        // Verificar status das ordens abertas
        await this.checkOpenOrders(robot);

        // Verificar se o robô pode abrir novas posições
        if (robot.openOrders.length >= robot.maxOperations) {
          continue; // Pular este robô se já atingiu o limite de operações
        }

        // Analisar pares de moedas
        for (const pair of robot.pairs) {
          // Verificar se já existe uma ordem aberta para este par
          const hasOpenOrderForPair = robot.openOrders.some(order => order.symbol === pair);
          if (hasOpenOrderForPair) continue;

          // Buscar dados históricos para análise
          const candles = await this.fetchCandlesForAnalysis(pair);
          if (!candles || candles.length === 0) continue;

          // Analisar dados com a estratégia do robô
          const signal = robot.strategy.analyze(candles, { symbol: pair });

          // Atualizar último sinal
          robot.lastSignal = signal;

          // Executar operação se o sinal for forte o suficiente
          if (signal.type !== SignalType.NEUTRAL && signal.confidence >= 70) {
            await this.executeSignal(robot, signal);
          }
        }
      }
    } catch (error) {
      console.error('Erro no ciclo de trading:', error);
    }
  }

  // Buscar candles para análise
  private async fetchCandlesForAnalysis(symbol: string, interval = '1h', limit = 100): Promise<CandleData[]> {
    try {
      const klines = await this.binanceService.getKlines(symbol, interval, limit);

      // Converter para o formato CandleData
      return klines.map(kline => ({
        time: kline.openTime,
        open: Number.parseFloat(kline.open),
        high: Number.parseFloat(kline.high),
        low: Number.parseFloat(kline.low),
        close: Number.parseFloat(kline.close),
        volume: Number.parseFloat(kline.volume)
      }));
    } catch (error) {
      console.error(`Erro ao buscar candles para ${symbol}:`, error);
      return [];
    }
  }

  // Atualizar informações de saldo
  private async updateBalance() {
    try {
      const accountInfo = await this.binanceService.getAccountInfo();
      this.balanceCache = accountInfo.balances;
      this.lastBalanceUpdate = Date.now();
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
    }
  }

  // Verificar o saldo disponível para uma moeda
  getAvailableBalance(asset: string): number {
    const assetBalance = this.balanceCache.find(balance => balance.asset === asset);
    return assetBalance ? Number.parseFloat(assetBalance.free) : 0;
  }

  // Verificar ordens abertas de um robô
  private async checkOpenOrders(robot: Robot) {
    for (const order of [...robot.openOrders]) {
      try {
        // Em um sistema real, consultaríamos o status da ordem na Binance
        // Para simulação, vamos finalizar aleatoriamente algumas ordens
        if (Math.random() < 0.2) { // 20% de chance de uma ordem ser concluída a cada ciclo
          // Determinar se foi lucrativa (mais chance de lucro do que perda)
          const profitable = Math.random() < 0.7; // 70% de chance de ser lucrativa

          // Finalizar a ordem e registrar no histórico
          const history = this.closeOrder(robot, order, profitable);

          // Remover a ordem da lista de ordens abertas
          robot.openOrders = robot.openOrders.filter(o => o.id !== order.id);

          console.log(`Ordem ${order.id} finalizada: ${profitable ? 'Lucro' : 'Perda'}`);
        }
      } catch (error) {
        console.error(`Erro ao verificar ordem ${order.id}:`, error);
      }
    }
  }

  // Fechar uma ordem e registrar no histórico
  private closeOrder(robot: Robot, order: Order, profitable: boolean): TradeHistory {
    const entryPrice = Number.parseFloat(order.price || '0');
    const profitFactor = profitable
      ? (1 + (robot.takeProfit || 5) / 100)
      : (1 - (robot.stopLoss || 2) / 100);

    const exitPrice = entryPrice * profitFactor;
    const quantity = Number.parseFloat(order.quantity);
    const profit = order.side === OrderSide.BUY
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity;

    const profitPercentage = (profit / (entryPrice * quantity)) * 100;

    const history: TradeHistory = {
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      robotId: robot.id,
      symbol: order.symbol,
      entryPrice,
      exitPrice,
      quantity: order.quantity,
      side: order.side,
      profit,
      profitPercentage,
      entryTime: order.createdAt,
      exitTime: Date.now(),
      duration: Date.now() - order.createdAt,
      strategy: robot.strategy.name
    };

    // Adicionar ao histórico
    this.tradeHistory.push(history);

    return history;
  }

  // Executar um sinal de trading
  private async executeSignal(robot: Robot, signal: Signal) {
    try {
      // Determinar o lado da ordem
      const side = signal.type === SignalType.BUY ? OrderSide.BUY : OrderSide.SELL;

      // Calcular a quantidade com base na alocação por operação
      // Em um sistema real, consultaríamos o saldo e calcularíamos a quantidade exata
      // Para simulação, vamos usar um valor fictício
      const allocation = robot.allocationPerTrade / 100;
      const baseQuantity = side === OrderSide.BUY ? 0.01 : 0.01; // Quantidade base para simulação

      // Criar a ordem
      const order: Order = {
        id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        robotId: robot.id,
        symbol: signal.symbol,
        side,
        type: OrderType.MARKET,
        quantity: baseQuantity.toString(),
        price: signal.price.toString(),
        status: OrderStatus.FILLED, // Para simulação, consideramos preenchida imediatamente
        createdAt: Date.now(),
        updatedAt: Date.now(),
        signal
      };

      // Em um sistema real, enviaríamos a ordem para a Binance
      // this.binanceService.createOrder(...)

      // Adicionar à lista de ordens abertas do robô
      robot.openOrders.push(order);

      console.log(`Nova ordem criada para ${robot.name}: ${side} ${signal.symbol} @ ${signal.price}`);

      return order;
    } catch (error) {
      console.error(`Erro ao executar sinal para ${robot.id}:`, error);
      return null;
    }
  }

  // Obter histórico de trades para um robô específico
  getTradeHistory(robotId?: string, limit?: number): TradeHistory[] {
    let history = [...this.tradeHistory];

    // Filtrar por robô se especificado
    if (robotId) {
      history = history.filter(trade => trade.robotId === robotId);
    }

    // Ordenar por data (mais recente primeiro)
    history = history.sort((a, b) => b.exitTime - a.exitTime);

    // Limitar quantidade se especificado
    if (limit && limit > 0) {
      history = history.slice(0, limit);
    }

    return history;
  }

  // Calcular o desempenho de um robô
  calculatePerformance(robotId: string, period: 'day' | 'week' | 'month' | 'year' | 'all' = 'all'): RobotPerformance {
    const robot = this.robots.get(robotId);
    if (!robot) {
      throw new Error(`Robô não encontrado: ${robotId}`);
    }

    // Filtrar histórico pelo robô e período
    let cutoffTime = 0;
    const now = Date.now();

    switch (period) {
      case 'day':
        cutoffTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'year':
        cutoffTime = now - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        cutoffTime = 0; // all time
    }

    const filteredHistory = this.tradeHistory.filter(
      trade => trade.robotId === robotId && trade.exitTime >= cutoffTime
    );

    // Inicializar métricas
    const totalTrades = filteredHistory.length;
    let winningTrades = 0;
    let losingTrades = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let bestTrade = 0;
    let worstTrade = 0;

    // Calcular métricas
    for (const trade of filteredHistory) {
      if (trade.profit > 0) {
        winningTrades++;
        totalProfit += trade.profit;
        bestTrade = Math.max(bestTrade, trade.profit);
      } else {
        losingTrades++;
        totalLoss += Math.abs(trade.profit);
        worstTrade = Math.min(worstTrade, trade.profit);
      }
    }

    const netProfit = totalProfit - totalLoss;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const averageTrade = totalTrades > 0 ? netProfit / totalTrades : 0;

    // Para simulação, definimos um saldo inicial fictício
    const startBalance = 10000; // $10,000 USDT
    const currentBalance = startBalance + netProfit;
    const returnPercentage = (netProfit / startBalance) * 100;

    return {
      robotId,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      returnPercentage,
      bestTrade,
      worstTrade,
      averageTrade,
      startBalance,
      currentBalance,
      period
    };
  }

  // Simular operações históricas (backtesting)
  async simulateBacktest(
    robotId: string,
    symbol: string,
    startTime: number,
    endTime: number
  ): Promise<{ performance: RobotPerformance, trades: TradeHistory[] }> {
    // Em uma implementação real, buscaríamos dados históricos e
    // simularíamos a execução da estratégia em todo o período

    // Para simplificar, retornamos um resultado simulado
    return {
      performance: {
        robotId,
        totalTrades: 42,
        winningTrades: 28,
        losingTrades: 14,
        winRate: 66.67,
        totalProfit: 850,
        totalLoss: 320,
        netProfit: 530,
        returnPercentage: 5.3,
        bestTrade: 120,
        worstTrade: -58,
        averageTrade: 12.62,
        startBalance: 10000,
        currentBalance: 10530,
        period: 'all'
      },
      trades: []
    };
  }
}
