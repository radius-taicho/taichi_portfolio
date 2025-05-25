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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid work ID' });
  }

  try {
    // 指定されたIDの作品詳細を取得
    const work = await prisma.work.findUnique({
      where: {
        id: id
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
      orderBy: {
        displayOrder: 'asc'
      },
      select: {
        id: true,
        title: true,
        type: true,
        mainImage: true
      }
    });

    res.status(200).json({
      work,
      otherWorks
    });
  } catch (error) {
    console.error('Work detail fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
