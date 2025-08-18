import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid work ID' });
  }

  try {
    // 指定されたIDの作品詳細を取得（selectでリレーションも含む）
    const work = await prisma.work.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        title: true,
        name: true,  // Missing field - this was causing the undefined value
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
        mainImage: true,
        designImage: true,
        link: true,
        displayOrder: true,
        isGroup: true,
        itemCount: true,
        createdAt: true,
        updatedAt: true,
        images: {
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    // Websiteタイプの他の作品を全て取得（現在の作品は除外）
    const otherWorks = await prisma.work.findMany({
      where: {
        type: {
          contains: 'Website'
        },
        id: {
          not: work.id
        }
      },
      select: {
        id: true,
        title: true,
        type: true,
        mainImage: true, // 後方互換性
        isGroup: true,
        images: {
          where: {
            isVisible: true
          },
          orderBy: {
            sortOrder: 'asc'
          },
          take: 1, // 一覧表示用には1枚だけ
          select: {
            id: true,
            imageUrl: true,
            title: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    res.status(200).json({
      work,
      otherWorks
    });
  } catch (error) {
    console.error('Work detail fetch error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      workId: id
    });
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : 
        'Server error'
    });
  }
}
