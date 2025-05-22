import NextAuth, { type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

// Usuários de demonstração para desenvolvimento
const demoUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$EikMgY7SvXVNC3t9oNK.C.S1BAqZ36jY/T14XFp.JwfZ5lP/X4R3m', // admin123
    image: 'https://avatars.githubusercontent.com/u/1?v=4',
    role: 'ADMIN',
  },
  {
    id: '2',
    name: 'Usuário Demo',
    email: 'demo@example.com',
    password: '$2b$10$rMeOXgEfpGj9NajHmqMoHO8BsPJQaB.J1g3lJCWQa4aFCTwOf69nO', // demo123
    image: 'https://avatars.githubusercontent.com/u/2?v=4',
    role: 'USER',
  }
];

/**
 * Opções de configuração do NextAuth
 */
export const authOptions: NextAuthOptions = {
  // Usar o adaptador Prisma para Next-Auth quando possível
  adapter: PrismaAdapter(prisma),

  // Usar JWT para sessões
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  // Páginas customizadas
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },

  // Configuração de segurança
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  // Provedores de autenticação
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Verificar credenciais hardcoded primeiro (para desenvolvimento e testes)
          const demoUser = demoUsers.find(u => u.email === credentials.email);

          if (demoUser) {
            const passwordMatch = await bcrypt
              .compare(credentials.password, demoUser.password)
              .catch(() => false);

            if (passwordMatch) {
              return {
                id: demoUser.id,
                name: demoUser.name,
                email: demoUser.email,
                image: demoUser.image,
                role: demoUser.role,
              }
            }
          }

          // Se não for um usuário de demonstração, tenta verificar no banco de dados
          try {
            // Verificar usuário no banco de dados
            const user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user || !user.password) {
              console.log('Usuário não encontrado ou sem senha');
              return null
            }

            // Verificar se o email foi verificado (exceto usuários de demonstração/admin)
            if (!user.emailVerified && user.role !== 'ADMIN') {
              throw new Error('email_not_verified');
            }

            // Verificar se a senha está correta
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!isPasswordValid) {
              console.log('Senha inválida');
              return null
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role,
            }
          } catch (dbError) {
            console.error('Erro ao verificar usuário no banco de dados:', dbError);
            // Se houver erro no banco de dados, volta a tentar apenas com usuários de demonstração
            return null;
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    async session({ session, token }) {
      // Adiciona o ID do usuário à sessão
      if (token.sub) {
        session.user.id = token.sub;

        // Adiciona o papel do usuário à sessão
        if (token.role) {
          session.user.role = token.role as string;
        } else {
          // Tenta encontrar o papel nos usuários de demonstração primeiro
          const demoUser = demoUsers.find(u => u.id === token.sub);
          if (demoUser) {
            session.user.role = demoUser.role;
          } else {
            // Tenta buscar o papel do usuário do banco de dados
            try {
              const user = await prisma.user.findUnique({
                where: { id: token.sub },
                select: { role: true },
              });

              if (user) {
                session.user.role = user.role;
              } else {
                // Default para USER se não conseguir buscar
                session.user.role = 'USER';
              }
            } catch (error) {
              console.error('Erro ao buscar papel do usuário:', error);
              // Default para USER se houver erro
              session.user.role = 'USER';
            }
          }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // Adiciona dados do usuário ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};

// Manipulador de rota para o NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
