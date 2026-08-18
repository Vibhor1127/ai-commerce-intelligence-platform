package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.HighSpendDissatisfiedCustomerDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerSatisfactionRepository extends JpaRepository<customers, Integer> {

    @Query(value = """
        SELECT 
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            c.email AS email,
            COALESCE(SUM(o.total_amount), 0) AS totalSpending,
            COUNT(DISTINCT o.order_id) AS totalOrders,
            ROUND(AVG(r.rating), 2) AS avgRating,
            SUM(CASE WHEN r.rating <= 2 THEN 1 ELSE 0 END) AS negativeReviews
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        JOIN reviews r ON c.customer_id = r.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name, c.email
        HAVING avgRating <= 3.0
        ORDER BY totalSpending DESC
        LIMIT 50
        """, nativeQuery = true)
    List<HighSpendDissatisfiedCustomerDTO> getHighSpendDissatisfiedCustomers();
}
