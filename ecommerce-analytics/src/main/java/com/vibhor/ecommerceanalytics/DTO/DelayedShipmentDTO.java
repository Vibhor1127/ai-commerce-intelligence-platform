package com.vibhor.ecommerceanalytics.DTO;

import java.time.LocalDateTime;

/**
 * Projection for delayed or pending shipment details.
 */
public interface DelayedShipmentDTO {

    Integer getShipmentId();
    Integer getOrderId();
    String getTrackingNumber();
    String getShipmentStatus();
    LocalDateTime getShippedDate();
    LocalDateTime getDeliveryDate();
    Integer getDaysInTransit();
}
