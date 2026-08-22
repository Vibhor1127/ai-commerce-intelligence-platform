-- ============================================================================
-- E-Commerce Business Intelligence Database Initialization Script
-- ============================================================================

CREATE DATABASE IF NOT EXISTS e_commerce;
USE e_commerce;

-- 1. App Users (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS app_users (
    user_id     INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    product_id   INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150)   NOT NULL,
    price        DECIMAL(10,2)  NOT NULL,
    stock        INT            NOT NULL,
    category_id  INT            NOT NULL,
    image_url    VARCHAR(500)   NULL,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

-- 4. Customers
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NULL UNIQUE,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NULL,
    city        VARCHAR(100) NOT NULL,
    CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES app_users (user_id)
        ON DELETE SET NULL
);

-- 5. Addresses
CREATE TABLE IF NOT EXISTS addresses (
    address_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT NOT NULL,
    line1        VARCHAR(150) NOT NULL,
    line2        VARCHAR(150) NULL,
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(20)  NOT NULL,
    phone        VARCHAR(20)  NOT NULL,
    is_default   BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_addresses_customer
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        ON DELETE CASCADE
);

-- 6. Cart & Cart Items
CREATE TABLE IF NOT EXISTS cart (
    cart_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT NOT NULL UNIQUE,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_customer
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id         INT AUTO_INCREMENT PRIMARY KEY,
    cart_id              INT NOT NULL,
    product_id           INT NOT NULL,
    quantity             INT NOT NULL DEFAULT 1,
    unit_price_snapshot  DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES cart (cart_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products (product_id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id    INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status      VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

-- 8. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id      INT NOT NULL,
    product_id    INT NOT NULL,
    quantity      INT NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- 9. Order Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    history_id  INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    from_status VARCHAR(30) NULL,
    to_status   VARCHAR(30) NOT NULL,
    changed_by  VARCHAR(50) NOT NULL,
    note        VARCHAR(255) NULL,
    changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON DELETE CASCADE
);

-- 10. Payments
CREATE TABLE IF NOT EXISTS payments (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    payment_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON DELETE CASCADE
);

-- 11. Shipments
CREATE TABLE IF NOT EXISTS shipments (
    shipment_id     INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL UNIQUE,
    shipment_status VARCHAR(30) NOT NULL,
    shipment_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shipments_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON DELETE CASCADE
);

-- 12. Reviews
CREATE TABLE IF NOT EXISTS reviews (
    review_id    INT AUTO_INCREMENT PRIMARY KEY,
    product_id   INT NOT NULL,
    customer_id  INT NOT NULL,
    rating       INT NOT NULL,
    comment      TEXT NULL,
    review_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products (product_id),
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

-- 13. Inventory Logs
CREATE TABLE IF NOT EXISTS inventory_logs (
    log_id        INT AUTO_INCREMENT PRIMARY KEY,
    product_id    INT NOT NULL,
    stock_before  INT NOT NULL,
    stock_after   INT NOT NULL,
    change_type   VARCHAR(50) NOT NULL,
    change_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_logs_product
        FOREIGN KEY (product_id) REFERENCES products (product_id)
);

-- ============================================================================
-- SEED DATA
-- Default Admin: username=admin, password=admin ($2a$10$wO3mYvB983xU... bcrypt)
-- Default User:  username=user,  password=user
-- ============================================================================

INSERT IGNORE INTO app_users (user_id, username, password, role) VALUES
(1, 'admin', '$2a$10$i2qTslcM3j/W00i3gWvIzeo1y5678w8qC672aV81x0yN8hM4.l9Q6', 'ADMIN'),
(2, 'user',  '$2a$10$i2qTslcM3j/W00i3gWvIzeo1y5678w8qC672aV81x0yN8hM4.l9Q6', 'USER');

INSERT IGNORE INTO categories (category_id, category_name) VALUES
(1, 'Home & Kitchen'),
(2, 'Sports & Fitness'),
(3, 'Toys & RC Vehicles'),
(4, 'Consumer Electronics'),
(5, 'Fashion & Apparel');

INSERT IGNORE INTO products (product_id, product_name, price, stock, category_id, image_url) VALUES
(1, 'Apex 750W Turbo Mixer Grinder (3 Stainless Steel Jars)', 3499.00, 45, 1, '/images/mixer-grinder.jpg'),
(2, 'Pro Match Size 5 Tournament Football', 1299.00, 80, 2, '/images/football.jpg'),
(3, 'HyperSpeed 4WD High-Speed Remote Control Offroad Car', 4999.00, 25, 3, '/images/remote-car.jpg'),
(4, 'Quantum ANC Wireless Noise-Cancelling Headphones', 7999.00, 30, 4, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
(5, 'Ergonomic Mesh Executive Chair with Lumbar Support', 8499.00, 15, 1, 'https://images.unsplash.com/photo-1580481077197-25e2e8584841?w=800&auto=format&fit=crop&q=80'),
(6, 'Smart Hydro Stainless Steel Thermal Flask 1000ml', 899.00, 120, 2, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80');

INSERT IGNORE INTO customers (customer_id, user_id, first_name, last_name, city) VALUES
(1, 1, 'Admin', 'User', 'Bengaluru'),
(2, 2, 'Vibhor', 'Srivastava', 'Lucknow');

INSERT IGNORE INTO addresses (address_id, customer_id, line1, city, state, pincode, phone, is_default) VALUES
(1, 2, 'Flat 402, Royal Palms, Gomti Nagar', 'Lucknow', 'Uttar Pradesh', '226010', '9876543210', TRUE);

INSERT IGNORE INTO reviews (review_id, product_id, customer_id, rating, comment, review_date) VALUES
(1, 1, 2, 5, 'Exceptional build quality and powerful 750W motor. Jars are heavy grade stainless steel.', NOW()),
(2, 2, 2, 5, 'Great grip and aerodynamic balance for competitive football matches.', NOW()),
(3, 3, 2, 5, 'High speed suspension handles grass and gravel smoothly. Great battery runtime.', NOW());
