-- ── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  first_name       VARCHAR(100) NOT NULL DEFAULT '',
  last_name        VARCHAR(100) NOT NULL DEFAULT '',
  email            VARCHAR(255) NOT NULL UNIQUE,
  phone            VARCHAR(40)  DEFAULT '',
  password_hash    VARCHAR(255) NOT NULL DEFAULT '',
  role             VARCHAR(20)  NOT NULL DEFAULT 'customer',
  admin_mobile     VARCHAR(15),
  admin_otp        VARCHAR(10),
  admin_otp_expires TIMESTAMP,
  address_line1    VARCHAR(255) DEFAULT '',
  city             VARCHAR(100) DEFAULT '',
  state            VARCHAR(100) DEFAULT '',
  zip_code         VARCHAR(20)  DEFAULT '',
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── Products ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255)    NOT NULL,
  price               DECIMAL(10, 2)  NOT NULL,
  category            VARCHAR(50)     NOT NULL,
  description         TEXT            NOT NULL,
  image_path          VARCHAR(500)    NOT NULL DEFAULT '',
  images_json         TEXT            DEFAULT NULL,
  is_new_arrival      BOOLEAN         NOT NULL DEFAULT FALSE,
  is_best_seller      BOOLEAN         NOT NULL DEFAULT FALSE,
  is_carousel         BOOLEAN         NOT NULL DEFAULT FALSE,
  is_on_offer         BOOLEAN         NOT NULL DEFAULT FALSE,
  is_trending         BOOLEAN         NOT NULL DEFAULT FALSE,
  sku                 VARCHAR(100)    DEFAULT '',
  discount_price      DECIMAL(10, 2)  DEFAULT NULL,
  tags                VARCHAR(500)    DEFAULT '',
  wash_care           TEXT            DEFAULT NULL,
  sleeve              VARCHAR(100)    DEFAULT NULL,
  pattern             VARCHAR(100)    DEFAULT NULL,
  package_contents    TEXT            DEFAULT NULL,
  net_quantity        INT             DEFAULT NULL,
  material            VARCHAR(255)    DEFAULT NULL,
  fit_type            VARCHAR(100)    DEFAULT NULL,
  shipping_info       TEXT            DEFAULT NULL,
  return_policy       TEXT            DEFAULT NULL,
  social_proof_count  INT             DEFAULT 855,
  social_proof_24hrs  INT             DEFAULT 12,
  stats_customers     VARCHAR(50)     DEFAULT NULL,
  stats_orders        VARCHAR(50)     DEFAULT NULL,
  stats_stores        VARCHAR(50)     DEFAULT NULL,
  created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── Product Inventory ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_inventory (
  id         SERIAL PRIMARY KEY,
  product_id INT         NOT NULL,
  size       VARCHAR(10) NOT NULL,
  stock      INT         NOT NULL DEFAULT 0,
  UNIQUE (product_id, size),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Carts ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id         VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Cart Items ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL      PRIMARY KEY,
  cart_id    VARCHAR(64) NOT NULL,
  product_id INT         NOT NULL,
  size       VARCHAR(10) NOT NULL,
  quantity   INT         NOT NULL,
  created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cart_id, product_id, size),
  CONSTRAINT fk_cart_item_cart    FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
  CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Orders ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                   SERIAL         PRIMARY KEY,
  user_id              INT            NULL,
  guest_email          VARCHAR(255)   NOT NULL DEFAULT '',
  guest_phone          VARCHAR(40)    NOT NULL DEFAULT '',
  status               VARCHAR(30)    NOT NULL DEFAULT 'pending',
  payment_status       VARCHAR(20)    NOT NULL DEFAULT 'pending',
  payment_method       VARCHAR(30)    NOT NULL DEFAULT 'cod',
  payment_provider     VARCHAR(50)    NOT NULL DEFAULT 'demo',
  payment_order_id     VARCHAR(255)   NOT NULL DEFAULT '',
  payment_reference    VARCHAR(255)   NOT NULL DEFAULT '',
  subtotal             DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping_amount      DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_amount      DECIMAL(10, 2) NOT NULL DEFAULT 0,
  coupon_code          VARCHAR(50)    DEFAULT NULL,
  total_amount         DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping_first_name  VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_last_name   VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_address     VARCHAR(255)   NOT NULL DEFAULT '',
  shipping_city        VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_state       VARCHAR(100)   NOT NULL DEFAULT '',
  shipping_zip_code    VARCHAR(20)    NOT NULL DEFAULT '',
  created_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Order Items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL         PRIMARY KEY,
  order_id     INT            NOT NULL,
  product_id   INT            NULL,
  product_name VARCHAR(255)   NOT NULL DEFAULT '',
  image_path   VARCHAR(500)   NOT NULL DEFAULT '',
  size         VARCHAR(10)    NOT NULL DEFAULT '',
  quantity     INT            NOT NULL,
  unit_price   DECIMAL(10, 2) NOT NULL DEFAULT 0,
  line_total   DECIMAL(10, 2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_order_item_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ── Coupons ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id               SERIAL         PRIMARY KEY,
  code             VARCHAR(50)    NOT NULL UNIQUE,
  type             VARCHAR(20)    NOT NULL DEFAULT 'percentage',
  value            DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  max_uses         INT            DEFAULT NULL,
  used_count       INT            NOT NULL DEFAULT 0,
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  starts_at        TIMESTAMP      NULL,
  expires_at       TIMESTAMP      NULL,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ── Reviews ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id             SERIAL      PRIMARY KEY,
  product_id     INT         NULL,
  customer_name  VARCHAR(200) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  rating         INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  is_approved    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ── Carousel Items ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carousel_items (
  id         SERIAL       PRIMARY KEY,
  type       VARCHAR(20)  NOT NULL DEFAULT 'product',
  product_id INT          NULL,
  media_url  VARCHAR(500) NULL,
  title      VARCHAR(255) NOT NULL DEFAULT '',
  subtitle   VARCHAR(255) NOT NULL DEFAULT '',
  link_url   VARCHAR(500) NOT NULL DEFAULT '',
  sort_order INT          NOT NULL DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carousel_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ── Shoppable Videos ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shoppable_videos (
  id             SERIAL          PRIMARY KEY,
  title          VARCHAR(255)    NOT NULL,
  description    TEXT,
  video_url      VARCHAR(1000)   NOT NULL,
  thumbnail_url  VARCHAR(1000),
  overlay_text   VARCHAR(120)    DEFAULT 'Comment "7"',
  price          DECIMAL(10, 2),
  discount_price DECIMAL(10, 2),
  sizes          VARCHAR(100)    DEFAULT 'S,M,L,XL',
  product_link   VARCHAR(500),
  likes          INT             NOT NULL DEFAULT 0,
  views          INT             NOT NULL DEFAULT 0,
  sort_order     INT             NOT NULL DEFAULT 0,
  is_active      BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── Homepage Dynamic Content ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homepage_content (
  id         SERIAL      PRIMARY KEY,
  section    VARCHAR(50) NOT NULL,
  key_name   VARCHAR(100) NOT NULL,
  value      TEXT,
  updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (section, key_name)
);

-- ── Seed default homepage content ────────────────────────────────────────────
INSERT INTO homepage_content (section, key_name, value) VALUES
('announcement', 'items', '["FREE SHIPPING ON ORDERS OVER ₹200","DAILY NEW LAUNCHES","9+ YEARS TRUSTED BRAND","100% GENUINE PRODUCTS","30-DAY EASY RETURNS","EXCLUSIVE MEMBERS OFFER — SIGN UP TODAY"]'),
('usp', 'items', '[{"iconName":"Truck","label":"Free Shipping","sub":"Orders over ₹200"},{"iconName":"RefreshCw","label":"Easy Returns","sub":"30-day policy"},{"iconName":"ShieldCheck","label":"Authentic Quality","sub":"Premium fabrics"},{"iconName":"Package","label":"Secure Packaging","sub":"Every order"}]'),
('offer', 'title', 'Today''s Offer — Up to 70% Off'),
('offer', 'subtitle', 'Offer ends at 10 PM tonight'),
('offer', 'endHour', '22'),
('hero', 'slides', '[{"badge":"🔥 HOT RIGHT NOW","title":["Hoodies That Hit","Different"],"description":"Oversized. Premium. Made for the modern gentleman.","cta":"Shop Hoodies","ctaLink":"/shop","image":"https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200","saveBadge":"SAVE 65%","saveSub":"Limited sizes left — order now"},{"badge":"⭐ NEW ARRIVAL","title":["Fresh Styles","Just Dropped"],"description":"New arrivals every week. Be the first to wear it.","cta":"Shop New Arrivals","ctaLink":"/new-arrivals","image":"https://images.unsplash.com/photo-1617724748068-691efeeaf542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200","saveBadge":"NEW IN","saveSub":"Spring / Summer 2026 Collection"},{"badge":"🏆 BESTSELLER","title":["Most Loved","Picks"],"description":"Trusted by thousands. Premium quality at unbeatable prices.","cta":"Shop Best Sellers","ctaLink":"/best-sellers","image":"https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200","saveBadge":"TOP RATED","saveSub":"Most purchased this month"}]')
ON CONFLICT (section, key_name) DO NOTHING;

-- ── Performance Indexes ──────────────────────────────────────────────────────
-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_is_on_offer ON products(is_on_offer);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Product inventory indexes
CREATE INDEX IF NOT EXISTS idx_product_inventory_product_id ON product_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_product_inventory_product_size ON product_inventory(product_id, size);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Coupons and reviews indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Carousel and videos indexes
CREATE INDEX IF NOT EXISTS idx_carousel_items_product_id ON carousel_items(product_id);
CREATE INDEX IF NOT EXISTS idx_shoppable_videos_is_active ON shoppable_videos(is_active);
