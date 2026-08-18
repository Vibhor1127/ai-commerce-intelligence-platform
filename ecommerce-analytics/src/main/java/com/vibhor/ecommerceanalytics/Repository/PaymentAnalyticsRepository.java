package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.FailedPaymentDTO;
import com.vibhor.ecommerceanalytics.DTO.PaymentMethodStatsDTO;
import com.vibhor.ecommerceanalytics.Entity.payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentAnalyticsRepository extends JpaRepository<payments, Integer> {

    @Query(value = """
        SELECT 
            p.payment_id AS paymentId,
            p.order_id AS orderId,
            p.amount AS amount,
            p.payment_method AS paymentMethod,
            p.payment_status AS paymentStatus,
            p.payment_date AS paymentDate
        FROM payments p
        WHERE UPPER(p.payment_status) = 'FAILED'
        ORDER BY p.payment_date DESC
        LIMIT 50
        """, nativeQuery = true)
    List<FailedPaymentDTO> getFailedPayments();

    @Query(value = """
        SELECT 
            p.payment_method AS paymentMethod,
            COUNT(p.payment_id) AS totalTransactions,
            SUM(CASE WHEN UPPER(p.payment_status) = 'SUCCESS' THEN 1 ELSE 0 END) AS successfulTransactions,
            SUM(CASE WHEN UPPER(p.payment_status) = 'FAILED' THEN 1 ELSE 0 END) AS failedTransactions,
            SUM(p.amount) AS totalVolume,
            ROUND((SUM(CASE WHEN UPPER(p.payment_status) = 'SUCCESS' THEN 1.0 ELSE 0.0 END) / COUNT(p.payment_id)) * 100, 2) AS successRate
        FROM payments p
        GROUP BY p.payment_method
        ORDER BY totalTransactions DESC
        """, nativeQuery = true)
    List<PaymentMethodStatsDTO> getPaymentMethodStats();
}
