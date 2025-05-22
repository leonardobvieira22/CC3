import { type CandleData, calculateRSI, calculateBollingerBands, calculateMACD, calculateSMA, calculateEMA, detectCrossovers, calculateStochastic, calculateADX } from './indicators';

// Tipos de sinais de trading
export enum SignalType {
  BUY = 'BUY',
  SELL = 'SELL',
  NEUTRAL = 'NEUTRAL'
}

// Define base metadata interface
export interface BaseMetadata {
  [key: string]: number | string | boolean | Array<unknown> | Record<string, unknown>;
}

// Strategy-specific metadata interfaces
export interface RSIMetadata extends BaseMetadata {
  rsi: number;
  prevRsi: number;
  overbought: number;
  oversold: number;
}

export interface BollingerMetadata extends BaseMetadata {
  upperBand: number;
  middleBand: number;
  lowerBand: number;
  bandWidth: number;
  bandPosition: number;
}

export interface MACDMetadata extends BaseMetadata {
  macd: number;
  signal: number;
  histogram: number;
  prevHistogram: number;
}

export interface TrendHunterMetadata extends BaseMetadata {
  shortEMA: number;
  longEMA: number;
  shortEMASlope: number;
  longEMASlope: number;
  adx: number;
  plusDI: number;
  minusDI: number;
}

export interface CombinedMetadata extends BaseMetadata {
  buyScore: number;
  sellScore: number;
  signals: Array<{
    strategy: string;
    type: SignalType;
    confidence: number;
  }>;
}

// Define strategy option interfaces
export interface BaseStrategyOptions {
  symbol: string;
}

export interface RSIOptions extends BaseStrategyOptions {
  period: number;
  overbought: number;
  oversold: number;
}

export interface BollingerOptions extends BaseStrategyOptions {
  period: number;
  multiplier: number;
}

export interface MACDOptions extends BaseStrategyOptions {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
}

export interface TrendHunterOptions extends BaseStrategyOptions {
  emaPeriodShort: number;
  emaPeriodLong: number;
  adxPeriod: number;
  adxThreshold: number;
}

export interface CombineSignalsOptions {
  weightByConfidence: boolean;
}

// Union type for all strategy options
export type StrategyOptions = 
  | RSIOptions 
  | BollingerOptions 
  | MACDOptions 
  | TrendHunterOptions;

// Union type for all metadata types
export type SignalMetadata = 
  | RSIMetadata
  | BollingerMetadata
  | MACDMetadata
  | TrendHunterMetadata
  | CombinedMetadata;

// Sinal gerado pelas estratégias
export interface Signal {
  type: SignalType;
  symbol: string;
  price: number;
  time: number;
  strategy: string;
  confidence: number; // 0-100
  metadata?: SignalMetadata;
}

// Interface comum para todas as estratégias
export interface Strategy {
  name: string;
  description: string;
  analyze(data: CandleData[], options?: StrategyOptions): Signal;
}

// Implementação da estratégia RSI
export class RSIStrategy implements Strategy {
  name = 'RSI Master';
  description = 'Utiliza o Índice de Força Relativa com IA para identificar sobrecompras e sobrevendas no mercado';

  analyze(data: CandleData[], options: RSIOptions = { period: 14, overbought: 70, oversold: 30, symbol: 'BTC/USDT' }): Signal {
    // Verificar se temos dados suficientes
    if (data.length < options.period + 1) {
      return {
        type: SignalType.NEUTRAL,
        symbol: options.symbol,
        price: data[data.length - 1].close,
        time: data[data.length - 1].time,
        strategy: this.name,
        confidence: 0
      };
    }

    // Extrair preços de fechamento
    const closes = data.map(candle => candle.close);

    // Calcular RSI
    const rsiValues = calculateRSI(closes, options.period);
    const currentRSI = rsiValues[rsiValues.length - 1];
    const prevRSI = rsiValues[rsiValues.length - 2];

    // Determinar o tipo de sinal com base no valor do RSI
    let signalType = SignalType.NEUTRAL;
    let confidence = 50; // Confiança neutra padrão

    // Lógica de geração de sinal
    if (currentRSI < options.oversold && prevRSI < currentRSI) {
      // RSI está abaixo do nível de sobrevenda e começando a subir
      signalType = SignalType.BUY;

      // Quanto mais sobrevendido, maior a confiança
      confidence = 50 + Math.min(50, ((options.oversold - currentRSI) / options.oversold) * 100);
    } else if (currentRSI > options.overbought && prevRSI > currentRSI) {
      // RSI está acima do nível de sobrecompra e começando a cair
      signalType = SignalType.SELL;

      // Quanto mais sobrecomprado, maior a confiança
      confidence = 50 + Math.min(50, ((currentRSI - options.overbought) / (100 - options.overbought)) * 100);
    }

    // Criar e retornar o sinal
    return {
      type: signalType,
      symbol: options.symbol,
      price: data[data.length - 1].close,
      time: data[data.length - 1].time,
      strategy: this.name,
      confidence,
      metadata: {
        rsi: currentRSI,
        prevRsi: prevRSI,
        overbought: options.overbought,
        oversold: options.oversold
      }
    };
  }
}

