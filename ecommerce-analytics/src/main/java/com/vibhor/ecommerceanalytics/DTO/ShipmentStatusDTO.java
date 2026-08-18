package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for shipment status distribution and average delivery days.
 */
public interface ShipmentStatusDTO {

    String getShipmentStatus();
    Long getTotalShipments();
    Double getAvgDeliveryDays();
}
