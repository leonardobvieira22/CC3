# Guia de Deploy no AWS Amplify

Este guia fornece instruções detalhadas para fazer o deploy da aplicação no AWS Amplify, incluindo todas as correções necessárias para resolver os problemas identificados.

## Pré-requisitos

- Conta AWS com acesso ao serviço Amplify
- Repositório Git (GitHub, GitLab, BitBucket ou AWS CodeCommit)
- Código da aplicação atualizado com as correções implementadas

## Passo 1: Preparação do Código

Certifique-se de que as seguintes correções estão implementadas no seu código:

1. **Atualização do `next.config.js`** para remover a configuração `swcMinify` e adicionar as configurações corretas para o Amplify
2. **Correção do componente `RobotsPage.tsx`** para substituir a importação do ícone `Robot` por `Bot`
3. **Correção do componente `AuthErrorPage`** para adicionar o Suspense boundary ao redor do `useSearchParams`
4. **Atualização do arquivo `amplify.yml`** com as configurações otimizadas para o build

## Passo 2: Faça commit e push das alterações

```bash
git add .
git commit -m "Correções para deploy no AWS Amplify"
git push origin main
```

## Passo 3: Configuração Inicial no AWS Amplify

1. **Acesse o Console AWS e navegue até o Amplify**
   - Faça login no [Console da AWS](https://console.aws.amazon.com/)
   - Navegue até o serviço AWS Amplify

2. **Crie um novo App ou acesse o existente**
   - Se já tem um app configurado: Selecione o app `cc3`
   - Se for novo: Clique em "Create app" ou "New app" → "Host web app"

3. **Configure o provedor do repositório**
   - Selecione o provedor (GitHub, GitLab, BitBucket, etc.)
   - Autorize o AWS Amplify a acessar seu repositório
   - Selecione o repositório `CC3` e a branch `main`

4. **Configure o build**
   - Na seção de configuração de build, confirme se está usando o arquivo `amplify.yml` do repositório
   - Clique em "Advanced settings" e configure:
     - Versão do Node.js: 18 (ou superior)
     - Versão do npm: 9 (ou superior)
     - Habilite "Allow Amplify to automatically deploy branch updates"

## Passo 4: Configuração das Variáveis de Ambiente

1. **Acesse a seção de variáveis de ambiente**
   - No menu lateral, clique em "Ambiente" → "Variáveis de ambiente"
   - Clique em "Gerenciar variáveis"

2. **Configure as variáveis conforme abaixo**

   | Variável | Valor | Disponível no Build |
   |----------|-------|---------------------|
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_pPqF8uoE6KYn@ep-gentle-boat-a56xil4c-pooler.us-east-2.aws.neon.tech/crypto_trading_db?sslmode=require` | ✓ |
   | `NEXTAUTH_URL` | `https://{branch-name}.d12weap3xjmri9.amplifyapp.com` | ✓ |
   | `NEXTAUTH_SECRET` | `your-nextauth-secret-key-change-this-in-production` | ✓ |
   | `JWT_SECRET` | `your-jwt-secret-key-change-this-in-production` | ✓ |
   | `NEXT_PUBLIC_APP_URL` | `https://{branch-name}.d12weap3xjmri9.amplifyapp.com` | ✓ |
   | `EMAIL_FROM` | `noreply@aicrypto.com` | ✓ |

   > **Nota:** Substitua `{branch-name}` pelo nome da sua branch, geralmente "main".

3. **Salve as configurações**
   - Clique em "Salvar"

## Passo 5: Inicie o Deploy

1. **Inicie o processo de build e deploy**
   - No menu principal do aplicativo, clique em "Build"
   - Ou acesse a página principal e clique em "Run build"

2. **Monitore o progresso do build**
   - Acompanhe o progresso na seção "Build logs"
   - Verifique se cada etapa está sendo concluída com sucesso

## Passo 6: Verificação Pós-Deploy

1. **Acesse o site implantado**
   - Após o build bem-sucedido, clique no link gerado para o site
   - Normalmente será algo como: `https://main.d12weap3xjmri9.amplifyapp.com`

2. **Verifique a funcionalidade básica**
   - Navegue pelas principais seções do site
   - Teste a autenticação (login/registro)
   - Verifique se os dados estão sendo carregados corretamente

3. **Verifique os logs em caso de problemas**
   - Se encontrar problemas, acesse novamente a seção "Build logs"
   - Analise os logs para identificar possíveis erros

## Solução de Problemas Comuns

### Build falha com erro relacionado ao Prisma

```
Prisma Client inicializado com sucesso
```

**Solução:** Certifique-se de que a variável `DATABASE_URL` está configurada corretamente e marcada como "Disponível no build". Além disso, a etapa `npx prisma generate` deve ser executada antes do build.

### Erro relacionado a dependências SWC

```
⚠ Found lockfile missing swc dependencies, run next locally to automatically patch
```

**Solução:** O amplify.yml atualizado já inclui um comando para instalar essas dependências manualmente quando necessário.

### Página de erro de autenticação não renderiza

**Solução:** O componente `AuthErrorPage` foi corrigido para usar o Suspense boundary corretamente, o que deve resolver o problema.

### Erro de importação do componente Robot

**Solução:** Substituímos a importação do ícone `Robot` por `Bot` no componente `RobotsPage.tsx`.

## Configuração de Domínio Personalizado (Opcional)

1. **Acesse a seção de gerenciamento de domínio**
   - No menu lateral, clique em "Hosting" → "Domain management"
   - Clique em "Add domain"

2. **Configure seu domínio personalizado**
   - Digite seu domínio personalizado
   - Siga as instruções para verificar a propriedade e configurar os registros DNS

3. **Configure o SSL**
   - O AWS Amplify configura automaticamente o certificado SSL
   - Aguarde a validação (pode levar até 24 horas)

## Verificação de Performance e Segurança

Após o deploy bem-sucedido, é recomendado:

1. **Verificar a performance da aplicação**
   - Use ferramentas como Lighthouse ou PageSpeed Insights
   - Identifique possíveis melhorias

2. **Verificar a segurança**
   - Garanta que todas as variáveis sensíveis estão protegidas
   - Verifique se os endpoints de API estão funcionando corretamente
   - Teste o fluxo de autenticação completo

## Manutenção Contínua

Para manter o aplicativo funcionando sem problemas:

1. **Monitore regularmente os logs**
   - Verifique os logs de build e runtime
   - Configure alertas para falhas

2. **Atualize as dependências periodicamente**
   - Mantenha as bibliotecas e frameworks atualizados
   - Teste localmente antes de enviar para produção

3. **Rotacione as credenciais de banco de dados e chaves secretas**
   - Atualize as credenciais periodicamente para maior segurança
   - Atualize as variáveis de ambiente no AWS Amplify quando necessário
