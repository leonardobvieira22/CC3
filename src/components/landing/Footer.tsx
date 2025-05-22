"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 dark:bg-blue-dark pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <div className="relative h-8 w-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5957D5] to-[#367EFF] rounded-md"></div>
                <span className="relative z-10 flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  A
                </span>
              </div>
              <span className="font-semibold text-lg text-[#0F1115] ml-2">AI Crypto</span>
            </div>
            <p className="text-black mb-6">
              Plataforma de trading automatizado com inteligência artificial para maximizar seus ganhos no mercado de criptomoedas.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-blue-highlight">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-highlight">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-highlight">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-highlight">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-highlight">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#beneficios" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#depoimentos" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#blog" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#documentation" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Documentação
                </Link>
              </li>
              <li>
                <Link href="#academy" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  Academia de Trading
                </Link>
              </li>
              <li>
                <Link href="#api" className="text-black hover:text-blue-highlight dark:hover:text-blue-highlight">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-black">Contato</h3>
            <ul className="space-y-3">
              <li className="text-black">
                contato@aicryptotrading.com
              </li>
              <li className="text-black">
                +55 (11) 4002-8922
              </li>
              <li className="text-black">
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-medium-contrast dark:text-medium-contrast text-sm mb-4 md:mb-0">
            &copy; {currentYear} AI Crypto Trading. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-medium-contrast dark:text-medium-contrast text-sm hover:text-blue-highlight dark:hover:text-blue-highlight">
              Privacidade
            </Link>
            <Link href="/terms" className="text-medium-contrast dark:text-medium-contrast text-sm hover:text-blue-highlight dark:hover:text-blue-highlight">
              Termos de Uso
            </Link>
            <Link href="/cookies" className="text-medium-contrast dark:text-medium-contrast text-sm hover:text-blue-highlight dark:hover:text-blue-highlight">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
