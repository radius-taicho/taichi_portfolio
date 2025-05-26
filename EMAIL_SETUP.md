# Gmail設定手順 - Nodemailer用

## 1. Googleアカウントの2段階認証を有効化

1. [Googleアカウント](https://myaccount.google.com/) にアクセス
2. 「セキュリティ」→「2段階認証プロセス」を有効化

## 2. アプリパスワードの生成

1. Googleアカウント設定で「セキュリティ」→「アプリパスワード」
2. 「アプリを選択」→「メール」
3. 「デバイスを選択」→「その他（カスタム名）」→「Node.js App」
4. 生成された16桁のパスワードを `.env.local` に設定

## 3. 環境変数設定例

```bash
# Gmail設定
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # 16桁のアプリパスワード
EMAIL_FROM=your-gmail@gmail.com
EMAIL_TO=contact@yourdomain.com

# セキュリティ設定
CONTACT_SECRET=your-random-secret-key-here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 4. 他のメールプロバイダーの設定

### Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```bash
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### 独自ドメインメール
```bash
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587  # または 465 (SSL)
EMAIL_USER=contact@yourdomain.com
EMAIL_PASS=your-email-password
```

## 5. テスト方法

1. 環境変数を設定
2. 開発サーバーを再起動: `npm run dev`
3. Contactページでテスト送信
4. 送信先メールアドレスとGmailを確認

## 6. セキュリティチェックリスト

- ✅ 環境変数でメール認証情報を管理
- ✅ レート制限でスパム攻撃を防止
- ✅ 入力値のバリデーションとサニタイゼーション
- ✅ HTMLエスケープでXSS攻撃を防止
- ✅ 適切なエラーハンドリング
- ✅ 送信ログの記録
- ✅ 自動返信メール機能

## 7. 本番環境での追加推奨設定

- Redis等の外部ストレージでレート制限管理
- MongoDBやPostgreSQLでお問い合わせ履歴保存
- Cloudflare等のCDNでDDoS攻撃対策
- SSL/TLS証明書の適切な設定
