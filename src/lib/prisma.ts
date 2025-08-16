import { PrismaClient } from '@prisma/client'

// Prismaクライアント用のグローバル型定義
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// シングルトンパターンでPrismaクライアントを初期化
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// 開発環境でのみグローバルに保存（HMRでの再初期化を防ぐ）
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// プロセス終了時にPrisma接続をクリーンアップ
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
