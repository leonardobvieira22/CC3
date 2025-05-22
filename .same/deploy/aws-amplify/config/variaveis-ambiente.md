# Configuração de Variáveis de Ambiente no AWS Amplify

Este guia detalha como configurar as variáveis de ambiente necessárias para o deploy da aplicação no AWS Amplify, utilizando as credenciais já existentes no sistema.

## Passo a Passo para Configuração

### 1. Acesse o Console do AWS Amplify

1. Faça login no [Console da AWS](https://console.aws.amazon.com/)
2. Navegue até o serviço AWS Amplify
3. Selecione o aplicativo `cc3`

### 2. Acesse a Configuração de Variáveis de Ambiente

1. No menu lateral, clique em "Ambiente"
2. Clique na aba "Variáveis de ambiente"
3. Clique no botão "Gerenciar variáveis"

### 3. Configure as seguintes variáveis de ambiente

As variáveis devem ser configuradas exatamente como mostrado abaixo, pois essas são as credenciais já existentes no sistema:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_pPqF8uoE6KYn@ep-gentle-boat-a56xil4c-pooler.us-east-2.aws.neon.tech/crypto_trading_db?sslmode=require` | URL de conexão com o banco de dados Neon |
| `NEXTAUTH_URL` | `https://{branch-name}.d12weap3xjmri9.amplifyapp.com` | URL do seu aplicativo no Amplify (substitua `{branch-name}` pelo nome da branch, como "main") |
| `NEXTAUTH_SECRET` | `your-nextauth-secret-key-change-this-in-production` | Chave secreta para o NextAuth |
| `JWT_SECRET` | `your-jwt-secret-key-change-this-in-production` | Chave secreta para JWT |
| `NEXT_PUBLIC_APP_URL` | `https://{branch-name}.d12weap3xjmri9.amplifyapp.com` | URL pública do app (substitua `{branch-name}` pelo nome da branch, como "main") |
| `EMAIL_FROM` | `noreply@aicrypto.com` | Email de remetente para mensagens do sistema |

> **Importante:** Para `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL`, substitua `{branch-name}` pelo nome da sua branch de deploy, geralmente "main".

### 4. Indicar Variáveis Utilizadas Durante o Build

Para que certas variáveis estejam disponíveis durante o processo de build:

1. Na seção "Variáveis de ambiente", clique no botão "Gerenciar variáveis"
2. Para cada uma das variáveis a seguir, marque a caixa de seleção "Disponibilizar no build":
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`

### 5. Salvar as Configurações

1. Após configurar todas as variáveis, clique no botão "Salvar"
2. Reinicie o deploy da aplicação para aplicar as alterações

## Verificação

Após configurar as variáveis e realizar o deploy, verifique se:

1. O build foi concluído com sucesso (verifique os logs do Amplify)
2. A aplicação está funcionando corretamente, sem erros de conexão com o banco de dados
3. Os recursos de autenticação estão funcionando (registro, login, etc.)

## Solução de Problemas

Se encontrar problemas após a configuração:

1. Verifique se as variáveis foram digitadas corretamente, sem espaços extras
2. Certifique-se de que as opções "Disponibilizar no build" estão marcadas para as variáveis necessárias
3. Verifique os logs de build e deploy para identificar possíveis erros
4. Teste a conexão com o banco de dados para garantir que a URL está correta e acessível

## Segurança

- As variáveis de ambiente são criptografadas no AWS Amplify
- Para variáveis sensíveis, marque a opção "Ocultar no console da AWS" para protegê-las ainda mais
- Considere rotacionar as chaves secretas periodicamente para maior segurança
