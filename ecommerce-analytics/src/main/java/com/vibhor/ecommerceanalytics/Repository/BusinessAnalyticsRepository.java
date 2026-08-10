package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Entity.customers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessAnalyticsRepository
        extends JpaRepository<customers, Integer> {

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
    List<TopCustomerDTO> getTopcustomers();


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
    List<TopProductsDTO> getTopProducts();


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
    List<MonthlyRevenueDTO> getMonthlyRevenue();


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
    List<CategoryRevenueDTO> getCategoryRevenue();


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
    List<CustomerLifetimeValueDTO> getCustomerLifetimeValue();


    // ============================================================
    // INACTIVE CUSTOMERS
    // Customers whose latest order is older than 90 days
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
    List<InactiveCustomerDTO> getInactiveCustomers();


    // ============================================================
    // INVENTORY ALERTS
    // ============================================================

    @Query(value = """
        SELECT
            product_id AS productId,
            product_name AS productName,
            stock AS stock
        FROM products
        WHERE stock <= 10
        ORDER BY stock ASC
        """, nativeQuery = true)
    List<InventoryAlertDTO> getInventoryAlerts();


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
    DashboardDTO getDashboard();
}