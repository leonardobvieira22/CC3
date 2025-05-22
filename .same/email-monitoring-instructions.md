# Instruções para Testar o Fluxo de Recuperação de Senha e Monitorar Emails

Este documento fornece instruções detalhadas para testar o fluxo de recuperação de senha e verificar os logs de email no painel administrativo.

## 1. Configurações Implementadas

Implementamos as seguintes melhorias no sistema de email:

1. **Sistema de Logs de Email**: Todos os emails enviados agora são registrados no banco de dados, incluindo detalhes como destinatário, tipo de email, status de envio e informações adicionais.

2. **Painel de Administração de Emails**: Uma nova seção no painel admin permite visualizar, filtrar e monitorar todos os emails enviados pelo sistema.

3. **Ferramenta de Teste de Email**: O painel admin inclui uma ferramenta para enviar emails de teste diretamente da interface.

4. **Páginas de Teste**: Criamos páginas HTML dedicadas para testar o fluxo de recuperação de senha.

## 2. Testando o Fluxo de Recuperação de Senha

### Utilizando a página normal de recuperação de senha:

1. Acesse a página de login:
   ```
   http://localhost:3000/auth/login
   ```

2. Clique no link "Esqueci minha senha" ou acesse diretamente:
   ```
   http://localhost:3000/auth/forgot-password
   ```

3. Digite o email cadastrado e envie o formulário.

4. Você receberá uma mensagem confirmando que o email foi enviado (se o endereço estiver cadastrado).

### Utilizando a página de teste:

1. Acesse a página de teste de recuperação de senha:
   ```
   http://localhost:3000/test-password-reset.html
   ```

2. Digite o email que deseja testar e clique em "Solicitar Recuperação de Senha".

3. A resposta da API será exibida na tela.

## 3. Monitorando os Logs de Email

1. Acesse o painel de administração:
   ```
   http://localhost:3000/admin
   ```

2. No menu lateral, clique em "Logs de Email" ou acesse diretamente:
   ```
   http://localhost:3000/admin/email-logs
   ```

3. Na interface de logs de email, você pode:
   - Ver todos os emails enviados pelo sistema
   - Filtrar por tipo de email, status ou destinatário
   - Enviar emails de teste para verificar o funcionamento
   - Verificar detalhes dos emails enviados, incluindo hora e status

## 4. Possíveis Status de Email

Os emails podem ter os seguintes status:

- **PENDING**: Email está em processo de envio
- **SENT**: Email foi enviado com sucesso
- **FAILED**: Ocorreu um erro ao tentar enviar o email
- **DELIVERED**: Email foi entregue ao servidor de destino (quando disponível)
- **OPENED**: Email foi aberto pelo destinatário (quando disponível)
- **CLICKED**: Links no email foram clicados (quando disponível)
- **BOUNCED**: Email não pôde ser entregue (quando disponível)
- **SPAM**: Email foi marcado como spam (quando disponível)

## 5. Solução de Problemas

Se você encontrar problemas ao enviar emails, verifique os seguintes pontos:

1. **Logs do Console**: Verifique os logs do console do servidor para ver possíveis erros durante o envio.

2. **Detalhes do Erro**: Na interface de logs de email, a coluna "Detalhes" pode conter informações específicas sobre falhas.

3. **Configuração da API**: Verifique se o token do MailerSend está configurado corretamente no arquivo `emailService.ts`.

4. **Fallback para Ethereal**: O sistema utiliza automaticamente o Ethereal (serviço de teste) se o MailerSend falhar. Os links para visualizar esses emails de teste aparecerão nos logs do servidor.

## 6. Verificando Emails em Ambiente de Teste

Se você estiver usando o Ethereal como fallback, os links para visualizar os emails serão exibidos nos logs do servidor. Estes links permitem visualizar o email em um navegador web sem precisar de uma caixa de entrada real.

---

## Resumo das Melhorias

- ✅ Configuramos corretamente o token do MailerSend
- ✅ Adicionamos sistema de logs detalhados para todos os emails
- ✅ Criamos interface administrativa para monitoramento de emails
- ✅ Implementamos ferramentas de teste e depuração
- ✅ Atualizamos o fluxo de recuperação de senha para incluir logs
