// Tipos para os dados de mercado
export type KlineData = {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignored: string;
};

export type OrderBook = {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][]; // [price, quantity]
};

export type Trade = {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
};

export type AccountInfo = {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: AccountBalance[];
  permissions: string[];
};

export type AccountBalance = {
  asset: string;
  free: string;
  locked: string;
};

export type Order = {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
};

// Classe para integração com a API da Binance
export class BinanceService {
  private baseUrl = 'https://api.binance.com';
  private apiKey = '';
  private apiSecret = '';

  constructor() {
    // Inicializar com credenciais padrão se disponíveis
    const defaultApiKey = process.env.NEXT_PUBLIC_BINANCE_API_KEY || '';
    const defaultApiSecret = process.env.BINANCE_API_SECRET || '';

    this.setCredentials(defaultApiKey, defaultApiSecret);
  }

  // Definir credenciais de API
  setCredentials(apiKey: string, apiSecret: string): void {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  // Verificar se as credenciais estão definidas
  hasCredentials(): boolean {
    return this.apiKey !== '' && this.apiSecret !== '';
  }

  // Gerar assinatura HMAC SHA256 para autenticação
  async generateSignature(queryString: string): Promise<string> {
    if (typeof window !== 'undefined') {
      // Ambiente browser
      const encoder = new TextEncoder();
      const key = encoder.encode(this.apiSecret);
      const data = encoder.encode(queryString);
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      // Ambiente Node.js
      throw new Error('Node.js crypto implementation required');
    }
  }

  // Métodos públicos (não requerem autenticação)

  // Obter dados de candles
  async getKlines(symbol: string, interval: string, limit = 500): Promise<KlineData[]> {
    try {
      const url = `${this.baseUrl}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data.map((kline: any[]) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        trades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignored: kline[11]
      }));
    } catch (error) {
      console.error('Erro ao buscar dados de candles:', error);
      throw error;
    }
  }

  // Obter livro de ofertas
  async getOrderBook(symbol: string, limit = 100): Promise<OrderBook> {
    try {
      const url = `${this.baseUrl}/api/v3/depth?symbol=${symbol}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livro de ofertas:', error);
      throw error;
    }
  }

  // Obter últimas negociações
  async getRecentTrades(symbol: string, limit = 500): Promise<Trade[]> {
    try {
      const url = `${this.baseUrl}/api/v3/trades?symbol=${symbol}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar negociações recentes:', error);
      throw error;
    }
  }

  // Testar conectividade com a API
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v3/ping`);
      return response.ok;
    } catch (error) {
      console.error('Erro ao testar conectividade:', error);
      return false;
    }
  }

  // Verificar status do servidor
  async getServerTime(): Promise<{ serverTime: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v3/time`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar horário do servidor:', error);
      throw error;
    }
  }

  // Obter informações da exchange
  async getExchangeInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v3/exchangeInfo`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar informações da exchange:', error);
      throw error;
    }
  }

  // Métodos privados (requerem autenticação)

  // Obter informações da conta
  async getAccountInfo(): Promise<AccountInfo> {
    if (!this.hasCredentials()) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = await this.generateSignature(queryString);

      const url = `${this.baseUrl}/api/v3/account?${queryString}&signature=${signature}`;

      const response = await fetch(url, {
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar informações da conta:', error);
      throw error;
    }
  }

  // Criar uma nova ordem
  async createOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET',
    quantity: string,
    price?: string,
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC'
  ): Promise<Order> {
    if (!this.hasCredentials()) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      let queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;

      if (type === 'LIMIT') {
        if (!price) throw new Error('Price is required for LIMIT orders');
        queryString += `&price=${price}&timeInForce=${timeInForce}`;
      }

      const signature = await this.generateSignature(queryString);

      const url = `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.msg || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      throw error;
    }
  }

  // Cancelar uma ordem
  async cancelOrder(symbol: string, orderId: number): Promise<any> {
    if (!this.hasCredentials()) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
      const signature = await this.generateSignature(queryString);

      const url = `${this.baseUrl}/api/v3/order?${queryString}&signature=${signature}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.msg || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar ordem:', error);
      throw error;
    }
  }

  // Obter histórico de ordens
  async getOrderHistory(symbol: string): Promise<Order[]> {
    if (!this.hasCredentials()) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
      const signature = await this.generateSignature(queryString);

      const url = `${this.baseUrl}/api/v3/allOrders?${queryString}&signature=${signature}`;

      const response = await fetch(url, {
        headers: {
          'X-MBX-APIKEY': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico de ordens:', error);
      throw error;
    }
  }

  // Obter preço atual de um ticker (símbolo)
  async getTickerPrice(symbol: string): Promise<{ symbol: string; price: string }> {
    try {
      const url = `${this.baseUrl}/api/v3/ticker/price?symbol=${symbol}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar preço do ticker:', error);
      throw error;
    }
  }
}
