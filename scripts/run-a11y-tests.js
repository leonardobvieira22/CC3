#!/usr/bin/env node

/**
 * Script para executar testes de acessibilidade usando Lighthouse e Axe
 *
 * Uso:
 * 1. Instale as dependências: bun add -D lighthouse axe-core puppeteer chalk
 * 2. Execute o script: bun scripts/run-a11y-tests.js
 *
 * Este script irá:
 * - Iniciar o servidor de desenvolvimento se não estiver rodando
 * - Executar testes de acessibilidade com Lighthouse e Axe
 * - Gerar um relatório com os resultados
 */

const { execSync, spawn } = require('child_process');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const axeCore = require('axe-core');
const { URL } = require('url');

// Configurações
const config = {
  serverUrl: 'http://localhost:3000',
  pagesToTest: [
    '/', // Home/Landing
    '/dashboard', // Dashboard principal
    '/dashboard/trading', // Painel de trading
    '/dashboard/paper-trading', // Paper trading
    '/auth/login', // Página de login
  ],
  outputDir: './a11y-reports',
  thresholds: {
    accessibility: 90,
    'best-practices': 85,
  },
};

// Cria diretório de saída se não existir
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Verifica se o servidor está rodando
async function isServerRunning() {
  try {
    const resp = await fetch(config.serverUrl, { method: 'HEAD' });
    return resp.status < 400;
  } catch (error) {
    return false;
  }
}

// Inicia o servidor de desenvolvimento
async function startDevServer() {
  console.log(chalk.blue('🚀 Iniciando servidor de desenvolvimento...'));

  const server = spawn('bun', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  // Aguarda o servidor iniciar
  let started = false;
  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Local:') && !started) {
      started = true;
      console.log(chalk.green('✅ Servidor iniciado em ' + config.serverUrl));
    }
  });

  // Espera até o servidor estar pronto
  while (!started) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Espera mais um pouco para garantir que o servidor está pronto
  await new Promise(resolve => setTimeout(resolve, 3000));

  return server;
}

// Executa teste Lighthouse
async function runLighthouse(url, options = {}) {
  console.log(chalk.blue(`🔍 Executando Lighthouse para ${url}...`));

  const { lhr } = await lighthouse(url, {
    port: (new URL(options.port)).port,
    output: 'json',
    logLevel: 'info',
    onlyCategories: ['accessibility', 'best-practices'],
  });

  return lhr;
}

// Executa teste Axe
async function runAxe(page) {
  console.log(chalk.blue(`🔍 Executando Axe...`));

  // Injeta axe na página
  await page.evaluateHandle(`
    ${axeCore.source}

    // Scroll para simular interação completa
    function autoScroll() {
      return new Promise(resolve => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    }

    autoScroll();
  `);

  // Espera um pouco para garantir que o axe foi carregado
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Executa o teste
  const results = await page.evaluate(() => {
    return new Promise(resolve => {
      axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'best-practice'],
        }
      }, (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });

  return results;
}

// Gera relatório
function generateReport(page, lighthouseResults, axeResults) {
  const urlPath = page === '/' ? 'home' : page.replace(/\//g, '_').replace(/^_/, '');
  const filename = `${urlPath}-a11y-report.json`;
  const filePath = path.join(config.outputDir, filename);

  const report = {
    url: config.serverUrl + page,
    timestamp: new Date().toISOString(),
    lighthouse: {
      accessibility: lighthouseResults.categories.accessibility,
      bestPractices: lighthouseResults.categories['best-practices'],
    },
    axe: {
      violations: axeResults.violations,
      passes: axeResults.passes.length,
      incomplete: axeResults.incomplete.length,
    },
    summary: {
      accessibilityScore: lighthouseResults.categories.accessibility.score * 100,
      bestPracticesScore: lighthouseResults.categories['best-practices'].score * 100,
      violationsCount: axeResults.violations.length,
      passesCount: axeResults.passes.length,
      incompleteCount: axeResults.incomplete.length,
    }
  };

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  console.log(chalk.green(`✅ Relatório salvo em ${filePath}`));

  return report.summary;
}

// Executa os testes para cada página
async function runTests() {
  let browser;
  let server;

  try {
    // Verifica se o servidor está rodando
    const serverRunning = await isServerRunning();
    if (!serverRunning) {
      server = await startDevServer();
    }

    // Lança o navegador
    browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: {
        width: 1280,
        height: 720,
      }
    });

    // Usa a mesma porta para o lighthouse
    const page = await browser.newPage();

    // Resultados
    const results = [];

    // Testa cada página
    for (const pagePath of config.pagesToTest) {
      const url = config.serverUrl + pagePath;

      console.log(chalk.blue(`\n🔍 Testando página: ${url}`));

      // Navega para a página
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Executa Lighthouse
      const lighthouseResults = await runLighthouse(url, {
        port: (new URL(browser.wsEndpoint())).port
      });

      // Executa Axe
      const axeResults = await runAxe(page);

      // Gera relatório
      const summary = generateReport(pagePath, lighthouseResults, axeResults);
      results.push({
        page: pagePath,
        summary
      });

      console.log(chalk.cyan(`
📊 Sumário para ${pagePath}:
   Pontuação de Acessibilidade: ${summary.accessibilityScore.toFixed(1)}%
   Pontuação de Boas Práticas: ${summary.bestPracticesScore.toFixed(1)}%
   Violações de acessibilidade: ${summary.violationsCount}
   Testes aprovados: ${summary.passesCount}
   Testes incompletos: ${summary.incompleteCount}
      `));

      // Verifica thresholds
      if (summary.accessibilityScore < config.thresholds.accessibility) {
        console.log(chalk.yellow(`⚠️ Pontuação de acessibilidade abaixo do threshold (${config.thresholds.accessibility}%)`));
      }

      if (summary.bestPracticesScore < config.thresholds['best-practices']) {
        console.log(chalk.yellow(`⚠️ Pontuação de boas práticas abaixo do threshold (${config.thresholds['best-practices']}%)`));
      }
    }

    // Gera relatório geral
    console.log(chalk.blue('\n📝 Gerando relatório geral...'));

    const generalReportPath = path.join(config.outputDir, 'general-report.json');
    fs.writeFileSync(generalReportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results
    }, null, 2));

    console.log(chalk.green(`✅ Relatório geral salvo em ${generalReportPath}`));

    // Sumário final
    console.log(chalk.cyan('\n📊 Sumário geral:'));

    results.forEach(result => {
      const accessColor = result.summary.accessibilityScore >= config.thresholds.accessibility ?
        chalk.green : chalk.yellow;
      const bpColor = result.summary.bestPracticesScore >= config.thresholds['best-practices'] ?
        chalk.green : chalk.yellow;

      console.log(`   ${result.page}: ` +
        accessColor(`A11y ${result.summary.accessibilityScore.toFixed(1)}%`) + ', ' +
        bpColor(`BP ${result.summary.bestPracticesScore.toFixed(1)}%`) + ', ' +
        `${result.summary.violationsCount} violações`);
    });

  } catch (error) {
    console.error(chalk.red('❌ Erro ao executar testes:'), error);
  } finally {
    // Fecha o navegador
    if (browser) {
      await browser.close();
    }

    // Encerra o servidor se foi iniciado pelo script
    if (server) {
      server.kill();
      console.log(chalk.blue('🛑 Servidor de desenvolvimento encerrado.'));
    }
  }
}

runTests().catch(error => {
  console.error(chalk.red('❌ Erro fatal:'), error);
  process.exit(1);
});
