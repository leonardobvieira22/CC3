"use client"

import { create } from 'zustand'
import { toast } from 'sonner'

// Tipos para as notificações
export type NotificationLevel = 'info' | 'success' | 'warning' | 'error'

export type Notification = {
  id: string
  title: string
  message: string
  level: NotificationLevel
  timestamp: number
  read: boolean
  link?: string
  data?: NotificationData
}

export type NotificationData = {
  symbol?: string
  price?: number
  targetPrice?: number
}

export type PriceAlert = {
  id: string
  symbol: string
  targetPrice: number
  direction: 'above' | 'below'
  active: boolean
  notifyVia: ('app' | 'email' | 'push')[]
  createdAt: number
  triggered?: boolean
  triggeredAt?: number
}

// Interface para o serviço de notificações
export interface NotificationStore {
  notifications: Notification[]
  priceAlerts: PriceAlert[]
  unreadCount: number

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void

  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered' | 'triggeredAt'>) => string
  removePriceAlert: (id: string) => void
  togglePriceAlert: (id: string, active: boolean) => void
  checkPriceAlerts: (symbol: string, price: number) => void
}

// Gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 15)

// Store para notificações
export const useNotificationStore = create<NotificationStore>((set, get) => {
  // Carregar notificações do localStorage quando disponível
  let savedNotifications: Notification[] = []
  let savedPriceAlerts: PriceAlert[] = []

  if (typeof window !== 'undefined') {
    try {
      const notificationsJson = localStorage.getItem('notifications')
      if (notificationsJson) {
        savedNotifications = JSON.parse(notificationsJson)
      }

      const priceAlertsJson = localStorage.getItem('priceAlerts')
      if (priceAlertsJson) {
        savedPriceAlerts = JSON.parse(priceAlertsJson)
      }
    } catch (e) {
      console.error('Erro ao carregar notificações do localStorage:', e)
    }
  }

  return {
    notifications: savedNotifications,
    priceAlerts: savedPriceAlerts,
    unreadCount: savedNotifications.filter(n => !n.read).length,

    addNotification: (notification) => {
      const newNotification: Notification = {
        id: generateId(),
        timestamp: Date.now(),
        read: false,
        ...notification
      }

      set(state => {
        const updatedNotifications = [newNotification, ...state.notifications]

        // Limitar a 100 notificações para não sobrecarregar o localStorage
        if (updatedNotifications.length > 100) {
          updatedNotifications.pop()
        }

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
        }

        return {
          notifications: updatedNotifications,
          unreadCount: state.unreadCount + 1
        }
      })

      // Mostrar toast para notificação
      switch (notification.level) {
        case 'success':
          toast.success(notification.title, { description: notification.message })
          break
        case 'warning':
          toast.warning(notification.title, { description: notification.message })
          break
        case 'error':
          toast.error(notification.title, { description: notification.message })
          break
        default:
          toast(notification.title, { description: notification.message })
      }

      // Se browser suporta notificações nativas, também enviar uma
      if (typeof window !== 'undefined' && 'Notification' in window) {
        // Verificar permissão
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          })
        }
        // Solicitar permissão se ainda não decidido
        else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico'
              })
            }
          })
        }
      }

      return newNotification.id
    },

    markAsRead: (id) => {
      set(state => {
        const updatedNotifications = state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
        }

        return {
          notifications: updatedNotifications,
          unreadCount: updatedNotifications.filter(n => !n.read).length
        }
      })
    },

    markAllAsRead: () => {
      set(state => {
        const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }))

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
        }

        return {
          notifications: updatedNotifications,
          unreadCount: 0
        }
      })
    },

    removeNotification: (id) => {
      set(state => {
        const updatedNotifications = state.notifications.filter(n => n.id !== id)
        const wasUnread = state.notifications.find(n => n.id === id)?.read === false

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
        }

        return {
          notifications: updatedNotifications,
          unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
        }
      })
    },

    clearAllNotifications: () => {
      set(() => {
        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('notifications', JSON.stringify([]))
        }

        return {
          notifications: [],
          unreadCount: 0
        }
      })
    },

    addPriceAlert: (alert) => {
      const newAlert: PriceAlert = {
        id: generateId(),
        createdAt: Date.now(),
        ...alert
      }

      set(state => {
        const updatedAlerts = [...state.priceAlerts, newAlert]

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
        }

        return { priceAlerts: updatedAlerts }
      })

      // Notificar que o alerta foi criado
      get().addNotification({
        title: 'Alerta de preço criado',
        message: `Você será notificado quando ${alert.symbol} ficar ${alert.direction === 'above' ? 'acima' : 'abaixo'} de $${alert.targetPrice}`,
        level: 'info'
      })

      return newAlert.id
    },

    removePriceAlert: (id) => {
      const alertToRemove = get().priceAlerts.find(a => a.id === id)

      set(state => {
        const updatedAlerts = state.priceAlerts.filter(a => a.id !== id)

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
        }

        return { priceAlerts: updatedAlerts }
      })

      if (alertToRemove) {
        // Notificar que o alerta foi removido
        get().addNotification({
          title: 'Alerta de preço removido',
          message: `O alerta para ${alertToRemove.symbol} a $${alertToRemove.targetPrice} foi removido`,
          level: 'info'
        })
      }
    },

    togglePriceAlert: (id, active) => {
      set(state => {
        const updatedAlerts = state.priceAlerts.map(a =>
          a.id === id ? { ...a, active } : a
        )

        // Persistir no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
        }

        return { priceAlerts: updatedAlerts }
      })

      const alert = get().priceAlerts.find(a => a.id === id)
      if (alert) {
        // Notificar a mudança de estado
        get().addNotification({
          title: active ? 'Alerta de preço ativado' : 'Alerta de preço desativado',
          message: `O alerta para ${alert.symbol} a $${alert.targetPrice} foi ${active ? 'ativado' : 'desativado'}`,
          level: 'info'
        })
      }
    },

    checkPriceAlerts: (symbol, price) => {
      const matchingAlerts = get().priceAlerts.filter(
        alert => alert.symbol === symbol &&
                 alert.active &&
                 !alert.triggered &&
                 ((alert.direction === 'above' && price >= alert.targetPrice) ||
                  (alert.direction === 'below' && price <= alert.targetPrice))
      )

      if (matchingAlerts.length > 0) {
        // Marcar alertas como disparados
        set(state => {
          const updatedAlerts = state.priceAlerts.map(alert => {
            if (matchingAlerts.some(a => a.id === alert.id)) {
              return {
                ...alert,
                triggered: true,
                triggeredAt: Date.now()
              }
            }
            return alert
          })

          // Persistir no localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts))
          }

          return { priceAlerts: updatedAlerts }
        })

        // Notificar o usuário sobre cada alerta disparado
        matchingAlerts.forEach(alert => {
          get().addNotification({
            title: '🔔 Alerta de preço atingido!',
            message: `${symbol} está ${alert.direction === 'above' ? 'acima' : 'abaixo'} de $${alert.targetPrice} (atual: $${price.toFixed(2)})`,
            level: 'warning',
            data: { symbol, price, targetPrice: alert.targetPrice }
          })
        })
      }
    }
  }
})

// Componente de notificação push para integração com ServiceWorker (se necessário)
export const setupPushNotifications = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false
  }

  try {
    // Verificar se a permissão já foi concedida, mas não solicitar automaticamente
    if (Notification.permission === 'granted') {
      // Registrar Service Worker
      const registration = await navigator.serviceWorker.register('/service-worker.js')

      // Obter assinatura push existente ou criar uma nova
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        // Aqui seria criada uma nova assinatura e enviada para o backend
        // para armazenar e usar posteriormente para enviar notificações
        // Simplificando para este exemplo
        return true
      }

      return true
    } else {
      // Permissão não concedida, mas não solicitar automaticamente
      console.log('Permissão para notificações ainda não concedida')
      return false
    }
  } catch (error) {
    console.error('Erro ao configurar notificações push:', error)
    return false
  }
}
