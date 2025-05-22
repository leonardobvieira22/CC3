# Fluxo de Autenticação - AI Crypto Trading Platform

Este documento descreve o fluxo completo de autenticação na plataforma AI Crypto Trading, incluindo registro, verificação de email, login e recuperação de senha. Além disso, fornece instruções para teste e verificação manual quando necessário.

## Visão Geral do Fluxo

O fluxo de autenticação consiste nas seguintes etapas:

1. **Registro do Usuário** - O usuário se registra com email, senha e dados pessoais
2. **Verificação de Email** - O usuário recebe um email com link para verificar sua conta
3. **Login** - Após verificação, o usuário pode fazer login
4. **Recuperação de Senha** - Se o usuário esquecer a senha, pode solicitar redefinição

## Componentes Principais

### 1. Registro de Usuário (`RegisterForm.tsx`)
- Coleta informações do usuário: nome, email, senha, CPF, data de nascimento
- Validação de dados com Zod: formato de email, força de senha, CPF válido, etc.
- Verificação de usuários existentes (email/CPF)
- Envio de email de verificação

### 2. Verificação de Email (`EmailVerificationForm.tsx`)
- Recebe o token de verificação do email via URL
- Valida o token com o servidor
- Permite reenvio do email de verificação
- Redireciona para login após verificação bem-sucedida

### 3. Login (`LoginForm.tsx`)
- Autenticação com credenciais (email/senha)
- Integração com NextAuth.js
- Verificação se o email foi confirmado
- Tratamento de erros específicos (email não verificado, credenciais inválidas, etc.)

### 4. Recuperação de Senha (`ForgotPasswordForm.tsx` e `ResetPasswordForm.tsx`)
- Solicitação de redefinição por email
- Verificação de token de redefinição
- Formulário para definir nova senha
- Validação de força da nova senha

## Banco de Dados (Prisma Schema)

O modelo `User` no Prisma inclui campos específicos para autenticação:
- `emailVerified` - Data/hora quando o email foi verificado
- `emailVerificationToken` - Token único para verificação de email
- `emailVerificationExpires` - Data/hora de expiração do token
- `resetPasswordToken` - Token único para redefinição de senha
- `resetPasswordExpires` - Data/hora de expiração do token de redefinição

## Como Testar o Fluxo de Autenticação

### Teste Automatizado

Para testar o fluxo completo de autenticação:

```bash
cd crypto-ai-trading-platform
node scripts/test-auth-flow.js
```

Este script testa:
1. Criação de usuário
2. Verificação de email
3. Login
4. Recuperação de senha

### Teste Manual

#### 1. Registro
- Acesse `/auth/register`
- Preencha o formulário com dados válidos
- Verifique se recebeu email de confirmação (verifique console para emails de teste)

#### 2. Verificação de Email
- Opção 1: Clique no link do email recebido
- Opção 2: Verificação manual no banco de dados (veja instruções abaixo)

#### 3. Login
- Após verificação, acesse `/auth/login`
- Use as credenciais do registro
- Verifique se o login é bem-sucedido

#### 4. Recuperação de Senha
- Acesse `/auth/forgot-password`
- Insira o email cadastrado
- Verifique se recebeu email com link de recuperação
- Clique no link e defina nova senha
- Teste login com a nova senha

## Verificação Manual de Email (para Desenvolvimento)

Em um ambiente de desenvolvimento, às vezes é necessário verificar o email manualmente:

```sql
-- Verificar detalhes do usuário
SELECT * FROM "User" WHERE email = 'email@exemplo.com';

-- Verificar email manualmente (substitua o ID do usuário)
UPDATE "User"
SET
  "emailVerified" = CURRENT_TIMESTAMP,
  "emailVerificationToken" = NULL,
  "emailVerificationExpires" = NULL
WHERE id = 'id-do-usuario';
```

## Solução de Problemas Comuns

### Erro: "Email não verificado"
- Verifique se o usuário confirmou o email
- Verifique se o token de verificação não expirou
- Verifique o console para URLs de email de teste (Ethereal)

### Erro: "Email ou senha incorretos"
- Certifique-se de que o email está verificado
- Verifique se as credenciais estão corretas
- Verifique se a conta existe no banco de dados

### Erro de Schema do Prisma
Se encontrar erros relacionados a colunas que não existem no banco de dados:
- Execute `bun prisma migrate dev --name add_missing_fields`
- Verifique se o banco de dados foi atualizado com `bun prisma db pull`

## Melhores Práticas

1. **Segurança**
   - Use sempre bcrypt para hash de senhas
   - Nunca armazene senhas em texto puro
   - Tokens de verificação devem ter expiração

2. **UX**
   - Forneça mensagens de erro claras e específicas
   - Ofereça redirecionamento após ações bem-sucedidas
   - Permita reenvio de emails de verificação

3. **Email**
   - Use modelos de email bem formatados e responsivos
   - Inclua instruções claras nos emails
   - Ofereça alternativa para verificação manual quando necessário

## Fluxo de Desenvolvimento

Ao desenvolver ou modificar o fluxo de autenticação:

1. Atualize o schema Prisma se necessário
2. Execute migrações do banco de dados
3. Atualize os componentes de UI
4. Atualize os handlers de API
5. Teste exaustivamente todas as etapas
6. Documente alterações neste arquivo
