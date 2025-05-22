# Variáveis de Ambiente para AWS Amplify

Este documento lista as variáveis de ambiente que precisam ser configuradas no AWS Amplify para que a aplicação funcione corretamente.

## Variáveis de Ambiente Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão do banco de dados PostgreSQL | `postgresql://user:password@host:port/database?sslmode=require` |
| `NEXTAUTH_URL` | URL completa da aplicação | `https://main.d1a2b3c4.amplifyapp.com` |
| `NEXTAUTH_SECRET` | Chave secreta para o Next Auth | `sua-chave-secreta-muito-longa-e-aleatoria` |
| `JWT_SECRET` | Chave secreta para JWT | `outra-chave-secreta-muito-longa-e-aleatoria` |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação | `https://main.d1a2b3c4.amplifyapp.com` |

## Variáveis de Ambiente para Email (Se necessário)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EMAIL_SERVER_HOST` | Host do servidor SMTP | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | Porta do servidor SMTP | `587` |
| `EMAIL_SERVER_USER` | Usuário do servidor SMTP | `seu_email@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | Senha do servidor SMTP | `sua-senha-ou-app-password` |
| `EMAIL_FROM` | Email de remetente | `noreply@seudominio.com` |

## Variáveis de Ambiente para Binance (Se necessário)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `BINANCE_API_KEY` | Chave de API da Binance (opcional) | `sua-chave-api-binance` |
| `BINANCE_API_SECRET` | Segredo da API da Binance (opcional) | `seu-segredo-api-binance` |

## Configurando no Console AWS Amplify

1. No console do AWS Amplify, selecione sua aplicação
2. Vá para a guia "Environment variables"
3. Clique em "Manage variables"
4. Adicione cada variável e seu valor
5. Para variáveis sensíveis, marque a opção "Hidden in the AWS console"
6. Clique em "Save"

## Notas Importantes

- **Nunca** faça commit de variáveis de ambiente com valores reais para o repositório
- As variáveis marcadas como `NEXT_PUBLIC_*` serão expostas no cliente
- As variáveis sensíveis devem ser mantidas privadas e configuradas apenas no AWS Amplify
- Para variáveis de ambiente que precisam ser acessadas durante o build, certifique-se de marcá-las como "Environment variables to use in build settings"
