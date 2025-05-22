'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkipLinkProps {
  contentId?: string
  className?: string
  label?: string
}

/**
 * Componente para melhorar a acessibilidade por teclado
 * Permite que usuários de teclado pulem para o conteúdo principal
 * sem precisar navegar por todos os links do menu
 */
export function SkipLink({
  contentId = 'main-content',
  className,
  label = 'Pular para o conteúdo'
}: SkipLinkProps) {
  return (
    <a
      href={`#${contentId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:bg-background focus:text-foreground focus:p-4 focus:border-2 focus:border-primary',
        'focus:shadow-md focus:outline-none focus:rounded-md',
        className
      )}
    >
      {label}
    </a>
  )
}

export default SkipLink
