package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.CancelledOrderDTO;
import com.vibhor.ecommerceanalytics.DTO.CustomerOrderFrequencyDTO;
import com.vibhor.ecommerceanalytics.DTO.OrderTrendDTO;
import com.vibhor.ecommerceanalytics.Entity.orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderAnalyticsRepository extends JpaRepository<orders, Integer> {

    @Query(value = """
        SELECT 
            o.order_id AS orderId,
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            o.total_amount AS totalAmount,
            o.status AS status,
            o.order_date AS orderDate
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        WHERE UPPER(o.status) IN ('CANCELLED', 'RETURNED', 'REFUNDED')
        ORDER BY o.order_date DESC
        LIMIT 50
        """, nativeQuery = true)
    List<CancelledOrderDTO> getCancelledOrders();

    @Query(value = """
        SELECT 
            YEAR(o.order_date) AS year,
            MONTH(o.order_date) AS month,
            COUNT(o.order_id) AS totalOrders,
            SUM(CASE WHEN UPPER(o.status) IN ('COMPLETED', 'DELIVERED', 'SHIPPED') THEN 1 ELSE 0 END) AS completedOrders,
            SUM(CASE WHEN UPPER(o.status) IN ('CANCELLED', 'RETURNED') THEN 1 ELSE 0 END) AS cancelledOrders,
            SUM(o.total_amount) AS totalRevenue
        FROM orders o
        GROUP BY YEAR(o.order_date), MONTH(o.order_date)
        ORDER BY year DESC, month DESC
        """, nativeQuery = true)
    List<OrderTrendDTO> getOrderTrends();

    @Query(value = """
        SELECT 
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            COUNT(o.order_id) AS orderCount,
            SUM(o.total_amount) AS totalSpend,
            ROUND(AVG(o.total_amount), 2) AS avgOrderValue
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name
        ORDER BY orderCount DESC
        LIMIT 50
        """, nativeQuery = true)
    List<CustomerOrderFrequencyDTO> getCustomerOrderFrequency();
}
