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

    // デバッグ：アイコン作品の画像データをコンソールに出力
    const illustrationWorks = works.filter(work => 
      work.type.toLowerCase().includes('illustration') || 
      work.type.toLowerCase().includes('icon')
    );
    
    if (illustrationWorks.length > 0) {
      console.log('API Debug - Illustration Works:', illustrationWorks.map(work => ({
        workId: work.id,
        workTitle: work.title,
        imageCount: work.images?.length || 0,
        images: work.images?.map(img => ({
          id: img.id,
          title: img.title,
          description: img.description,
          fileName: img.imageUrl?.split('/').pop()
        }))
      })));
    }

    res.status(200).json(works);
  } catch (error) {
    console.error('Works fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
