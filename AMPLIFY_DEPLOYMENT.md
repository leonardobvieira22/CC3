# Instruções para Deploy no AWS Amplify

Este documento contém as instruções para fazer o deploy desta aplicação Next.js no AWS Amplify.

## Pré-requisitos

1. Uma conta AWS com acesso ao AWS Amplify
2. AWS CLI configurado (opcional, apenas se for fazer deploy pela linha de comando)
3. Git instalado

## Passos para o Deploy

### 1. No Console AWS Amplify

1. Acesse o console do AWS Amplify: https://console.aws.amazon.com/amplify/
2. Clique em "Create app" ou "New app"
3. Selecione "Host web app"
4. Escolha o provedor do repositório (GitHub, GitLab, BitBucket, ou AWS CodeCommit)
5. Autorize o AWS Amplify a acessar seu repositório
6. Selecione o repositório `cc2` e o branch que você deseja implantar
7. Na seção de configuração de build, mantenha o arquivo de configuração de build padrão (amplify.yml já está configurado no projeto)
8. Configure as variáveis de ambiente necessárias:
   - DATABASE_URL (URL de conexão com o banco de dados Postgres)
   - NEXTAUTH_URL (URL da aplicação implantada)
   - NEXTAUTH_SECRET (Chave secreta para Next Auth)
   - JWT_SECRET (Chave secreta para JWT)
   - EMAIL_* (Configurações de email, se necessário)
   - NEXT_PUBLIC_APP_URL (URL da aplicação implantada)
9. Clique em "Save and deploy"

### 2. Configuração Avançada

#### Domínio Personalizado

Após o deploy, você pode configurar um domínio personalizado:

1. No console do Amplify, selecione sua aplicação
2. Vá para a aba "Domain Management"
3. Clique em "Add domain"
4. Siga as instruções para configurar seu domínio

#### CI/CD com Webhooks

O Amplify configura automaticamente um webhook para seu repositório. Isso significa que quando você fizer um push para o branch configurado, o Amplify iniciará automaticamente um novo build e deploy.

### 3. Solução de Problemas

Se encontrar problemas durante o deploy:

1. Verifique os logs de build no console do Amplify
2. Certifique-se de que todas as variáveis de ambiente necessárias estão configuradas
3. Verifique se o arquivo amplify.yml está configurado corretamente
4. Verifique se o banco de dados está acessível a partir do AWS Amplify

## Arquivos Importantes

- `amplify.yml`: Contém a configuração de build para o AWS Amplify
- `next.config.js`: Configuração do Next.js
- `.env`: Template para as variáveis de ambiente necessárias (não faça commit deste arquivo com valores reais)

## Notas Adicionais

- Esta aplicação usa o Bun como gerenciador de pacotes e executor de scripts
- A aplicação é construída com Next.js 15.2.0
- O banco de dados utilizado é PostgreSQL através do Prisma ORM
