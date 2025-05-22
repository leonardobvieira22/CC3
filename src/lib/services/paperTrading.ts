import type { BinanceService } from './binance';
import { type Signal, SignalType } from './strategies';

// Tipos para paper trading
export interface PaperTradingConfig {
  initialCapital: number;
  feePercentage: number;
  defaultLeverageSpot: number; // Normalmente 1x para spot
  defaultLeverageMargin: number; // Para margem, por exemplo 5x
  enableMarginTrading: boolean;
  defaultOrderSize: number; // Porcentagem do capital por ordem (ex: 10 = 10%)
  stopLoss?: number; // Percentual (ex: 5 = 5%)
  takeProfit?: number; // Percentual (ex: 15 = 15%)
}

export interface PaperPosition {
  id: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryTime: number;
  updateTime: number;
  pnl: number;
  pnlPercentage: number;
  status: 'OPEN' | 'CLOSED';
  exitPrice?: number;
  exitTime?: number;
  strategy?: string;
  stopLoss?: number;
  takeProfit?: number;
  margin?: number; // Montante bloqueado como margem
  fees: number;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'TAKE_PROFIT';
  price?: number; // Para ordens limit
  stopPrice?: number; // Para ordens stop
  quantity: number;
  status: 'NEW' | 'FILLED' | 'CANCELED' | 'REJECTED';
  createTime: number;
  updateTime: number;
  positionId?: string;
  isClosePosition: boolean;
}

export interface PaperWallet {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number; // Em ordens abertas ou margem
  positions: PaperPosition[];
  orders: PaperOrder[];
  pnl: number;
  totalFees: number;
  transactionHistory: PaperTransaction[];
}

export interface PaperTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'FEE' | 'TRADE' | 'FUNDING';
  amount: number;
  symbol: string;
  timestamp: number;
  description: string;
  relatedOrderId?: string;
  relatedPositionId?: string;
}

// Chaves para persistência local
const PAPER_WALLET_KEY = 'ai_crypto_paper_wallet';
const PAPER_CONFIG_KEY = 'ai_crypto_paper_config';

export class PaperTradingService {
  private binanceService: BinanceService;
  private wallet: PaperWallet;
  private config: PaperTradingConfig;
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private positionCheckerInterval: NodeJS.Timeout | null = null;

  constructor(binanceService: BinanceService) {
    this.binanceService = binanceService;

    // Carregar configuração
    const savedConfig = this.loadConfig();
    this.config = savedConfig || this.getDefaultConfig();

    // Carregar carteira ou criar uma nova
    const savedWallet = this.loadWallet();
    this.wallet = savedWallet || this.createNewWallet(this.config.initialCapital);

    // Iniciar atualizações de preço
    this.startPriceUpdates();

    // Iniciar verificações de posições
    this.startPositionChecker();
  }

  // Configuração padrão
  private getDefaultConfig(): PaperTradingConfig {
    return {
      initialCapital: 10000,
      feePercentage: 0.1,
      defaultLeverageSpot: 1,
      defaultLeverageMargin: 5,
      enableMarginTrading: false,
      defaultOrderSize: 10,
      stopLoss: 5,
      takeProfit: 15
    };
  }

  // Criar uma nova carteira
  private createNewWallet(initialCapital: number): PaperWallet {
    return {
      totalBalance: initialCapital,
      availableBalance: initialCapital,
      lockedBalance: 0,
      positions: [],
      orders: [],
      pnl: 0,
      totalFees: 0,
      transactionHistory: [
        {
          id: this.generateId(),
          type: 'DEPOSIT',
          amount: initialCapital,
          symbol: 'USDT',
          timestamp: Date.now(),
          description: 'Depósito inicial de capital'
        }
      ]
    };
  }

  // Carregar carteira do storage
  private loadWallet(): PaperWallet | null {
    if (typeof window === 'undefined') return null;

    const savedWallet = localStorage.getItem(PAPER_WALLET_KEY);
    if (savedWallet) {
      try {
        return JSON.parse(savedWallet);
      } catch (error) {
        console.error('Erro ao carregar carteira de paper trading:', error);
      }
    }
    return null;
  }

