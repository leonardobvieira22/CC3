"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const navItems = [
  {
    name: "Recursos",
    href: "#recursos",
    dropdown: [
      { name: "Robôs de Trading", href: "#robos" },
      { name: "Integração com Binance", href: "#binance" },
      { name: "Backtesting", href: "#backtesting" },
      { name: "Paper Trading", href: "#paper-trading" },
    ],
  },
  {
    name: "Por que AI Crypto",
    href: "#porque",
    dropdown: [
      { name: "Casos de Uso", href: "#casos-uso" },
      { name: "Para Iniciantes", href: "#iniciantes" },
      { name: "Para Traders", href: "#traders" },
    ],
  },
  { name: "Preços", href: "/pricing" },
  { name: "Blog", href: "#blog" },
  {
    name: "Documentação",
    href: "#documentacao",
    dropdown: [
      { name: "API", href: "#api" },
      { name: "Guias", href: "#guias" },
      { name: "Tutoriais", href: "#tutoriais" },
    ],
  },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#5957D5] to-[#367EFF] rounded-md"></div>
                <span className="relative z-10 flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  A
                </span>
              </div>
              <span className="font-semibold text-lg text-[#0F1115]">AI Crypto</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.dropdown ? index : null)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-[15px] text-[#0F1115] hover:text-[#5957D5] rounded-md font-medium flex items-center"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === index && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md bg-white shadow-lg border border-gray-100">
                    <div className="py-1">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-[#0F1115] hover:bg-gray-50 hover:text-[#5957D5]"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/auth/login" className="text-[15px] text-[#0F1115] hover:text-[#5957D5] px-3 py-2 rounded-md font-medium">
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="bg-[#5957D5] hover:bg-[#4F4EC0] text-white px-5 py-2.5 rounded-md font-medium transition-colors"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#5957D5] hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item, index) => (
                <div key={index} className="py-2">
                  <div
                    className="flex justify-between items-center px-3 py-2 text-base font-medium text-[#0F1115] rounded-md hover:bg-gray-50 hover:text-[#5957D5]"
                    onClick={() => {
                      if (item.dropdown) {
                        setActiveDropdown(activeDropdown === index ? null : index)
                      }
                    }}
                  >
                    <Link href={item.href}>{item.name}</Link>
                    {item.dropdown && (
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          activeDropdown === index ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  {item.dropdown && activeDropdown === index && (
                    <div className="mt-2 pl-4 space-y-1">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-3 py-2 text-base text-[#6E7589] hover:bg-gray-50 hover:text-[#5957D5] rounded-md"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-3">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-base font-medium text-center text-[#0F1115] hover:text-[#5957D5] border border-gray-200 rounded-md"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 text-base font-medium text-center text-white bg-[#5957D5] hover:bg-[#4F4EC0] rounded-md"
                >
                  Começar Grátis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
