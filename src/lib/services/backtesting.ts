import type { CandleData } from './indicators';
import { type Signal, SignalType, type Strategy } from './strategies';
import type { BinanceService } from './binance';

// Tipos para a configuração do backtesting
export interface BacktestConfig {
  symbol: string;
  interval: string;
  startTime?: number; // Timestamp em ms
  endTime?: number; // Timestamp em ms
  initialCapital: number;
  feePercentage: number;
  strategies: Strategy[];
  stopLoss?: number; // Percentual de stop loss (ex: 5 = 5%)
  takeProfit?: number; // Percentual de take profit (ex: 10 = 10%)
}

// Uma única operação no backtesting
export interface BacktestTrade {
  entryTime: number;
  entryPrice: number;
  exitTime: number | null;
  exitPrice: number | null;
  type: 'LONG' | 'SHORT';
  profit: number;
  profitPercentage: number;
  quantity: number;
  fees: number;
  strategy: string;
  confidence: number;
  status: 'OPEN' | 'CLOSED';
  exitReason: 'SIGNAL' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'END_OF_TEST' | null;
}

// Resultado do backtesting
export interface BacktestResult {
  symbol: string;
  interval: string;
  startTime: number;
  endTime: number;
  initialCapital: number;
  finalCapital: number;
  profitLoss: number;
  profitLossPercentage: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
  equityCurve: { time: number; equity: number }[];
  signals: Signal[];
}

export class BacktestingService {
  private binanceService: BinanceService;

  constructor(binanceService: BinanceService) {
    this.binanceService = binanceService;
  }

  /**
   * Executa um backtesting completo com as configurações fornecidas
   */
  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    // Buscar dados históricos da Binance
    const candles = await this.fetchHistoricalData(
      config.symbol,
      config.interval,
      config.startTime,
      config.endTime
    );

    if (candles.length === 0) {
      throw new Error('Não foram encontrados dados históricos para o período especificado');
    }

    // Inicializar o resultado do backtesting
    const result: BacktestResult = {
      symbol: config.symbol,
      interval: config.interval,
      startTime: candles[0].time * 1000,
      endTime: candles[candles.length - 1].time * 1000,
      initialCapital: config.initialCapital,
      finalCapital: config.initialCapital,
      profitLoss: 0,
      profitLossPercentage: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgProfit: 0,
      avgLoss: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      trades: [],
      equityCurve: [{ time: candles[0].time * 1000, equity: config.initialCapital }],
      signals: []
    };

    // Informações de estado durante o backtesting
    let currentCapital = config.initialCapital;
    let availableCapital = config.initialCapital;
    let allocatedCapital = 0;
    let highestCapital = config.initialCapital;
    let currentDrawdown = 0;
    let maxDrawdown = 0;
    let openTrades: BacktestTrade[] = [];
    const allSignals: Signal[] = [];
    const dailyReturns: number[] = [];
    let lastDayTimestamp = Math.floor(candles[0].time / 86400) * 86400;
    let lastDayCapital = config.initialCapital;

