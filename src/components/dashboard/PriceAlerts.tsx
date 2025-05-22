"use client"

import { useState } from 'react'
import { type PriceAlert, useNotificationStore } from '@/lib/services/notificationService'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  BellRing,
  Trash2,
  AlertCircle,
  PlusCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function PriceAlerts() {
  // Estados locais
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [price, setPrice] = useState('')
  const [direction, setDirection] = useState<'above' | 'below'>('above')
  const [notifyVia, setNotifyVia] = useState<('app' | 'email' | 'push')[]>(['app'])

  // Store de notificações
  const {
    priceAlerts,
    addPriceAlert,
    removePriceAlert,
    togglePriceAlert
  } = useNotificationStore()

  // Lista de pares disponíveis
  const availablePairs = [
    { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)' },
    { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)' },
    { value: 'BNBUSDT', label: 'Binance Coin (BNB/USDT)' },
    { value: 'SOLUSDT', label: 'Solana (SOL/USDT)' },
    { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)' },
    { value: 'DOGEUSDT', label: 'Dogecoin (DOGE/USDT)' },
    { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)' },
  ]

  // Funções auxiliares
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleToggleNotifyVia = (method: 'app' | 'email' | 'push') => {
    setNotifyVia(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method)
      } else {
        return [...prev, method]
      }
    })
  }

  const handleAddAlert = () => {
    if (!price || isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0) {
      toast.error('Por favor, insira um preço válido')
      return
    }

    if (notifyVia.length === 0) {
      toast.error('Selecione pelo menos um método de notificação')
      return
    }

    addPriceAlert({
      symbol,
      targetPrice: Number.parseFloat(price),
      direction,
      active: true,
      notifyVia
    })

    // Limpar formulário
    setPrice('')
  }

  // Agrupar alertas por símbolo
  const alertsBySymbol: Record<string, PriceAlert[]> = {}
  priceAlerts.forEach(alert => {
    if (!alertsBySymbol[alert.symbol]) {
      alertsBySymbol[alert.symbol] = []
    }
    alertsBySymbol[alert.symbol].push(alert)
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alertas de Preço</h2>
          <p className="text-muted-foreground">
            Configure alertas para ser notificado sobre movimentos de preço
          </p>
        </div>
        <Button>
          <BellRing className="h-4 w-4 mr-2" />
          Testar Notificações
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Formulário para novo alerta */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Novo Alerta</CardTitle>
            <CardDescription>
              Crie um alerta para ser notificado quando o preço atingir um valor específico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Par de Moedas</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um par" />
                </SelectTrigger>
                <SelectContent>
                  {availablePairs.map(pair => (
                    <SelectItem key={pair.value} value={pair.value}>
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Condição</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className={`flex-1 ${direction === 'above' ? '' : 'bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground'}`}
                  onClick={() => setDirection('above')}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Acima de
                </Button>
                <Button
                  type="button"
                  className={`flex-1 ${direction === 'below' ? '' : 'bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground'}`}
                  onClick={() => setDirection('below')}
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Abaixo de
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (USDT)</Label>
              <Input
                id="price"
                type="number"
                step="0.000001"
                min="0"
                placeholder="Ex: 50000.00"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notificar via</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-app" className="text-base">Aplicativo</Label>
                    <p className="text-muted-foreground text-xs">
                      Receba notificações no aplicativo
                    </p>
                  </div>
                  <Switch
                    id="notify-app"
                    checked={notifyVia.includes('app')}
                    onCheckedChange={() => handleToggleNotifyVia('app')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-email" className="text-base">Email</Label>
                    <p className="text-muted-foreground text-xs">
                      Receba notificações por email
                    </p>
                  </div>
                  <Switch
                    id="notify-email"
                    checked={notifyVia.includes('email')}
                    onCheckedChange={() => handleToggleNotifyVia('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-push" className="text-base">Push</Label>
                    <p className="text-muted-foreground text-xs">
                      Receba notificações push no navegador
                    </p>
                  </div>
                  <Switch
                    id="notify-push"
                    checked={notifyVia.includes('push')}
                    onCheckedChange={() => handleToggleNotifyVia('push')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAddAlert}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Alerta
            </Button>
          </CardFooter>
        </Card>

        {/* Lista de alertas existentes */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Alertas Ativos</CardTitle>
            <CardDescription>
              {priceAlerts.filter(a => a.active && !a.triggered).length} alertas ativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {priceAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">Nenhum alerta configurado</h3>
                <p className="text-muted-foreground">
                  Crie seu primeiro alerta para ser notificado sobre movimentos de preço.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(alertsBySymbol).map(([symbol, alerts]) => (
                  <div key={symbol} className="space-y-3">
                    <h3 className="font-medium text-lg flex items-center">
                      {symbol.replace('USDT', '/USDT')}
                      <Badge className="ml-2">{alerts.length}</Badge>
                    </h3>
                    <div className="space-y-2">
                      {alerts.map(alert => (
                        <div
                          key={alert.id}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            alert.triggered ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50' :
                            alert.active ? 'border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/20' :
                            'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center">
                              {alert.direction === 'above' ? (
                                <ArrowUpCircle className="h-4 w-4 mr-2 text-green-500" />
                              ) : (
                                <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
                              )}
                              <span className="font-medium">
                                {alert.direction === 'above' ? 'Acima de' : 'Abaixo de'} ${alert.targetPrice.toFixed(2)}
                              </span>
                              {alert.triggered && (
                                <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
                                  Disparado
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Criado em {formatDate(alert.createdAt)}
                              {alert.triggered && ` • Disparado em ${formatDate(alert.triggeredAt!)}`}
                            </p>
                            <div className="flex space-x-1 mt-1">
                              {alert.notifyVia.includes('app') && (
                                <Badge variant="secondary" className="text-xs">App</Badge>
                              )}
                              {alert.notifyVia.includes('email') && (
                                <Badge variant="secondary" className="text-xs">Email</Badge>
                              )}
                              {alert.notifyVia.includes('push') && (
                                <Badge variant="secondary" className="text-xs">Push</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!alert.triggered && (
                              <Switch
                                checked={alert.active}
                                onCheckedChange={(checked) => togglePriceAlert(alert.id, checked)}
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePriceAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
