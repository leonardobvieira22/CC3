"use client"

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Bot,
  Settings,
  BarChart3,
  DollarSign,
  FileText,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Shield,
  Mail, // Adicionado ícone de email
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Itens de navegação do painel administrativo
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Robôs',
    href: '/admin/robots',
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: 'Finanças',
    href: '/admin/finance',
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Logs',
    href: '/admin/logs',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Logs de Email', // Novo item
    href: '/admin/email-logs',
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-blue-dark">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-blue-medium/20 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                AI Crypto Admin
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
                    "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-blue-dark/60"
                  )}
                >
                  <div className="flex items-center">
                    <span className={cn(
                      "mr-3",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.icon}
                    </span>
                    {item.title}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center">
              <div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/images/avatar-1.png" alt="Admin" />
                  <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Staff
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Administrador
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Perfil de Administrador
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="sm:max-w-xs">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2 dark:border-gray-800">
              <Link href="/admin/dashboard" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Admin
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
                    "flex items-center justify-between px-4 py-3 text-sm font-medium",
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </span>
                    {item.title}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center">
                <div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/images/avatar-1.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Staff
                  </p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Administrador
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

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4 md:mx-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-blue-dark/60 py-2 pl-10 pr-4 text-sm"
                />
              </div>
            </div>

            {/* Right side nav items */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="/images/avatar-1.png" alt="Admin" />
                    <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Perfil de Administrador
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-blue-dark/50 py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