    // Para cada período, analisar os dados com todas as estratégias
    for (let i = 50; i < candles.length; i++) { // Começar a partir do índice 50 para ter dados suficientes para indicadores
      const currentCandle = candles[i];
      const currentTime = currentCandle.time * 1000;
      const historicalData = candles.slice(0, i + 1);

      // Gerar sinais para cada estratégia
      const periodSignals: Signal[] = [];

      for (const strategy of config.strategies) {
        const signal = strategy.analyze(historicalData, { symbol: config.symbol });
        if (signal.type !== SignalType.NEUTRAL) {
          periodSignals.push(signal);
          allSignals.push(signal);
        }
      }

      // Processar os sinais gerados
      if (periodSignals.length > 0) {
        // Priorizar sinais com base na confiança
        const prioritizedSignals = periodSignals.sort((a, b) => b.confidence - a.confidence);

        // Vamos usar o sinal mais confiante para tomar uma decisão
        const bestSignal = prioritizedSignals[0];

        // Verificar se devemos fechar trades existentes com base em sinais opostos
        openTrades = this.processExistingTrades(
          openTrades,
          bestSignal,
          currentCandle,
          config.feePercentage,
          result.trades
        );

        // Verificar se devemos abrir novas posições
        if (availableCapital > 0) {
          const newTrade = this.processNewTrade(
            bestSignal,
            currentCandle,
            availableCapital,
            config.feePercentage
          );

          if (newTrade) {
            openTrades.push(newTrade);
            availableCapital -= newTrade.quantity * newTrade.entryPrice;
            allocatedCapital += newTrade.quantity * newTrade.entryPrice;
          }
        }
      }

      // Verificar stop loss e take profit para trades abertas
      if (config.stopLoss || config.takeProfit) {
        openTrades = this.checkStopLossAndTakeProfit(
          openTrades,
          currentCandle,
          config.stopLoss,
          config.takeProfit,
          config.feePercentage,
          result.trades
        );
      }

      // Atualizar o capital atual
      currentCapital = availableCapital;
      for (const trade of openTrades) {
        // Valor de mercado das posições abertas
        const marketValue = trade.quantity * currentCandle.close;

        if (trade.type === 'LONG') {
          currentCapital += marketValue;
        } else {
          // Para posições curtas, o valor da posição diminui quando o preço sobe
          const shortValue = trade.quantity * (2 * trade.entryPrice - currentCandle.close);
          currentCapital += shortValue;
        }
      }

      // Atualizar a curva de patrimônio
      result.equityCurve.push({ time: currentTime, equity: currentCapital });

      // Calcular o drawdown
      if (currentCapital > highestCapital) {
        highestCapital = currentCapital;
        currentDrawdown = 0;
      } else {
        currentDrawdown = (highestCapital - currentCapital) / highestCapital * 100;
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
      }

      // Calcular retornos diários (para Sharpe Ratio)
      const currentDay = Math.floor(currentTime / 86400000) * 86400000;
      if (currentDay > lastDayTimestamp) {
        const dailyReturn = (currentCapital - lastDayCapital) / lastDayCapital;
        dailyReturns.push(dailyReturn);
        lastDayCapital = currentCapital;
        lastDayTimestamp = currentDay;
      }
    }

    // Fechar todas as posições abertas no final do período
    openTrades = this.closeAllTrades(
      openTrades,
      candles[candles.length - 1],
      config.feePercentage,
      'END_OF_TEST',
      result.trades
    );

    // Calcular estatísticas finais
    result.finalCapital = currentCapital;
    result.profitLoss = currentCapital - config.initialCapital;
    result.profitLossPercentage = (result.profitLoss / config.initialCapital) * 100;
    result.totalTrades = result.trades.length;
    result.winningTrades = result.trades.filter(t => t.profit > 0).length;
    result.losingTrades = result.trades.filter(t => t.profit <= 0).length;
    result.winRate = result.totalTrades > 0 ? (result.winningTrades / result.totalTrades) * 100 : 0;

    const profits = result.trades.filter(t => t.profit > 0).map(t => t.profit);
    const losses = result.trades.filter(t => t.profit <= 0).map(t => t.profit);

    result.avgProfit = profits.length > 0 ? profits.reduce((sum, p) => sum + p, 0) / profits.length : 0;
    result.avgLoss = losses.length > 0 ? losses.reduce((sum, l) => sum + l, 0) / losses.length : 0;
    result.maxDrawdown = maxDrawdown;

