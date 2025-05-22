// Tipos para os dados de entrada
export type CandleData = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

/**
 * Calcula a Média Móvel Simples (SMA)
 * @param data Array de preços de fechamento
 * @param period Período para cálculo da média
 * @returns Array com as médias móveis
 */
export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = [];

  // Precisamos de pelo menos 'period' pontos para começar a calcular
  if (data.length < period) {
    return result;
  }

  // Primeira média
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  result.push(sum / period);

  // Médias subsequentes
  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period] + data[i];
    result.push(sum / period);
  }

  return result;
}

/**
 * Calcula a Média Móvel Exponencial (EMA)
 * @param data Array de preços de fechamento
 * @param period Período para cálculo da média
 * @returns Array com as médias móveis exponenciais
 */
export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const k = 2 / (period + 1);

  // Precisamos de pelo menos 'period' pontos para começar a calcular
  if (data.length < period) {
    return result;
  }

  // A primeira EMA é igual à SMA
  let ema = data.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
  result.push(ema);

  // Cálculo das EMAs subsequentes
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    result.push(ema);
  }

  return result;
}

/**
 * Calcula o Índice de Força Relativa (RSI)
 * @param data Array de preços de fechamento
 * @param period Período para cálculo do RSI (normalmente 14)
 * @returns Array com os valores de RSI
 */
export function calculateRSI(data: number[], period = 14): number[] {
  const result: number[] = [];
  const changes: number[] = [];

  // Calculando as mudanças de preço
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1]);
  }

  // Precisamos de pelo menos 'period + 1' pontos para começar a calcular
  if (changes.length < period) {
    return result;
  }

  let gains = 0;
  let losses = 0;

  // Calculando ganhos e perdas iniciais
  for (let i = 0; i < period; i++) {
    if (changes[i] >= 0) {
      gains += changes[i];
    } else {
      losses -= changes[i];
    }
  }

  // Ganhos e perdas médios iniciais
  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculando o primeiro RSI
  if (avgLoss === 0) {
    result.push(100);
  } else {
    const rs = avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }

  // Calculando os RSIs subsequentes
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];

    if (change >= 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) - change) / period;
    }

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(100 - (100 / (1 + rs)));
    }
  }

  return result;
}

/**
 * Calcula as Bandas de Bollinger
 * @param data Array de preços de fechamento
 * @param period Período para a média móvel (normalmente 20)
 * @param multiplier Multiplicador para o desvio padrão (normalmente 2)
 * @returns Objeto com arrays para média, banda superior e banda inferior
 */
export function calculateBollingerBands(
  data: number[],
  period = 20,
  multiplier = 2
): { middle: number[]; upper: number[]; lower: number[] } {
  const result = {
    middle: [] as number[],
    upper: [] as number[],
    lower: [] as number[]
  };

  // Precisamos de pelo menos 'period' pontos para começar a calcular
  if (data.length < period) {
    return result;
  }

  // Calculando a média móvel simples
  const sma = calculateSMA(data, period);

  // Calculando as bandas para cada ponto
  for (let i = 0; i < sma.length; i++) {
    const sliceStart = i;
    const sliceEnd = i + period;
    const slice = data.slice(sliceStart, sliceEnd);

    // Calculando o desvio padrão
    const avg = sma[i];
    const squaredDiffs = slice.map(value => Math.pow(value - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, value) => sum + value, 0) / period;
    const stdDev = Math.sqrt(avgSquaredDiff);

    // Aplicando o multiplicador ao desvio padrão
    const bandWidth = multiplier * stdDev;

    result.middle.push(avg);
    result.upper.push(avg + bandWidth);
    result.lower.push(avg - bandWidth);
  }

  return result;
}

/**
 * Calcula o MACD (Moving Average Convergence Divergence)
 * @param data Array de preços de fechamento
 * @param fastPeriod Período para a EMA rápida (normalmente 12)
 * @param slowPeriod Período para a EMA lenta (normalmente 26)
 * @param signalPeriod Período para a linha de sinal (normalmente 9)
 * @returns Objeto com arrays para MACD, linha de sinal e histograma
 */
