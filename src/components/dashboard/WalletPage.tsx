"use client"

import { useState } from "react"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  BarChart3,
  Layers,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Download,
  InfoIcon,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// Tipos para as criptomoedas
type Crypto = {
  symbol: string
  name: string
  balance: number
  price: number
  change24h: number
  value: number
  allocation: number
  icon: string
}

// Tipos para os depósitos/saques
type Transaction = {
  id: string
  type: "deposit" | "withdrawal"
  status: "completed" | "pending" | "failed"
  amount: number
  fee: number
  timestamp: Date
  txid?: string
}

// Dados simulados
const generateCryptoData = (): Crypto[] => {
  return [
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: 0.082,
      price: 46521.34,
      change24h: 2.45,
      value: 0.082 * 46521.34,
      allocation: 62.3,
      icon: "🟠"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: 1.24,
      price: 2453.87,
      change24h: -1.18,
      value: 1.24 * 2453.87,
      allocation: 25.1,
      icon: "🔷"
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: 1580.43,
      price: 1.00,
      change24h: 0.01,
      value: 1580.43,
      allocation: 9.2,
      icon: "🟢"
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      balance: 0.92,
      price: 432.65,
      change24h: 1.67,
      value: 0.92 * 432.65,
      allocation: 3.4,
      icon: "🟡"
    }
  ]
}

