package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessAnalyticsRepository extends JpaRepository<customers,Integer> {
    @Query(
            value = """
        SELECT
            c.customer_id,
            c.first_name,
            SUM(o.total_amount) AS total_spending
        FROM customers c
        JOIN orders o
        ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name
        ORDER BY total_spending DESC
        """,
            nativeQuery = true
    )
      List<TopCustomerDTO> getTopcustomers();
}

