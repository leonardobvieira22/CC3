"use client"

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/lib/services/notificationService'
import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'

export default function NotificationsMenu() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotificationStore()

  // Formatar a data relativa
  const formatRelativeTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: pt
    })
  }

  // Obter ícone com base no nível da notificação
  const getIcon = (level: 'info' | 'success' | 'warning' | 'error') => {
    switch (level) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  // Estado para armazenar a permissão de notificações
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | 'default'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  // Atualizar o estado quando a permissão mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsPermission(Notification.permission)
    }
  }, [])

  // Solicitar permissão de notificações a partir da interação do usuário
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationsPermission(permission)
      } catch (error) {
        console.error('Erro ao solicitar permissão de notificações:', error)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          <div className="flex items-center gap-2">
            {notificationsPermission !== 'granted' && (
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
                className="text-xs h-auto py-1"
              >
                Permitir notificações
              </Button>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-auto py-1"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-4 px-2 text-center text-muted-foreground">
            <p>Você não tem notificações</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/10'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-2">
                  <div className="text-lg">{getIcon(notification.level)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Ver detalhes
                      </a>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 10 && (
              <DropdownMenuItem className="p-2 text-center">
                <Button variant="link" className="text-xs w-full">
                  Ver todas as notificações ({notifications.length})
                </Button>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
