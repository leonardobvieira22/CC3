"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  ListOrdered,
  Users,
  Wallet,
  Settings,
  HelpCircle,
  Bell,
  User,
  Menu,
  X,
  CandlestickChart,
  BellRing,
  LineChart,
  PencilRuler
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Robôs",
    href: "/dashboard/robots",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Trading",
    href: "/dashboard/trading",
    icon: <CandlestickChart className="h-5 w-5" />,
  },
  {
    title: "Backtesting",
    href: "/dashboard/backtesting",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    title: "Paper Trading",
    href: "/dashboard/paper-trading",
    icon: <PencilRuler className="h-5 w-5" />,
  },
  {
    title: "Alertas",
    href: "/dashboard/alerts",
    icon: <BellRing className="h-5 w-5" />,
  },
  {
    title: "Histórico",
    href: "/dashboard/history",
    icon: <ListOrdered className="h-5 w-5" />,
  },
  {
    title: "Copy Trading",
    href: "/dashboard/copy-trading",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Carteira",
    href: "/dashboard/wallet",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Suporte",
    href: "/dashboard/support",
    icon: <HelpCircle className="h-5 w-5" />,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-blue-dark">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-blue-medium/20 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight dark:from-blue-light dark:to-blue-highlight">
                AI Crypto
              </span>
            </Link>
          </div>
          <div className="mt-8 flex flex-1 flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-3 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-blue-50 dark:bg-blue-dark text-blue-highlight"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-blue-dark/60"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-white">
                  JS
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    João Silva
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Plano Gratuito
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="sm:max-w-xs">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2 dark:border-gray-800">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-dark to-blue-highlight dark:from-blue-light dark:to-blue-highlight">
                  AI Crypto
                </span>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto pt-4">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-3 text-sm font-medium",
                    pathname === item.href
                      ? "text-blue-highlight"
                      : "text-gray-600 dark:text-gray-300"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-white">
                  JS
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    João Silva
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Plano Gratuito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white dark:bg-blue-medium/20 shadow-sm dark:border-b dark:border-gray-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-blue-dark/60 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-highlight focus:outline-none focus:ring-1 focus:ring-blue-highlight"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full md:hidden"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuItem>Suporte</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
