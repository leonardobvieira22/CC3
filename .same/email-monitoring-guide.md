# Guia do Sistema de Monitoramento de Emails

Este documento fornece instruções detalhadas sobre como utilizar o sistema avançado de monitoramento de emails implementado na plataforma AI Crypto Trading.

## Funcionalidades Implementadas

1. **Reenvio de Emails**: Capacidade de reenviar emails que falharam diretamente do painel administrativo
2. **Rastreamento em Tempo Real**: Configuração de webhooks para atualização automática dos status de email
3. **Dashboard com Estatísticas**: Gráficos e métricas de entrega de emails
4. **Logs Detalhados**: Visualização completa de todos os emails enviados com filtros avançados
5. **Sistema de Diagnóstico**: Identificação e resolução de problemas de entrega

## Acessando o Painel de Monitoramento

1. Faça login como administrador
2. No menu lateral, clique em "Logs de Email"
3. Você será direcionado para o dashboard completo de monitoramento

## Guia de Uso das Funcionalidades

### 1. Visualizando Logs de Email

O painel de logs permite visualizar todos os emails enviados pela plataforma:

- **Filtros**: Use os filtros no painel lateral para refinar sua busca por status, tipo de email ou endereço
- **Detalhes**: Clique em "Ver detalhes" para obter informações completas sobre cada email
- **Paginação**: Navegue entre as páginas de resultados usando os controles de navegação

### 2. Reenviando Emails

Para reenviar um email que falhou:

1. Localize o email na tabela de logs
2. Clique no menu de ações (ícone ⌄)
3. Selecione "Reenviar Email"
4. Aguarde a confirmação de reenvio

Observações importantes:
- Emails de verificação serão reenviados usando o token original se ainda for válido
- Emails de redefinição de senha gerarão um novo token de redefinição
- Emails de teste serão simplesmente reenviados com um novo token de teste

### 3. Consultando Estatísticas

A aba "Estatísticas" fornece uma visão detalhada das métricas de entrega:

- **Cards de Resumo**: Visualize rapidamente o total de emails, taxas de entrega e falhas
- **Gráfico por Status**: Distribuição dos emails por status (enviado, entregue, falha, etc)
- **Gráfico por Tipo**: Distribuição dos emails por tipo (verificação, recuperação de senha, etc)
- **Tendência Semanal**: Visualize a atividade de emails nos últimos 7 dias

### 4. Configurando Webhooks

Para habilitar o rastreamento em tempo real, configure webhooks no painel do MailerSend:

1. Acesse a aba "Estatísticas" no painel de monitoramento
2. Localize a seção "Webhooks para Tracking de Email"
3. Copie a URL do webhook exibida
4. Acesse o painel de administração do MailerSend
5. Vá para a seção "Webhooks"
6. Adicione um novo webhook usando a URL copiada
7. Selecione os eventos a monitorar (sent, delivered, opened, etc)
8. Salve a configuração

### 5. Testando o Sistema de Email

Você pode enviar emails de teste diretamente do painel administrativo:

1. Use o formulário "Enviar Email de Teste" no painel de logs
2. Preencha o email de destino e nome (opcional)
3. Selecione o tipo de email (verificação ou recuperação de senha)
4. Clique em "Enviar Email de Teste"
5. Verifique os logs para confirmar o envio e monitorar o status

## Resolução de Problemas

### Problemas Comuns e Soluções

1. **Email não entregue**:
   - Verifique se o endereço de email é válido
   - Confira se o domínio não está bloqueado pelo MailerSend
   - Tente reenviar o email

2. **Status não atualizado**:
   - Verifique se os webhooks estão configurados corretamente
   - Confirme se o MailerSend está enviando as notificações de status
   - Verifique os logs do servidor para possíveis erros de processamento de webhook

3. **Falhas constantes de envio**:
   - Verifique se o token do MailerSend é válido e está correto
   - Confirme se o domínio de envio está verificado no MailerSend
   - Verifique as cotas e limites da sua conta MailerSend

### Logs de Depuração

Os logs detalhados de cada tentativa de envio são armazenados no banco de dados e podem ser visualizados na interface. Para problemas mais complexos, verifique os logs do servidor para mensagens de erro específicas.

## Melhores Práticas

1. **Monitoramento Regular**: Verifique o painel de emails diariamente para identificar problemas precocemente

2. **Teste após Atualizações**: Após qualquer atualização do sistema, envie emails de teste para confirmar o funcionamento

3. **Verificação de Webhooks**: Confirme periodicamente se os webhooks estão funcionando, observando se os status são atualizados

4. **Análise de Estatísticas**: Use os gráficos para identificar tendências e problemas recorrentes

## Considerações de Segurança

- O acesso ao painel de monitoramento é restrito apenas a administradores
- Dados sensíveis como tokens de verificação nunca são exibidos completamente na interface
- Todas as ações são registradas para auditoria