  // Salvar carteira no storage
  private saveWallet(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(PAPER_WALLET_KEY, JSON.stringify(this.wallet));
    } catch (error) {
      console.error('Erro ao salvar carteira de paper trading:', error);
    }
  }

  // Carregar configuração do storage
  private loadConfig(): PaperTradingConfig | null {
    if (typeof window === 'undefined') return null;

    const savedConfig = localStorage.getItem(PAPER_CONFIG_KEY);
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (error) {
        console.error('Erro ao carregar configuração de paper trading:', error);
      }
    }
    return null;
  }

  // Salvar configuração no storage
  private saveConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(PAPER_CONFIG_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Erro ao salvar configuração de paper trading:', error);
    }
  }

  // Iniciar atualizações de preço para posições abertas
  private startPriceUpdates(): void {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
    }

    this.priceUpdateInterval = setInterval(async () => {
      if (this.wallet.positions.length === 0) return;

      // Criar um mapa para reduzir chamadas à API
      const symbolsToUpdate = new Set<string>();
      for (const position of this.wallet.positions) {
        if (position.status === 'OPEN') {
          symbolsToUpdate.add(position.symbol);
        }
      }

      // Buscar preços atuais
      for (const symbol of symbolsToUpdate) {
        try {
          const ticker = await this.binanceService.getTickerPrice(symbol);
          const currentPrice = Number.parseFloat(ticker.price);

          // Atualizar posições com este símbolo
          let updated = false;
          this.wallet.positions = this.wallet.positions.map(position => {
            if (position.status === 'OPEN' && position.symbol === symbol) {
              updated = true;

              // Calcular PnL
              let pnl = 0;
              let pnlPercentage = 0;

              if (position.side === 'LONG') {
                pnl = (currentPrice - position.entryPrice) * position.quantity * position.leverage;
                pnlPercentage = ((currentPrice - position.entryPrice) / position.entryPrice) * 100 * position.leverage;
              } else {
                pnl = (position.entryPrice - currentPrice) * position.quantity * position.leverage;
                pnlPercentage = ((position.entryPrice - currentPrice) / position.entryPrice) * 100 * position.leverage;
              }

              return {
                ...position,
                currentPrice,
                pnl,
                pnlPercentage,
                updateTime: Date.now()
              };
            }
            return position;
          });

          if (updated) {
            this.saveWallet();
          }
        } catch (error) {
          console.error(`Erro ao atualizar preço para ${symbol}:`, error);
        }
      }
    }, 15000); // Atualizar a cada 15 segundos
  }

  // Verificar se posições atingiram stop loss ou take profit
  private startPositionChecker(): void {
    if (this.positionCheckerInterval) {
      clearInterval(this.positionCheckerInterval);
    }

    this.positionCheckerInterval = setInterval(() => {
      const positionsToClose: PaperPosition[] = [];

      // Verificar cada posição aberta
      for (const position of this.wallet.positions) {
        if (position.status === 'OPEN') {
          // Verificar stop loss
          if (position.stopLoss && position.pnlPercentage <= -position.stopLoss) {
            positionsToClose.push(position);
          }
          // Verificar take profit
          else if (position.takeProfit && position.pnlPercentage >= position.takeProfit) {
            positionsToClose.push(position);
          }
        }
      }

      // Fechar posições que atingiram stop loss ou take profit
      for (const position of positionsToClose) {
        this.closePosition(position.id, position.currentPrice,
          position.pnlPercentage <= -position.stopLoss! ? 'STOP_LOSS' : 'TAKE_PROFIT');
      }
    }, 5000); // Verificar a cada 5 segundos
  }

  // Limpar intervalos ao destruir a instância
  public cleanup(): void {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }

    if (this.positionCheckerInterval) {
      clearInterval(this.positionCheckerInterval);
      this.positionCheckerInterval = null;
    }
  }

  // Gerar ID único
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  // Obter carteira atual
  public getWallet(): PaperWallet {
    return this.wallet;
  }

  // Obter configuração atual
  public getConfig(): PaperTradingConfig {
    return this.config;
  }

  // Atualizar configuração
  public updateConfig(newConfig: Partial<PaperTradingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  // Resetar carteira
  public resetWallet(): void {
    this.wallet = this.createNewWallet(this.config.initialCapital);
    this.saveWallet();
  }

  // Depositar fundos
  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('O montante de depósito deve ser maior que zero');
    }

    this.wallet.totalBalance += amount;
    this.wallet.availableBalance += amount;

    // Registrar transação
    this.wallet.transactionHistory.push({
      id: this.generateId(),
      type: 'DEPOSIT',
      amount,
      symbol: 'USDT',
      timestamp: Date.now(),
      description: 'Depósito de fundos'
    });

    this.saveWallet();
  }

  // Retirar fundos
  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('O montante de retirada deve ser maior que zero');
    }

    if (amount > this.wallet.availableBalance) {
      throw new Error('Saldo insuficiente para retirada');
    }

    this.wallet.totalBalance -= amount;
    this.wallet.availableBalance -= amount;

    // Registrar transação
    this.wallet.transactionHistory.push({
      id: this.generateId(),
      type: 'WITHDRAWAL',
      amount: -amount,
      symbol: 'USDT',
      timestamp: Date.now(),
      description: 'Retirada de fundos'
    });

    this.saveWallet();
  }

  // Criar uma ordem de mercado
  public async createMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity?: number,
    percentOfBalance?: number,
    leverage = 1,
    stopLoss?: number,
    takeProfit?: number,
    strategy?: string
  ): Promise<PaperOrder> {
    try {
      // Obter preço atual
      const ticker = await this.binanceService.getTickerPrice(symbol);
      const currentPrice = Number.parseFloat(ticker.price);

      // Calcular quantidade se percentOfBalance for fornecido
      let orderQuantity = quantity || 0;
      if (percentOfBalance && !quantity) {
        const amountToSpend = (this.wallet.availableBalance * percentOfBalance) / 100;
        orderQuantity = amountToSpend / currentPrice;
      }

      // Validar quantidade
      if (orderQuantity <= 0) {
        throw new Error('Quantidade da ordem inválida');
      }

      // Verificar saldo disponível para ordens de compra
      const orderValue = orderQuantity * currentPrice;

      if (side === 'BUY') {
        const requiredBalance = this.config.enableMarginTrading && leverage > 1
          ? orderValue / leverage
          : orderValue;

        if (requiredBalance > this.wallet.availableBalance) {
          throw new Error('Saldo insuficiente para esta ordem');
        }
      } else {
        // Para venda, verificar se temos a posição (no caso de trading spot)
        if (!this.config.enableMarginTrading) {
          const position = this.wallet.positions.find(p =>
            p.status === 'OPEN' && p.symbol === symbol && p.side === 'LONG');

          if (!position || position.quantity < orderQuantity) {
            throw new Error('Quantidade insuficiente para venda');
          }
        }
      }

      // Criar ordem
      const orderId = this.generateId();
      const newOrder: PaperOrder = {
        id: orderId,
        symbol,
        side,
        type: 'MARKET',
        quantity: orderQuantity,
        status: 'NEW',
        createTime: Date.now(),
        updateTime: Date.now(),
        isClosePosition: false
      };

      // Calcular taxas
      const fees = orderValue * (this.config.feePercentage / 100);

      // Processar ordem imediatamente (é uma ordem de mercado)
      if (side === 'BUY') {
        // Bloquear saldo
        const marginRequired = this.config.enableMarginTrading && leverage > 1
          ? orderValue / leverage
          : orderValue;

        this.wallet.availableBalance -= marginRequired + fees;
        this.wallet.lockedBalance += marginRequired;

        // Adicionar posição
        const positionId = this.generateId();
        const newPosition: PaperPosition = {
          id: positionId,
          symbol,
          entryPrice: currentPrice,
          currentPrice,
          quantity: orderQuantity,
          side: 'LONG',
          leverage,
          entryTime: Date.now(),
          updateTime: Date.now(),
          pnl: 0,
          pnlPercentage: 0,
          status: 'OPEN',
          stopLoss,
          takeProfit,
          strategy,
          fees,
          margin: marginRequired
        };

        // Atualizar ordem
        newOrder.status = 'FILLED';
        newOrder.updateTime = Date.now();
        newOrder.positionId = positionId;

        // Adicionar à carteira
        this.wallet.positions.push(newPosition);

        // Registrar transação
        this.wallet.transactionHistory.push({
          id: this.generateId(),
          type: 'TRADE',
          amount: -orderValue,
          symbol,
          timestamp: Date.now(),
          description: `Compra a mercado de ${orderQuantity} ${symbol} a ${currentPrice} USDT`,
          relatedOrderId: orderId,
          relatedPositionId: positionId
        });

        // Registrar taxa
        this.wallet.transactionHistory.push({
          id: this.generateId(),
          type: 'FEE',
          amount: -fees,
          symbol: 'USDT',
          timestamp: Date.now(),
          description: `Taxa de transação para ordem ${orderId}`,
          relatedOrderId: orderId
        });

        this.wallet.totalFees += fees;
      } else {
        // Para vendas, fechar posição existente ou criar uma posição curta
        if (this.config.enableMarginTrading && leverage > 1) {
          // Trading de margem - Criar posição curta
          const marginRequired = orderValue / leverage;

          this.wallet.availableBalance -= marginRequired + fees;
          this.wallet.lockedBalance += marginRequired;

          // Adicionar posição
          const positionId = this.generateId();
          const newPosition: PaperPosition = {
            id: positionId,
            symbol,
            entryPrice: currentPrice,
            currentPrice,
            quantity: orderQuantity,
            side: 'SHORT',
            leverage,
            entryTime: Date.now(),
            updateTime: Date.now(),
            pnl: 0,
            pnlPercentage: 0,
            status: 'OPEN',
            stopLoss,
            takeProfit,
            strategy,
            fees,
            margin: marginRequired
          };

          // Atualizar ordem
          newOrder.status = 'FILLED';
          newOrder.updateTime = Date.now();
          newOrder.positionId = positionId;

          // Adicionar à carteira
          this.wallet.positions.push(newPosition);

          // Registrar transação
          this.wallet.transactionHistory.push({
            id: this.generateId(),
            type: 'TRADE',
            amount: orderValue,
            symbol,
            timestamp: Date.now(),
            description: `Venda a mercado de ${orderQuantity} ${symbol} a ${currentPrice} USDT (posição curta)`,
            relatedOrderId: orderId,
            relatedPositionId: positionId
          });
        } else {
          // Trading spot - Fechar posição longa existente
          const position = this.wallet.positions.find(p =>
            p.status === 'OPEN' && p.symbol === symbol && p.side === 'LONG');

          if (!position) {
            throw new Error('Nenhuma posição aberta para vender');
          }

          // Fechar posição (parcial ou total)
          const quantityToClose = Math.min(position.quantity, orderQuantity);
          const valueToClose = quantityToClose * currentPrice;

          // Calcular lucro/perda
          const entryValue = quantityToClose * position.entryPrice;
          const pnl = valueToClose - entryValue;
          const pnlPercentage = (pnl / entryValue) * 100;

          // Atualizar carteira
          this.wallet.availableBalance += valueToClose - fees;
          this.wallet.lockedBalance -= entryValue;
          this.wallet.pnl += pnl;

          // Atualizar posição
          if (quantityToClose === position.quantity) {
            // Fechar posição completamente
            position.status = 'CLOSED';
            position.exitPrice = currentPrice;
            position.exitTime = Date.now();
            position.pnl = pnl;
            position.pnlPercentage = pnlPercentage;
            position.updateTime = Date.now();
          } else {
            // Fechar posição parcialmente
            position.quantity -= quantityToClose;
            position.updateTime = Date.now();

            // Criar nova posição fechada para o registro
            const closedPositionId = this.generateId();
            const closedPosition: PaperPosition = {
              ...position,
              id: closedPositionId,
              quantity: quantityToClose,
              exitPrice: currentPrice,
              exitTime: Date.now(),
              pnl,
              pnlPercentage,
              status: 'CLOSED',
              fees: fees
            };

            this.wallet.positions.push(closedPosition);
            newOrder.positionId = closedPositionId;
          }

          // Atualizar ordem
          newOrder.status = 'FILLED';
          newOrder.updateTime = Date.now();
          newOrder.isClosePosition = true;
          if (!newOrder.positionId) {
            newOrder.positionId = position.id;
          }

          // Registrar transação
          this.wallet.transactionHistory.push({
            id: this.generateId(),
            type: 'TRADE',
            amount: valueToClose,
            symbol,
            timestamp: Date.now(),
            description: `Venda a mercado de ${quantityToClose} ${symbol} a ${currentPrice} USDT`,
            relatedOrderId: orderId,
            relatedPositionId: position.id
          });
        }

        // Registrar taxa
        this.wallet.transactionHistory.push({
          id: this.generateId(),
          type: 'FEE',
          amount: -fees,
          symbol: 'USDT',
          timestamp: Date.now(),
          description: `Taxa de transação para ordem ${orderId}`,
          relatedOrderId: orderId
        });

        this.wallet.totalFees += fees;
      }

      // Adicionar ordem à carteira
      this.wallet.orders.push(newOrder);

      // Recalcular saldo total
      this.updateTotalBalance();

      // Salvar carteira
      this.saveWallet();

      return newOrder;
    } catch (error) {
      console.error('Erro ao criar ordem de mercado:', error);
      throw error;
    }
  }

  // Processa um sinal de trading
  public async processSignal(signal: Signal): Promise<PaperOrder | null> {
    try {
      // Verificar se temos saldo disponível
      if (this.wallet.availableBalance <= 0) {
        console.warn('Saldo insuficiente para processar sinal');
        return null;
      }

      // Só processar sinais com confiança acima de 70%
      if (signal.confidence < 70) {
        console.log(`Sinal ignorado (confiança ${signal.confidence}%)`);
        return null;
      }

      // Determinar direção da ordem
      const side = signal.type === SignalType.BUY ? 'BUY' : 'SELL';

      // Verificar se já temos uma posição aberta neste símbolo
      const existingPosition = this.wallet.positions.find(p =>
        p.status === 'OPEN' && p.symbol === signal.symbol);

      // Para sinais de compra, não abrir nova posição se já temos uma
      if (side === 'BUY' && existingPosition && existingPosition.side === 'LONG') {
        console.log(`Já existe uma posição longa aberta em ${signal.symbol}`);
        return null;
      }

      // Para sinais de venda, fechar posição longa ou abrir curta
      if (side === 'SELL') {
        if (existingPosition && existingPosition.side === 'LONG') {
          // Fechar posição longa existente
          return this.closePosition(existingPosition.id, signal.price, 'SIGNAL');
        } else if (!this.config.enableMarginTrading) {
          // Se não temos posição e não estamos fazendo margin trading, ignorar venda
          console.log(`Nenhuma posição aberta em ${signal.symbol} para vender`);
          return null;
        }
      }

      // Criar ordem de mercado
      return this.createMarketOrder(
        signal.symbol,
        side,
        undefined, // quantidade
        this.config.defaultOrderSize, // porcentagem do saldo
        side === 'BUY' ? this.config.defaultLeverageSpot : this.config.defaultLeverageMargin,
        this.config.stopLoss,
        this.config.takeProfit,
        signal.strategy
      );
    } catch (error) {
      console.error('Erro ao processar sinal de trading:', error);
      return null;
    }
  }

  // Fechar uma posição
  public async closePosition(
    positionId: string,
    price?: number,
    reason: 'SIGNAL' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'MANUAL' = 'MANUAL'
  ): Promise<PaperOrder | null> {
    try {
      // Encontrar a posição
      const position = this.wallet.positions.find(p =>
        p.id === positionId && p.status === 'OPEN');

      if (!position) {
        throw new Error('Posição não encontrada ou já fechada');
      }

      // Obter preço atual se não for fornecido
      let exitPrice = price;
      if (!exitPrice) {
        const ticker = await this.binanceService.getTickerPrice(position.symbol);
        exitPrice = Number.parseFloat(ticker.price);
      }

      // Criar ordem de fechamento
      const orderId = this.generateId();
      const closeOrder: PaperOrder = {
        id: orderId,
        symbol: position.symbol,
        side: position.side === 'LONG' ? 'SELL' : 'BUY',
        type: 'MARKET',
        quantity: position.quantity,
        status: 'NEW',
        createTime: Date.now(),
        updateTime: Date.now(),
        positionId: position.id,
        isClosePosition: true
      };

      // Calcular valor da posição
      const positionValue = position.quantity * exitPrice;

      // Calcular taxas
      const fees = positionValue * (this.config.feePercentage / 100);

      // Calcular lucro/perda
      let pnl = 0;
      let pnlPercentage = 0;

      if (position.side === 'LONG') {
        pnl = (exitPrice - position.entryPrice) * position.quantity * position.leverage;
        pnlPercentage = ((exitPrice - position.entryPrice) / position.entryPrice) * 100 * position.leverage;
      } else {
        pnl = (position.entryPrice - exitPrice) * position.quantity * position.leverage;
        pnlPercentage = ((position.entryPrice - exitPrice) / position.entryPrice) * 100 * position.leverage;
      }

      // Liberar margem bloqueada e adicionar lucro/perda
      if (position.margin) {
        this.wallet.lockedBalance -= position.margin;
        this.wallet.availableBalance += position.margin + pnl - fees;
      } else {
        // Trading spot, o valor já está bloqueado na entrada
        this.wallet.availableBalance += positionValue - fees;
      }

      // Atualizar PnL total
      this.wallet.pnl += pnl;

      // Atualizar posição
      position.status = 'CLOSED';
      position.exitPrice = exitPrice;
      position.exitTime = Date.now();
      position.pnl = pnl;
      position.pnlPercentage = pnlPercentage;
      position.updateTime = Date.now();
      position.fees += fees;

      // Atualizar ordem
      closeOrder.status = 'FILLED';
      closeOrder.updateTime = Date.now();

      // Adicionar à carteira
      this.wallet.orders.push(closeOrder);

      // Registrar transação
      const description = `${position.side === 'LONG' ? 'Venda' : 'Compra'} a mercado de ${position.quantity} ${position.symbol} a ${exitPrice} USDT (fechamento de posição - ${reason})`;

      this.wallet.transactionHistory.push({
        id: this.generateId(),
        type: 'TRADE',
        amount: position.side === 'LONG' ? positionValue : -positionValue,
        symbol: position.symbol,
        timestamp: Date.now(),
        description,
        relatedOrderId: orderId,
        relatedPositionId: position.id
      });

      // Registrar taxa
      this.wallet.transactionHistory.push({
        id: this.generateId(),
        type: 'FEE',
        amount: -fees,
        symbol: 'USDT',
        timestamp: Date.now(),
        description: `Taxa de transação para ordem ${orderId}`,
        relatedOrderId: orderId
      });

      this.wallet.totalFees += fees;

      // Recalcular saldo total
      this.updateTotalBalance();

      // Salvar carteira
      this.saveWallet();

      return closeOrder;
    } catch (error) {
      console.error('Erro ao fechar posição:', error);
      return null;
    }
  }

  // Fechar todas as posições
  public async closeAllPositions(): Promise<void> {
    const openPositions = this.wallet.positions.filter(p => p.status === 'OPEN');

    for (const position of openPositions) {
      await this.closePosition(position.id, undefined, 'MANUAL');
    }
  }

  // Atualizar saldo total
  private updateTotalBalance(): void {
    // Somar saldo disponível e bloqueado
    this.wallet.totalBalance = this.wallet.availableBalance + this.wallet.lockedBalance;

    // Adicionar valor de mercado das posições abertas
    this.wallet.positions.forEach(position => {
      if (position.status === 'OPEN') {
        if (position.side === 'LONG') {
          // Para posições longas, adicionar valor de mercado
          const marketValue = position.quantity * position.currentPrice;
          this.wallet.totalBalance += marketValue - position.margin!;
        } else {
          // Para posições curtas, o cálculo é mais complexo
          // O lucro/perda já está refletido no PnL
          const marketValue = position.margin! + position.pnl;
          if (marketValue > 0) {
            this.wallet.totalBalance += marketValue - position.margin!;
          }
        }
      }
    });
  }
}
