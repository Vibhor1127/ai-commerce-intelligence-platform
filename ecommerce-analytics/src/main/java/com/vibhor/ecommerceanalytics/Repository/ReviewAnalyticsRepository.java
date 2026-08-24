package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.NegativeReviewDTO;
import com.vibhor.ecommerceanalytics.DTO.ProductRatingDTO;
import com.vibhor.ecommerceanalytics.Entity.reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewAnalyticsRepository extends JpaRepository<reviews, Integer> {

    @Query(value = """
        SELECT 
            r.review_id AS reviewId,
            p.product_id AS productId,
            p.product_name AS productName,
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            r.rating AS rating,
            r.comment AS reviewText,
            r.review_date AS reviewDate
        FROM reviews r
        JOIN products p ON r.product_id = p.product_id
        JOIN customers c ON r.customer_id = c.customer_id
        WHERE r.rating <= 2
        ORDER BY r.review_date DESC
        LIMIT 50
        """, nativeQuery = true)
    List<NegativeReviewDTO> getNegativeReviews();

    @Query(value = """
        SELECT 
            p.product_id AS productId,
            p.product_name AS productName,
            ROUND(AVG(r.rating), 2) AS avgRating,
            COUNT(r.review_id) AS totalReviews,
            SUM(CASE WHEN r.rating <= 2 THEN 1 ELSE 0 END) AS negativeReviewsCount
        FROM products p
        JOIN reviews r ON p.product_id = r.product_id
        GROUP BY p.product_id, p.product_name
        ORDER BY avgRating ASC
        LIMIT 50
        """, nativeQuery = true)
    List<ProductRatingDTO> getProductRatings();
}
