package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for customer order count and purchase frequency.
 */
public interface CustomerOrderFrequencyDTO {

    Integer getCustomerId();
    String getCustomerName();
    Long getOrderCount();
    Double getTotalSpend();
    Double getAvgOrderValue();
}
