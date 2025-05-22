"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Tipos para as etapas
type OnboardingStep = {
  id: string
  title: string
  description: string
  Component: React.FC<StepProps>
}

// Propriedades para cada etapa
type StepProps = {
  onNext: () => void
  onBack: () => void
}

const ConnectExchangeStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Conecte sua corretora</CardTitle>
        <CardDescription>
          Conecte sua conta da Binance para começar a utilizar nossos robôs de
          trading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center my-6">
          <div className="w-20 h-20 relative">
            <img
              src="/images/binance-logo.png"
              alt="Binance"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="block text-sm font-medium">
              Chave da API (somente leitura/trading)
            </label>
            <Input
              id="api-key"
              placeholder="Digite sua chave da API da Binance"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Usamos criptografia AES-256 para proteger suas chaves
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="api-secret" className="block text-sm font-medium">
              Secret da API
            </label>
            <Input
              id="api-secret"
              type="password"
              placeholder="Digite seu secret da API da Binance"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Como criar uma chave API na Binance
            </h4>
            <ol className="mt-2 ml-6 text-sm text-gray-600 dark:text-gray-300 list-decimal">
              <li>Faça login na sua conta da Binance</li>
              <li>Acesse Dashboard &gt; Gerenciamento de API</li>
              <li>Crie uma nova chave API</li>
              <li>
                Habilite apenas permissões de leitura e trading (não habilite
                saques)
              </li>
              <li>Copie a chave e o secret e cole aqui</li>
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>Continuar</Button>
      </CardFooter>
    </>
  )
}

const RiskProfileStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  const [riskProfile, setRiskProfile] = useState("")

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Seu perfil de risco</CardTitle>
        <CardDescription>
          Selecione o perfil que melhor se encaixa com sua estratégia de
          investimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="risk-profile" className="block text-sm font-medium">
              Perfil de risco
            </label>
            <Select
              onValueChange={(value) => setRiskProfile(value)}
              defaultValue={riskProfile}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu perfil de risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservador</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="aggressive">Agressivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Alocação por operação (% do capital)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  defaultValue="5"
                  className="w-full"
                />
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Operações simultâneas (máximo)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="3"
                  className="w-full"
                />
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                riskProfile === "conservative"
                  ? "border-blue-highlight bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setRiskProfile("conservative")}
            >
              <h4 className="font-medium">Conservador</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Prioriza segurança e consistência nos resultados
              </p>
              <div className="mt-2 flex items-center">
                <div className="bg-green-500 h-2 w-8 rounded-full"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 w-8 rounded-full ml-1"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 w-8 rounded-full ml-1"></div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                riskProfile === "moderate"
                  ? "border-blue-highlight bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setRiskProfile("moderate")}
            >
              <h4 className="font-medium">Moderado</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Equilibra riscos e retornos, com exposição moderada
              </p>
              <div className="mt-2 flex items-center">
                <div className="bg-green-500 h-2 w-8 rounded-full"></div>
                <div className="bg-yellow-500 h-2 w-8 rounded-full ml-1"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-2 w-8 rounded-full ml-1"></div>
              </div>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                riskProfile === "aggressive"
                  ? "border-blue-highlight bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setRiskProfile("aggressive")}
            >
              <h4 className="font-medium">Agressivo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Busca retornos máximos, aceitando maior volatilidade
              </p>
              <div className="mt-2 flex items-center">
                <div className="bg-green-500 h-2 w-8 rounded-full"></div>
                <div className="bg-yellow-500 h-2 w-8 rounded-full ml-1"></div>
                <div className="bg-red-500 h-2 w-8 rounded-full ml-1"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={!riskProfile}>
          Continuar
        </Button>
      </CardFooter>
    </>
  )
}

const SelectRobotsStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  const [selectedRobots, setSelectedRobots] = useState<string[]>([])

  const robots = [
    {
      id: "rsi-master",
      name: "RSI Master",
      description: "Utiliza o Índice de Força Relativa com IA para identificar sobrecompras e sobrevendas no mercado.",
      return: "+5.8%",
      pairs: "BTC, ETH, SOL",
      risk: "moderate"
    },
    {
      id: "bollinger-ia",
      name: "Bollinger IA",
      description: "Identifica volatilidade e reversões com Bandas de Bollinger aprimoradas por IA.",
      return: "+4.2%",
      pairs: "BTC, ETH, BNB",
      risk: "conservative"
    },
    {
      id: "trend-hunter",
      name: "Trend Hunter",
      description: "Algoritmo de detecção de tendências com análise profunda de mercado.",
      return: "+7.3%",
      pairs: "BTC, ETH, ADA",
      risk: "aggressive"
    },
    {
      id: "macd-pro",
      name: "MACD Pro",
      description: "Análise avançada de convergência/divergência com filtros de IA.",
      return: "+4.9%",
      pairs: "BTC, ETH, DOT",
      risk: "moderate"
    }
  ]

  const toggleRobot = (id: string) => {
    if (selectedRobots.includes(id)) {
      setSelectedRobots(selectedRobots.filter(robotId => robotId !== id))
    } else {
      if (selectedRobots.length < 2) {
        setSelectedRobots([...selectedRobots, id])
      } else {
        toast.error("Plano gratuito permite apenas 2 robôs. Faça upgrade para adicionar mais.")
      }
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Escolha seus robôs de IA</CardTitle>
        <CardDescription>
          Selecione até 2 robôs para começar (plano gratuito). Você pode alterar depois.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Robôs selecionados: {selectedRobots.length}/2</span>
          <Button variant="link" className="text-blue-highlight p-0">
            Ver planos premium
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {robots.map((robot) => (
            <div
              key={robot.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedRobots.includes(robot.id)
                  ? "border-blue-highlight bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => toggleRobot(robot.id)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{robot.name}</h4>
                <span className="text-sm font-bold text-green-500">{robot.return}/mês</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {robot.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {robot.pairs}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    robot.risk === "conservative" ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200" :
                    robot.risk === "moderate" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200" :
                    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                  }`}>
                    {robot.risk === "conservative" ? "Conservador" :
                     robot.risk === "moderate" ? "Moderado" : "Agressivo"}
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full border border-blue-highlight flex items-center justify-center">
                  {selectedRobots.includes(robot.id) && (
                    <div className="w-3 h-3 rounded-full bg-blue-highlight"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext} disabled={selectedRobots.length === 0}>
          Continuar
        </Button>
      </CardFooter>
    </>
  )
}

const CompleteSetupStep: React.FC<StepProps> = ({ onNext, onBack }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Configuração concluída!</CardTitle>
        <CardDescription>
          Tudo pronto para você começar a utilizar nossa plataforma de trading com inteligência artificial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center my-6">
          <div className="w-20 h-20 relative">
            <svg
              className="w-full h-full text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">Resumo da configuração</h3>

          <div className="space-y-4">
            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Corretora</span>
              <span className="font-medium">Binance</span>
            </div>

            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Perfil de risco</span>
              <span className="font-medium">Moderado</span>
            </div>

            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Robôs selecionados</span>
              <span className="font-medium">RSI Master, Bollinger IA</span>
            </div>

            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
              <span className="text-gray-600 dark:text-gray-400">Alocação por operação</span>
              <span className="font-medium">5% do capital</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Próximos passos
          </h4>
          <ul className="mt-2 ml-6 text-sm text-gray-600 dark:text-gray-300 list-disc">
            <li>Seus robôs começarão a operar automaticamente</li>
            <li>Acompanhe seu desempenho no dashboard</li>
            <li>Configure alertas para ser notificado de operações</li>
            <li>Convide amigos e ganhe 10% de bônus</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Link href="/dashboard">
          <Button>Ir para Dashboard</Button>
        </Link>
      </CardFooter>
    </>
  )
}

// Configuração das etapas
const steps: OnboardingStep[] = [
  {
    id: "connect-exchange",
    title: "Conectar Corretora",
    description: "Conecte sua conta da Binance",
    Component: ConnectExchangeStep,
  },
  {
    id: "risk-profile",
    title: "Perfil de Risco",
    description: "Defina seu perfil de investimento",
    Component: RiskProfileStep,
  },
  {
    id: "select-robots",
    title: "Selecionar Robôs",
    description: "Escolha seus robôs de IA",
    Component: SelectRobotsStep,
  },
  {
    id: "complete",
    title: "Concluir",
    description: "Revise e confirme",
    Component: CompleteSetupStep,
  },
]

export default function OnboardingFlow() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = steps[currentStepIndex]
  const router = useRouter()

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    } else {
      router.push("/auth/register")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight">
              AI Crypto
            </h2>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Configuração inicial
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Passo {currentStepIndex + 1} de {steps.length} - {currentStep.title}
          </p>
        </div>

        <div className="mb-8">
          <Progress value={(currentStepIndex / (steps.length - 1)) * 100} className="h-2" />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-center ${
                  index <= currentStepIndex
                    ? "text-blue-highlight"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`mx-auto h-6 w-6 flex items-center justify-center rounded-full text-xs ${
                    index < currentStepIndex
                      ? "bg-blue-highlight text-white"
                      : index === currentStepIndex
                      ? "border-2 border-blue-highlight text-blue-highlight"
                      : "border border-gray-300 text-gray-500"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <p className="mt-1 text-xs font-medium hidden sm:block">
                  {step.title}
                </p>
                <p className="text-xs hidden sm:block">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <currentStep.Component
                onNext={handleNext}
                onBack={handleBack}
              />
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
