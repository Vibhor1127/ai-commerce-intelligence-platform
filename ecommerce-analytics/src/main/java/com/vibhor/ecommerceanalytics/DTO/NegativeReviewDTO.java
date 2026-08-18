package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for negative or critical customer reviews.
 */
public interface NegativeReviewDTO {

    Integer getReviewId();
    Integer getProductId();
    String getProductName();
    Integer getCustomerId();
    String getCustomerName();
    Integer getRating();
    String getReviewText();
    String getReviewDate();
}
