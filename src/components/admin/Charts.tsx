import { ChartDataPoint } from "./ChartTypes";
"use client"

import type React from 'react'
import { useRef, useEffect, useState } from 'react'
import { createChart, ColorType, LineStyle, AreaSeries, LineSeries, HistogramSeries } from 'lightweight-charts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Função auxiliar para formatar valores numéricos grandes
const formatValue = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

// Função auxiliar para formatar datas
const formatDate = (dateStr: string): number => {
  const date = new Date(dateStr)
  return date.getTime() / 1000
}

// Define uma interface genérica para os dados dos gráficos
export interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

// Propriedades base para todos os gráficos
interface BaseChartProps {
  data: ChartDataPoint[]
  xField: string
  height?: number
  color?: string
  tooltip?: boolean
}

// Propriedades para gráfico de área
interface AreaChartProps extends BaseChartProps {
  yField: string
}

// Propriedades para gráfico de linha
interface LineChartProps extends BaseChartProps {
  yField: string
}

// Propriedades para gráfico de barras
interface BarChartProps extends BaseChartProps {
  series: { name: string; value: string; color: string }[]
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  color = '#2563eb',
  tooltip = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return

    // Limpar o conteúdo do container
    chartContainerRef.current.innerHTML = ''

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(107, 114, 128, 1)',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(229, 231, 235, 0.5)',
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    })

    // Adicionar série de área
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}80`, // 50% de transparência
      bottomColor: `${color}10`, // 10% de transparência
      lineWidth: 2,
    })

    // Formatar os dados para o gráfico
    const formattedData = data.map(item => ({
      time: formatDate(item[xField]),
      value: item[yField]
    }))

    // Definir dados para a série
    areaSeries.setData(formattedData)

    // Ajustar visualização
    chart.timeScale().fitContent()

    // Tooltip personalizado
    if (tooltip) {
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.display = 'none'
      container.style.padding = '8px'
      container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'
      container.style.backgroundColor = 'white'
      container.style.borderRadius = '4px'
      container.style.fontSize = '12px'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '1000'
      container.style.border = '1px solid rgba(229, 231, 235, 1)'
      chartContainerRef.current.appendChild(container)

      chart.subscribeCrosshairMove(param => {
        if (!param.time || param.point === undefined) {
          container.style.display = 'none'
          return
        }

        const dateStr = new Date(param.time * 1000).toISOString().split('T')[0]
        const dataPoint = data.find(d => typeof d[xField] === 'string' && d[xField].includes(dateStr))

        if (dataPoint) {
          const value = dataPoint[yField]

          // Exibir data formatada e valor com separador de milhares
          container.innerHTML = `
            <div style={{fontWeight: "500"}}>${format(new Date(dataPoint[xField]), 'dd/MM/yyyy', { locale: ptBR })}</div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}>
              <span style={{color: "#6b7280"}}>Valor:</span>
              <span style={{fontWeight: "500", color: "${color}"}}>${(value as number).toLocaleString('pt-BR')}</span>
            </div>
          `

          container.style.display = 'block'
          const coordinate = areaSeries.priceToCoordinate(value as number)

          // Posicionar tooltip
          let left = param.point.x + 20
          if (left > chartContainerRef.current.clientWidth - container.clientWidth) {
            left = param.point.x - container.clientWidth - 20
          }

          container.style.left = `${left}px`
          container.style.top = `${coordinate - container.clientHeight / 2}px`
        } else {
          container.style.display = 'none'
        }
      })
    }

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, xField, yField, height, color, tooltip])

  return <div ref={chartContainerRef} className="w-full" />
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  color = '#16a34a',
  tooltip = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return

    // Limpar o conteúdo do container
    chartContainerRef.current.innerHTML = ''

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(107, 114, 128, 1)',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(229, 231, 235, 0.5)',
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    })

    // Adicionar série de linha
    const lineSeries = chart.addSeries(LineSeries, {
      color: color,
      lineWidth: 2,
    })

    // Formatar os dados para o gráfico
    const formattedData = data.map(item => ({
      time: formatDate(item[xField]),
      value: item[yField]
    }))

    // Definir dados para a série
    lineSeries.setData(formattedData)

    // Ajustar visualização
    chart.timeScale().fitContent()

    // Tooltip personalizado
    if (tooltip) {
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.display = 'none'
      container.style.padding = '8px'
      container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'
      container.style.backgroundColor = 'white'
      container.style.borderRadius = '4px'
      container.style.fontSize = '12px'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '1000'
      container.style.border = '1px solid rgba(229, 231, 235, 1)'
      chartContainerRef.current.appendChild(container)

      chart.subscribeCrosshairMove(param => {
        if (!param.time || param.point === undefined) {
          container.style.display = 'none'
          return
        }

        const dateStr = new Date(param.time * 1000).toISOString().split('T')[0]
        const dataPoint = data.find(d => typeof d[xField] === 'string' && d[xField].includes(dateStr))

        if (dataPoint) {
          const value = dataPoint[yField] as number

          // Formatar o valor para melhor exibição (ex: 1.2M, 450K, etc)
          const formattedValue = value >= 1000000
            ? `$${(value / 1000000).toFixed(1)}M`
            : value >= 1000
              ? `$${(value / 1000).toFixed(1)}K`
              : `$${value.toFixed(2)}`

          // Exibir data formatada e valor
          container.innerHTML = `
            <div style={{fontWeight: "500"}}>${format(new Date(dataPoint[xField]), 'dd/MM/yyyy', { locale: ptBR })}</div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}>
              <span style={{color: "#6b7280"}}>Volume:</span>
              <span style={{fontWeight: "500", color: "${color}"}}>${formattedValue}</span>
            </div>
          `

          container.style.display = 'block'
          const coordinate = lineSeries.priceToCoordinate(value)

          // Posicionar tooltip
          let left = param.point.x + 20
          if (left > chartContainerRef.current.clientWidth - container.clientWidth) {
            left = param.point.x - container.clientWidth - 20
          }

          container.style.left = `${left}px`
          container.style.top = `${coordinate - container.clientHeight / 2}px`
        } else {
          container.style.display = 'none'
        }
      })
    }

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, xField, yField, height, color, tooltip])

  return <div ref={chartContainerRef} className="w-full" />
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xField,
  series,
  height = 300,
  tooltip = true
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0 || !series || series.length === 0) return

    // Limpar o conteúdo do container
    chartContainerRef.current.innerHTML = ''

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(107, 114, 128, 1)',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
        horzLines: { color: 'rgba(229, 231, 235, 0.5)', style: LineStyle.Dotted },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(229, 231, 235, 0.5)',
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    })

    // Adicionar séries de barras
    const histogramSeries = series.map(serie => {
      const seriesInstance = chart.addSeries(HistogramSeries, {
        color: serie.color,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'right',
      })

      // Formatar os dados para cada série
      const formattedData = data.map(item => ({
        time: formatDate(item[xField]),
        value: item[serie.value],
      }))

      // Definir dados para a série
      seriesInstance.setData(formattedData)

      return {
        name: serie.name,
        color: serie.color,
        series: seriesInstance
      }
    })

    // Ajustar visualização
    chart.timeScale().fitContent()

    // Tooltip personalizado
    if (tooltip) {
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.display = 'none'
      container.style.padding = '8px'
      container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'
      container.style.backgroundColor = 'white'
      container.style.borderRadius = '4px'
      container.style.fontSize = '12px'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '1000'
      container.style.border = '1px solid rgba(229, 231, 235, 1)'
      chartContainerRef.current.appendChild(container)

      // Legenda
      const legendContainer = document.createElement('div')
      legendContainer.style.display = 'flex'
      legendContainer.style.justifyContent = 'center'
      legendContainer.style.gap = '16px'
      legendContainer.style.marginTop = '12px'

      for (const serie of series) {
        const legendItem = document.createElement('div')
        legendItem.style.display = 'flex'
        legendItem.style.alignItems = 'center'
        legendItem.style.gap = '4px'

        const colorBox = document.createElement('div')
        colorBox.style.width = '12px'
        colorBox.style.height = '12px'
        colorBox.style.backgroundColor = serie.color
        colorBox.style.borderRadius = '2px'

        const legendText = document.createElement('span')
        legendText.innerText = serie.name
        legendText.style.fontSize = '12px'
        legendText.style.color = 'rgba(107, 114, 128, 1)'

        legendItem.appendChild(colorBox)
        legendItem.appendChild(legendText)
        legendContainer.appendChild(legendItem)
      }

      chartContainerRef.current.appendChild(legendContainer)

      chart.subscribeCrosshairMove(param => {
        if (!param.time || param.point === undefined) {
          container.style.display = 'none'
          return
        }

        const dateStr = new Date(param.time * 1000).toISOString().split('T')[0]
        const dataPoint = data.find(d => typeof d[xField] === 'string' && d[xField].includes(dateStr))

        if (dataPoint) {
          let tooltipContent = `
            <div style={{fontWeight: "500", marginBottom: "4px"}}>${format(new Date(dataPoint[xField]), 'dd/MM/yyyy', { locale: ptBR })}</div>
          `

          // Adicionar cada série no tooltip
          for (const serie of series) {
            const value = dataPoint[serie.value] as number
            const formattedValue = value >= 1000000
              ? `$${(value / 1000000).toFixed(1)}M`
              : value >= 1000
                ? `$${(value / 1000).toFixed(1)}K`
                : `$${value.toFixed(2)}`

            tooltipContent += `
              <div style={{display: "flex", justifyContent: "space-between", marginTop: "2px"}}>
                <span style={{color: "#6b7280", marginRight: "12px"}}>${serie.name}:</span>
                <span style={{fontWeight: "500", color: "${serie.color}"}}>${formattedValue}</span>
              </div>
            `
          }

          // Adicionar total se houver
          if (dataPoint.totalRevenue) {
            const total = dataPoint.totalRevenue as number
            const formattedTotal = total >= 1000000
              ? `$${(total / 1000000).toFixed(1)}M`
              : total >= 1000
                ? `$${(total / 1000).toFixed(1)}K`
                : `$${total.toFixed(2)}`

            tooltipContent += `
              <div style={{display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "4px", borderTop: "1px dashed #e5e7eb"}}>
                <span style={{color: "#6b7280", fontWeight: "500"}}>Total:</span>
                <span style={{fontWeight: "600", color: "#111827"}}>${formattedTotal}</span>
              </div>
            `
          }

          container.innerHTML = tooltipContent
          container.style.display = 'block'

          // Posicionar tooltip
          let left = param.point.x + 20
          if (left > chartContainerRef.current.clientWidth - container.clientWidth) {
            left = param.point.x - container.clientWidth - 20
          }

          container.style.left = `${left}px`
          container.style.top = `${param.point.y - container.clientHeight / 2}px`
        } else {
          container.style.display = 'none'
        }
      })
    }

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, xField, series, height, tooltip])

  return <div ref={chartContainerRef} className="w-full" />
}