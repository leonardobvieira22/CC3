"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "Como funciona a IA nos robôs?",
    answer: "Nossos robôs são alimentados por algoritmos de inteligência artificial que analisam milhares de dados do mercado em tempo real. Eles identificam padrões, tendências e oportunidades com base em indicadores técnicos como RSI, MACD, Bollinger Bands e outros. A IA aprende continuamente com cada operação para melhorar sua precisão e adaptação às condições do mercado.",
  },
  {
    question: "É seguro conectar minha conta da Binance?",
    answer: "Sim, é 100% seguro. Nossa plataforma utiliza apenas chaves de API com permissões de leitura e trading, sem acesso para saques. Além disso, todas as chaves são criptografadas com AES-256 e armazenadas em servidores com certificação bancária. Você mantém total controle sobre suas criptomoedas a qualquer momento.",
  },
  {
    question: "Como recebo meus lucros?",
    answer: "Seus lucros ficam disponíveis diretamente na sua conta da Binance, sem intermediários. Como operamos via API, não temos acesso aos seus fundos - todos os lucros vão diretamente para sua carteira na corretora conectada.",
  },
  {
    question: "O que é copy trading?",
    answer: "Copy trading é uma funcionalidade que permite replicar automaticamente as operações dos melhores traders da plataforma. Você escolhe quanto deseja alocar para cada trader e nosso sistema replica proporcionalmente todas as operações em sua conta. É ideal para iniciantes que querem resultados profissionais enquanto aprendem.",
  },
  {
    question: "Quais criptomoedas posso operar?",
    answer: "Nossa plataforma suporta mais de 120 pares de trading, incluindo BTC, ETH, BNB, SOL, DOT, ADA e muitos outros. Os robôs são otimizados para operar principalmente pares com USDT e BUSD, que oferecem maior liquidez e estabilidade para os algoritmos.",
  },
  {
    question: "Quais são os custos para usar a plataforma?",
    answer: "Oferecemos um plano gratuito com acesso a 2 robôs básicos e limitação de US$1.000 em capital. Nossos planos pagos começam em US$29/mês com acesso a robôs avançados, copy trading, e sem limitação de capital. Não cobramos taxas sobre lucros ou comissões por operação.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-white dark:bg-blue-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[2.75rem] font-semibold leading-[1.2] tracking-tight text-black mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-black">
            Tire suas dúvidas sobre nossa plataforma de trading automatizado com IA.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-black">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-black">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-black mb-6">
              Ainda tem dúvidas? Nossa equipe está pronta para ajudar.
            </p>
            <Link href="/auth/register">
              <Button className="bg-[#5957D5] hover:bg-[#4F4EC0] text-white px-6 py-3 rounded-md font-medium text-center transition-colors">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
