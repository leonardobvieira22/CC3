import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Estende o tipo User do NextAuth para incluir propriedades customizadas
   */
  interface User {
    id: string;
    role?: string;
  }

  /**
   * Estende o tipo Session do NextAuth para incluir propriedades customizadas para o usuário
   */
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    // Outros campos que você deseja adicionar ao token JWT
  }
}
