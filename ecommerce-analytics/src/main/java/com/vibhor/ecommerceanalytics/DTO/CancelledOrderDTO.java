package com.vibhor.ecommerceanalytics.DTO;

import java.time.LocalDateTime;

/**
 * Projection for cancelled or returned orders.
 */
public interface CancelledOrderDTO {

    Integer getOrderId();
    Integer getCustomerId();
    String getCustomerName();
    Double getTotalAmount();
    String getStatus();
    LocalDateTime getOrderDate();
}
