const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 データベース接続をテスト中...')
    
    // 作品データの取得テスト
    const worksCount = await prisma.work.count()
    console.log(`✅ Works テーブル: ${worksCount}件`)
    
    // ヒーロー画像の取得テスト
    const heroImagesCount = await prisma.heroImage.count()
    console.log(`✅ Hero Images テーブル: ${heroImagesCount}件`)
    
    // お問い合わせテーブルへの書き込みテスト
    const testContact = await prisma.contact.create({
      data: {
        name: 'Connection Test',
        email: 'test@example.com',
        message: 'Database connection test message',
      }
    })
    console.log(`✅ Contact 作成テスト: ID ${testContact.id}`)
    
    // テストデータを削除
    await prisma.contact.delete({
      where: { id: testContact.id }
    })
    console.log('🧹 テストデータを削除しました')
    
    console.log('🎉 すべてのテストが成功しました！')
    
  } catch (error) {
    console.error('❌ データベース接続エラー:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
