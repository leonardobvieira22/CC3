import { type NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/services/emailService';

// Esta é uma rota de teste temporária para verificar o funcionamento do serviço de email
// Desativar ou proteger em ambiente de produção

export async function POST(req: NextRequest) {
  try {
    // Processar corpo da requisição
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // URL de teste para verificação
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const testVerificationUrl = `${appUrl}/auth/verify-email?token=test-token-123&email=${encodeURIComponent(email)}`;

    // Enviar email de teste de verificação
    const result = await emailService.sendVerificationEmail({
      to: email,
      name: name || 'Usuário Teste',
      verificationUrl: testVerificationUrl
    });

    return NextResponse.json(
      {
        message: 'Email de teste enviado com sucesso!',
        details: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
    return NextResponse.json(
      {
        message: 'Erro interno ao enviar email de teste',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
