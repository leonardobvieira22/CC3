"use client"

import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    content: "Os robôs de IA triplicaram meu lucro em 3 meses! A plataforma é extremamente intuitiva e o suporte é incrível.",
    author: "Carlos S.",
    role: "Trader Experiente",
    avatar: "/images/avatar-1.png",
    stars: 5,
  },
  {
    content: "Copy trading é perfeito para quem está começando! Não entendo muito de criptomoedas, mas estou conseguindo resultados consistentes.",
    author: "Mariana L.",
    role: "Investidora Iniciante",
    avatar: "/images/avatar-2.png",
    stars: 5,
  },
  {
    content: "Seguro e fácil de usar, recomendo! Já testei outras plataformas, mas nenhuma tem a tecnologia de IA tão avançada.",
    author: "Rafael M.",
    role: "Engenheiro de Software",
    avatar: "/images/avatar-3.png",
    stars: 5,
  },
  {
    content: "Comecei com o plano gratuito e rapidamente fiz upgrade. Os robôs identificam oportunidades que eu jamais veria sozinho.",
    author: "Patricia K.",
    role: "Analista Financeira",
    avatar: "/images/avatar-4.png",
    stars: 4,
  },
  {
    content: "A integração com a Binance é perfeita! Não preciso transferir meus fundos para outra plataforma e ainda ganho com a automação.",
    author: "André B.",
    role: "Empresário",
    avatar: "/images/avatar-5.png",
    stars: 5,
  },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-white dark:bg-blue-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-[2.75rem] font-semibold leading-[1.2] tracking-tight text-black mb-6"
          >
            O que nossos traders dizem
          </h2>
          <p className="text-lg text-black">
            Junte-se a milhares de traders satisfeitos que transformaram sua experiência de trading com nossa plataforma.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border border-[#4B5CFA] rounded-3xl shadow-lg bg-white flex flex-col p-8 items-center text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-highlight">
                    <CardContent className="p-0 flex-1 flex flex-col justify-between">
                      <div className="flex mb-4 justify-center">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      {/* Avatar com fundo sutil */}
                      <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-dark dark:to-blue-medium rounded-full p-2 shadow-md flex items-center justify-center">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                            <AvatarFallback className="bg-blue-light text-white text-lg">
                              {testimonial.author.split(' ').map(n => n[0]).join('').slice(0,2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      {/* Depoimento */}
                      <p className="text-black mb-6 text-base md:text-lg font-medium leading-relaxed relative">
                        <span className="text-3xl text-[#4B5CFA] font-bold mr-2 align-top">“</span>
                        {testimonial.content}
                        <span className="text-3xl text-[#4B5CFA] font-bold ml-2 align-bottom">”</span>
                      </p>
                      {/* Autor */}
                      <div className="flex flex-col items-center mt-auto">
                        <p className="font-bold text-[#4B5CFA] text-lg">{testimonial.author}</p>
                        <p className="text-sm text-black font-medium">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}
