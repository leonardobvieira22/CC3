"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Download,
  Filter,
  ChevronDown,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Gerar dados fictícios para a tabela de histórico
const generateHistoryData = () => {
  const types = ["compra", "venda"]
  const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "BNB/USDT"]
  const robots = ["RSI Master", "Bollinger IA"]
  const statusOptions = ["concluído", "pendente", "cancelado"]

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const pair = pairs[Math.floor(Math.random() * pairs.length)]
    const robot = robots[Math.floor(Math.random() * robots.length)]
    const amount = (Math.random() * 0.1).toFixed(6)
    const price = type === "compra"
      ? (Math.random() * 10000 + 35000).toFixed(2)
      : (Math.random() * 10000 + 35000).toFixed(2)

    const value = (Number.parseFloat(amount) * Number.parseFloat(price)).toFixed(2)

    // Data aleatória nos últimos 30 dias
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const dateStr = date.toISOString().split('T')[0]
    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const status = i < 45
      ? "concluído"
      : statusOptions[Math.floor(Math.random() * statusOptions.length)]

    return {
      id: `OP${100000 + i}`,
      type,
      pair,
      robot,
      amount,
      price,
      value,
      date: dateStr,
      time: timeStr,
      status
    }
  }).sort((a, b) => {
    // Ordenar por data/hora (mais recente primeiro)
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })
}

export default function HistoryPage() {
  const [history] = useState(generateHistoryData())
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterPair, setFilterPair] = useState<string | null>(null)
  const [filterRobot, setFilterRobot] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<string>("all")

  // Obter dados únicos para os filtros
  const uniquePairs = Array.from(new Set(history.map(item => item.pair)))
  const uniqueRobots = Array.from(new Set(history.map(item => item.robot)))

  // Aplicar filtros
  const filteredHistory = history.filter(item => {
    if (filterType && item.type !== filterType) return false
    if (filterPair && item.pair !== filterPair) return false
    if (filterRobot && item.robot !== filterRobot) return false
    if (filterStatus && item.status !== filterStatus) return false

    if (dateRange !== "all") {
      const itemDate = new Date(item.date)
      const today = new Date()

      if (dateRange === "today") {
        const todayStr = today.toISOString().split('T')[0]
        if (item.date !== todayStr) return false
      } else if (dateRange === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        if (itemDate < weekAgo) return false
      } else if (dateRange === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(today.getMonth() - 1)
        if (itemDate < monthAgo) return false
      }
    }

    return true
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Operações</h2>
          <p className="text-muted-foreground">
            Histórico completo de todas as operações realizadas pelos seus robôs
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>
            Estatísticas das suas operações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Operações</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{history.length}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Compras</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{history.filter(item => item.type === "compra").length}</span>
                <ArrowUpRight className="h-5 w-5 text-green-500 ml-2" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendas</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">{history.filter(item => item.type === "venda").length}</span>
                <ArrowDownRight className="h-5 w-5 text-red-500 ml-2" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Volume Total</div>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold">
                  ${history.reduce((acc, item) => acc + Number.parseFloat(item.value), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Histórico Detalhado</CardTitle>
              <CardDescription>
                {filteredHistory.length} operações encontradas
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Últimos 7 dias</SelectItem>
                    <SelectItem value="month">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Input
                  placeholder="Pesquisar operação..."
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        Tipo
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={filterType === null}
                          onCheckedChange={() => setFilterType(null)}
                        >
                          Todos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filterType === "compra"}
                          onCheckedChange={() => setFilterType(filterType === "compra" ? null : "compra")}
                        >
                          Compra
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filterType === "venda"}
                          onCheckedChange={() => setFilterType(filterType === "venda" ? null : "venda")}
                        >
                          Venda
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                  <TableHead>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        Par
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filtrar por par</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={filterPair === null}
                          onCheckedChange={() => setFilterPair(null)}
                        >
                          Todos
                        </DropdownMenuCheckboxItem>
                        {uniquePairs.map(pair => (
                          <DropdownMenuCheckboxItem
                            key={pair}
                            checked={filterPair === pair}
                            onCheckedChange={() => setFilterPair(filterPair === pair ? null : pair)}
                          >
                            {pair}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                  <TableHead>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        Robô
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filtrar por robô</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={filterRobot === null}
                          onCheckedChange={() => setFilterRobot(null)}
                        >
                          Todos
                        </DropdownMenuCheckboxItem>
                        {uniqueRobots.map(robot => (
                          <DropdownMenuCheckboxItem
                            key={robot}
                            checked={filterRobot === robot}
                            onCheckedChange={() => setFilterRobot(filterRobot === robot ? null : robot)}
                          >
                            {robot}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        Status
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={filterStatus === null}
                          onCheckedChange={() => setFilterStatus(null)}
                        >
                          Todos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filterStatus === "concluído"}
                          onCheckedChange={() => setFilterStatus(filterStatus === "concluído" ? null : "concluído")}
                        >
                          Concluído
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filterStatus === "pendente"}
                          onCheckedChange={() => setFilterStatus(filterStatus === "pendente" ? null : "pendente")}
                        >
                          Pendente
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filterStatus === "cancelado"}
                          onCheckedChange={() => setFilterStatus(filterStatus === "cancelado" ? null : "cancelado")}
                        >
                          Cancelado
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.slice(0, 15).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 h-2 w-2 rounded-full ${
                            item.type === "compra" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.pair}</TableCell>
                    <TableCell>{item.robot}</TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                    <TableCell className="text-right font-medium">${item.value}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.date}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`
                          ${item.status === "concluído" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" :
                            item.status === "pendente" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"}
                        `}
                        variant="outline"
                      >
                        <span className="capitalize">{item.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando 1-15 de {filteredHistory.length} resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" className="px-4 font-medium">
                1
              </Button>
              <Button variant="ghost" size="sm" className="px-4">
                2
              </Button>
              <Button variant="ghost" size="sm" className="px-4">
                3
              </Button>
              <Button variant="ghost" size="sm" className="px-4">
                ...
              </Button>
              <Button variant="ghost" size="sm" className="px-4">
                {Math.ceil(filteredHistory.length / 15)}
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