// Implementação da estratégia Bollinger Bands
export class BollingerStrategy implements Strategy {
  name = 'Bollinger IA';
  description = 'Identifica volatilidade e reversões com Bandas de Bollinger aprimoradas por IA';

  analyze(data: CandleData[], options: BollingerOptions = { period: 20, multiplier: 2, symbol: 'BTC/USDT' }): Signal {
    // Verificar se temos dados suficientes
    if (data.length < options.period) {
      return {
        type: SignalType.NEUTRAL,
        symbol: options.symbol,
        price: data[data.length - 1].close,
        time: data[data.length - 1].time,
        strategy: this.name,
        confidence: 0
      };
    }

    // Extrair preços de fechamento
    const closes = data.map(candle => candle.close);

    // Calcular bandas de Bollinger
    const bands = calculateBollingerBands(closes, options.period, options.multiplier);

    // Obter os últimos valores
    const lastIndex = bands.middle.length - 1;
    const currentClose = closes[closes.length - 1];
    const prevClose = closes[closes.length - 2];
    const upperBand = bands.upper[lastIndex];
    const lowerBand = bands.lower[lastIndex];
    const middleBand = bands.middle[lastIndex];

    // Calcular a largura da banda (volatilidade)
    const bandWidth = (upperBand - lowerBand) / middleBand;

    // Calcular a porcentagem de posição dentro da banda
    // 0% = limite inferior, 50% = meio, 100% = limite superior
    const bandPosition = (currentClose - lowerBand) / (upperBand - lowerBand) * 100;

    // Determinar o tipo de sinal
    let signalType = SignalType.NEUTRAL;
    let confidence = 50; // Confiança neutra padrão

    // Lógica de geração de sinal
    if (currentClose < lowerBand && prevClose > lowerBand) {
      // Preço cruzou para baixo da banda inferior
      signalType = SignalType.BUY;

      // Quanto mais próximo/abaixo da banda inferior, maior a confiança
      confidence = 60 + Math.min(40, (1 - bandPosition / 20) * 100);
    } else if (currentClose > upperBand && prevClose < upperBand) {
      // Preço cruzou para cima da banda superior
      signalType = SignalType.SELL;

      // Quanto mais próximo/acima da banda superior, maior a confiança
      confidence = 60 + Math.min(40, ((bandPosition - 100) / 20) * 100);
    } else if (bandPosition < 5) {
      // Preço próximo/abaixo da banda inferior (potencial compra)
      signalType = SignalType.BUY;
      confidence = 50 + Math.min(30, (5 - bandPosition) * 6);
    } else if (bandPosition > 95) {
      // Preço próximo/acima da banda superior (potencial venda)
      signalType = SignalType.SELL;
      confidence = 50 + Math.min(30, (bandPosition - 95) * 6);
    }

    // Criar e retornar o sinal
    return {
      type: signalType,
      symbol: options.symbol,
      price: currentClose,
      time: data[data.length - 1].time,
      strategy: this.name,
      confidence,
      metadata: {
        upperBand,
        middleBand,
        lowerBand,
        bandWidth,
        bandPosition
      }
    };
  }
}

// Implementação da estratégia MACD
export class MACDStrategy implements Strategy {
  name = 'MACD Pro';
  description = 'Análise avançada de convergência/divergência com filtros de IA';

