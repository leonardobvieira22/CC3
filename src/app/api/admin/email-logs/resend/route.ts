import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';

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
    const { logId } = body;

    if (!logId) {
      return NextResponse.json(
        { message: 'ID do log é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o log de email
    const log = await prisma.emailLog.findUnique({
      where: { id: logId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!log) {
      return NextResponse.json(
        { message: 'Log de email não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se podemos reenviar este tipo de email
    const canResend = ['VERIFICATION', 'PASSWORD_RESET', 'TEST'].includes(log.emailType);

    if (!canResend) {
      return NextResponse.json(
        { message: 'Este tipo de email não pode ser reenviado diretamente' },
        { status: 400 }
      );
    }

    // Preparar URL para reenvio
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let result: unknown;

    // Buscar informações no banco de dados se for email de verificação ou recuperação de senha
    if (log.emailType === 'VERIFICATION') {
      // Verificar se o usuário existe
      if (!log.userId) {
        return NextResponse.json(
          { message: 'Usuário não encontrado para este email' },
          { status: 404 }
        );
      }

      // Obter informações do usuário
      const user = await prisma.user.findUnique({
        where: { id: log.userId }
      });

      if (!user || !user.emailVerificationToken) {
        return NextResponse.json(
          { message: 'Não foi possível reenviar este email de verificação. Token não disponível.' },
          { status: 400 }
        );
      }

      // Construir URL de verificação
      const verificationUrl = `${appUrl}/auth/verify-email?token=${user.emailVerificationToken}&email=${encodeURIComponent(log.toEmail)}`;

      // Reenviar email de verificação
      result = await emailService.sendVerificationEmail({
        to: log.toEmail,
        name: log.toName || 'Usuário',
        verificationUrl,
        userId: log.userId ?? undefined
      });
    }
    else if (log.emailType === 'PASSWORD_RESET') {
      // Verificar se o usuário existe
      if (!log.userId) {
        return NextResponse.json(
          { message: 'Usuário não encontrado para este email' },
          { status: 404 }
        );
      }

      // Gerar novo token de redefinição de senha
      const crypto = await import('crypto');
      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

      // Atualizar token no banco de dados
      await prisma.user.update({
        where: { id: log.userId },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry
        }
      });

      // Construir URL de redefinição
      const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;

      // Reenviar email de redefinição de senha
      result = await emailService.sendPasswordResetEmail({
        to: log.toEmail,
        name: log.toName || 'Usuário',
        resetUrl,
        userId: log.userId ?? undefined
      });
    }
    else if (log.emailType === 'TEST') {
      // Para emails de teste, simplesmente reenviamos um novo email de teste
      if (log.subject.includes('Verificação')) {
        // Email de verificação de teste
        const testVerificationUrl = `${appUrl}/auth/verify-email?token=test-token-resent-${Date.now()}&email=${encodeURIComponent(log.toEmail)}`;
        result = await emailService.sendVerificationEmail({
          to: log.toEmail,
          name: log.toName || 'Usuário Teste',
          verificationUrl: testVerificationUrl,
          userId: log.userId ?? undefined
        });
      } else {
        // Email de redefinição de senha de teste
        const testResetUrl = `${appUrl}/auth/reset-password?token=test-token-resent-${Date.now()}`;
        result = await emailService.sendPasswordResetEmail({
          to: log.toEmail,
          name: log.toName || 'Usuário Teste',
          resetUrl: testResetUrl,
          userId: log.userId ?? undefined
        });
      }
    }

    return NextResponse.json({
      message: 'Email reenviado com sucesso',
      details: result
    });
  } catch (error) {
    console.error('Erro ao reenviar email:', error);
    return NextResponse.json(
      {
        message: 'Erro ao reenviar email',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
