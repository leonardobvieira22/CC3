"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
	{
		name: "Binance",
		logo: "/images/binance-logo.png",
	},
	{
		name: "Globo",
		logo: "/images/globo-logo.png",
	},
	{
		name: "Unilever",
		logo: "/images/unilever-logo.png",
	},
	{
		name: "Empresa X",
		logo: "/images/empresa-x-logo.png",
	},
]

export function Partners() {
	return (
		<section className="py-16 bg-gray-50 dark:bg-blue-medium">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl font-bold mb-4 text-black">
						Parceiros de Confiança
					</h2>
					<p className="text-lg text-black max-w-2xl mx-auto">
						Trabalhamos com as maiores empresas do mercado para oferecer a melhor
						experiência aos nossos usuários.
					</p>
				</motion.div>

				<motion.div
					className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.7 }}
				>
					{partners.map((partner, index) => (
						<div
							key={index}
							className="w-32 h-24 md:w-40 md:h-28 relative grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
						>
							<Image
								src={partner.logo}
								alt={partner.name}
								fill
								className="object-contain"
							/>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
