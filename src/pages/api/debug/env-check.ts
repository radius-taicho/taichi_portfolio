import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 環境変数の確認（セキュリティのため値は部分的に隠す）
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    hasNextPublicCloudinaryCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    cloudNamePreview: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.substring(0, 3) + '***',
    // データベース接続確認
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseType: process.env.DATABASE_URL?.includes('mysql') ? 'MySQL' : 
                  process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'Unknown',
    // NextAuth設定確認
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    // その他の重要な設定
    timestamp: new Date().toISOString(),
    serverInfo: {
      platform: process.platform,
      nodeVersion: process.version,
    }
  };

  console.log('=== Environment Check ===');
  console.log('Environment variables status:', envCheck);

  res.status(200).json({
    status: 'Environment check completed',
    environment: envCheck,
    recommendations: [
      !envCheck.hasNextPublicCloudinaryCloudName && 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing',
      !envCheck.hasDatabaseUrl && 'DATABASE_URL is missing',
      !envCheck.hasNextAuthUrl && 'NEXTAUTH_URL is missing',
      !envCheck.hasNextAuthSecret && 'NEXTAUTH_SECRET is missing',
    ].filter(Boolean),
  });
}
