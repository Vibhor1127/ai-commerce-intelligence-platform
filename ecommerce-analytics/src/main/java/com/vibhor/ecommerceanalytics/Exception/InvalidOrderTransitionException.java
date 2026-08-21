package com.vibhor.ecommerceanalytics.Exception;

/**
 * Thrown when an order status transition violates the state machine rules.
 * Valid transitions:
 *   PENDING   → PROCESSING, CANCELLED
 *   PROCESSING → COMPLETED, CANCELLED
 *   COMPLETED → REFUNDED
 *   CANCELLED, REFUNDED → terminal (no further transitions)
 */
public class InvalidOrderTransitionException extends RuntimeException {
    public InvalidOrderTransitionException(String message) {
        super(message);
    }
}