export function calculateMACD(
  data: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const result = {
    macd: [] as number[],
    signal: [] as number[],
    histogram: [] as number[]
  };

  // Precisamos de pelo menos 'slowPeriod' pontos para começar a calcular
  if (data.length < slowPeriod) {
    return result;
  }

  // Calculando as EMAs
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Alinhando os arrays
  const offset = slowEMA.length - fastEMA.length;

  // Calculando a linha MACD
  const macdLine: number[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    if (i >= offset) {
      macdLine.push(fastEMA[i - offset] - slowEMA[i]);
    }
  }

  // Calculando a linha de sinal (EMA do MACD)
  const signalLine = calculateEMA(macdLine, signalPeriod);

  // Calculando o histograma
  const histogram: number[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    const macdIndex = i + (macdLine.length - signalLine.length);
    histogram.push(macdLine[macdIndex] - signalLine[i]);
  }

  result.macd = macdLine;
  result.signal = signalLine;
  result.histogram = histogram;

  return result;
}

/**
 * Calcula o ADX (Average Directional Index)
 * @param data Array de dados OHLC
 * @param period Período para o cálculo (normalmente 14)
 * @returns Objeto com arrays para ADX, +DI e -DI
 */
export function calculateADX(
  data: CandleData[],
  period = 14
): { adx: number[]; plusDI: number[]; minusDI: number[] } {
  const result = {
    adx: [] as number[],
    plusDI: [] as number[],
    minusDI: [] as number[]
  };

  if (data.length < period + 1) {
    return result;
  }

  // Calculando True Range e Directional Movement
  const trueRanges: number[] = [];
  const plusDMs: number[] = [];
  const minusDMs: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevHigh = data[i - 1].high;
    const prevLow = data[i - 1].low;
    const prevClose = data[i - 1].close;

    // True Range
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    const tr = Math.max(tr1, tr2, tr3);
    trueRanges.push(tr);

    // Directional Movement
    const upMove = high - prevHigh;
    const downMove = prevLow - low;

    let plusDM = 0;
    let minusDM = 0;

    if (upMove > downMove && upMove > 0) {
      plusDM = upMove;
    }

    if (downMove > upMove && downMove > 0) {
      minusDM = downMove;
    }

    plusDMs.push(plusDM);
    minusDMs.push(minusDM);
  }

  // Smoothed TR and DMs
  let smoothedTR = trueRanges.slice(0, period).reduce((sum, value) => sum + value, 0);
  let smoothedPlusDM = plusDMs.slice(0, period).reduce((sum, value) => sum + value, 0);
  let smoothedMinusDM = minusDMs.slice(0, period).reduce((sum, value) => sum + value, 0);

  // Initial +DI and -DI
  let plusDI = 100 * (smoothedPlusDM / smoothedTR);
  let minusDI = 100 * (smoothedMinusDM / smoothedTR);

  result.plusDI.push(plusDI);
  result.minusDI.push(minusDI);

  // Initial DX
  let dx = 100 * (Math.abs(plusDI - minusDI) / (plusDI + minusDI));

  // Continue calculation for the rest of the data
  for (let i = period; i < trueRanges.length; i++) {
    // Update smoothed values
    smoothedTR = smoothedTR - (smoothedTR / period) + trueRanges[i];
    smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDMs[i];
    smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDMs[i];

    // Update +DI and -DI
    plusDI = 100 * (smoothedPlusDM / smoothedTR);
    minusDI = 100 * (smoothedMinusDM / smoothedTR);

    result.plusDI.push(plusDI);
    result.minusDI.push(minusDI);

    // Update DX
    dx = 100 * (Math.abs(plusDI - minusDI) / (plusDI + minusDI));
  }

  // Calculate ADX (EMA of DX)
  let adx = dx; // First ADX value is the first DX
  result.adx.push(adx);

  // Calculate ADX for the rest of the data
  for (let i = 1; i < result.plusDI.length; i++) {
    adx = ((period - 1) * adx + dx) / period;
    result.adx.push(adx);
  }

  return result;
}

/**
 * Calcula o Estocástico
 * @param data Array de dados OHLC
 * @param kPeriod Período para %K (normalmente 14)
 * @param dPeriod Período para %D (normalmente 3)
 * @returns Objeto com arrays para %K e %D
 */
