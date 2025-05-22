#!/usr/bin/env node

/**
 * Script para executar uma verificação rápida de acessibilidade
 * usando axe-core diretamente em HTML estático gerado pelo app
 */

const { execSync } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axeCore = require('axe-core');

// Função para iniciar o servidor estático
async function startStaticServer() {
  console.log('Iniciando build estático para teste...');

  // Primeiro fazemos o build
  try {
    execSync('bun run build', { stdio: 'inherit' });
    console.log('Build concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao fazer o build:', error);
    process.exit(1);
  }

  // Inicia um servidor para servir os arquivos estáticos
  console.log('Iniciando servidor estático...');
  const server = execSync('npx serve out -p 3001', {
    stdio: 'pipe',
    encoding: 'utf-8',
    detached: true
  });

  return server;
}

// Função para realizar a auditoria
async function runAccessibilityAudit() {
  const outputDir = './a11y-reports';

  // Cria diretório para relatórios se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let browser;
  let serverProcess;

  try {
    // Inicia o servidor
    serverProcess = startStaticServer();

    // Aguarda o servidor iniciar
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Inicia o navegador
    browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: {
        width: 1280,
        height: 720
      }
    });

    const page = await browser.newPage();

    // Navega para a página
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

    // Injeta o axe-core
    await page.evaluate(axeSource => {
      const script = document.createElement('script');
      script.text = axeSource;
      document.head.appendChild(script);
    }, axeCore.source);

    // Executa a análise
    const results = await page.evaluate(() => {
      return new Promise(resolve => {
        axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
          }
        }, (err, results) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });

    // Salva os resultados
    fs.writeFileSync(
      path.join(outputDir, 'a11y-quick-report.json'),
      JSON.stringify(results, null, 2)
    );

    // Exibe um resumo
    console.log(`\nProblemas encontrados: ${results.violations.length}`);

    if (results.violations.length > 0) {
      console.log('\nViolações de acessibilidade:');
      results.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id} - ${violation.impact} - ${violation.help}`);
        console.log(`   Descrição: ${violation.description}`);
        console.log(`   Nodes afetados: ${violation.nodes.length}`);

        // Mostra apenas o primeiro nó como exemplo
        if (violation.nodes.length > 0) {
          const node = violation.nodes[0];
          console.log(`   Exemplo: ${node.html}`);
          console.log(`   Problemas:`);
          node.failureSummary.split('\n').forEach(line => {
            if (line.trim()) console.log(`     - ${line.trim()}`);
          });
        }
      });
    } else {
      console.log('Nenhuma violação de acessibilidade encontrada!');
    }

    console.log(`\nRelatório completo salvo em: ${path.join(outputDir, 'a11y-quick-report.json')}`);

    return results;
  } catch (error) {
    console.error('Erro durante a auditoria:', error);
    return null;
  } finally {
    // Fecha o navegador
    if (browser) {
      await browser.close();
    }

    // Mata o servidor
    if (serverProcess) {
      try {
        process.kill(-serverProcess.pid);
      } catch (e) {
        console.log('Processo do servidor já encerrado');
      }
    }
  }
}

// Executa a auditoria
runAccessibilityAudit()
  .then(results => {
    if (!results) {
      console.error('Falha na auditoria de acessibilidade');
      process.exit(1);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
