package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for order volume and status distribution over time.
 */
public interface OrderTrendDTO {

    Integer getYear();
    Integer getMonth();
    Long getTotalOrders();
    Long getCompletedOrders();
    Long getCancelledOrders();
    Double getTotalRevenue();
}
