import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { emailService } from '@/lib/services/emailService';

/**
 * GET - Obter logs de email com paginação e filtros
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Obter parâmetros da query
    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || undefined;
    const emailType = searchParams.get('type') || undefined;
    const email = searchParams.get('email') || undefined;

    // Obter logs de email
    const result = await emailService.getAllEmailLogs({
      page,
      limit,
      status,
      emailType,
      email
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao obter logs de email:', error);
    return NextResponse.json(
      { message: 'Erro interno ao processar sua solicitação' },
      { status: 500 }
    );
  }
}

/**
 * POST - Testar envio de email (apenas para admins)
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Processar corpo da requisição
    const body = await req.json();
    const { email, name, type } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // URL de teste
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let result: unknown;

    // Enviar email de teste baseado no tipo
    if (type === 'reset') {
      const testResetUrl = `${appUrl}/auth/reset-password?token=test-token-admin-123`;
      result = await emailService.sendPasswordResetEmail({
        to: email,
        name: name || 'Usuário Teste Admin',
        resetUrl: testResetUrl,
        userId: session.user.id
      });
    } else {
      // Padrão: verificação de email
      const testVerificationUrl = `${appUrl}/auth/verify-email?token=test-token-admin-123&email=${encodeURIComponent(email)}`;
      result = await emailService.sendVerificationEmail({
        to: email,
        name: name || 'Usuário Teste Admin',
        verificationUrl: testVerificationUrl,
        userId: session.user.id
      });
    }

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
