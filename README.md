# Taichi Portfolio

Webデザイナー・太一のポートフォリオサイト

## 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **データベース**: MySQL (Taichi Portfolio Adminと共有)
- **ORM**: Prisma
- **国際化**: カスタム言語プロバイダー
- **テーマ**: モダン/レトロ切り替え機能

## 機能

- 📱 レスポンシブデザイン
- 🌍 日本語/英語切り替え
- 🎨 モダン/レトロテーマ切り替え
- 🖼️ 作品ポートフォリオ表示
- 📧 お問い合わせ機能

## セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **環境変数の設定**
   ```bash
   cp .env.example .env
   ```
   
   `.env`ファイルを編集して、データベース接続文字列を設定してください。

3. **データベースの準備**
   
   Taichi Portfolio Adminと同じデータベースを使用します。
   読み取り専用ユーザーを作成することを推奨します：
   
   ```sql
   -- 読み取り専用ユーザーの作成
   CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';
   GRANT SELECT ON taichi_portfolio_admin.works TO 'portfolio_user'@'localhost';
   GRANT SELECT ON taichi_portfolio_admin.hero_images TO 'portfolio_user'@'localhost';
   GRANT INSERT ON taichi_portfolio_admin.contacts TO 'portfolio_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Prismaの設定**
   ```bash
   npx prisma generate
   ```

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── components/         # Reactコンポーネント
│   ├── providers/      # Context Providers
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── HeroSection.tsx # ヒーローセクション
│   ├── WorksSection.tsx# 作品セクション
│   ├── Footer.tsx      # フッター
│   └── Controls.tsx    # テーマ・言語切り替え
├── lib/                # ユーティリティ
│   └── prisma.ts       # Prismaクライアント
└── types/              # TypeScript型定義
    └── index.ts
```

## 使用方法

### テーマ切り替え
右上のボタンでモダン/レトロテーマを切り替えできます。

### 言語切り替え
右上のボタンで日本語/英語を切り替えできます。

### 作品表示
- Website作品: グリッド表示
- Illustration & Icon Design: 大きな画像表示

## カスタマイズ

### テーマの追加
`src/components/providers/ThemeProvider.tsx`でテーマを追加できます。

### 言語の追加
`src/components/providers/LanguageProvider.tsx`で翻訳を追加できます。

### スタイルのカスタマイズ
`tailwind.config.js`でカスタムカラーやスタイルを設定できます。

## データベース連携

このサイトはTaichi Portfolio Adminの管理画面で登録されたデータを表示します：

- 作品データ（works テーブル）
- ヒーロー画像（hero_images テーブル）
- お問い合わせの送信（contacts テーブルに追加）

## 本番環境

本番環境では以下の設定を行ってください：

1. 環境変数の設定
2. データベースユーザーの権限制限
3. セキュリティ設定の確認

## ライセンス

Private License
