import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verificar se já existe usuário administrador
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  // Criar usuário administrador
  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        image: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
    });
    console.log('✅ Usuário admin criado');
  } else {
    console.log('✅ Usuário admin já existe');
  }

  // Verificar se já existe usuário de demonstração
  const demoExists = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  });

  // Criar usuário de demonstração
  if (!demoExists) {
    const demoUser = await prisma.user.create({
      data: {
        name: 'Usuário Demo',
        email: 'demo@example.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'USER',
        image: 'https://avatars.githubusercontent.com/u/2?v=4',
      },
    });

    // Criar configurações de trading para o usuário demo
    await prisma.tradingSetting.create({
      data: {
        userId: demoUser.id,
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
    });

    // Criar carteira de paper trading para o usuário demo
    await prisma.paperTradingWallet.create({
      data: {
        userId: demoUser.id,
        balance: 10000.0,
        equity: 10000.0,
        openPositionsJson: JSON.stringify([]),
        historyJson: JSON.stringify([]),
      },
    });

    // Criar preferências de notificação para o usuário demo
    await prisma.notificationPreferences.create({
      data: {
        userId: demoUser.id,
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
    });

    console.log('✅ Usuário demo criado com configurações completas');
  } else {
    console.log('✅ Usuário demo já existe');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fechar conexão com o banco de dados
    await prisma.$disconnect();
  });
