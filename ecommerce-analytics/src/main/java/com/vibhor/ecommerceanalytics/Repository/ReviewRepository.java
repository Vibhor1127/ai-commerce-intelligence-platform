package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.reviews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<reviews, Integer> {

    Page<reviews> findByProduct_ProductIdOrderByReviewDateDesc(Integer productId, Pageable pageable);

    @Query("""
        SELECT r FROM reviews r
        WHERE (:minRating IS NULL OR r.rating >= :minRating)
          AND (:maxRating IS NULL OR r.rating <= :maxRating)
        ORDER BY r.reviewDate DESC
        """)
    Page<reviews> findFiltered(
            @Param("minRating") Integer minRating,
            @Param("maxRating") Integer maxRating,
            Pageable pageable
    );

    @Query(value = """
        SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.product_id = :productId
        """, nativeQuery = true)
    Double avgRatingForProduct(@Param("productId") Integer productId);

    @Query(value = """
        SELECT COUNT(*) FROM reviews r WHERE r.product_id = :productId
        """, nativeQuery = true)
    Long countForProduct(@Param("productId") Integer productId);

    @Query(value = """
        SELECT COUNT(*) FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.customer_id = :customerId
          AND oi.product_id = :productId
          AND UPPER(o.status) IN ('COMPLETED', 'PROCESSING', 'PENDING')
        """, nativeQuery = true)
    Long countPurchases(@Param("customerId") Integer customerId, @Param("productId") Integer productId);
}
