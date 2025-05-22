/**
 * Utilitário para monitorar Core Web Vitals
 *
 * Este módulo usa a API web-vitals para coletar métricas
 * e enviá-las para um endpoint de análise
 *
 * Web Vitals incluem:
 * - LCP (Largest Contentful Paint): Tempo até o maior elemento de conteúdo ser renderizado
 * - CLS (Cumulative Layout Shift): Medida de mudanças visuais inesperadas
 * - FCP (First Contentful Paint): Tempo até o primeiro conteúdo ser renderizado
 * - TTFB (Time to First Byte): Tempo até o primeiro byte ser recebido
 *
 * Nota: FID (First Input Delay) foi removido pois não está mais disponível na biblioteca web-vitals
 */

import type { ReportCallback } from 'web-vitals'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

// Endpoint para enviar os dados (poderia ser uma API interna ou serviço de analytics)
const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || ''

// Interface para os dados de análise
interface AnalyticsData {
  name: string
  id: string
  value: number
  delta: number
  category: string
  // Campos auxiliares para contexto
  path: string
  deviceType: string
  connectionType?: string
  effectiveType?: string
  theme: string
  viewportWidth: number
  viewportHeight: number
}

/**
 * Relata uma métrica Web Vital para o endpoint de análise
 */
const reportVital = (metric: AnalyticsData) => {
  if (!analyticsEndpoint) {
    console.debug('[Web Vitals]', metric)
    return
  }

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      analyticsEndpoint,
      JSON.stringify(metric)
    )
  } else {
    fetch(analyticsEndpoint, {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(error => {
      console.error('[Web Vitals] Erro ao reportar métrica:', error)
    })
  }
}

/**
 * Coleta informações sobre o dispositivo e conexão
 */
const getEnvironmentInfo = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
  const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

  let connectionInfo = {}
  if ('connection' in navigator) {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection
    connectionInfo = {
      connectionType: conn?.type,
      effectiveType: conn?.effectiveType,
    }
  }

  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  return {
    deviceType,
    ...connectionInfo,
    theme,
    viewportWidth,
    viewportHeight,
  }
}

/**
 * Função para reportar as Web Vitals
 * Versão atualizada que remove onFID e usa apenas as métricas disponíveis
 */
export function reportWebVitals(onPerfEntry?: ReportCallback) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
    // Nota: onFID foi removido pois não está mais disponível na biblioteca web-vitals
  }
}

/**
 * Função principal para iniciar o monitoramento de Web Vitals
 * Usa o reportVital para enviar os dados para o endpoint
 */
export function startWebVitalsMonitor() {
  try {
    const reportCallback: ReportCallback = (metric) => {
      const { name, id, value, delta } = metric
      const path = window.location.pathname
      const environmentInfo = getEnvironmentInfo()

      const dataToReport: AnalyticsData = {
        name,
        id,
        value,
        delta,
        category: (metric as { navigationType?: string }).navigationType ? 'navigational' : 'non-navigational',
        path,
        ...environmentInfo,
      }

      reportVital(dataToReport)
    }

    reportWebVitals(reportCallback)
    console.info('[Web Vitals] Monitoramento iniciado')
  } catch (error) {
    console.error('[Web Vitals] Erro ao iniciar monitoramento:', error)
  }
}

// Adicionar declaração global para NetworkInformation:
declare global {
  interface NetworkInformation {
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  }
}

export default reportWebVitals
