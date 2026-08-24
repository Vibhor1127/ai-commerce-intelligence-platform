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

    Page<orders> findAllByOrderByOrderDateDesc(Pageable pageable);

    Page<orders> findByStatusOrderByOrderDateDesc(OrderStatus status, Pageable pageable);

    @Query("""
        SELECT o FROM orders o
        LEFT JOIN o.customer c
        WHERE (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY o.orderDate DESC
        """)
    Page<orders> searchByCustomerName(@Param("search") String search, Pageable pageable);
}