export function calculateStochastic(
  data: CandleData[],
  kPeriod = 14,
  dPeriod = 3
): { k: number[]; d: number[] } {
  const result = {
    k: [] as number[],
    d: [] as number[]
  };

  if (data.length < kPeriod) {
    return result;
  }

  // Calcular %K
  for (let i = kPeriod - 1; i < data.length; i++) {
    const currentClose = data[i].close;

    // Encontrar o maior e o menor no período
    let highestHigh = Number.NEGATIVE_INFINITY;
    let lowestLow = Number.POSITIVE_INFINITY;

    for (let j = i - (kPeriod - 1); j <= i; j++) {
      highestHigh = Math.max(highestHigh, data[j].high);
      lowestLow = Math.min(lowestLow, data[j].low);
    }

    // Calcular %K
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    result.k.push(k);
  }

  // Calcular %D (média móvel simples de %K)
  result.d = calculateSMA(result.k, dPeriod);

  return result;
}

/**
 * Detecta cruzamentos entre duas linhas (por exemplo, EMA rápida e lenta)
 * @param lineA Primeira linha (por exemplo, EMA rápida)
 * @param lineB Segunda linha (por exemplo, EMA lenta)
 * @returns Array de objetos indicando posições e tipos de cruzamento
 */
export function detectCrossovers(lineA: number[], lineB: number[]): { position: number; type: 'bullish' | 'bearish' }[] {
  const crossovers = [];

  // Precisamos de pelo menos 2 pontos para detectar um cruzamento
  if (lineA.length < 2 || lineB.length < 2) {
    return crossovers;
  }

  // Vamos supor que os arrays têm o mesmo tamanho
  const length = Math.min(lineA.length, lineB.length);

  for (let i = 1; i < length; i++) {
    // Cruzamento de baixo para cima (bullish)
    if (lineA[i - 1] <= lineB[i - 1] && lineA[i] > lineB[i]) {
      crossovers.push({ position: i, type: 'bullish' });
    }
    // Cruzamento de cima para baixo (bearish)
    else if (lineA[i - 1] >= lineB[i - 1] && lineA[i] < lineB[i]) {
      crossovers.push({ position: i, type: 'bearish' });
    }
  }

  return crossovers;
}

/**
 * Detecta formações de velas (como Doji, Martelo, etc.)
 * @param data Array de dados OHLC
 * @returns Array com os padrões detectados
 */
export function detectCandlePatterns(data: CandleData[]): { position: number; pattern: string }[] {
  const patterns = [];

  for (let i = 0; i < data.length; i++) {
    const candle = data[i];
    const bodySize = Math.abs(candle.open - candle.close);
    const totalSize = candle.high - candle.low;
    const upperWick = candle.close > candle.open
      ? candle.high - candle.close
      : candle.high - candle.open;
    const lowerWick = candle.close > candle.open
      ? candle.open - candle.low
      : candle.close - candle.low;

    // Doji (corpo muito pequeno)
    if (bodySize / totalSize < 0.1) {
      patterns.push({ position: i, pattern: 'doji' });
    }
    // Martelo (corpo pequeno no topo, pavio inferior longo)
    else if (
      bodySize / totalSize < 0.3 &&
      lowerWick > 2 * bodySize &&
      upperWick < 0.1 * totalSize
    ) {
      patterns.push({ position: i, pattern: 'hammer' });
    }
    // Estrela cadente (corpo pequeno na base, pavio superior longo)
    else if (
      bodySize / totalSize < 0.3 &&
      upperWick > 2 * bodySize &&
      lowerWick < 0.1 * totalSize
    ) {
      patterns.push({ position: i, pattern: 'shooting_star' });
    }
    // Engolfo de alta (quando uma vela de alta 'engole' uma vela de baixa anterior)
    else if (
      i > 0 &&
      candle.close > candle.open && // vela atual é de alta
      data[i - 1].close < data[i - 1].open && // vela anterior é de baixa
      candle.open < data[i - 1].close && // abertura atual abaixo do fechamento anterior
      candle.close > data[i - 1].open // fechamento atual acima da abertura anterior
    ) {
      patterns.push({ position: i, pattern: 'bullish_engulfing' });
    }
    // Engolfo de baixa (quando uma vela de baixa 'engole' uma vela de alta anterior)
    else if (
      i > 0 &&
      candle.close < candle.open && // vela atual é de baixa
      data[i - 1].close > data[i - 1].open && // vela anterior é de alta
      candle.open > data[i - 1].close && // abertura atual acima do fechamento anterior
      candle.close < data[i - 1].open // fechamento atual abaixo da abertura anterior
    ) {
      patterns.push({ position: i, pattern: 'bearish_engulfing' });
    }
  }

  return patterns;
}
