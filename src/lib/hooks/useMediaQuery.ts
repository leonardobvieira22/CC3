'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para verificar se um media query corresponde ao viewport atual
 * @param query Media query para verificar (ex: '(max-width: 768px)')
 * @returns Boolean indicando se o media query corresponde
 */
export function useMediaQuery(query: string): boolean {
  // Verificar se estamos no ambiente do cliente (browser)
  const isClient = typeof window === 'object'

  // Estado para armazenar se o media query corresponde ou não
  const [matches, setMatches] = useState<boolean>(() => {
    // No SSR, retornar false por padrão
    if (!isClient) return false
    // No cliente, verificar imediatamente
    return window.matchMedia(query).matches
  })

  // Efeito para atualizar o estado quando o viewport mudar
  useEffect(() => {
    if (!isClient) return

    // Criar o objeto media query
    const mediaQuery = window.matchMedia(query)

    // Definir o estado inicial baseado no media query
    setMatches(mediaQuery.matches)

    // Criar o listener para atualizar o estado quando o viewport mudar
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)

    // Adicionar o listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(handler)
    }

    // Limpar o listener quando o componente for desmontado
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler)
      } else {
        // Fallback para navegadores antigos
        mediaQuery.removeListener(handler)
      }
    }
  }, [query, isClient])

  return matches
}

/**
 * Breakpoints comuns para uso rápido
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  // Breakpoints móveis
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  // Orientação
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
}
