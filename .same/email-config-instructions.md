# Instruções para Testar o Serviço de Email MailerSend

Este documento fornece instruções para verificar e testar a configuração do serviço de email que usa a API do MailerSend.

## Configuração Realizada

1. **Dependência adicionada**: node-fetch@2 foi instalada para suportar requisições HTTP para a API do MailerSend.
2. **Token fixo configurado**: O token `mlsn.b928d6b97328b42846ba4f9841fa4fbd7b4fbf0e63582d17589e0a0e05c1c3f9` foi configurado diretamente no serviço de email.
3. **Logs melhorados**: Adicionados logs detalhados para facilitar a depuração de problemas com o envio de emails.
4. **Rota de teste adicionada**: Uma nova rota foi criada para testar o serviço de email sem precisar passar pelo fluxo de registro ou recuperação de senha.

## Como Testar

### Opção 1: Usando a API de Teste

1. Inicie o servidor de desenvolvimento:
   ```bash
   cd crypto-ai-trading-platform && bun run dev
   ```

2. Acesse o cliente de teste no navegador:
   ```
   http://localhost:3000/api/test-client.html
   ```

3. Preencha seu email e nome (opcional) e clique em "Testar Email" para enviar um email de teste.

4. A resposta da API será exibida na tela.

### Opção 2: Testando o Fluxo Normal de Registro

1. Acesse a página de registro:
   ```
   http://localhost:3000/auth/register
   ```

2. Complete o formulário de registro com dados válidos.

3. Após o registro, você será redirecionado para verificar seu email.

4. Verifique se o email de verificação chegou na caixa de entrada ou pasta de spam.

### Opção 3: Testando o Fluxo de Recuperação de Senha

1. Acesse a página de recuperação de senha:
   ```
   http://localhost:3000/auth/forgot-password
   ```

2. Digite seu email registrado e envie o formulário.

3. Verifique se o email de recuperação de senha chegou na caixa de entrada ou pasta de spam.

## Solução de Problemas

Se os emails não estiverem sendo enviados, verifique os seguintes pontos:

1. **Logs do servidor**: Os logs do servidor mostrarão detalhes sobre o processo de envio e possíveis erros.

2. **Verificação do token**: Confirme se o token da API MailerSend está corretamente configurado no arquivo `emailService.ts`.

3. **Verificação da dependência**: Certifique-se de que a dependência `node-fetch` foi instalada na versão 2.x.

4. **Verificação da API**: Se necessário, teste a API MailerSend usando ferramentas como Postman ou Insomnia para verificar se o token está funcionando corretamente.

## Nota de Segurança

A rota de teste (`/api/auth/test-email`) é apenas para fins de desenvolvimento e teste. Em um ambiente de produção, esta rota deve ser desativada ou protegida por autenticação de administrador.
