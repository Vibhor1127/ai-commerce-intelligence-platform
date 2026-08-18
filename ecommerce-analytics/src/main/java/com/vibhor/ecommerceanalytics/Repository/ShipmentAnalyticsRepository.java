package com.vibhor.ecommerceanalytics.Repository;

import com.vibhor.ecommerceanalytics.DTO.DelayedShipmentDTO;
import com.vibhor.ecommerceanalytics.DTO.ShipmentStatusDTO;
import com.vibhor.ecommerceanalytics.Entity.shipments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentAnalyticsRepository extends JpaRepository<shipments, Integer> {

    @Query(value = """
        SELECT 
            s.shipment_id AS shipmentId,
            s.order_id AS orderId,
            s.tracking_number AS trackingNumber,
            s.shipment_status AS shipmentStatus,
            s.shipped_date AS shippedDate,
            s.delivery_date AS deliveryDate,
            DATEDIFF(COALESCE(s.delivery_date, CURDATE()), s.shipped_date) AS daysInTransit
        FROM shipments s
        WHERE UPPER(s.shipment_status) IN ('DELAYED', 'IN_TRANSIT', 'PENDING')
           OR (s.delivery_date IS NULL AND s.shipped_date < DATE_SUB(CURDATE(), INTERVAL 5 DAY))
        ORDER BY daysInTransit DESC
        LIMIT 50
        """, nativeQuery = true)
    List<DelayedShipmentDTO> getDelayedShipments();

    @Query(value = """
        SELECT 
            s.shipment_status AS shipmentStatus,
            COUNT(s.shipment_id) AS totalShipments,
            ROUND(AVG(CASE WHEN s.delivery_date IS NOT NULL AND s.shipped_date IS NOT NULL 
                THEN DATEDIFF(s.delivery_date, s.shipped_date) ELSE NULL END), 1) AS avgDeliveryDays
        FROM shipments s
        GROUP BY s.shipment_status
        ORDER BY totalShipments DESC
        """, nativeQuery = true)
    List<ShipmentStatusDTO> getShipmentStatusSummary();
}