  analyze(data: CandleData[], options: MACDOptions = {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    symbol: 'BTC/USDT'
  }): Signal {
    // Verificar se temos dados suficientes
    if (data.length < options.slowPeriod + options.signalPeriod) {
      return {
        type: SignalType.NEUTRAL,
        symbol: options.symbol,
        price: data[data.length - 1].close,
        time: data[data.length - 1].time,
        strategy: this.name,
        confidence: 0
      };
    }

    // Extrair preços de fechamento
    const closes = data.map(candle => candle.close);

    // Calcular MACD
    const macd = calculateMACD(
      closes,
      options.fastPeriod,
      options.slowPeriod,
      options.signalPeriod
    );

    // Obter os últimos valores
    const lastIndex = macd.signal.length - 1;
    const currentMACD = macd.macd[macd.macd.length - 1];
    const prevMACD = macd.macd[macd.macd.length - 2];
    const currentSignal = macd.signal[lastIndex];
    const prevSignal = macd.signal[lastIndex - 1];
    const currentHist = macd.histogram[lastIndex];
    const prevHist = macd.histogram[lastIndex - 1];

    // Determinar o tipo de sinal
    let signalType = SignalType.NEUTRAL;
    let confidence = 50; // Confiança neutra padrão

    // Lógica de geração de sinal

    // Cruzamento da linha MACD com a linha de sinal
    if (prevMACD < prevSignal && currentMACD > currentSignal) {
      // MACD cruzou para cima da linha de sinal (sinal de compra)
      signalType = SignalType.BUY;

      // Maior a distância do cruzamento, maior a confiança
      const crossStrength = Math.abs(currentMACD - currentSignal) / Math.abs(currentMACD);
      confidence = 60 + Math.min(40, crossStrength * 100);

      // Aumentar confiança se o histograma está se fortalecendo
      if (currentHist > prevHist) {
        confidence = Math.min(100, confidence + 10);
      }
    } else if (prevMACD > prevSignal && currentMACD < currentSignal) {
      // MACD cruzou para baixo da linha de sinal (sinal de venda)
      signalType = SignalType.SELL;

      // Maior a distância do cruzamento, maior a confiança
      const crossStrength = Math.abs(currentMACD - currentSignal) / Math.abs(currentMACD);
      confidence = 60 + Math.min(40, crossStrength * 100);

      // Aumentar confiança se o histograma está se enfraquecendo
      if (currentHist < prevHist) {
        confidence = Math.min(100, confidence + 10);
      }
    }
    // Divergência no histograma (sinal mais fraco)
    else if (prevHist < 0 && currentHist > 0) {
      // Histograma cruzou de negativo para positivo
      signalType = SignalType.BUY;
      confidence = 55;
    } else if (prevHist > 0 && currentHist < 0) {
      // Histograma cruzou de positivo para negativo
      signalType = SignalType.SELL;
      confidence = 55;
    }

    // Criar e retornar o sinal
    return {
      type: signalType,
      symbol: options.symbol,
      price: data[data.length - 1].close,
      time: data[data.length - 1].time,
      strategy: this.name,
      confidence,
      metadata: {
        macd: currentMACD,
        signal: currentSignal,
        histogram: currentHist,
        prevHistogram: prevHist
      }
    };
  }
}

// Implementação da estratégia Trend Hunter
export class TrendHunterStrategy implements Strategy {
  name = 'Trend Hunter';
  description = 'Algoritmo de detecção de tendências com análise profunda de mercado';

