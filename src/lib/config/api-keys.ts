// Credenciais padrão para a API da Binance
// NOTA: Em um ambiente de produção, isso NUNCA deve ficar no código-fonte
// As chaves devem ser armazenadas em variáveis de ambiente ou em um serviço seguro de gerenciamento de segredos

export const BINANCE_API_KEYS = {
  apiKey: "VGQ0dhdCcHjDhEjj0Xuue3ZtyIZHiG9NK8chA4ew0HMQMywydjrVrLTWeN8nnZ9e",
  apiSecret: "jHrPFutd2fQH2AECeABbG6mDvbJqhEYBt1kuYmiWfcBjJV22Fwtykqx8mDFle3dO"
}

// Função para carregar as credenciais (pode ser expandida para buscar de outras fontes)
export const getBinanceCredentials = () => {
  // Primeiro, tenta buscar do localStorage (se o usuário já configurou)
  if (typeof window !== 'undefined') {
    const storedApiKey = localStorage.getItem('binance_api_key')
    const storedApiSecret = localStorage.getItem('binance_api_secret')

    if (storedApiKey && storedApiSecret) {
      return {
        apiKey: storedApiKey,
        apiSecret: storedApiSecret
      }
    }
  }

  // Se não encontrou no localStorage, usa as credenciais padrão
  return BINANCE_API_KEYS
}
