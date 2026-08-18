package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for product ratings summary and average score.
 */
public interface ProductRatingDTO {

    Integer getProductId();
    String getProductName();
    Double getAvgRating();
    Long getTotalReviews();
    Long getNegativeReviewsCount();
}
