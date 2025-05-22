"use client"

import { useState } from "react"
import {
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart4,
  AlertCircle,
  Star,
  StarHalf,
  ChevronDown,
  Lock,
  Check,
  Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// Tipo para traders
type Trader = {
  id: string
  name: string
  username: string
  avatar: string
  monthlyReturn: string
  overallReturn: string
  followers: number
  description: string
  experience: "iniciante" | "intermediário" | "avançado" | "expert"
  risk: "baixo" | "médio" | "alto"
  winRate: number
  totalTrades: number
  premium: boolean
  following: boolean
}

// Simulando dados para a página de copy trading
const generateTraders = (): Trader[] => {
  const traders: Trader[] = [
    {
      id: "trader1",
      name: "Carlos Almeida",
      username: "carlosalmeida",
      avatar: "",
      monthlyReturn: "+8.6%",
      overallReturn: "+42.5%",
      followers: 3754,
      description: "Trader profissional com foco em análise técnica avançada. Especialista em identificar padrões de reversão e tendências fortes.",
      experience: "expert",
      risk: "médio",
      winRate: 78,
      totalTrades: 432,
      premium: true,
      following: false
    },
    {
      id: "trader2",
      name: "Mariana Silva",
      username: "marianasilva",
      avatar: "",
      monthlyReturn: "+6.2%",
      overallReturn: "+37.8%",
      followers: 2865,
      description: "Especialista em análise fundamentalista e aproveitamento de tendências de longo prazo no mercado de criptomoedas.",
      experience: "avançado",
      risk: "baixo",
      winRate: 83,
      totalTrades: 284,
      premium: false,
      following: false
    },
    {
      id: "trader3",
      name: "André Santos",
      username: "andresantos",
      avatar: "",
      monthlyReturn: "+11.4%",
      overallReturn: "+63.1%",
      followers: 4256,
      description: "Trader agressivo com foco em movimentos de curto prazo. Especializado em estratégias de scalping e day trading em altcoins.",
      experience: "expert",
      risk: "alto",
      winRate: 65,
      totalTrades: 876,
      premium: true,
      following: false
    },
    {
      id: "trader4",
      name: "Patricia Mendes",
      username: "patriciamendes",
      avatar: "",
      monthlyReturn: "+5.4%",
      overallReturn: "+28.7%",
      followers: 1543,
      description: "Abordagem conservadora com foco em preservação de capital. Estratégia baseada em DCA (Dollar Cost Average) inteligente.",
      experience: "intermediário",
      risk: "baixo",
      winRate: 88,
      totalTrades: 149,
      premium: false,
      following: false
    },
    {
      id: "trader5",
      name: "Rafael Costa",
      username: "rafaelcosta",
      avatar: "",
      monthlyReturn: "+9.1%",
      overallReturn: "+52.3%",
      followers: 3187,
      description: "Trader quantitativo utilizando algoritmos proprietários para identificar ineficiências de mercado.",
      experience: "expert",
      risk: "médio",
      winRate: 74,
      totalTrades: 531,
      premium: true,
      following: false
    },
    {
      id: "trader6",
      name: "Juliana Ferreira",
      username: "julianaferreira",
      avatar: "",
      monthlyReturn: "+7.6%",
      overallReturn: "+45.2%",
      followers: 2341,
      description: "Especialista em análise de sentimento e indicadores on-chain para identificar oportunidades de entrada e saída.",
      experience: "avançado",
      risk: "médio",
      winRate: 77,
      totalTrades: 389,
      premium: false,
      following: false
    },
    {
      id: "trader7",
      name: "Bruno Oliveira",
      username: "brunooliveira",
      avatar: "",
      monthlyReturn: "+13.2%",
      overallReturn: "+87.5%",
      followers: 5634,
      description: "Trader experiente focado em arbitragem e aproveitamento de gaps de liquidez entre exchanges.",
      experience: "expert",
      risk: "alto",
      winRate: 71,
      totalTrades: 1253,
      premium: true,
      following: false
    },
    {
      id: "trader8",
      name: "Camila Rocha",
      username: "camilarocha",
      avatar: "",
      monthlyReturn: "+6.8%",
      overallReturn: "+31.4%",
      followers: 1876,
      description: "Estratégia baseada em análise de ciclos de mercado e correlação entre ativos tradicionais e criptomoedas.",
      experience: "intermediário",
      risk: "médio",
      winRate: 79,
      totalTrades: 327,
      premium: false,
      following: false
    }
  ]

  return traders
}

// Renderizar as estrelas de avaliação com base no win rate
const RatingStars = ({ winRate }: { winRate: number }) => {
  // Mapear o win rate para uma escala de 0-5 estrelas
  // 60% = 3 estrelas, 80% = 4 estrelas, 90%+ = 5 estrelas
  const rating = Math.floor((winRate - 60) / 10) + 3
  const hasHalfStar = ((winRate - 60) % 10) >= 5 && rating < 5

  return (
    <div className="flex items-center">
      {Array.from({ length: Math.min(rating, 5) }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      {Array.from({ length: Math.max(5 - rating - (hasHalfStar ? 1 : 0), 0) }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  )
}

export default function CopyTradingPage() {
  const [traders, setTraders] = useState(generateTraders())
  const [sortBy, setSortBy] = useState("performance")
  const [riskFilter, setRiskFilter] = useState("all")
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null)
  const [followDialogOpen, setFollowDialogOpen] = useState(false)

  // Traders que o usuário está seguindo
  const followedTraders = traders.filter(trader => trader.following)

  // Filtrar e ordenar traders
  const filteredTraders = traders.filter(trader => {
    if (riskFilter === "all") return true
    return trader.risk === riskFilter
  })

  const sortedTraders = [...filteredTraders].sort((a, b) => {
    if (sortBy === "performance") {
      return Number.parseFloat(b.monthlyReturn.replace("%", "")) - Number.parseFloat(a.monthlyReturn.replace("%", ""))
    } else if (sortBy === "followers") {
      return b.followers - a.followers
    } else if (sortBy === "winrate") {
      return b.winRate - a.winRate
    }
    return 0
  })

  // Função para seguir um trader
  const followTrader = (trader: Trader) => {
    if (trader.premium) {
      toast.error("Este trader está disponível apenas no plano Premium")
      return
    }

    setSelectedTrader(trader)
    setFollowDialogOpen(true)
  }

  // Confirmar seguir o trader
  const confirmFollow = () => {
    if (!selectedTrader) return

    setTraders(traders.map(t =>
      t.id === selectedTrader.id ? { ...t, following: true } : t
    ))

    toast.success(`Você começou a seguir ${selectedTrader.name}`)
    setFollowDialogOpen(false)
  }

  // Deixar de seguir um trader
  const unfollowTrader = (traderId: string) => {
    setTraders(traders.map(t =>
      t.id === traderId ? { ...t, following: false } : t
    ))

    const trader = traders.find(t => t.id === traderId)
    if (trader) {
      toast.success(`Você deixou de seguir ${trader.name}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Copy Trading</h2>
          <p className="text-muted-foreground">
            Copie automaticamente as operações dos melhores traders da plataforma
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">Como funciona</Button>
          {followedTraders.length < 2 ? (
            <Badge className="py-1 px-3">
              {followedTraders.length}/2 traders seguidos
            </Badge>
          ) : (
            <Badge variant="destructive" className="py-1 px-3">
              Limite atingido (2/2)
            </Badge>
          )}
        </div>
      </div>

      {/* Seção de status do Copy Trading */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Copy Trading</CardTitle>
          <CardDescription>
            Acompanhe o desempenho dos traders que você segue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {followedTraders.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Traders Seguidos</div>
                  <div className="mt-2 flex items-center">
                    <span className="text-3xl font-bold">{followedTraders.length}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ 2</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Retorno Médio</div>
                  <div className="mt-2 flex items-center">
                    <span className="text-3xl font-bold text-green-500">
                      {followedTraders.length > 0
                        ? `+${(followedTraders.reduce((acc, t) => acc + Number.parseFloat(t.monthlyReturn.replace("%", "")), 0) / followedTraders.length).toFixed(1)}%`
                        : "0%"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/mês</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Operações Copiadas</div>
                  <div className="mt-2 flex items-center">
                    <span className="text-3xl font-bold">42</span>
                    <span className="text-sm text-green-500 ml-2">+12 (7 dias)</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Alocação</div>
                  <div className="mt-2 flex items-center">
                    <span className="text-3xl font-bold">$5,340</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">distribuídos</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Seus Traders</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {followedTraders.map(trader => (
                    <Card key={trader.id} className="relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        trader.risk === "baixo" ? "bg-green-500" :
                        trader.risk === "médio" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`} />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-10 w-10 border">
                              <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                {trader.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{trader.name}</CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground">
                                @{trader.username}
                                <span className="mx-1">•</span>
                                <RatingStars winRate={trader.winRate} />
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              trader.risk === "baixo" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" :
                              trader.risk === "médio" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            } capitalize`}
                            variant="outline"
                          >
                            Risco {trader.risk}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Retorno Mensal</p>
                            <p className="text-xl font-medium text-green-500">{trader.monthlyReturn}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Seguidores</p>
                            <p className="text-xl font-medium">{trader.followers.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-xl font-medium">{trader.winRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Trades</p>
                            <p className="text-xl font-medium">{trader.totalTrades.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Alocação</p>
                            <p className="text-sm">$2,500 (50%)</p>
                          </div>
                          <Progress value={50} className="h-2" />

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex">
                              <Button variant="outline" size="sm" className="mr-2">
                                Ajustar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => unfollowTrader(trader.id)}
                              >
                                Deixar de seguir
                              </Button>
                            </div>
                            <Button variant="outline" size="sm">
                              Ver detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Users className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Você ainda não segue nenhum trader</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Copie as operações dos traders mais lucrativos da plataforma e comece a ter
                resultados semelhantes automaticamente.
              </p>
              <Button>Escolher traders</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Encontrar Traders */}
      <Tabs defaultValue="discover" className="w-full">
        <TabsList>
          <TabsTrigger value="discover">Descobrir Traders</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Encontre Traders para Seguir</CardTitle>
                  <CardDescription>
                    Explore traders baseado em seu perfil de risco e objetivos
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Maior performance</SelectItem>
                        <SelectItem value="followers">Mais populares</SelectItem>
                        <SelectItem value="winrate">Maior win rate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={riskFilter}
                      onValueChange={setRiskFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por risco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os perfis</SelectItem>
                        <SelectItem value="baixo">Risco baixo</SelectItem>
                        <SelectItem value="médio">Risco médio</SelectItem>
                        <SelectItem value="alto">Risco alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Buscar traders..."
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedTraders.slice(0, 6).map(trader => (
                  <Card key={trader.id} className={`relative overflow-hidden ${
                    trader.premium ? "border-amber-200 dark:border-amber-800" : ""
                  }`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      trader.risk === "baixo" ? "bg-green-500" :
                      trader.risk === "médio" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-10 w-10 border">
                            <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              {trader.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <CardTitle className="text-lg">{trader.name}</CardTitle>
                              {trader.premium && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="ml-2 bg-amber-500">PRO</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Requer plano Premium</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              @{trader.username}
                              <span className="mx-1">•</span>
                              <RatingStars winRate={trader.winRate} />
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            trader.risk === "baixo" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" :
                            trader.risk === "médio" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          } capitalize`}
                          variant="outline"
                        >
                          Risco {trader.risk}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Retorno Mensal</p>
                          <p className="text-xl font-medium text-green-500">{trader.monthlyReturn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Seguidores</p>
                          <p className="text-xl font-medium">{trader.followers.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Win Rate</p>
                          <p className="text-xl font-medium">{trader.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Trades</p>
                          <p className="text-xl font-medium">{trader.totalTrades.toLocaleString()}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {trader.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {trader.following ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => unfollowTrader(trader.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Seguindo
                        </Button>
                      ) : (
                        <Button
                          className={`w-full ${trader.premium ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                          onClick={() => followTrader(trader)}
                          disabled={followedTraders.length >= 2 && !trader.following}
                        >
                          {trader.premium ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Desbloquear
                            </>
                          ) : (
                            "Seguir"
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">Carregar mais traders</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Traders</CardTitle>
              <CardDescription>
                Os traders com melhor desempenho da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Retorno Mensal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Retorno Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Seguidores
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Win Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Risco
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {[...traders].sort((a, b) => Number.parseFloat(b.monthlyReturn.replace("%", "")) - Number.parseFloat(a.monthlyReturn.replace("%", ""))).map((trader, index) => (
                      <tr key={trader.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <div className="absolute -top-1 -left-1 z-10 w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <Avatar className="h-10 w-10 border">
                                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                  {trader.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {trader.name}
                                </div>
                                {trader.premium && (
                                  <Badge className="ml-2 bg-amber-500">PRO</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                @{trader.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500 font-medium">
                            {trader.monthlyReturn}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-500 font-medium">
                            {trader.overallReturn}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {trader.followers.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {trader.winRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${
                              trader.risk === "baixo" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" :
                              trader.risk === "médio" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                            } capitalize`}
                            variant="outline"
                          >
                            {trader.risk}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {trader.following ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => unfollowTrader(trader.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Seguindo
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className={trader.premium ? "bg-amber-500 hover:bg-amber-600" : ""}
                              onClick={() => followTrader(trader)}
                              disabled={followedTraders.length >= 2 && !trader.following}
                            >
                              {trader.premium ? (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Desbloquear
                                </>
                              ) : (
                                "Seguir"
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para confirmar seguir um trader */}
      <Dialog open={followDialogOpen} onOpenChange={setFollowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seguir Trader</DialogTitle>
            <DialogDescription>
              Defina quanto do seu capital será alocado para copiar as operações deste trader.
            </DialogDescription>
          </DialogHeader>

          {selectedTrader && (
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {selectedTrader.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-medium">{selectedTrader.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RatingStars winRate={selectedTrader.winRate} />
                    <span className="ml-2">{selectedTrader.winRate}% win rate</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Informações importantes</p>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
                  <li>Você copiará automaticamente todas as operações deste trader</li>
                  <li>A alocação define o percentual do seu capital utilizado</li>
                  <li>Você pode deixar de seguir um trader a qualquer momento</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Alocação de Capital</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    defaultValue="50"
                    className="flex-1"
                  />
                  <span className="font-medium">50%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Saldo disponível: $5,000 • Alocação: $2,500
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmFollow}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