    // Calcular Sharpe Ratio (retorno anualizado / volatilidade anualizada)
    if (dailyReturns.length > 0) {
      const avgDailyReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
      const dailyStdDev = Math.sqrt(
        dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgDailyReturn, 2), 0) / dailyReturns.length
      );

      // Anualizando (aproximadamente 252 dias de trading por ano)
      const annualizedReturn = avgDailyReturn * 252;
      const annualizedStdDev = dailyStdDev * Math.sqrt(252);

      result.sharpeRatio = annualizedStdDev > 0 ? annualizedReturn / annualizedStdDev : 0;
    }

    result.signals = allSignals;

    return result;
  }

  /**
   * Busca dados históricos da API da Binance
   */
  private async fetchHistoricalData(
    symbol: string,
    interval: string,
    startTime?: number,
    endTime?: number
  ): Promise<CandleData[]> {
    try {
      const klines = await this.binanceService.getKlines(symbol, interval, 1000, startTime, endTime);

      return klines.map(kline => ({
        time: kline.openTime / 1000, // Convertendo para segundos (padrão usado pelo Lightweight Charts)
        open: Number.parseFloat(kline.open),
        high: Number.parseFloat(kline.high),
        low: Number.parseFloat(kline.low),
        close: Number.parseFloat(kline.close),
        volume: Number.parseFloat(kline.volume)
      }));
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
      return [];
    }
  }

  /**
   * Processa trades existentes e fecha posições com base em sinais
   */
  private processExistingTrades(
    openTrades: BacktestTrade[],
    signal: Signal,
    currentCandle: CandleData,
    feePercentage: number,
    allTrades: BacktestTrade[]
  ): BacktestTrade[] {
    const updatedTrades: BacktestTrade[] = [];

    for (const trade of openTrades) {
      let shouldClose = false;

      // Fechar posições longas em sinais de venda
      if (trade.type === 'LONG' && signal.type === SignalType.SELL) {
        shouldClose = true;
      }
      // Fechar posições curtas em sinais de compra
      else if (trade.type === 'SHORT' && signal.type === SignalType.BUY) {
        shouldClose = true;
      }

      if (shouldClose) {
        // Calcular resultado do trade
        const exitPrice = currentCandle.close;
        const exitTime = currentCandle.time * 1000;
        const fees = (trade.quantity * exitPrice) * (feePercentage / 100);

        let profit = 0;
        if (trade.type === 'LONG') {
          profit = (exitPrice - trade.entryPrice) * trade.quantity - trade.fees - fees;
        } else {
          profit = (trade.entryPrice - exitPrice) * trade.quantity - trade.fees - fees;
        }

        const profitPercentage = (profit / (trade.quantity * trade.entryPrice)) * 100;

        // Atualizar o trade
        const closedTrade: BacktestTrade = {
          ...trade,
          exitTime,
          exitPrice,
          profit,
          profitPercentage,
          fees: trade.fees + fees,
          status: 'CLOSED',
          exitReason: 'SIGNAL'
        };

        // Adicionar à lista de trades fechados
        allTrades.push(closedTrade);
      } else {
        // Manter o trade aberto
        updatedTrades.push(trade);
      }
    }

    return updatedTrades;
  }

  /**
   * Processa um novo trade com base no sinal
   */
  private processNewTrade(
    signal: Signal,
    currentCandle: CandleData,
    availableCapital: number,
    feePercentage: number
  ): BacktestTrade | null {
    // Não abrir trade se o sinal for neutro
    if (signal.type === SignalType.NEUTRAL) {
      return null;
    }

    // Determinar o tipo de operação baseado no sinal
    const tradeType = signal.type === SignalType.BUY ? 'LONG' : 'SHORT';

    // Calcular a quantidade a ser negociada (usar todo o capital disponível)
    // Em um cenário real, seria melhor usar apenas uma porcentagem do capital disponível
    const price = currentCandle.close;

    // Usar 95% do capital disponível para deixar margem para taxas
    const tradingCapital = availableCapital * 0.95;
    const quantity = tradingCapital / price;

    if (quantity <= 0) {
      return null;
    }

    // Calcular taxas
    const fees = (quantity * price) * (feePercentage / 100);

    // Criar o novo trade
    return {
      entryTime: currentCandle.time * 1000,
      entryPrice: price,
      exitTime: null,
      exitPrice: null,
      type: tradeType,
      profit: 0,
      profitPercentage: 0,
      quantity,
      fees,
      strategy: signal.strategy,
      confidence: signal.confidence,
      status: 'OPEN',
      exitReason: null
    };
  }

  /**
   * Verifica stop loss e take profit para os trades abertos
   */
  private checkStopLossAndTakeProfit(
    openTrades: BacktestTrade[],
    currentCandle: CandleData,
    stopLoss?: number,
    takeProfit?: number,
    feePercentage: number,
    allTrades: BacktestTrade[]
  ): BacktestTrade[] {
    const updatedTrades: BacktestTrade[] = [];

    for (const trade of openTrades) {
      let shouldClose = false;
      let exitReason: 'STOP_LOSS' | 'TAKE_PROFIT' | null = null;

      // Calcular variação percentual atual do trade
      let currentProfitPercentage = 0;

      if (trade.type === 'LONG') {
        currentProfitPercentage = ((currentCandle.close - trade.entryPrice) / trade.entryPrice) * 100;
      } else {
        currentProfitPercentage = ((trade.entryPrice - currentCandle.close) / trade.entryPrice) * 100;
      }

      // Verificar stop loss
      if (stopLoss && currentProfitPercentage <= -stopLoss) {
        shouldClose = true;
        exitReason = 'STOP_LOSS';
      }

      // Verificar take profit
      if (takeProfit && currentProfitPercentage >= takeProfit) {
        shouldClose = true;
        exitReason = 'TAKE_PROFIT';
      }

      if (shouldClose && exitReason) {
        // Calcular resultado do trade
        const exitPrice = currentCandle.close;
        const exitTime = currentCandle.time * 1000;
        const fees = (trade.quantity * exitPrice) * (feePercentage / 100);

        let profit = 0;
        if (trade.type === 'LONG') {
          profit = (exitPrice - trade.entryPrice) * trade.quantity - trade.fees - fees;
        } else {
          profit = (trade.entryPrice - exitPrice) * trade.quantity - trade.fees - fees;
        }

        const profitPercentage = (profit / (trade.quantity * trade.entryPrice)) * 100;

        // Atualizar o trade
        const closedTrade: BacktestTrade = {
          ...trade,
          exitTime,
          exitPrice,
          profit,
          profitPercentage,
          fees: trade.fees + fees,
          status: 'CLOSED',
          exitReason
        };

        // Adicionar à lista de trades fechados
        allTrades.push(closedTrade);
      } else {
        // Manter o trade aberto
        updatedTrades.push(trade);
      }
    }

    return updatedTrades;
  }

  /**
   * Fecha todos os trades abertos no final do período
   */
  private closeAllTrades(
    openTrades: BacktestTrade[],
    lastCandle: CandleData,
    feePercentage: number,
    exitReason: 'END_OF_TEST',
    allTrades: BacktestTrade[]
  ): BacktestTrade[] {
    for (const trade of openTrades) {
      // Calcular resultado do trade
      const exitPrice = lastCandle.close;
      const exitTime = lastCandle.time * 1000;
      const fees = (trade.quantity * exitPrice) * (feePercentage / 100);

      let profit = 0;
      if (trade.type === 'LONG') {
        profit = (exitPrice - trade.entryPrice) * trade.quantity - trade.fees - fees;
      } else {
        profit = (trade.entryPrice - exitPrice) * trade.quantity - trade.fees - fees;
      }

      const profitPercentage = (profit / (trade.quantity * trade.entryPrice)) * 100;

      // Atualizar o trade
      const closedTrade: BacktestTrade = {
        ...trade,
        exitTime,
        exitPrice,
        profit,
        profitPercentage,
        fees: trade.fees + fees,
        status: 'CLOSED',
        exitReason
      };

      // Adicionar à lista de trades fechados
      allTrades.push(closedTrade);
    }

    return [];
  }
}
