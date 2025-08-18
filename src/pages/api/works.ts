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
    await prisma.$connect();
    
    // Works テーブルから表示順に並べて取得（selectでリレーションも含む）
    const works = await prisma.work.findMany({
      select: {
        id: true,
        title: true,
        name: true,  // Missing field - needed for project descriptions
        type: true,
        status: true,
        client: true,
        concept: true,
        target: true,
        challenge: true,
        purpose: true,
        informationDesign: true,
        design: true,
        implementation: true,
        planningDays: true,
        designDays: true,
        codingDays: true,
        // 後方互換性のため保持
        mainImage: true,
        designImage: true,
        link: true,
        displayOrder: true,
        // 新機能
        isGroup: true,
        itemCount: true,
        createdAt: true,
        updatedAt: true,
        // リレーション（selectの中で指定）
        images: {
          where: {
            isVisible: true // UFOキャッチャー表示用の画像のみ
          },
          orderBy: {
            sortOrder: 'asc'
          },
          select: {
            id: true,
            imageUrl: true,
            publicId: true,
            title: true,
            description: true,
            imageType: true,
            category: true,
            sortOrder: true,
            isVisible: true,
            rarity: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });



    res.status(200).json(works);
  } catch (error) {
    console.error('Works fetch error:', {
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
