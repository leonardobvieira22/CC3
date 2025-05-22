import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para a verificação de email
const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: 'Token inválido' }),
})

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json()

    // Validar dados de entrada
    const result = verifyEmailSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Token inválido', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { token } = result.data

    // Buscar usuário pelo token de verificação
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date() // Token ainda não expirou
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Link de verificação inválido ou expirado. Solicite um novo email de verificação.' },
        { status: 400 }
      )
    }

    // Atualizar usuário como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      }
    })

    return NextResponse.json(
      { message: 'Email verificado com sucesso! Você já pode fazer login na plataforma.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao verificar email:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
