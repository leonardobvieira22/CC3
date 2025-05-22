#!/usr/bin/env bun

/**
 * Script para preparar o ambiente para deploy no AWS Amplify
 *
 * Este script verifica:
 * 1. Variáveis de ambiente necessárias
 * 2. Dependências instaladas
 * 3. Se o build funciona localmente
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}=== Verificação de Preparação para Deploy no AWS Amplify ===${colors.reset}\n`);

// Verificar se o arquivo .env existe
try {
  console.log(`${colors.blue}Verificando arquivo .env...${colors.reset}`);
  if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
    console.log(`${colors.yellow}Aviso: Arquivo .env não encontrado. Certifique-se de configurar as variáveis de ambiente no AWS Amplify.${colors.reset}`);
  } else {
    console.log(`${colors.green}Arquivo .env encontrado.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Erro ao verificar arquivo .env: ${error.message}${colors.reset}`);
}

// Verificar se as dependências estão instaladas
try {
  console.log(`\n${colors.blue}Verificando dependências instaladas...${colors.reset}`);
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log(`${colors.yellow}Instalando dependências...${colors.reset}`);
    execSync('bun install', { stdio: 'inherit' });
  } else {
    console.log(`${colors.green}Dependências já instaladas.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Erro ao verificar dependências: ${error.message}${colors.reset}`);
}

// Verificar se o arquivo amplify.yml existe
try {
  console.log(`\n${colors.blue}Verificando arquivo amplify.yml...${colors.reset}`);
  if (!fs.existsSync(path.join(process.cwd(), 'amplify.yml'))) {
    console.error(`${colors.red}Erro: Arquivo amplify.yml não encontrado! Este arquivo é necessário para o deploy no AWS Amplify.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}Arquivo amplify.yml encontrado.${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Erro ao verificar arquivo amplify.yml: ${error.message}${colors.reset}`);
}

// Verificar se o build funciona localmente
try {
  console.log(`\n${colors.blue}Testando build localmente...${colors.reset}`);
  console.log(`${colors.yellow}Este processo pode demorar alguns minutos...${colors.reset}`);
  execSync('bun run build', { stdio: 'inherit' });
  console.log(`${colors.green}Build local bem-sucedido!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Erro no build local: ${error.message}${colors.reset}`);
  console.error(`${colors.red}Corrija os erros antes de fazer o deploy no AWS Amplify.${colors.reset}`);
  process.exit(1);
}

// Verificar se o diretório .next foi criado
try {
  console.log(`\n${colors.blue}Verificando artefatos de build...${colors.reset}`);
  if (!fs.existsSync(path.join(process.cwd(), '.next'))) {
    console.error(`${colors.red}Erro: Diretório .next não foi criado pelo build!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}Artefatos de build encontrados no diretório .next${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Erro ao verificar artefatos de build: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.green}=== Preparação para Deploy concluída com sucesso! ===${colors.reset}`);
console.log(`\n${colors.cyan}Próximos passos:${colors.reset}`);
console.log(`1. ${colors.cyan}Faça commit e push das alterações para o repositório${colors.reset}`);
console.log(`2. ${colors.cyan}Configure o AWS Amplify com as variáveis de ambiente necessárias${colors.reset}`);
console.log(`3. ${colors.cyan}Inicie o deploy no console do AWS Amplify${colors.reset}`);
console.log(`\n${colors.magenta}Consulte o arquivo AMPLIFY_DEPLOYMENT.md para instruções detalhadas.${colors.reset}`);
