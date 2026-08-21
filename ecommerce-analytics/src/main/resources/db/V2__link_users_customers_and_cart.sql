-- ============================================================================
-- V2__link_users_customers_and_cart.sql
--
-- Run manually against a COPY of the e_commerce database before starting
-- the app (ddl-auto=none). Alters existing tables and normalizes orders.status.
-- ============================================================================

-- STEP 1: Link customers -> app_users
ALTER TABLE customers
    ADD COLUMN user_id INT NULL AFTER customer_id;

ALTER TABLE customers
    ADD CONSTRAINT uq_customers_user_id UNIQUE (user_id);

ALTER TABLE customers
    ADD CONSTRAINT fk_customers_user
        FOREIGN KEY (user_id) REFERENCES app_users (user_id)
        ON DELETE SET NULL;

-- STEP 2: Addresses
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

-- STEP 3: Cart + cart_items
CREATE TABLE IF NOT EXISTS cart (
    cart_id      INT AUTO_INCREMENT PRIMARY KEY,
    customer_id  INT NOT NULL UNIQUE,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP,
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

-- STEP 4: Normalize orders.status + shipping address
-- Map legacy labels onto the canonical enum set before UPPER().
UPDATE orders SET status = 'COMPLETED'
    WHERE UPPER(status) IN ('DELIVERED', 'SHIPPED', 'PAID');
UPDATE orders SET status = 'REFUNDED'
    WHERE UPPER(status) IN ('RETURNED');
UPDATE orders SET status = 'PROCESSING'
    WHERE UPPER(status) IN ('CONFIRMED', 'PACKED');
UPDATE orders SET status = UPPER(status);

ALTER TABLE orders
    ADD COLUMN shipping_address_id INT NULL AFTER customer_id;

ALTER TABLE orders
    ADD CONSTRAINT fk_orders_address
        FOREIGN KEY (shipping_address_id) REFERENCES addresses (address_id)
        ON DELETE SET NULL;
