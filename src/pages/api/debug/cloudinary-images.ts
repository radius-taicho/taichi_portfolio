import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cloudinary URL最適化関数（MainSectionと同じ）
const optimizeCloudinaryUrl = (url: string, width?: number, height?: number) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  const params = [
    "f_auto",
    "q_100", 
    "c_fill",
    width ? `w_${Math.round(width * 2)}` : null,
    height ? `h_${Math.round(height * 2)}` : null,
    "dpr_auto",
    "fl_progressive",
    "fl_immutable_cache", 
    "fl_preserve_transparency",
    "fl_awebp",
    "fl_strip_profile",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${params}/`);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 全作品の画像情報を取得
    const works = await prisma.work.findMany({
      include: {
        images: {
          where: { isVisible: true },
          select: {
            id: true,
            title: true,
            imageUrl: true,
            rarity: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const imageAnalysis = works.map(work => {
      const originalMainImage = work.mainImage;
      const optimizedMainImage = work.mainImage ? optimizeCloudinaryUrl(work.mainImage, 440, 320) : null;

      return {
        workId: work.id,
        workTitle: work.title,
        workType: work.type,
        mainImage: {
          original: originalMainImage,
          optimized: optimizedMainImage,
          isCloudinary: originalMainImage?.includes('cloudinary.com') || false,
        },
        additionalImages: work.images.map(img => ({
          id: img.id,
          title: img.title,
          original: img.imageUrl,
          optimized: optimizeCloudinaryUrl(img.imageUrl, 200, 200),
          isCloudinary: img.imageUrl?.includes('cloudinary.com') || false,
          rarity: img.rarity
        })),
        imageCount: work.images.length,
      };
    });

    const summary = {
      totalWorks: works.length,
      worksWithMainImage: works.filter(w => w.mainImage).length,
      worksWithAdditionalImages: works.filter(w => w.images.length > 0).length,
      totalAdditionalImages: works.reduce((sum, w) => sum + w.images.length, 0),
      cloudinaryMainImages: works.filter(w => w.mainImage?.includes('cloudinary.com')).length,
      cloudinaryAdditionalImages: works.reduce((sum, w) => 
        sum + w.images.filter(img => img.imageUrl?.includes('cloudinary.com')).length, 0
      ),
    };

    // URLアクセシビリティテスト用サンプル
    const sampleUrls = imageAnalysis
      .filter(work => work.mainImage.isCloudinary)
      .slice(0, 3)
      .map(work => ({
        workTitle: work.workTitle,
        originalUrl: work.mainImage.original,
        optimizedUrl: work.mainImage.optimized,
      }));

    console.log('=== Cloudinary Image Analysis ===');
    console.log('Summary:', summary);
    console.log('Sample URLs for testing:', sampleUrls);

    res.status(200).json({
      summary,
      sampleUrls,
      detailedAnalysis: imageAnalysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cloudinary analysis error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}
