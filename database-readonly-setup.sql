-- 完全読み取り専用ユーザーの作成（お問い合わせ機能なし）

-- 1. ユーザーの作成
CREATE USER 'portfolio_readonly'@'localhost' IDENTIFIED BY 'readonly_password';

-- 2. データベースへの基本接続権限
GRANT USAGE ON *.* TO 'portfolio_readonly'@'localhost';

-- 3. 閲覧のみの権限
GRANT SELECT ON taichi_portfolio_admin.works TO 'portfolio_readonly'@'localhost';
GRANT SELECT ON taichi_portfolio_admin.hero_images TO 'portfolio_readonly'@'localhost';

-- ※ contacts テーブルへの権限は付与しない（完全読み取り専用）

-- 4. 権限の反映
FLUSH PRIVILEGES;

-- 5. 権限の確認
SHOW GRANTS FOR 'portfolio_readonly'@'localhost';
