"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fallbackSrc?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Componente de imagem otimizado com suporte a:
 * - Lazy loading automático (exceto quando priority=true)
 * - Melhorias de acessibilidade
 * - Placeholder durante o carregamento
 * - Imagem de fallback para erros
 * - Animação de fade-in
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  fallbackSrc = '/images/image-placeholder.svg',
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Reset estado quando a src muda
  useEffect(() => {
    setLoading(!priority)
    setError(false)
    setImageSrc(src)
  }, [src, priority])

  // Handlers para eventos de imagem
  const handleLoad = () => {
    setLoading(false)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setError(true)
    setImageSrc(fallbackSrc)
    if (onError) onError()
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className
      )}
      aria-busy={loading}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%'
      }}
    >
      {/* Placeholder/shimmer durante o carregamento */}
      {loading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          objectFit === 'contain' && "object-contain",
          objectFit === 'cover' && "object-cover",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down",
        )}
        style={{ objectPosition }}
        // Melhorias de acessibilidade
        aria-hidden={alt === ''} // Imagens decorativas
        decoding="async" // Melhora de performance
        fetchPriority={priority ? 'high' : 'auto'}
        // Com o plugin sizes responsivo
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Mensagem de erro para leitores de tela */}
      {error && alt !== '' && (
        <span className="sr-only">
          A imagem {alt} não pôde ser carregada.
        </span>
      )}
    </div>
  )
}

/**
 * Componente decorativo de imagem (sem valor semântico)
 * Usado para imagens de fundo, ícones decorativos, etc.
 */
export function DecorativeImage(props: Omit<OptimizedImageProps, 'alt'>) {
  return <OptimizedImage {...props} alt="" />
}

/**
 * Componente de avatar otimizado
 */
export function Avatar({
  name,
  src,
  size = 40,
  className,
  ...props
}: {
  name: string
  src?: string
  size?: number
  className?: string
} & Omit<OptimizedImageProps, 'alt' | 'width' | 'height' | 'src'>) {
  // Gera iniciais para o fallback
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center bg-muted text-muted-foreground font-medium",
        className
      )}
      style={{ width: size, height: size }}
      aria-label={`Avatar de ${name}`}
    >
      {/* Fallback com iniciais */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: size * 0.4 }}>{initials}</span>
      </div>

      {/* Imagem do avatar */}
      {src && (
        <OptimizedImage
          src={src}
          alt={`Foto de ${name}`}
          width={size}
          height={size}
          objectFit="cover"
          className="w-full h-full"
          {...props}
        />
      )}
    </div>
  )
}

export default OptimizedImage
