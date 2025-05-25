import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // データベース接続をテスト
    await prisma.$connect();
    
    // HeroImageテーブルの全データを取得
    const heroImages = await prisma.heroImage.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const response = {
      status: 'success',
      connection: 'connected',
      totalHeroImages: heroImages.length,
      activeHeroImages: heroImages.filter(img => img.isActive).length,
      heroImages: heroImages.map(img => ({
        id: img.id,
        title: img.title,
        description: img.description?.substring(0, 100) + (img.description && img.description.length > 100 ? '...' : ''),
        imageUrl: img.imageUrl,
        isActive: img.isActive,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      status: 'error',
      connection: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      totalHeroImages: 0,
      activeHeroImages: 0,
      heroImages: []
    });
  } finally {
    await prisma.$disconnect();
  }
}
