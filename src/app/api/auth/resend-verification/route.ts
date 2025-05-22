import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { isValidEmail } from '@/lib/utils/validation'
import { randomUUID } from 'node:crypto'

// Schema de validação para reenvio de email
const resendVerificationSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
})

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json()

    // Validar dados de entrada
    const result = resendVerificationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Email inválido', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Se o usuário não existir, retornar erro
    if (!user) {
      return NextResponse.json(
        { message: 'Não foi possível encontrar um usuário com este email.' },
        { status: 404 }
      )
    }

    // Se o email já foi verificado, retornar mensagem
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Seu email já foi verificado. Você pode fazer login normalmente.' },
        { status: 200 }
      )
    }

    // Gerar novo token de verificação
    const verificationToken = randomUUID()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Atualizar usuário com novo token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: tokenExpiry,
      },
    })

    // Enviar email com link para verificação
    try {
      const { emailService } = await import('@/lib/services/emailService');

      // Construir a URL de verificação
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verificationUrl = `${appUrl}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

      // Enviar email de verificação, agora incluindo o userId
      await emailService.sendVerificationEmail({
        to: email,
        name: user.name || 'Usuário',
        verificationUrl,
        userId: user.id
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
      // Não interrompe o fluxo, log apenas para depuração
    }

    return NextResponse.json(
      { message: 'Email de verificação reenviado com sucesso. Por favor, verifique sua caixa de entrada e spam.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao reenviar email de verificação:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
