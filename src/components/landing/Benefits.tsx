"use client"

import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  Copy,
  Shield,
  Bot,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const benefits = [
  {
    icon: <Brain className="h-10 w-10 text-blue-highlight" />,
    title: "IA Avançada",
    description: "Nossos algoritmos de IA analisam milhares de padrões de mercado em tempo real para identificar as melhores oportunidades.",
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-blue-highlight" />,
    title: "Retornos Consistentes",
    description: "Robôs com retornos simulados de 4-7% ao mês, independente das condições do mercado.",
  },
  {
    icon: <Copy className="h-10 w-10 text-blue-highlight" />,
    title: "Copy Trading",
    description: "Replique automaticamente as operações dos melhores traders da plataforma e lucre enquanto aprende.",
  },
  {
    icon: <Shield className="h-10 w-10 text-blue-highlight" />,
    title: "Segurança Total",
    description: "Integração segura com a Binance, sem acesso às suas chaves de saque. Segurança de nível bancário.",
  },
  {
    icon: <Bot className="h-10 w-10 text-blue-highlight" />,
    title: "Robôs Personalizados",
    description: "Escolha entre diversos robôs com estratégias diferentes ou personalize o seu próprio.",
  },
  {
    icon: <Zap className="h-10 w-10 text-blue-highlight" />,
    title: "Bônus de Indicação",
    description: "Ganhe 10% do investimento de cada amigo que você indicar para a plataforma.",
  },
]

export function Benefits() {
  return (
    <section
      id="beneficios"
      className="py-24 bg-white dark:bg-blue-dark"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2.75rem] font-semibold leading-[1.2] tracking-tight text-black mb-6"
          >
            Por que escolher nossa plataforma?
          </motion.h2>
          <motion.p
            className="text-xl text-black mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Combinamos tecnologia de ponta em IA com anos de experiência em trading para oferecer a plataforma mais completa do mercado.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group focus-within:ring-2 focus-within:ring-blue-highlight"
            >
              <div className="bg-white border border-[#4B5CFA] rounded-3xl shadow-lg flex flex-col items-center text-center px-8 pt-10 pb-8 h-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl focus:outline-none">
                {/* Ícone com fundo sutil */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-dark dark:to-blue-medium rounded-full p-6 mb-6 flex items-center justify-center shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#4B5CFA] mb-3 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-black font-medium text-base md:text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
