-- 最小限の権限設定（USAGEなし）

-- 1. ユーザーの作成（これだけでUSAGE権限が自動付与される）
CREATE USER 'portfolio_minimal'@'localhost' IDENTIFIED BY 'minimal_password';

-- 2. 必要な権限のみ設定
GRANT SELECT ON taichi_portfolio_admin.works TO 'portfolio_minimal'@'localhost';
GRANT SELECT ON taichi_portfolio_admin.hero_images TO 'portfolio_minimal'@'localhost';
GRANT INSERT ON taichi_portfolio_admin.contacts TO 'portfolio_minimal'@'localhost';

-- 3. 権限の反映
FLUSH PRIVILEGES;

-- 4. 権限の確認（USAGEが自動的に付与されているか確認）
SHOW GRANTS FOR 'portfolio_minimal'@'localhost';
