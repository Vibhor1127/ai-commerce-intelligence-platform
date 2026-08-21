package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<products, Integer> {

    @Query("""
        SELECT p FROM products p
        WHERE (:categoryId IS NULL OR p.Category.categoryId = :categoryId)
          AND (:search IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<products> search(
            @Param("categoryId") Integer categoryId,
            @Param("search") String search,
            Pageable pageable
    );
}
