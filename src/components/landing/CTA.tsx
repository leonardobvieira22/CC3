"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const features = [
	"7 dias de teste grátis",
	"Suporte 24/7",
	"Cancelamento a qualquer momento",
	"API completa",
	"Robôs de IA avançados",
	"Sem taxas ocultas",
]

export function CTA() {
	return (
		<section className="py-24 relative overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 z-0" />

			{/* Decorative circles */}
			<div className="absolute top-20 right-16 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 blur-3xl" />
			<div className="absolute bottom-20 left-16 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-50 blur-3xl" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
							Pronto para potencializar seus resultados?
						</h2>
						<p className="text-xl text-black mb-8">
							Comece agora e transforme sua experiência de trading com nossa
							plataforma de IA avançada.
						</p>
					</motion.div>

					<ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 max-w-2xl mx-auto mb-10">
						{features.map((feature, index) => (
							<li key={index} className="flex items-center">
								<Check className="h-5 w-5 text-[#4B5CFA] mr-2 flex-shrink-0" />
								<span className="text-black text-left font-medium">
									{feature}
								</span>
							</li>
						))}
					</ul>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/auth/register">
							<Button className="bg-[#4B5CFA] hover:bg-[#373FCB] text-white font-medium rounded-md px-6 py-3 transition-colors w-full sm:w-auto">
								Começar gratuitamente
							</Button>
						</Link>
						<Link href="/pricing">
							<Button className="bg-white border border-gray-200 hover:bg-gray-50 text-[#0F1115] px-6 py-3 rounded-md font-medium text-center transition-colors w-full sm:w-auto">
								Ver planos e preços
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
