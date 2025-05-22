import { type NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { isValidCPF, isValidCPFFormat, cleanCPF, isAtLeast18YearsOld } from '@/lib/utils/validation'

// Schema de validação para o registro
const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, { message: 'Senha deve conter pelo menos um caractere especial' }),
  confirmPassword: z.string(),
  cpf: z
    .string()
    .refine((cpf) => {
      const cleanedCPF = cleanCPF(cpf);
      return cleanedCPF.length === 11;
    }, { message: 'CPF deve conter 11 dígitos' })
    .refine((cpf) => isValidCPF(cpf), { message: 'CPF inválido' }),
  dateOfBirth: z
    .string()
    .refine((date) => {
      try {
        return Boolean(new Date(date).toISOString());
      } catch {
        return false;
      }
    }, { message: 'Data de nascimento inválida' })
    .refine((date) => isAtLeast18YearsOld(date), {
      message: 'Você deve ter pelo menos 18 anos para se registrar'
    }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos e condições',
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar a política de privacidade',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json()

    // Validar dados de entrada
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Dados de cadastro inválidos', errors: result.error.errors },
        { status: 400 }
      )
    }

    const {
      name,
      email,
      password,
      cpf: rawCpf,
      dateOfBirth,
      termsAccepted,
      privacyAccepted,
      confirmPassword: _ // Desestruturar e ignorar
    } = result.data

    // Limpar CPF antes de continuar
    const cpf = cleanCPF(rawCpf)

    // Verificar se o usuário já existe pelo email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    }).catch(error => {
      console.error('Erro ao verificar email existente:', error)
      return null
    })

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificação de formato do CPF
    if (!isValidCPFFormat(rawCpf)) {
      return NextResponse.json(
        { message: 'Formato de CPF inválido. Use o formato XXX.XXX.XXX-XX ou apenas números.' },
        { status: 400 }
      )
    }

    // Verificar se o CPF já está cadastrado
    const existingCPF = await prisma.user.findUnique({
      where: { cpf },
    }).catch(error => {
      console.error('Erro ao verificar CPF existente:', error)
      return null
    })

    if (existingCPF) {
      return NextResponse.json(
        { message: 'CPF já cadastrado' },
        { status: 400 }
      )
    }

    // Validação adicional de CPF no servidor (algoritmo verificador)
    if (!isValidCPF(cpf)) {
      return NextResponse.json(
        { message: 'CPF inválido. O número informado não é um CPF válido.' },
        { status: 400 }
      )
    }

    // Validar idade mínima
    if (!isAtLeast18YearsOld(dateOfBirth)) {
      return NextResponse.json(
        { message: 'Você deve ter pelo menos 18 anos para se registrar' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpf,
        dateOfBirth: new Date(dateOfBirth),
        termsAccepted,
        privacyAccepted,
        isActive: true,
        // Criar token de verificação de email
        emailVerificationToken: crypto.randomUUID(),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      },
    }).catch(error => {
      console.error('Erro ao criar usuário:', error)
      throw new Error('Erro ao criar usuário no banco de dados')
    })

    // Criar configurações padrão para o usuário
    await prisma.tradingSetting.create({
      data: {
        userId: user.id,
        riskLevel: 'MEDIUM',
        defaultOrderSize: 5.0,
        maxOpenPositions: 5,
        defaultLeverage: 1.0,
        enableStopLoss: true,
        stopLossPercentage: 5.0,
        enableTakeProfit: true,
        takeProfitPercentage: 15.0,
        tradingPairs: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
      },
    }).catch(error => {
      console.error('Erro ao criar configurações de trading:', error)
      // Não interrompe o fluxo, pois o usuário já foi criado
    })

    // Criar carteira de paper trading para o usuário
    await prisma.paperTradingWallet.create({
      data: {
        userId: user.id,
        balance: 10000.0,
        equity: 10000.0,
        openPositionsJson: JSON.stringify([]),
        historyJson: JSON.stringify([]),
      },
    }).catch(error => {
      console.error('Erro ao criar carteira paper trading:', error)
      // Não interrompe o fluxo, pois o usuário já foi criado
    })

    // Criar preferências de notificação para o usuário
    await prisma.notificationPreferences.create({
      data: {
        userId: user.id,
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        emailFrequency: 'INSTANT',
        marketUpdates: true,
        tradeAlerts: true,
        securityAlerts: true,
        newsAlerts: false,
        priceAlerts: true,
        robotAlerts: true,
        subscriptionAlerts: true,
        quietHoursEnabled: false,
        timezone: 'UTC',
      },
    }).catch(error => {
      console.error('Erro ao criar preferências de notificação:', error)
      // Não interrompe o fluxo, pois o usuário já foi criado
    })

    // Enviar email de verificação usando o serviço de email
    try {
      const { emailService } = await import('@/lib/services/emailService');

      // Construir a URL de verificação
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verificationUrl = `${appUrl}/auth/verify-email?token=${user.emailVerificationToken}&email=${encodeURIComponent(email)}`;

      // Enviar email de verificação
      await emailService.sendVerificationEmail({
        to: email,
        name: name || 'Usuário',
        verificationUrl,
        userId: user.id
      });

    } catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError)
      // Não interrompe o fluxo, pois o usuário já foi criado
    }

    // Remover a senha e o token de verificação do objeto de retorno
    const { password: __, emailVerificationToken: ___, ...userWithoutSensitiveData } = user

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso. Por favor, verifique seu email para ativar sua conta.',
        user: userWithoutSensitiveData,
        requiresEmailVerification: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    )
  }
}
