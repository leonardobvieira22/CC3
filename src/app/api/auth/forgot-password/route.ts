import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { isValidEmail } from '@/lib/utils/validation'
import { randomUUID } from 'node:crypto'

// Schema de validação para requisição de recuperação de senha
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
})

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json()

    // Validar dados de entrada
    const result = forgotPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Email inválido', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Verificar se o email existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Sempre retornar a mesma resposta independente do resultado
    // para evitar enumeração de usuários
    if (!user) {
      console.log(`Tentativa de recuperação para email não cadastrado: ${email}`)
      return NextResponse.json(
        { message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.' },
        { status: 200 }
      )
    }

    // Gerar token de redefinição de senha
    const resetToken = randomUUID()
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hora

    // Atualizar usuário com token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      },
    })

    // Enviar email com link para reset de senha
    try {
      const { emailService } = await import('@/lib/services/emailService');

      // Construir a URL de reset
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;

      // Enviar email de recuperação de senha
      await emailService.sendPasswordResetEmail({
        to: email,
        name: user.name || 'Usuário',
        resetUrl,
        userId: user.id
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de recuperação de senha:', emailError);
      // Não interrompe o fluxo, log apenas para depuração
    }

    return NextResponse.json(
      { message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao processar solicitação de recuperação de senha:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
