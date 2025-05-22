# Guia de Solução de Problemas para AWS Amplify

Este guia ajudará a resolver problemas comuns encontrados durante o deploy desta aplicação Next.js no AWS Amplify.

## Problemas Comuns de Build

### 1. Falha na Instalação de Dependências

**Sintoma**: O build falha durante a instalação de dependências com erros como "ENOENT" ou "ETIMEDOUT".

**Soluções**:
- Verifique se todas as dependências no `package.json` são válidas e têm versões compatíveis
- Tente instalar as dependências localmente para identificar problemas
- Considere usar Bun em vez de npm ou yarn para instalação mais rápida e confiável

**No console do Amplify**:
1. Vá para "App settings" > "Build settings"
2. Modifique o comando de instalação para: `npm install --force` ou `bun install --no-cache`
3. Salve e reinicie o build

### 2. Erros de TypeScript

**Sintoma**: Build falha com erros de TypeScript como "Type error", "Cannot find module", etc.

**Soluções**:
- Atualize o `next.config.js` para ignorar erros de TypeScript durante o build:
  ```javascript
  typescript: {
    ignoreBuildErrors: true,
  }
  ```
- Certifique-se de que todas as dependências de tipos (@types/*) estão instaladas

### 3. Problemas com o Prisma

**Sintoma**: Erros relacionados ao Prisma, como "Database connection error" ou "Prisma Client not generated".

**Soluções**:
- Certifique-se de que `DATABASE_URL` está configurado corretamente nas variáveis de ambiente
- Modifique o script de build para incluir a geração do Prisma Cliente:
  ```json
  "build": "prisma generate && next build"
  ```
- Verifique se o banco de dados está acessível a partir do AWS Amplify
  (pode ser necessário configurar regras de segurança do banco de dados)

### 4. Erros de Memória Durante o Build

**Sintoma**: Build falha com "FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed" ou erros semelhantes.

**Soluções**:
- Aumente a memória disponível para o Node.js:
  ```bash
  export NODE_OPTIONS="--max-old-space-size=4096"
  ```
- Modifique o arquivo amplify.yml para incluir esta configuração antes do build

## Problemas de Runtime

### 1. Erro "404 Not Found" ou "502 Bad Gateway"

**Sintoma**: A aplicação é implantada, mas ao acessar retorna erros 404 ou 502.

**Soluções**:
- Verifique se o diretório de saída está configurado corretamente em `amplify.yml`
- Certifique-se de que `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` estejam apontando para o URL correto
- Verifique os logs da aplicação para identificar erros específicos

### 2. Problemas de API Routes

**Sintoma**: Frontend carrega, mas chamadas de API retornam erros.

**Soluções**:
- Verifique se as variáveis de ambiente necessárias para conectar ao banco de dados e serviços externos estão configuradas
- Certifique-se de que as rotas de API estão definidas corretamente
- Examine os logs do servidor para erros específicos

### 3. Problemas de CORS

**Sintoma**: Erros de CORS ao chamar APIs.

**Soluções**:
- Adicione cabeçalhos CORS adequados nas rotas de API (se estiver usando o Next.js API Routes)
- Certifique-se de que as origens permitidas incluem o domínio do Amplify

## Verificando Logs

Para diagnosticar problemas, os logs são essenciais:

1. No console do AWS Amplify, selecione sua aplicação
2. Clique na aba "Hosting environments"
3. Selecione o ambiente (geralmente "main")
4. Clique no último deploy
5. Clique em "Logs" para ver os logs de build e deploy

## Ambiente de Produção vs. Desenvolvimento

Lembre-se que o ambiente de produção no AWS Amplify pode comportar-se diferente do ambiente de desenvolvimento local:

- Variáveis de ambiente podem ter valores diferentes
- Banco de dados de produção vs. desenvolvimento
- Configurações de cache e otimização

## Suporte

Se você encontrar problemas não cobertos por este guia, consulte:

- [Documentação oficial do AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Fóruns de suporte do Next.js](https://github.com/vercel/next.js/discussions)
- [AWS re:Post para Amplify](https://repost.aws/tags/TAj7Sb-ftHepuUIGaCPKrswQ/aws-amplify)
