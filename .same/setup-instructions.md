# Instruções para Corrigir o Projeto crypto-ai-trading-platform

Este documento contém instruções detalhadas para corrigir os problemas encontrados no projeto crypto-ai-trading-platform.

## Problemas Identificados

1. **Erro com o módulo web-vitals**: A função `onFID` não é mais exportada pela biblioteca web-vitals.
2. **Erro com o adaptador Prisma**: O módulo `@auth/prisma-adapter` não foi encontrado.
3. **Problemas com dependências faltantes ou desatualizadas**.

## Passos para Correção

### 1. Correção do arquivo webVitals.ts

Modifique o arquivo `src/lib/utils/webVitals.ts` para remover a importação de `onFID`:

```typescript
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: any) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    // Remova a linha com onFID
  }
}
```

### 2. Instalação de Dependências Corretas

Execute os seguintes comandos para instalar as dependências necessárias:

```bash
# Instalar dependências do NextAuth e Prisma
npm install next-auth @prisma/client

# Escolha uma das opções abaixo, dependendo de qual adaptador você deseja usar
npm install @auth/prisma-adapter
# OU
npm install @next-auth/prisma-adapter

# Dependências de desenvolvimento
npm install -D prisma
```

### 3. Correção do Arquivo de Rota do NextAuth

Modifique o arquivo `src/app/api/auth/[...nextauth]/route.ts` para usar o adaptador correto ou removê-lo temporariamente:

```typescript
import NextAuth, { type NextAuthOptions } from 'next-auth'
// Remova ou comente esta linha se estiver causando problemas
// import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  // Comente esta linha se o adaptador não estiver funcionando
  // adapter: PrismaAdapter(prisma),

  // Resto da configuração...
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4. Configuração do Prisma (se estiver usando)

Se você estiver usando o Prisma, execute os seguintes comandos:

```bash
# Inicializar o Prisma (se ainda não tiver feito)
npx prisma init

# Gerar o cliente Prisma após definir seu schema
npx prisma generate
```

### 5. Limpeza e Reinstalação

Se ainda houver problemas, tente limpar o cache e reinstalar as dependências:

```bash
# Limpar o cache
npm cache clean --force

# Excluir node_modules e reinstalar
rm -rf node_modules
npm install
```

## Nota Importante

Os avisos sobre `useLayoutEffect` são conhecidos e não afetam o funcionamento do aplicativo. Eles são gerados pelo React quando componentes que usam `useLayoutEffect` são renderizados no servidor. Você pode ignorá-los com segurança.
