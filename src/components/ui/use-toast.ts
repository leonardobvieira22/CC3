// Este arquivo serve como um redirecionamento para o toast da biblioteca sonner
// Mantivemos para compatibilidade com código existente

import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
  action?: React.ReactNode
}

export const useToast = () => {
  const toast = (props: ToastProps) => {
    const { title, description, variant, duration = 5000 } = props

    if (variant === 'destructive') {
      return sonnerToast.error(title, { description, duration })
    }

    return sonnerToast(title, { description, duration })
  }

  toast.success = (title: string, options?: Omit<ToastProps, 'variant' | 'title'>) => {
    return sonnerToast.success(title, options)
  }

  toast.error = (title: string, options?: Omit<ToastProps, 'variant' | 'title'>) => {
    return sonnerToast.error(title, options)
  }

  toast.warning = (title: string, options?: Omit<ToastProps, 'variant' | 'title'>) => {
    return sonnerToast.warning(title, options)
  }

  toast.info = (title: string, options?: Omit<ToastProps, 'variant' | 'title'>) => {
    return sonnerToast.info(title, options)
  }

  return { toast }
}
