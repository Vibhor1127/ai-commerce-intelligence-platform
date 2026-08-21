-- ============================================================================
-- V4__product_images.sql
--
-- Adds a nullable image_url column to the products table so admins can
-- assign a product image URL that the storefront renders.
-- ============================================================================

ALTER TABLE products
    ADD COLUMN image_url VARCHAR(500) NULL AFTER product_name;
