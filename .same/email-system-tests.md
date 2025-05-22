# Testes do Sistema de Email

Este documento contém instruções para testes manuais que verificam se o sistema de email está funcionando corretamente.

## 1. Teste de Envio de Email

### Propósito
Verificar se o sistema consegue enviar emails corretamente usando a API MailerSend.

### Procedimento
1. Acesse `http://localhost:3000/api/test-client.html`
2. Preencha o campo de email com um email de teste válido
3. Clique em "Testar Email"
4. Verifique a resposta do servidor

### Resultado Esperado
- Resposta de sucesso da API
- Email recebido na caixa de entrada de teste
- Novo registro criado nos logs de email

## 2. Teste de Recuperação de Senha

### Propósito
Verificar se o fluxo de recuperação de senha está gerando e enviando corretamente os emails.

### Procedimento
1. Acesse `http://localhost:3000/test-password-reset.html`
2. Insira um email de usuário cadastrado
3. Clique em "Solicitar Recuperação de Senha"
4. Verifique os logs no painel de administração
5. Verifique o recebimento do email

### Resultado Esperado
- Email de recuperação de senha enviado corretamente
- Token de redefinição gerado e armazenado no banco de dados
- Log registrado no painel administrativo

## 3. Teste de Reenvio de Email

### Propósito
Verificar se a funcionalidade de reenvio de emails está funcionando.

### Procedimento
1. Acesse o painel administrativo de emails em `http://localhost:3000/admin/email-logs`
2. Localize um email que falhou ou escolha qualquer email
3. Clique no menu de ações e selecione "Reenviar Email"
4. Observe os logs e verifique a caixa de entrada do destinatário

### Resultado Esperado
- Interface mostra feedback de reenvio em andamento
- Novo email enviado ao mesmo destinatário
- Novo registro de log criado
- Email recebido na caixa de entrada

## 4. Teste de Estatísticas

### Propósito
Verificar se as estatísticas de email estão sendo calculadas corretamente.

### Procedimento
1. Envie pelo menos 5 emails de teste (usando as ferramentas acima)
2. Acesse o painel administrativo de emails
3. Clique na aba "Estatísticas"
4. Verifique se os gráficos mostram dados consistentes

### Resultado Esperado
- Total de emails combina com o número de emails enviados
- Gráficos são renderizados corretamente
- Dados são consistentes entre os diferentes gráficos

## 5. Teste de Webhook (Simulado)

### Propósito
Verificar se o sistema pode processar webhooks do MailerSend.

### Procedimento
1. Use uma ferramenta como Postman para enviar uma requisição POST para `/api/webhooks/mailersend`
2. Use o formato de payload:
```json
{
  "type": "activity.delivered",
  "data": {
    "message_id": "SUBSTITUA_PELO_ID_DE_UM_EMAIL_REAL_DOS_LOGS",
    "email": "destinatario@teste.com",
    "created_at": "2025-05-21T12:00:00Z"
  }
}
```
3. Verifique os logs do servidor e o painel administrativo

### Resultado Esperado
- Webhook processado com sucesso (resposta 200)
- Status do email atualizado no banco de dados
- Log exibe o novo status no painel administrativo

## Matriz de Teste Completa

| ID | Teste | Pré-condição | Passos | Resultado Esperado | Status |
|----|-------|--------------|--------|-------------------|--------|
| E01 | Envio de email | Servidor rodando | Formulário de teste | Email enviado | - |
| E02 | Recuperação de senha | Usuário cadastrado | Fluxo de recuperação | Email com token enviado | - |
| E03 | Reenvio de email | Email existente nos logs | Ação de reenvio no painel | Email reenviado | - |
| E04 | Estatísticas | Existem logs no sistema | Visualizar aba de estatísticas | Gráficos corretos | - |
| E05 | Webhook | Email enviado com ID | Simular webhook | Status atualizado | - |
| E06 | Filtros de log | Existem logs no sistema | Aplicar diferentes filtros | Resultados filtrados corretamente | - |

## Observações para Debugging

Se algum teste falhar, verifique:

1. **Logs do servidor**: Podem conter erros detalhados sobre falhas de envio
2. **Banco de dados**: Verifique se os registros estão sendo criados na tabela `EmailLog`
3. **Configurações do MailerSend**: Confirme se o token está correto
4. **Dependência node-fetch**: Confirme que a versão 2.x está instalada
