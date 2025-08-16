import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Fetching hero image...');
    
    // データベース接続テスト
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // アクティブなHeroImageを取得（最新のものを1つ）
    const heroImage = await prisma.heroImage.findFirst({
      where: {
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    console.log('Hero image query result:', heroImage ? 'Found' : 'Not found');

    if (!heroImage) {
      return res.status(404).json({ message: 'No active hero image found' });
    }

    res.status(200).json(heroImage);
  } catch (error) {
    console.error('Hero image fetch error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : 
        'Server error'
    });
  }
}
