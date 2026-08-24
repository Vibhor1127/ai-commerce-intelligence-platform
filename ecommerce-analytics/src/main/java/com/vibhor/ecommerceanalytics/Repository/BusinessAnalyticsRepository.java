package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.Entity.customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusinessAnalyticsRepository
        extends JpaRepository<customers, Integer> {

    // ============================================================
    // PROJECTIONS
    // ============================================================

    interface TopCustomerProjection {
        Integer getCustomerId();
        String getCustomerName();
        BigDecimal getTotalSpending();
    }

    interface TopProductProjection {
        Integer getProductId();
        String getProductName();
        BigDecimal getQuantity();
        BigDecimal getRevenue();
    }

    interface MonthlyRevenueProjection {
        Integer getYear();
        Integer getMonth();
        BigDecimal getRevenue();
    }

    interface CategoryRevenueProjection {
        Integer getCategoryId();
        String getCategoryName();
        BigDecimal getRevenue();
    }

    interface CustomerLifetimeValueProjection {
        Integer getCustomerId();
        String getCustomerName();
        BigDecimal getLifetimeValue();
    }

    interface InactiveCustomerProjection {
        Integer getCustomerId();
        String getCustomerName();
        LocalDateTime getLastOrderDate();
    }

    interface InventoryAlertProjection {
        Integer getProductId();
        String getProductName();
        Integer getStock();
    }

    interface DashboardProjection {
        BigDecimal getTotalRevenue();
        Long getTotalOrders();
        Long getTotalCustomers();
        Long getTotalProducts();
    }

    // ============================================================
    // TOP CUSTOMERS
    // ============================================================

    @Query(value = """
        SELECT
            c.customer_id AS customerId,
            c.first_name AS customerName,
            SUM(o.total_amount) AS totalSpending
        FROM customers c
        JOIN orders o
            ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name
        ORDER BY totalSpending DESC
        """, nativeQuery = true)
    List<TopCustomerProjection> getTopcustomers();


    // ============================================================
    // TOP PRODUCTS
    // ============================================================

    @Query(value = """
        SELECT
            p.product_id AS productId,
            p.product_name AS productName,
            SUM(oi.quantity) AS Quantity,
            SUM(oi.quantity * oi.price) AS Revenue
        FROM products p
        JOIN order_items oi
            ON p.product_id = oi.product_id
        GROUP BY p.product_id, p.product_name
        ORDER BY Revenue DESC
        """, nativeQuery = true)
    List<TopProductProjection> getTopProducts();


    // ============================================================
    // LOW PERFORMING PRODUCTS
    // ============================================================

    @Query(value = """
        SELECT
            p.product_id AS productId,
            p.product_name AS productName,
            SUM(oi.quantity) AS Quantity,
            SUM(oi.quantity * oi.price) AS Revenue
        FROM products p
        JOIN order_items oi
            ON p.product_id = oi.product_id
        GROUP BY p.product_id, p.product_name
        HAVING SUM(oi.quantity) > 0
        ORDER BY Revenue ASC
        LIMIT 10
        """, nativeQuery = true)
    List<TopProductProjection> getLowPerformingProducts();


    // ============================================================
    // MONTHLY REVENUE
    // ============================================================

    @Query(value = """
        SELECT
            YEAR(order_date) AS year,
            MONTH(order_date) AS month,
            SUM(total_amount) AS revenue
        FROM orders
        GROUP BY YEAR(order_date), MONTH(order_date)
        ORDER BY year, month
        """, nativeQuery = true)
    List<MonthlyRevenueProjection> getMonthlyRevenue();


    // ============================================================
    // CATEGORY REVENUE
    // ============================================================

    @Query(value = """
        SELECT
            c.category_id AS categoryId,
            c.category_name AS categoryName,
            SUM(oi.quantity * oi.price) AS revenue
        FROM categories c
        JOIN products p
            ON c.category_id = p.category_id
        JOIN order_items oi
            ON p.product_id = oi.product_id
        GROUP BY c.category_id, c.category_name
        ORDER BY revenue DESC
        """, nativeQuery = true)
    List<CategoryRevenueProjection> getCategoryRevenue();


    // ============================================================
    // CUSTOMER LIFETIME VALUE
    // ============================================================

    @Query(value = """
        SELECT
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            SUM(o.total_amount) AS lifetimeValue
        FROM customers c
        JOIN orders o
            ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name
        ORDER BY lifetimeValue DESC
        """, nativeQuery = true)
    List<CustomerLifetimeValueProjection> getCustomerLifetimeValue();


    // ============================================================
    // INACTIVE CUSTOMERS
    // ============================================================

    @Query(value = """
        SELECT
            c.customer_id AS customerId,
            CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customerName,
            MAX(o.order_date) AS lastOrderDate
        FROM customers c
        JOIN orders o
            ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.first_name, c.last_name
        HAVING MAX(o.order_date) < DATE_SUB(NOW(), INTERVAL 90 DAY)
        ORDER BY lastOrderDate
        """, nativeQuery = true)
    List<InactiveCustomerProjection> getInactiveCustomers();


    // ============================================================
    // INVENTORY ALERTS
    // ============================================================

    @Query(value = """
    SELECT
        p.product_id AS productId,
        p.product_name AS productName,
        i.stock_after AS stock
    FROM products p
    JOIN inventory_logs i
        ON p.product_id = i.product_id
    WHERE i.change_date = (
        SELECT MAX(i2.change_date)
        FROM inventory_logs i2
        WHERE i2.product_id = i.product_id
    )
    AND i.stock_after <= 10
    ORDER BY i.stock_after ASC
    """, nativeQuery = true)
    List<InventoryAlertProjection> getInventoryAlerts();


    // ============================================================
    // DASHBOARD TOTALS
    // ============================================================

    @Query(value = """
        SELECT
            COALESCE(SUM(total_amount), 0) AS totalRevenue,
            COUNT(order_id) AS totalOrders,
            (SELECT COUNT(*) FROM customers) AS totalCustomers,
            (SELECT COUNT(*) FROM products) AS totalProducts
        FROM orders
        """, nativeQuery = true)
    DashboardProjection getDashboard();
}