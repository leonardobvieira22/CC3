"use client"

import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, CheckCircle, Ban, Settings, Mail } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados de exemplo para usuários
const mockUsers = [
  {
    id: 1,
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    avatar: '/images/avatar-1.png',
    status: 'active',
    plan: 'premium',
    joined: '2024-04-25T12:34:56Z',
    balance: 12450,
    activeRobots: 3
  },
  {
    id: 2,
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    avatar: '/images/avatar-2.png',
    status: 'active',
    plan: 'standard',
    joined: '2024-04-23T09:23:45Z',
    balance: 5670,
    activeRobots: 2
  },
  {
    id: 3,
    name: 'Pedro Santos',
    email: 'pedro.santos@example.com',
    avatar: '/images/avatar-3.png',
    status: 'inactive',
    plan: 'free',
    joined: '2024-04-22T15:42:18Z',
    balance: 0,
    activeRobots: 0
  },
  {
    id: 4,
    name: 'Juliana Costa',
    email: 'juliana.costa@example.com',
    avatar: '/images/avatar-4.png',
    status: 'pending',
    plan: 'free',
    joined: '2024-04-21T18:12:33Z',
    balance: 100,
    activeRobots: 1
  },
  {
    id: 5,
    name: 'Marcos Pereira',
    email: 'marcos.pereira@example.com',
    avatar: '/images/avatar-5.png',
    status: 'active',
    plan: 'premium',
    joined: '2024-04-20T11:05:29Z',
    balance: 18340,
    activeRobots: 4
  },
  {
    id: 6,
    name: 'Fernanda Lima',
    email: 'fernanda.lima@example.com',
    avatar: '/images/avatar-1.png',
    status: 'active',
    plan: 'standard',
    joined: '2024-04-19T10:45:21Z',
    balance: 7825,
    activeRobots: 2
  },
  {
    id: 7,
    name: 'Roberto Alves',
    email: 'roberto.alves@example.com',
    avatar: '/images/avatar-2.png',
    status: 'suspended',
    plan: 'standard',
    joined: '2024-04-18T14:32:11Z',
    balance: 4350,
    activeRobots: 0
  },
  {
    id: 8,
    name: 'Camila Ferreira',
    email: 'camila.ferreira@example.com',
    avatar: '/images/avatar-3.png',
    status: 'active',
    plan: 'premium',
    joined: '2024-04-17T09:18:42Z',
    balance: 22180,
    activeRobots: 5
  },
  {
    id: 9,
    name: 'Lucas Martins',
    email: 'lucas.martins@example.com',
    avatar: '/images/avatar-4.png',
    status: 'active',
    plan: 'free',
    joined: '2024-04-16T16:24:53Z',
    balance: 450,
    activeRobots: 1
  },
  {
    id: 10,
    name: 'Isabella Souza',
    email: 'isabella.souza@example.com',
    avatar: '/images/avatar-5.png',
    status: 'inactive',
    plan: 'free',
    joined: '2024-04-15T13:57:36Z',
    balance: 0,
    activeRobots: 0
  }
]

interface UserTableProps {
  limit?: number
}

export const UserTable: React.FC<UserTableProps> = ({ limit }) => {
  // Mostrar todos os usuários ou limitar pelo parâmetro
  const users = limit ? mockUsers.slice(0, limit) : mockUsers

  // Função para formatar o status do usuário
  const formatStatus = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
            Inativo
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Pendente
          </Badge>
        )
      case 'suspended':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Suspenso
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  // Função para formatar o plano do usuário
  const formatPlan = (plan: string) => {
    switch (plan) {
      case 'premium':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            Premium
          </Badge>
        )
      case 'standard':
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">
            Standard
          </Badge>
        )
      case 'free':
        return (
          <Badge variant="outline">
            Gratuito
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {plan}
          </Badge>
        )
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">#</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuário</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plano</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saldo</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Robôs</th>
            <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cadastro</th>
            <th className="py-3 px-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-blue-dark/40">
              <td className="py-3 px-2 text-sm text-gray-500 dark:text-gray-400">{user.id}</td>
              <td className="py-3 px-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-2">
                {formatStatus(user.status)}
              </td>
              <td className="py-3 px-2">
                {formatPlan(user.plan)}
              </td>
              <td className="py-3 px-2 text-sm">
                <span className="font-medium">
                  {user.balance > 0 ? `$${user.balance.toLocaleString('pt-BR')}` : '$0'}
                </span>
              </td>
              <td className="py-3 px-2 text-sm text-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {user.activeRobots}
                </span>
              </td>
              <td className="py-3 px-2 text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(user.joined), 'dd/MM/yyyy', { locale: ptBR })}
              </td>
              <td className="py-3 px-2 text-right text-sm font-medium">
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' || user.status === 'pending' ? (
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          <Ban className="mr-2 h-4 w-4" />
                          Suspender
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600 dark:text-green-400">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Ativar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
