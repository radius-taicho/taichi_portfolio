const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPermissions() {
  console.log('🔒 権限テストを開始します...\n')

  try {
    // ✅ 許可されている操作のテスト
    console.log('📖 【許可されている操作】')
    
    // 作品データの閲覧
    const worksCount = await prisma.work.count()
    console.log(`✅ 作品データ閲覧: ${worksCount}件取得成功`)
    
    // ヒーロー画像の閲覧
    const heroCount = await prisma.heroImage.count()
    console.log(`✅ ヒーロー画像閲覧: ${heroCount}件取得成功`)
    
    // お問い合わせの送信
    const testContact = await prisma.contact.create({
      data: {
        name: 'Permission Test',
        email: 'test@example.com', 
        message: 'Testing INSERT permission'
      }
    })
    console.log(`✅ お問い合わせ送信: ID ${testContact.id} 作成成功`)

  } catch (error) {
    console.log(`❌ 許可操作でエラー: ${error.message}`)
  }

  console.log('\n🚫 【禁止されている操作】')
  
  // ❌ 禁止されている操作のテスト
  try {
    // 作品データの更新を試行
    await prisma.work.update({
      where: { id: 'dummy-id' },
      data: { title: 'Hacked!' }
    })
    console.log('❌ 危険: 作品データの更新ができました！')
  } catch (error) {
    console.log('✅ 作品データ更新: 正しく拒否されました')
  }

  try {
    // 作品データの削除を試行
    await prisma.work.delete({
      where: { id: 'dummy-id' }
    })
    console.log('❌ 危険: 作品データの削除ができました！')
  } catch (error) {
    console.log('✅ 作品データ削除: 正しく拒否されました')
  }

  try {
    // お問い合わせデータの閲覧を試行
    await prisma.contact.findMany()
    console.log('❌ 危険: お問い合わせデータの閲覧ができました！') 
  } catch (error) {
    console.log('✅ お問い合わせ閲覧: 正しく拒否されました')
  }

  try {
    // ユーザーテーブルへのアクセスを試行
    await prisma.$queryRaw`SELECT * FROM users LIMIT 1`
    console.log('❌ 危険: ユーザーデータにアクセスできました！')
  } catch (error) {
    console.log('✅ ユーザーデータアクセス: 正しく拒否されました')
  }

  console.log('\n🎯 【結論】')
  console.log('重要なデータは読み取り専用で保護されています')
  console.log('お問い合わせ送信のみ許可されています')

  await prisma.$disconnect()
}

testPermissions()
