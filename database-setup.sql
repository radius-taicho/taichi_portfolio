-- 読み取り専用ユーザーの作成（正しい権限設定）

-- 1. ユーザーの作成
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'portfolio_password';

-- 2. データベースへの基本接続権限
GRANT USAGE ON *.* TO 'portfolio_user'@'localhost';

-- 3. 特定テーブルへの読み取り権限
GRANT SELECT ON taichi_portfolio_admin.works TO 'portfolio_user'@'localhost';
GRANT SELECT ON taichi_portfolio_admin.hero_images TO 'portfolio_user'@'localhost';

-- 4. お問い合わせテーブルへの書き込み権限
GRANT INSERT ON taichi_portfolio_admin.contacts TO 'portfolio_user'@'localhost';

-- 5. 権限の反映
FLUSH PRIVILEGES;

-- 6. 権限の確認
SHOW GRANTS FOR 'portfolio_user'@'localhost';
