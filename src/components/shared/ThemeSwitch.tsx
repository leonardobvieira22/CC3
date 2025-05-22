'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ThemeSwitchProps {
  className?: string
  compact?: boolean
}

export function ThemeSwitch({ className, compact = false }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Para evitar erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Alterna entre os temas
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  // Componente compacto (apenas ícone)
  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn('relative rounded-full', className)}
        aria-label={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
      >
        <div className="relative w-5 h-5">
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={{
              opacity: theme === 'dark' ? 0 : 1,
              rotate: theme === 'dark' ? -90 : 0,
              scale: theme === 'dark' ? 0.5 : 1
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Sun className="w-5 h-5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, rotate: 90 }}
            animate={{
              opacity: theme === 'dark' ? 1 : 0,
              rotate: theme === 'dark' ? 0 : 90,
              scale: theme === 'dark' ? 1 : 0.5
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        </div>
      </Button>
    )
  }

  // Componente completo com texto
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn('flex items-center gap-2 h-9 px-3', className)}
      aria-label={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: theme === 'dark' ? 0 : 1,
            scale: theme === 'dark' ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5" />
        </motion.div>
      </div>
      <span>
        {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
      </span>
    </Button>
  )
}

export default ThemeSwitch
