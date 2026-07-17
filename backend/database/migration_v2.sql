-- ============================================================
-- Sagar Feeds — Migration v2
-- Run this ONLY ONCE if you already ran the original schema.sql from the
-- first delivery, and only if you haven't already applied it. If you're
-- setting up fresh, just run schema.sql — it already includes all of this.
--
--   mysql -u <user> -p sagarfeeds < migration_v2.sql
-- ============================================================

-- Dealer territory (Admin assigns a district to each Dealer account)
ALTER TABLE users ADD COLUMN service_area VARCHAR(100) DEFAULT NULL;

-- Product image override (admin-managed products can use an external image URL)
ALTER TABLE products ADD COLUMN image_url VARCHAR(500) DEFAULT NULL;

-- eSewa transaction reference + a 'failed' payment status for retry flow
ALTER TABLE orders ADD COLUMN esewa_ref_id VARCHAR(100) DEFAULT NULL;
ALTER TABLE orders MODIFY COLUMN payment_status ENUM('pending', 'paid', 'cod_pending', 'failed') NOT NULL DEFAULT 'cod_pending';

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_resets_token (token)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_id INT DEFAULT NULL,
  message VARCHAR(255) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_notifications_user (user_id)
);
