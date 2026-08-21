-- ============================================================================
-- V3__order_status_history.sql
--
-- Creates an audit trail for every order status transition.
-- Each row records: which order, from what status, to what status,
-- who triggered it, when, and an optional note.
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
    history_id   INT AUTO_INCREMENT PRIMARY KEY,
    order_id     INT NOT NULL,
    from_status  VARCHAR(30) NULL,
    to_status    VARCHAR(30) NOT NULL,
    changed_by   VARCHAR(100) NULL,
    note         VARCHAR(500) NULL,
    changed_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_osh_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON DELETE CASCADE
);
