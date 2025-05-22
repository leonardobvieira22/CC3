import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

// Schema de validação para redefinição de senha
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json()

    // Validar dados de entrada
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // Buscar usuário pelo token de redefinição
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date() // Token ainda é válido
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado. Solicite uma nova redefinição de senha.' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Atualizar senha e limpar tokens de redefinição
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      }
    })

    return NextResponse.json(
      { message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao processar redefinição de senha:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
