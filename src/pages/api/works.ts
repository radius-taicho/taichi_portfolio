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
    // Works テーブルから表示順に並べて取得
    const works = await prisma.work.findMany({
      orderBy: {
        displayOrder: 'asc'
      },
      select: {
        id: true,
        title: true,
        type: true,
        mainImage: true,
        displayOrder: true
      }
    });

    res.status(200).json(works);
  } catch (error) {
    console.error('Works fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
