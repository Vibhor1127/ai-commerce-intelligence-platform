package com.vibhor.ecommerceanalytics.DTO;

/**
 * Projection for payment method analytics and success rates.
 */
public interface PaymentMethodStatsDTO {

    String getPaymentMethod();
    Long getTotalTransactions();
    Long getSuccessfulTransactions();
    Long getFailedTransactions();
    Double getTotalVolume();
    Double getSuccessRate();
}
