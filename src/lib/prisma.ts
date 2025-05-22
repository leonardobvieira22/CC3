// Mock PrismaClient que implementa as funcionalidades básicas
// Este mock será usado quando o Prisma Client real não puder ser inicializado
class MockPrismaClient {
  // Mock de usuários para teste
  private mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      password: '$2b$10$EikMgY7SvXVNC3t9oNK.C.S1BAqZ36jY/T14XFp.JwfZ5lP/X4R3m', // "admin123" criptografado
      cpf: '123.456.789-00',
      dateOfBirth: new Date('1990-01-01'),
      isActive: true,
      termsAccepted: true,
      privacyAccepted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Usuário Demo',
      email: 'demo@example.com',
      role: 'USER',
      password: '$2b$10$rMeOXgEfpGj9NajHmqMoHO8BsPJQaB.J1g3lJCWQa4aFCTwOf69nO', // "demo123" criptografado
      cpf: '987.654.321-00',
      dateOfBirth: new Date('1995-05-15'),
      isActive: true,
      termsAccepted: true,
      privacyAccepted: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  user = {
    findUnique: async (params: { where: { id?: string; email?: string; cpf?: string } }) => {
      console.log('Mock: user.findUnique chamado', params);

      if (params.where.id) {
        return this.mockUsers.find(u => u.id === params.where.id) || null;
      }
      else if (params.where.email) {
        return this.mockUsers.find(u => u.email === params.where.email) || null;
      }
      else if (params.where.cpf) {
        return this.mockUsers.find(u => u.cpf === params.where.cpf) || null;
      }

      return null;
    },

    create: async (params: { data: { email: string; cpf?: string; name?: string; role?: string; password?: string; dateOfBirth?: Date; isActive?: boolean; termsAccepted?: boolean; privacyAccepted?: boolean; [key: string]: unknown } }) => {
      console.log('Mock: user.create chamado', params);

      // Validar se email já existe
      const existingEmail = this.mockUsers.find(u => u.email === params.data.email);
      if (existingEmail) {
        throw new Error('Email já está em uso');
      }

      // Validar se CPF já existe
      if (params.data.cpf) {
        const existingCpf = this.mockUsers.find(u => u.cpf === params.data.cpf);
        if (existingCpf) {
          throw new Error('CPF já está em uso');
        }
      }

      // Criar novo usuário com todos os campos obrigatórios
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        name: params.data.name ?? 'Novo Usuário',
        email: params.data.email,
        role: params.data.role ?? 'USER',
        password: params.data.password ?? '',
        cpf: params.data.cpf ?? '',
        dateOfBirth: params.data.dateOfBirth ?? new Date('2000-01-01'),
        isActive: params.data.isActive ?? true,
        termsAccepted: params.data.termsAccepted ?? true,
        privacyAccepted: params.data.privacyAccepted ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
        // ...outros campos opcionais...
      };

      this.mockUsers.push(newUser);

      return newUser;
    },

    update: async (params: { where: { id: string }; data: { [key: string]: unknown } }) => {
      console.log('Mock: user.update chamado', params);

      const userIndex = this.mockUsers.findIndex(u => u.id === params.where.id);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar o usuário existente
      this.mockUsers[userIndex] = {
        ...this.mockUsers[userIndex],
        ...params.data,
        updatedAt: new Date(),
      };

      return this.mockUsers[userIndex];
    },

    delete: async (params: { where: { id: string } }) => {
      console.log('Mock: user.delete chamado', params);

      const userIndex = this.mockUsers.findIndex(u => u.id === params.where.id);
      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      const deletedUser = this.mockUsers[userIndex];
      this.mockUsers.splice(userIndex, 1);

      return deletedUser;
    }
  };

  tradingSetting = {
    create: async (params: { data: { [key: string]: unknown } }) => {
      console.log('Mock: tradingSetting.create chamado', params);
      return {
        id: Math.random().toString(36).substring(2, 15),
        ...params.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    update: async (params: { where: { id?: string }; data: { [key: string]: unknown } }) => {
      console.log('Mock: tradingSetting.update chamado', params);
      return {
        id: params.where.id || Math.random().toString(36).substring(2, 15),
        ...params.data,
        updatedAt: new Date(),
      };
    },
  };

  paperTradingWallet = {
    create: async (params: { data: { [key: string]: unknown } }) => {
      console.log('Mock: paperTradingWallet.create chamado', params);
      return {
        id: Math.random().toString(36).substring(2, 15),
        ...params.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
  };

  notificationPreferences = {
    create: async (params: { data: { [key: string]: unknown } }) => {
      console.log('Mock: notificationPreferences.create chamado', params);
      return {
        id: Math.random().toString(36).substring(2, 15),
        ...params.data,
        updatedAt: new Date(),
      };
    },
  };

  // Método para fechamento de conexão
  $disconnect() {
    return Promise.resolve();
  }
}

// Função que decide se deve usar o Prisma real ou o mock
function getPrismaClient(): PrismaClient {
  // Verificar se estamos no navegador (não suportado pelo Prisma)
  if (typeof window !== 'undefined') {
    console.log('Usando PrismaClient mock (browser environment)');
    return new MockPrismaClient() as unknown as PrismaClient;
  }

  // Tentar importar e criar o PrismaClient real
  try {
    // Importação dinâmica para evitar erro em ambientes sem dependência do Prisma
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');

    // Objeto global para armazenar a instância do Prisma
    const globalForPrisma = global as unknown as { prisma?: PrismaClient };

    // Criar ou reutilizar instância
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
      });

      console.log('Prisma Client inicializado com sucesso');
    }

    // Garantir que o retorno nunca seja undefined, usando fallback para nova instância do PrismaClient.
    return globalForPrisma.prisma ?? new PrismaClient();

  } catch (error) {
    console.error('Erro ao inicializar Prisma Client:', error);
    console.log('Usando PrismaClient mock devido a erro de inicialização');
    return new MockPrismaClient() as unknown as PrismaClient;
  }
}

// Importar tipo do Prisma Client para garantir compatibilidade de tipos
import type { PrismaClient } from '@prisma/client';

// Exportar instância
const prisma = getPrismaClient();
export default prisma;

// Substituir require() por import ES6, exceto em arquivos gerados.
// Substituir 'any' por tipos adequados nos métodos do PrismaClient e resultados de queries.
// Usar tipos do Prisma Client.
