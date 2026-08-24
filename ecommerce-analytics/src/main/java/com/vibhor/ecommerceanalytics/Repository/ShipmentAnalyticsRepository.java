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
            CONCAT('TRK-', s.shipment_id, '-', s.order_id) AS trackingNumber,
            s.shipment_status AS shipmentStatus,
            s.shipment_date AS shippedDate,
            s.shipment_date AS deliveryDate,
            DATEDIFF(NOW(), s.shipment_date) AS daysInTransit
        FROM shipments s
        WHERE UPPER(s.shipment_status) IN ('DELAYED', 'IN_TRANSIT', 'PENDING', 'PROCESSING')
           OR s.shipment_date < DATE_SUB(NOW(), INTERVAL 5 DAY)
        ORDER BY daysInTransit DESC
        LIMIT 50
        """, nativeQuery = true)
    List<DelayedShipmentDTO> getDelayedShipments();

    @Query(value = """
        SELECT 
            s.shipment_status AS shipmentStatus,
            COUNT(s.shipment_id) AS totalShipments,
            ROUND(AVG(DATEDIFF(NOW(), s.shipment_date)), 1) AS avgDeliveryDays
        FROM shipments s
        GROUP BY s.shipment_status
        ORDER BY totalShipments DESC
        """, nativeQuery = true)
    List<ShipmentStatusDTO> getShipmentStatusSummary();
}