  analyze(data: CandleData[], options: TrendHunterOptions = {
    emaPeriodShort: 20,
    emaPeriodLong: 50,
    adxPeriod: 14,
    adxThreshold: 25,
    symbol: 'BTC/USDT'
  }): Signal {
    // Verificar se temos dados suficientes
    if (data.length < Math.max(options.emaPeriodLong, options.adxPeriod + 1)) {
      return {
        type: SignalType.NEUTRAL,
        symbol: options.symbol,
        price: data[data.length - 1].close,
        time: data[data.length - 1].time,
        strategy: this.name,
        confidence: 0
      };
    }

    // Extrair preços de fechamento
    const closes = data.map(candle => candle.close);

    // Calcular EMAs
    const shortEMA = calculateEMA(closes, options.emaPeriodShort);
    const longEMA = calculateEMA(closes, options.emaPeriodLong);

    // Calcular ADX para força da tendência
    const adx = calculateADX(data, options.adxPeriod);

    // Obter os últimos valores
    const currentShortEMA = shortEMA[shortEMA.length - 1];
    const prevShortEMA = shortEMA[shortEMA.length - 2];
    const currentLongEMA = longEMA[longEMA.length - 1];
    const prevLongEMA = longEMA[longEMA.length - 2];

    const currentADX = adx.adx[adx.adx.length - 1];
    const currentPlusDI = adx.plusDI[adx.plusDI.length - 1];
    const currentMinusDI = adx.minusDI[adx.minusDI.length - 1];

    // Calcular a inclinação das EMAs
    const shortEMASlope = (currentShortEMA - prevShortEMA) / prevShortEMA * 100;
    const longEMASlope = (currentLongEMA - prevLongEMA) / prevLongEMA * 100;

    // Determinar o tipo de sinal
    let signalType = SignalType.NEUTRAL;
    let confidence = 50; // Confiança neutra padrão

    // Verificar se há uma tendência forte (ADX > threshold)
    const strongTrend = currentADX > options.adxThreshold;

    // Lógica de geração de sinal
    if (currentShortEMA > currentLongEMA &&
        (prevShortEMA <= prevLongEMA || shortEMASlope > 0.5)) {
      // EMA curta cruzou acima da EMA longa (tendência de alta)
      signalType = SignalType.BUY;

      // Base de confiança
      confidence = 60;

      // Aumentar confiança se a tendência for forte e confirmada pelo DI+
      if (strongTrend && currentPlusDI > currentMinusDI) {
        confidence += 20;
      }

      // Aumentar confiança se ambas as EMAs estiverem subindo
      if (shortEMASlope > 0 && longEMASlope > 0) {
        confidence += 15;
      }

      // Ajustar com base na inclinação da EMA curta
      confidence += Math.min(15, shortEMASlope * 10);
    } else if (currentShortEMA < currentLongEMA &&
              (prevShortEMA >= prevLongEMA || shortEMASlope < -0.5)) {
      // EMA curta cruzou abaixo da EMA longa (tendência de baixa)
      signalType = SignalType.SELL;

      // Base de confiança
      confidence = 60;

      // Aumentar confiança se a tendência for forte e confirmada pelo DI-
      if (strongTrend && currentMinusDI > currentPlusDI) {
        confidence += 20;
      }

      // Aumentar confiança se ambas as EMAs estiverem caindo
      if (shortEMASlope < 0 && longEMASlope < 0) {
        confidence += 15;
      }

      // Ajustar com base na inclinação da EMA curta
      confidence += Math.min(15, Math.abs(shortEMASlope) * 10);
    }

    // Limitar a confiança ao máximo de 100
    confidence = Math.min(100, confidence);

    // Criar e retornar o sinal
    return {
      type: signalType,
      symbol: options.symbol,
      price: data[data.length - 1].close,
      time: data[data.length - 1].time,
      strategy: this.name,
      confidence,
      metadata: {
        shortEMA: currentShortEMA,
        longEMA: currentLongEMA,
        shortEMASlope,
        longEMASlope,
        adx: currentADX,
        plusDI: currentPlusDI,
        minusDI: currentMinusDI
      }
    };
  }
}

// Funções de combinação e processamento de sinais

/**
 * Combina sinais de múltiplas estratégias em um único sinal
 * com base em pesos e outros critérios
 */
export function combineSignals(signals: Signal[], options: CombineSignalsOptions = { weightByConfidence: true }): Signal {
  if (signals.length === 0) {
    throw new Error('Nenhum sinal fornecido para combinação');
  }

  // Inicializar contadores para cada tipo de sinal
  let buyScore = 0;
  let sellScore = 0;
  let totalWeight = 0;

  // Processar cada sinal
  for (const signal of signals) {
    // Calcular o peso deste sinal
    const weight = options.weightByConfidence ? signal.confidence / 100 : 1;
    totalWeight += weight;

    // Adicionar pontuação ao tipo de sinal
    if (signal.type === SignalType.BUY) {
      buyScore += weight;
    } else if (signal.type === SignalType.SELL) {
      sellScore += weight;
    }
  }

  // Normalizar pontuações
  buyScore = totalWeight > 0 ? buyScore / totalWeight * 100 : 0;
  sellScore = totalWeight > 0 ? sellScore / totalWeight * 100 : 0;

  // Determinar o tipo de sinal combinado
  let combinedType = SignalType.NEUTRAL;
  let combinedConfidence = 50;

  if (buyScore > sellScore && buyScore > 60) {
    combinedType = SignalType.BUY;
    combinedConfidence = buyScore;
  } else if (sellScore > buyScore && sellScore > 60) {
    combinedType = SignalType.SELL;
    combinedConfidence = sellScore;
  }

  // Usar o primeiro sinal como base para o combinado (para obter símbolo, preço, etc.)
  const baseSignal = signals[0];

  return {
    type: combinedType,
    symbol: baseSignal.symbol,
    price: baseSignal.price,
    time: baseSignal.time,
    strategy: 'Combined Strategy',
    confidence: combinedConfidence,
    metadata: {
      buyScore,
      sellScore,
      signals: signals.map(s => ({
        strategy: s.strategy,
        type: s.type,
        confidence: s.confidence
      }))
    }
  };
}