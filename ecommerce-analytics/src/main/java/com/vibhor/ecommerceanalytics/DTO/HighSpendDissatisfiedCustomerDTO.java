package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for multi-table cross analysis: customers with high spending but low satisfaction ratings.
 */
public interface HighSpendDissatisfiedCustomerDTO {

    Integer getCustomerId();
    String getCustomerName();
    String getEmail();
    Double getTotalSpending();
    Long getTotalOrders();
    Double getAvgRating();
    Long getNegativeReviews();
}
