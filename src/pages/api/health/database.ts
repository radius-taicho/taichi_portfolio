import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const startTime = Date.now();

  try {
    console.log('=== Database Health Check Started ===');
    
    // 1. 基本的な接続テスト
    await prisma.$connect();
    console.log('✅ Database connection established');

    // 2. テーブル存在確認
    const tableChecks = await Promise.allSettled([
      prisma.work.findFirst({ select: { id: true } }),
      prisma.heroImage.findFirst({ select: { id: true } }),
      prisma.contact.findFirst({ select: { id: true } }),
      prisma.workImage.findFirst({ select: { id: true } }),
    ]);

    const tableStatus = {
      works: tableChecks[0].status === 'fulfilled' ? '✅ OK' : '❌ Error',
      heroImages: tableChecks[1].status === 'fulfilled' ? '✅ OK' : '❌ Error', 
      contacts: tableChecks[2].status === 'fulfilled' ? '✅ OK' : '❌ Error',
      workImages: tableChecks[3].status === 'fulfilled' ? '✅ OK' : '❌ Error',
    };

    console.log('Table status:', tableStatus);

    // 3. 簡単なカウントクエリ
    const counts = await Promise.allSettled([
      prisma.work.count(),
      prisma.heroImage.count(),
      prisma.contact.count(),
      prisma.workImage.count(),
    ]);

    const dataCounts = {
      works: counts[0].status === 'fulfilled' ? counts[0].value : 'Error',
      heroImages: counts[1].status === 'fulfilled' ? counts[1].value : 'Error',
      contacts: counts[2].status === 'fulfilled' ? counts[2].value : 'Error',
      workImages: counts[3].status === 'fulfilled' ? counts[3].value : 'Error',
    };

    console.log('Data counts:', dataCounts);

    const responseTime = Date.now() - startTime;

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        connected: true,
        tables: tableStatus,
        counts: dataCounts,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseType: process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'Unknown',
      },
      prisma: {
        version: process.env.npm_package_dependencies__prisma_client || 'Unknown',
        clientInitialized: true,
      }
    };

    console.log('=== Database Health Check Completed ===');
    res.status(200).json(healthStatus);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('❌ Database Health Check Failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
    });

    const errorStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'UNKNOWN',
        details: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.stack : undefined) : 
          'Error details hidden in production'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseType: process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'Unknown',
      }
    };

    res.status(503).json(errorStatus);
  }
}
