"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

// Dados dos planos
const pricingData = {
  monthly: [
    {
      name: "Gratuito",
      description: "Para investidores iniciantes",
      price: 0,
      features: [
        { title: "2 robôs de IA simultâneos", included: true },
        { title: "Pares básicos (BTC, ETH)", included: true },
        { title: "Limite de $1.000 em capital", included: true },
        { title: "Acesso à versão básica dos robôs", included: true },
        { title: "Análise de mercado básica", included: true },
        { title: "Copy Trading (2 traders)", included: true },
        { title: "Robôs premium", included: false },
        { title: "Backtesting e otimização", included: false },
        { title: "Suporte prioritário", included: false },
        { title: "API avançada", included: false },
      ],
      cta: "Começar Grátis",
      highlighted: false,
    },
    {
      name: "Essencial",
      description: "Para traders recorrentes",
      price: 29,
      features: [
        { title: "5 robôs de IA simultâneos", included: true },
        { title: "Todos os pares de criptomoedas", included: true },
        { title: "Sem limite de capital", included: true },
        { title: "Acesso à versão completa dos robôs", included: true },
        { title: "Análise de mercado avançada", included: true },
        { title: "Copy Trading (5 traders)", included: true },
        { title: "2 robôs premium", included: true },
        { title: "Backtesting básico", included: true },
        { title: "Suporte por e-mail", included: true },
        { title: "API básica", included: true },
      ],
      cta: "Assinar Plano",
      highlighted: false,
    },
    {
      name: "Premium",
      description: "Para traders sérios",
      price: 79,
      features: [
        { title: "Robôs de IA ilimitados", included: true },
        { title: "Todos os pares de criptomoedas", included: true },
        { title: "Sem limite de capital", included: true },
        { title: "Acesso à versão completa dos robôs", included: true },
        { title: "Análise de mercado profissional", included: true },
        { title: "Copy Trading (traders ilimitados)", included: true },
        { title: "Todos os robôs premium", included: true },
        { title: "Backtesting e otimização avançados", included: true },
        { title: "Suporte prioritário 24/7", included: true },
        { title: "API completa", included: true },
      ],
      cta: "Assinar Plano",
      highlighted: true,
    },
  ],
  annual: [
    {
      name: "Gratuito",
      description: "Para investidores iniciantes",
      price: 0,
      features: [
        { title: "2 robôs de IA simultâneos", included: true },
        { title: "Pares básicos (BTC, ETH)", included: true },
        { title: "Limite de $1.000 em capital", included: true },
        { title: "Acesso à versão básica dos robôs", included: true },
        { title: "Análise de mercado básica", included: true },
        { title: "Copy Trading (2 traders)", included: true },
        { title: "Robôs premium", included: false },
        { title: "Backtesting e otimização", included: false },
        { title: "Suporte prioritário", included: false },
        { title: "API avançada", included: false },
      ],
      cta: "Começar Grátis",
      highlighted: false,
    },
    {
      name: "Essencial",
      description: "Para traders recorrentes",
      price: 19,
      priceAnnual: 228,
      features: [
        { title: "5 robôs de IA simultâneos", included: true },
        { title: "Todos os pares de criptomoedas", included: true },
        { title: "Sem limite de capital", included: true },
        { title: "Acesso à versão completa dos robôs", included: true },
        { title: "Análise de mercado avançada", included: true },
        { title: "Copy Trading (5 traders)", included: true },
        { title: "2 robôs premium", included: true },
        { title: "Backtesting básico", included: true },
        { title: "Suporte por e-mail", included: true },
        { title: "API básica", included: true },
      ],
      discount: "Economize 34%",
      cta: "Assinar Plano",
      highlighted: false,
    },
    {
      name: "Premium",
      description: "Para traders sérios",
      price: 59,
      priceAnnual: 708,
      features: [
        { title: "Robôs de IA ilimitados", included: true },
        { title: "Todos os pares de criptomoedas", included: true },
        { title: "Sem limite de capital", included: true },
        { title: "Acesso à versão completa dos robôs", included: true },
        { title: "Análise de mercado profissional", included: true },
        { title: "Copy Trading (traders ilimitados)", included: true },
        { title: "Todos os robôs premium", included: true },
        { title: "Backtesting e otimização avançados", included: true },
        { title: "Suporte prioritário 24/7", included: true },
        { title: "API completa", included: true },
      ],
      discount: "Economize 25%",
      cta: "Assinar Plano",
      highlighted: true,
    },
  ],
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-white dark:bg-blue-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight dark:from-blue-light dark:to-blue-highlight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Escolha o plano ideal para maximizar seus lucros
              </motion.h1>
              <motion.p
                className="text-xl text-black mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Planos flexíveis para traders iniciantes e profissionais, com acesso a robôs de IA avançados e ferramentas exclusivas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Tabs
                  defaultValue="monthly"
                  value={billingCycle}
                  onValueChange={setBillingCycle}
                  className="inline-flex"
                >
                  <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="monthly">Mensal</TabsTrigger>
                    <TabsTrigger value="annual" className="relative">
                      Anual
                      <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-0.5">
                        Economia
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingData[billingCycle as keyof typeof pricingData].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  className={`flex ${plan.highlighted ? 'mt-[-20px] mb-[-20px]' : ''}`}
                >
                  <Card className={`w-full shadow-lg ${
                    plan.highlighted
                      ? 'border-blue-highlight dark:border-blue-highlight border-2 relative overflow-hidden'
                      : ''
                  }`}>
                    {plan.highlighted && (
                      <div className="absolute top-0 left-0 w-full bg-blue-highlight text-white text-center py-1.5 text-sm font-medium">
                        Mais Popular
                      </div>
                    )}
                    <CardHeader className={`${plan.highlighted ? 'pt-10' : ''}`}>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-black ml-2">
                          {plan.price > 0 ? "/mês" : ""}
                        </span>
                        {billingCycle === "annual" && plan.price > 0 && "discount" in plan && (
                          <div className="mt-1">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                              {plan.discount}
                            </Badge>
                            <span className="text-sm text-black ml-2 line-through">
                              ${(plan.price * 12).toFixed(0)}/ano
                            </span>
                            {"priceAnnual" in plan && (
                              <span className="text-sm text-black ml-2">
                                ${plan.priceAnnual}/ano
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={feature.included ? "" : "text-gray-500 dark:text-gray-400"}>
                              {feature.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Link href={plan.price > 0 ? "/auth/register?plan=" + plan.name.toLowerCase() : "/auth/register"} className="w-full">
                        <Button
                          className={`w-full ${
                            plan.highlighted
                              ? 'bg-blue-highlight hover:bg-blue-medium text-white'
                              : plan.price === 0 ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''
                          }`}
                          variant={plan.highlighted ? "default" : plan.price === 0 ? "outline" : "default"}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center max-w-xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Dúvidas frequentes sobre os planos</h3>
              <div className="space-y-6 text-left">
                <div>
                  <h4 className="font-medium mb-2">Posso mudar de plano depois?</h4>
                  <p className="text-black">
                    Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                    As mudanças serão aplicadas imediatamente e o valor será ajustado proporcionalmente.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Existe algum contrato de fidelidade?</h4>
                  <p className="text-black">
                    Não, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
                    No plano anual, o valor é cobrado integralmente no início e não há reembolso por cancelamento antecipado.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Como funciona o período gratuito?</h4>
                  <p className="text-black">
                    O plano gratuito não tem prazo de expiração. Você pode usar a plataforma com as limitações do plano
                    gratuito por quanto tempo desejar, sem a necessidade de fornecer dados de cartão de crédito.
                  </p>
                </div>
              </div>
              <Button variant="link" className="mt-6">
                <Link href="/landing#faq">
                  Ver todas as perguntas frequentes
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Seção de depoimentos */}
        <section className="py-20 bg-gray-50 dark:bg-blue-medium/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text">O que nossos clientes dizem</h2>
              <p className="text-lg text-black">
                Junte-se aos milhares de traders que transformaram sua experiência de trading com nossa plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-black mb-6">
                    "Os robôs de IA triplicaram meu lucro em apenas 3 meses. A plataforma é extremamente intuitiva e o suporte é incrível.
                    Melhor investimento que fiz este ano!"
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-medium text-blue-800 dark:text-blue-300">
                      CA
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Carlos A.</p>
                      <p className="text-sm text-black">Trader há 5 anos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-black mb-6">
                    "Como iniciante no mercado de criptomoedas, o Copy Trading foi perfeito para mim. Não entendo muito de indicadores técnicos,
                    mas estou conseguindo resultados consistentes seguindo traders experientes."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-medium text-blue-800 dark:text-blue-300">
                      ML
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Mariana L.</p>
                      <p className="text-sm text-black">Investidora iniciante</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-black mb-6">
                    "Já testei várias plataformas, mas nenhuma tem a tecnologia de IA tão avançada como esta.
                    Os robôs identificam oportunidades que eu jamais veria sozinho. Vale cada centavo do plano Premium."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-medium text-blue-800 dark:text-blue-300">
                      RM
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Rafael M.</p>
                      <p className="text-sm text-black">Engenheiro de Software</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção de CTA */}
        <section className="py-20 bg-white dark:bg-blue-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                Pronto para maximizar seus lucros com IA?
              </h2>
              <p className="text-xl text-black mb-10 max-w-2xl mx-auto">
                Inicie seu teste gratuito hoje e veja como nossa plataforma pode transformar sua experiência de trading.
                Sem necessidade de cartão de crédito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button className="hero-button py-6 text-lg w-full sm:w-auto">
                    Comece Agora Gratuitamente
                  </Button>
                </Link>
                <Link href="/landing#beneficios">
                  <Button variant="outline" className="py-6 text-lg w-full sm:w-auto">
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
