package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for failed/problematic payment records.
 */
public interface FailedPaymentDTO {

    Integer getPaymentId();
    Integer getOrderId();
    Double getAmount();
    String getPaymentMethod();
    String getPaymentStatus();
    String getPaymentDate();
}
