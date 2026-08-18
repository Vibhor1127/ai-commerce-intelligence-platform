package com.vibhor.ecommerceanalytics.DTO;

import java.time.LocalDateTime;

/**
 * Projection for failed/problematic payment records.
 */
public interface FailedPaymentDTO {

    Integer getPaymentId();
    Integer getOrderId();
    Double getAmount();
    String getPaymentMethod();
    String getPaymentStatus();
    LocalDateTime getPaymentDate();
}
