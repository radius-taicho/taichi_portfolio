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
    // 全作品のdesignImageの状況をチェック
    const works = await prisma.work.findMany({
      select: {
        id: true,
        title: true,
        mainImage: true,
        designImage: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const analysis = {
      totalWorks: works.length,
      worksWithMainImage: works.filter(w => w.mainImage).length,
      worksWithDesignImage: works.filter(w => w.designImage).length,
      works: works.map(work => ({
        id: work.id,
        title: work.title,
        hasMainImage: !!work.mainImage,
        hasDesignImage: !!work.designImage,
        mainImageUrl: work.mainImage ? work.mainImage.substring(0, 50) + '...' : null,
        designImageUrl: work.designImage ? work.designImage.substring(0, 50) + '...' : null,
        createdAt: work.createdAt,
        updatedAt: work.updatedAt
      }))
    };

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Debug analysis error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}
