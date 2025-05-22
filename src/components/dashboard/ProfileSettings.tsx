"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Lock,
  Shield,
  Bell,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useBinance } from "@/lib/context/BinanceContext"

export default function ProfileSettings() {
  const { isConnected, isConnecting, connectBinance, disconnectBinance } = useBinance()
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error("Preencha a chave e o secret da API")
      return
    }

    setConnecting(true)
    try {
      const success = await connectBinance(apiKey, apiSecret)
      if (success) {
        toast.success("Conectado com sucesso à Binance")
        // Limpar campos por segurança
        setApiKey("")
        setApiSecret("")
      } else {
        toast.error("Erro ao conectar. Verifique as credenciais.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro ao conectar com a Binance")
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnectBinance()
    toast.success("Desconectado da Binance com sucesso")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas configurações de perfil, segurança e integrações
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="João Silva" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao.silva@email.com" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+55 (11) 98765-4321" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Conte um pouco sobre você..."
                  defaultValue="Trader experiente com foco em criptomoedas desde 2017. Especialista em análise técnica e automatização de estratégias."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={() => toast.success("Perfil atualizado com sucesso!")}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Autenticação de Dois Fatores</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base">Autenticação por App</Label>
                      <p className="text-sm text-muted-foreground">
                        Use um aplicativo de autenticação como Google Authenticator ou Authy
                      </p>
                    </div>
                    <Switch id="2fa-app" defaultChecked />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base">Autenticação por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba códigos de verificação via SMS
                      </p>
                    </div>
                    <Switch id="2fa-sms" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-base">Autenticação por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba códigos de verificação via email
                      </p>
                    </div>
                    <Switch id="2fa-email" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Dispositivos Conectados</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Windows PC - Chrome</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil (Este dispositivo)</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Ativo
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">iPhone 13 - Safari</p>
                      <p className="text-sm text-muted-foreground">São Paulo, Brasil • Última conexão: 2 horas atrás</p>
                    </div>
                    <Button variant="outline" size="sm">Desconectar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={() => toast.success("Configurações de segurança atualizadas!")}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Gerencie suas conexões com corretoras e serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Binance</h3>

                {isConnected ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/30">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <h4 className="font-medium text-green-800 dark:text-green-300">Conectado à Binance</h4>
                    </div>
                    <p className="text-sm mt-1 text-green-700 dark:text-green-400">
                      Sua conta está conectada e pronta para operar.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300"
                      onClick={handleDisconnect}
                    >
                      Desconectar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="binance-api-key">Chave da API</Label>
                      <Input
                        id="binance-api-key"
                        placeholder="Digite sua chave da API da Binance"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="binance-api-secret">Secret da API</Label>
                      <Input
                        id="binance-api-secret"
                        type="password"
                        placeholder="Digite seu secret da API da Binance"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Como gerar uma chave API na Binance
                      </h4>
                      <ol className="mt-2 ml-6 text-sm text-gray-600 dark:text-gray-300 list-decimal">
                        <li>Faça login na sua conta da Binance</li>
                        <li>Acesse Dashboard &gt; Gerenciamento de API</li>
                        <li>Crie uma nova chave API</li>
                        <li>Habilite apenas permissões de leitura e trading (não habilite saques)</li>
                        <li>Copie a chave e o secret e cole aqui</li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleConnect}
                      disabled={connecting}
                      className="w-full"
                    >
                      {connecting ? "Conectando..." : "Conectar Binance"}
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Google</h3>
                    <p className="text-sm text-muted-foreground">
                      Para login e importação de dados
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Microsoft</h3>
                    <p className="text-sm text-muted-foreground">
                      Para login e importação de dados
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Conectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando você deseja ser notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canais de notificação</h3>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações por email
                    </p>
                  </div>
                  <Switch id="notify-email" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações push no navegador
                    </p>
                  </div>
                  <Switch id="notify-push" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações por SMS
                    </p>
                  </div>
                  <Switch id="notify-sms" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de notificação</h3>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Novas operações</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando um robô iniciar uma nova operação
                    </p>
                  </div>
                  <Switch id="notify-new-trades" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Operações finalizadas</Label>
                    <p className="text-sm text-muted-foreground">
                      Quando uma operação for finalizada (com lucro ou prejuízo)
                    </p>
                  </div>
                  <Switch id="notify-closed-trades" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Status dos robôs</Label>
                    <p className="text-sm text-muted-foreground">
                      Mudanças no status dos robôs (ativação, pausa, etc.)
                    </p>
                  </div>
                  <Switch id="notify-robot-status" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Relatórios semanais</Label>
                    <p className="text-sm text-muted-foreground">
                      Resumo semanal de desempenho
                    </p>
                  </div>
                  <Switch id="notify-weekly-reports" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base">Notícias e atualizações</Label>
                    <p className="text-sm text-muted-foreground">
                      Novidades sobre a plataforma e mercado
                    </p>
                  </div>
                  <Switch id="notify-news" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={() => toast.success("Configurações de notificação atualizadas!")}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
