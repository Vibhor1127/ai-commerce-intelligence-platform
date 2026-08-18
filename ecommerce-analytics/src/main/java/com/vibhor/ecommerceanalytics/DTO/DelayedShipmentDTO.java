package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for delayed or pending shipment details.
 */
public interface DelayedShipmentDTO {

    Integer getShipmentId();
    Integer getOrderId();
    String getTrackingNumber();
    String getShipmentStatus();
    String getShippedDate();
    String getDeliveryDate();
    Integer getDaysInTransit();
}
