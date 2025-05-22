"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bot, LineChart, Zap } from "lucide-react"

const steps = [
	{
		icon: (
			<Bot className="h-14 w-14 text-blue-highlight" />
		),
		title: "Escolha o robô ideal para você",
		description:
			"Selecione entre robôs de IA otimizados para diferentes estratégias e pares de criptomoedas. Encontre a solução perfeita para o seu perfil e objetivo.",
	},
	{
		icon: (
			<LineChart className="h-14 w-14 text-blue-highlight" />
		),
		title: "Conecte sua conta com segurança",
		description:
			"Integre sua conta Binance via API, sem acesso ao saque dos seus fundos. Seus ativos permanecem protegidos na corretora, com total privacidade.",
	},
	{
		icon: (
			<Zap className="h-14 w-14 text-blue-highlight" />
		),
		title: "Deixe a IA operar por você",
		description:
			"Nossos robôs monitoram o mercado 24 horas por dia, 7 dias por semana, e executam operações automaticamente com base em análises avançadas, maximizando seus resultados sem que você precise acompanhar o tempo todo.",
	},
]

export function HowItWorks() {
	return (
		<section id="como-funciona" className="py-24 bg-gray-50 dark:bg-blue-dark/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<motion.h2
						className="text-3xl md:text-4xl font-bold mb-4 text-black"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						Como potencializar seus ganhos com IA
					</motion.h2>
					<motion.p
						className="text-lg text-black"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Automatize seus investimentos em criptomoedas de forma simples, segura e inteligente. Veja como é fácil começar:
					</motion.p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
					{steps.map((step, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.2 }}
							className="relative group focus-within:ring-2 focus-within:ring-blue-highlight"
						>
							{/* Badge numerado flutuante com coloração roxa */}
							<div className="absolute -top-5 left-6">
								<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#4B5CFA] text-white text-xl font-bold shadow-lg border-4 border-white dark:border-blue-dark">
									{index + 1}
								</span>
							</div>
							<div
								className="bg-white border border-[#4B5CFA] rounded-3xl shadow-lg flex flex-col items-center text-center px-8 pt-10 pb-8 h-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl focus:outline-none"
								tabIndex={0}
								aria-label={`Etapa ${index + 1}: ${step.title}`}
							>
								{/* Ícone com fundo sutil */}
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-dark dark:to-blue-medium rounded-full p-6 mb-6 flex items-center justify-center shadow-sm">
									{step.icon}
								</div>
								<h3 className="text-xl md:text-2xl font-bold text-[#4B5CFA] mb-3 leading-tight">
									{step.title}
								</h3>
								<p className="text-black font-medium text-base md:text-lg leading-relaxed">
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-16 text-center"
				>
					<p className="text-lg text-black mb-8 max-w-2xl mx-auto">
						Tecnologia de ponta para resultados reais. Aproveite o poder da inteligência artificial para investir com eficiência, segurança e praticidade.
					</p>
					<a
						href="/auth/register"
						className="bg-[#5957D5] hover:bg-[#4F4EC0] text-white px-6 py-3 rounded-md font-medium text-center transition-colors inline-flex items-center justify-center"
					>
						Começar Grátis
					</a>
				</motion.div>
			</div>
		</section>
	)
}
