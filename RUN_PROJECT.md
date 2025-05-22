# Guia de Execução do AI Crypto Trading Platform

Este documento fornece instruções detalhadas para executar o projeto AI Crypto Trading Platform localmente.

## Requisitos

- Node.js versão 18 ou superior
- Bun (recomendado) ou npm para gerenciamento de pacotes

## Passos para Execução

### 1. Instalação de Dependências

Primeiro, é necessário instalar todas as dependências do projeto. Recomendamos usar o Bun para uma instalação mais rápida:

```bash
# Usando Bun (recomendado)
bun install

# Ou usando npm
npm install
```

### 2. Verificação de Dependências Críticas

Certifique-se que estas dependências críticas estão instaladas corretamente:

```bash
# Instalação explícita de dependências críticas com Bun
bun add next-themes zustand date-fns framer-motion sonner lightweight-charts

# Ou usando npm
npm install next-themes zustand date-fns framer-motion sonner lightweight-charts
```

### 3. Iniciar o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
# Usando Bun
bun run dev

# Ou usando npm
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

### 4. Construir para Produção (Opcional)

Para construir o projeto para produção:

```bash
# Usando Bun
bun run build

# Ou usando npm
npm run build
```

Para iniciar o servidor de produção após a construção:

```bash
# Usando Bun
bun run start

# Ou usando npm
npm run start
```

## Solução de Problemas

Se encontrar problemas ao executar o projeto, tente os seguintes passos:

1. **Limpar o cache do Next.js**:
   ```bash
   rm -rf .next
   ```

2. **Reinstalar os módulos**:
   ```bash
   rm -rf node_modules
   bun install
   ```

3. **Verificar versão do Node.js**:
   Certifique-se de que está usando Node.js versão 18 ou superior.
   ```bash
   node -v
   ```

4. **Problema com SWC e Babel**:
   Se você encontrar um erro relacionado a "next/font requires SWC although Babel is being used", isso indica um conflito entre o compilador SWC do Next.js e o Babel.

   **Solução:** Remova o arquivo `.babelrc` se ele existir. O Next.js 15 utiliza o SWC como compilador padrão, e a presença de um arquivo de configuração Babel causa conflitos.
   ```bash
   rm .babelrc
   ```

5. **Desativar o Turbopack**:
   Se houver problemas com o Turbopack, edite o arquivo `package.json` e remova a flag `--turbopack` do script `dev`.

## Estrutura do Projeto

- `/src/app`: Páginas e layouts do Next.js
- `/src/components`: Componentes React reutilizáveis
- `/src/lib`: Utilitários, serviços e hooks
- `/public`: Arquivos estáticos

## Funcionalidades Principais

- **Landing Page**: Apresentação do produto
- **Onboarding**: Processo de cadastro e configuração inicial
- **Dashboard**: Visão geral da plataforma
- **Trading Panel**: Interface para trading com gráficos em tempo real
- **Backtesting**: Ferramenta para teste de estratégias com dados históricos
- **Paper Trading**: Simulador de trading para prática sem risco
- **Robot Management**: Gerenciamento de robôs de trading automatizado

## Contato

Se precisar de ajuda adicional, entre em contato com nossa equipe.
