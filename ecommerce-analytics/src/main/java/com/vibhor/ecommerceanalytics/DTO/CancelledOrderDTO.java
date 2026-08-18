package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for cancelled or returned orders.
 */
public interface CancelledOrderDTO {

    Integer getOrderId();
    Integer getCustomerId();
    String getCustomerName();
    Double getTotalAmount();
    String getStatus();
    String getOrderDate();
}
