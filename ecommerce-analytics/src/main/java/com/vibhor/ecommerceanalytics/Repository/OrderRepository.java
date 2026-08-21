package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.OrderStatus;
import com.vibhor.ecommerceanalytics.Entity.orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<orders, Integer> {
    Page<orders> findByCustomer_CustomerIdOrderByOrderDateDesc(Integer customerId, Pageable pageable);

    Optional<orders> findByOrderIdAndCustomer_CustomerId(Integer orderId, Integer customerId);

    /**
     * Admin search: filter by status (optional) and search by order ID or customer name.
     * Search matches against order_id (exact numeric) or customer first/last name (LIKE).
     */
    @Query("""
        SELECT o FROM orders o
        LEFT JOIN o.customer c
        WHERE (:status IS NULL OR o.status = :status)
          AND (:search IS NULL OR :search = ''
               OR CAST(o.orderId AS string) = :search
               OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY o.orderDate DESC
        """)
    Page<orders> searchAdmin(
            @Param("status") OrderStatus status,
            @Param("search") String search,
            Pageable pageable
    );
}
