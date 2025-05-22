"use client"

import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet, ExternalLink, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados de exemplo para transações
const mockTransactions = [
  {
    id: 'TX12345678',
    type: 'deposit',
    amount: 2500,
    currency: 'USD',
    user: 'Carlos Oliveira',
    userId: 1,
    date: '2024-05-19T14:32:45Z',
    status: 'completed',
    method: 'credit_card'
  },
  {
    id: 'TX12345679',
    type: 'withdrawal',
    amount: 1200,
    currency: 'USD',
    user: 'Ana Silva',
    userId: 2,
    date: '2024-05-19T12:21:15Z',
    status: 'completed',
    method: 'bank_transfer'
  },
  {
    id: 'TX12345680',
    type: 'subscription',
    amount: 99,
    currency: 'USD',
    user: 'Marcos Pereira',
    userId: 5,
    date: '2024-05-19T10:15:33Z',
    status: 'completed',
    method: 'credit_card',
    plan: 'premium'
  },
  {
    id: 'TX12345681',
    type: 'trading_fee',
    amount: 12.50,
    currency: 'USD',
    user: 'Juliana Costa',
    userId: 4,
    date: '2024-05-19T09:45:22Z',
    status: 'completed',
    tradeId: 'TRD98765432'
  },
  {
    id: 'TX12345682',
    type: 'deposit',
    amount: 5000,
    currency: 'USD',
    user: 'Camila Ferreira',
    userId: 8,
    date: '2024-05-19T08:12:18Z',
    status: 'pending',
    method: 'pix'
  },
  {
    id: 'TX12345683',
    type: 'withdrawal',
    amount: 3500,
    currency: 'USD',
    user: 'Fernando Gomes',
    userId: 11,
    date: '2024-05-18T18:33:27Z',
    status: 'rejected',
    method: 'bank_transfer',
    reason: 'insufficient_funds'
  },
  {
    id: 'TX12345684',
    type: 'trading_fee',
    amount: 28.75,
    currency: 'USD',
    user: 'Roberto Alves',
    userId: 7,
    date: '2024-05-18T16:22:11Z',
    status: 'completed',
    tradeId: 'TRD98765433'
  },
  {
    id: 'TX12345685',
    type: 'referral_bonus',
    amount: 50,
    currency: 'USD',
    user: 'Isabela Souza',
    userId: 10,
    date: '2024-05-18T14:11:09Z',
    status: 'completed',
    referredUser: 'Lucas Martins'
  },
  {
    id: 'TX12345686',
    type: 'subscription',
    amount: 49,
    currency: 'USD',
    user: 'Pedro Santos',
    userId: 3,
    date: '2024-05-18T12:45:55Z',
    status: 'completed',
    method: 'credit_card',
    plan: 'standard'
  },
  {
    id: 'TX12345687',
    type: 'deposit',
    amount: 1000,
    currency: 'USD',
    user: 'Lucas Martins',
    userId: 9,
    date: '2024-05-18T10:33:42Z',
    status: 'completed',
    method: 'pix'
  }
]

interface RecentTransactionsProps {
  limit?: number
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ limit }) => {
  // Mostrar todas as transações ou limitar pelo parâmetro
  const transactions = limit ? mockTransactions.slice(0, limit) : mockTransactions

  // Função para formatar o tipo de transação
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mr-3">
              <ArrowDownRight className="h-4 w-4" />
            </div>
            <span>Depósito</span>
          </div>
        )
      case 'withdrawal':
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mr-3">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <span>Saque</span>
          </div>
        )
      case 'subscription':
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
              <CreditCard className="h-4 w-4" />
            </div>
            <span>Assinatura</span>
          </div>
        )
      case 'trading_fee':
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3">
              <ExternalLink className="h-4 w-4" />
            </div>
            <span>Taxa Trading</span>
          </div>
        )
      case 'referral_bonus':
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mr-3">
              <DollarSign className="h-4 w-4" />
            </div>
            <span>Bônus Indicação</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center mr-3">
              <Wallet className="h-4 w-4" />
            </div>
            <span>{type}</span>
          </div>
        )
    }
  }

  // Função para formatar o status da transação
  const formatStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            Concluída
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Pendente
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Rejeitada
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

  // Função para formatar o valor da transação
  const formatAmount = (type: string, amount: number, currency: string) => {
    const isPositive = ['deposit', 'referral_bonus'].includes(type)
    const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

    return (
      <span className={`font-medium ${color}`}>
        {isPositive ? '+' : '-'}${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-dark/40">
          <div className="flex-1">
            <div className="flex items-center">
              {formatTransactionType(transaction.type)}
            </div>
            <div className="mt-1 ml-11 text-xs text-gray-500 dark:text-gray-400">
              {transaction.method && (
                <span className="capitalize">
                  {transaction.method.replace('_', ' ')}
                </span>
              )}
              {transaction.method && transaction.plan && (
                <span className="mx-1">•</span>
              )}
              {transaction.plan && (
                <span className="capitalize">
                  Plano {transaction.plan}
                </span>
              )}
              {!transaction.method && !transaction.plan && transaction.tradeId && (
                <span>
                  Trade #{transaction.tradeId.substring(3, 7)}
                </span>
              )}
              {!transaction.method && !transaction.plan && !transaction.tradeId && transaction.referredUser && (
                <span>
                  Indicado: {transaction.referredUser}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div>{formatAmount(transaction.type, transaction.amount, transaction.currency)}</div>
            <div className="flex items-center mt-1">
              <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
              {formatStatus(transaction.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