const generateTransactionHistory = (): Transaction[] => {
  // Histórico de depósitos e saques simulados
  const transactions: Transaction[] = []

  // Data atual
  const now = new Date()

  // Gerar 15 transações nos últimos 30 dias
  for (let i = 0; i < 15; i++) {
    const date = new Date()
    date.setDate(now.getDate() - Math.floor(Math.random() * 30))

    const type = Math.random() > 0.4 ? "deposit" : "withdrawal"
    const amount = type === "deposit"
      ? Math.round(Math.random() * 5000 + 100)
      : Math.round(Math.random() * 2000 + 50)

    const fee = type === "withdrawal" ? Math.round(amount * 0.001 * 100) / 100 : 0

    const status = i < 12 ? "completed" : (i === 12 ? "failed" : "pending")

    transactions.push({
      id: `TX${100000 + i}`,
      type,
      status,
      amount,
      fee,
      timestamp: date,
      txid: status === "completed" ? `0x${Math.random().toString(16).substring(2, 12)}` : undefined
    })
  }

  // Ordenar por data (mais recente primeiro)
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function WalletPage() {
  const [cryptos] = useState(generateCryptoData())
  const [transactions] = useState(generateTransactionHistory())
  const [isHidingBalances, setIsHidingBalances] = useState(false)
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)

  // Calcular saldo total
  const totalBalance = cryptos.reduce((acc, crypto) => acc + crypto.value, 0)

  // Limitar números decimais
  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return `$${formatNumber(value)}`
  }

  // Formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Simular depósito
  const handleDeposit = () => {
    toast.success("Depósito processado com sucesso")
    setDepositDialogOpen(false)
  }

  // Simular saque
  const handleWithdraw = () => {
    toast.success("Solicitação de saque enviada com sucesso")
    setWithdrawDialogOpen(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Carteira</h2>
          <p className="text-muted-foreground">
            Gerencie seus fundos e acompanhe seu portfólio
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setIsHidingBalances(!isHidingBalances)}>
            {isHidingBalances ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Mostrar Saldos
              </>
            ) : (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Ocultar Saldos
              </>
            )}
          </Button>
          <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Depositar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Depositar Fundos</DialogTitle>
                <DialogDescription>
                  Adicione fundos à sua conta para começar a operar
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="crypto" className="text-sm font-medium">Criptomoeda</label>
                  <Select defaultValue="BTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma criptomoeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptos.map(crypto => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol}>
                          <span className="flex items-center">
                            <span className="mr-2">{crypto.icon}</span>
                            {crypto.name} ({crypto.symbol})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="amount" className="text-sm font-medium">Valor</label>
                  <div className="relative">
                    <Input
                      id="amount"
                      placeholder="0.00"
                      className="pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Instruções de depósito</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Como sua conta está integrada à Binance, para depositar fundos:
                  </p>
                  <ol className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-decimal pl-5 space-y-1">
                    <li>Acesse sua conta da Binance</li>
                    <li>Realize um depósito na moeda desejada</li>
                    <li>Os fundos ficarão automaticamente disponíveis na nossa plataforma</li>
                  </ol>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleDeposit}>
                  Abrir Binance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Minus className="h-4 w-4 mr-2" />
                Sacar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sacar Fundos</DialogTitle>
                <DialogDescription>
                  Retire fundos da sua conta para sua carteira externa
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="crypto-withdraw" className="text-sm font-medium">Criptomoeda</label>
                  <Select defaultValue="BTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma criptomoeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptos.map(crypto => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol}>
                          <span className="flex items-center">
                            <span className="mr-2">{crypto.icon}</span>
                            {crypto.name} ({crypto.symbol}) - {isHidingBalances ? "****" : formatNumber(crypto.balance, 8)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="amount-withdraw" className="text-sm font-medium">Valor</label>
                  <div className="relative">
                    <Input
                      id="amount-withdraw"
                      placeholder="0.00"
                      className="pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Disponível: {isHidingBalances ? "****" : "$15,234.12"}</span>
                    <button className="text-blue-500 hover:underline">Máximo</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="address" className="text-sm font-medium">Endereço de destino</label>
                  <Input
                    id="address"
                    placeholder="Informe o endereço da carteira de destino"
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Informações importantes</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                    <li>Taxa de saque: 0.0005 BTC (aproximadamente $23.25)</li>
                    <li>Tempo estimado: 30-60 minutos</li>
                    <li>Verifique duas vezes o endereço antes de confirmar</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleWithdraw}>
                  Confirmar Saque
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Card de saldo total e alocação */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Saldo Total</CardTitle>
            <CardDescription>
              Valor total de ativos em sua carteira
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Valor estimado em USD</span>
                {isHidingBalances ? (
                  <span className="text-3xl font-bold">*****</span>
                ) : (
                  <span className="text-3xl font-bold">{formatCurrency(totalBalance)}</span>
                )}
              </div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+$342.18 (2.3%) hoje</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Alocação por criptomoeda</span>
                <span className="text-sm text-muted-foreground">% do portfólio</span>
              </div>
              {cryptos.map((crypto) => (
                <div key={crypto.symbol} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{crypto.icon}</span>
                      <span>{crypto.name} ({crypto.symbol})</span>
                    </div>
                    <span>{crypto.allocation.toFixed(1)}%</span>
                  </div>
                  <Progress value={crypto.allocation} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Distribuição de Ativos</CardTitle>
            <CardDescription>
              Total de criptomoedas em sua carteira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>24h</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptos.map((crypto) => (
                    <TableRow key={crypto.symbol}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crypto.icon}</span>
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(crypto.price)}</TableCell>
                      <TableCell>
                        <div className={crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                          <div className="flex items-center">
                            {crypto.change24h >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(crypto.change24h).toFixed(2)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isHidingBalances
                          ? "*****"
                          : formatNumber(crypto.balance, crypto.symbol === "USDT" ? 2 : 8)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {isHidingBalances
                          ? "*****"
                          : formatCurrency(crypto.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Transações */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="deposits">Depósitos</TabsTrigger>
          <TabsTrigger value="withdrawals">Saques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Histórico de depósitos e saques
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Taxa</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div>
                                {transaction.id}
                                {transaction.txid && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <a
                                          href="#"
                                          className="block text-xs text-blue-500 hover:underline"
                                          onClick={(e) => e.preventDefault()}
                                        >
                                          {transaction.txid}
                                        </a>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>ID da transação na blockchain</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={transaction.type === "deposit"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              }
                              variant="outline"
                            >
                              <span className="capitalize">
                                {transaction.type === "deposit" ? "Depósito" : "Saque"}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.fee > 0 ? formatCurrency(transaction.fee) : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              }
                              variant="outline"
                            >
                              <span className="capitalize">
                                {transaction.status === "completed" ? "Concluído" :
                                  transaction.status === "pending" ? "Pendente" : "Falhou"}
                              </span>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-4">
                    <Layers className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Você ainda não realizou nenhum depósito ou saque. Comece adicionando fundos à sua conta.
                  </p>
                </div>
              )}

              {transactions.length > 5 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando 1-5 de {transactions.length} transações
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas as transações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Depósitos</CardTitle>
              <CardDescription>
                Todos os depósitos realizados na sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === "deposit").length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter(t => t.type === "deposit")
                        .map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <div>
                                {transaction.id}
                                {transaction.txid && (
                                  <a
                                    href="#"
                                    className="block text-xs text-blue-500 hover:underline"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    {transaction.txid}
                                  </a>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                    : transaction.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                }
                                variant="outline"
                              >
                                <span className="capitalize">
                                  {transaction.status === "completed" ? "Concluído" :
                                    transaction.status === "pending" ? "Pendente" : "Falhou"}
                                </span>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-4">
                    <ArrowUpRight className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Sem depósitos</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Você ainda não realizou nenhum depósito. Adicione fundos para começar a operar.
                  </p>
                  <Button onClick={() => setDepositDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Depositar agora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Saques</CardTitle>
              <CardDescription>
                Todos os saques realizados da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.filter(t => t.type === "withdrawal").length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Taxa</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter(t => t.type === "withdrawal")
                        .map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <div>
                                {transaction.id}
                                {transaction.txid && (
                                  <a
                                    href="#"
                                    className="block text-xs text-blue-500 hover:underline"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    {transaction.txid}
                                  </a>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(transaction.fee)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                    : transaction.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                }
                                variant="outline"
                              >
                                <span className="capitalize">
                                  {transaction.status === "completed" ? "Concluído" :
                                    transaction.status === "pending" ? "Pendente" : "Falhou"}
                                </span>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-4">
                    <ArrowDownRight className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Sem saques</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Você ainda não realizou nenhum saque. Você pode sacar seus fundos a qualquer momento.
                  </p>
                  <Button variant="outline" onClick={() => setWithdrawDialogOpen(true)}>
                    <Minus className="h-4 w-4 mr-2" />
                    Sacar agora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informações da Carteira */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Segurança</CardTitle>
          <CardDescription>
            Detalhes sobre a segurança dos seus fundos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Segurança de Fundos</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Seus fundos permanecem em sua conta Binance</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Nossa plataforma nunca tem acesso às suas chaves de saque</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Todas as chaves API são criptografadas com AES-256</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Status da Integração</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Conexão com Binance</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Ativa
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Sincronização de saldo</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Sincronizado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Permissões de API</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Leitura e Trading
                  </Badge>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
