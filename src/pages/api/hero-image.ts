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
    // アクティブなHeroImageを取得（最新のものを1つ）
    const heroImage = await prisma.heroImage.findFirst({
      where: {
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (!heroImage) {
      return res.status(404).json({ message: 'No active hero image found' });
    }

    res.status(200).json(heroImage);
  } catch (error) {
    console.error('Hero image fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
