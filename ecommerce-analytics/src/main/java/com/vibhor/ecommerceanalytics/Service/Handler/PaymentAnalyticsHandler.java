package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Repository.PaymentAnalyticsRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PaymentAnalyticsHandler implements AnalyticsCapability {

    private final PaymentAnalyticsRepository paymentAnalyticsRepository;

    public PaymentAnalyticsHandler(PaymentAnalyticsRepository paymentAnalyticsRepository) {
        this.paymentAnalyticsRepository = paymentAnalyticsRepository;
    }

    @Override
    public String supportedEntity() {
        return "PAYMENT";
    }

    @Override
    public String description() {
        return "Analyzes payment transactions, failed payments, payment method breakdown, and payment success rates";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "PAYMENT_METHOD_ANALYSIS",
                "PAYMENT_SUCCESS_RATE",
                "FAILED_PAYMENTS"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "PAYMENT_METHOD_ANALYSIS" : intent.getOperation().toUpperCase();

        if (operation.contains("FAIL") || operation.contains("ERROR") || operation.contains("DECLINE")) {
            var data = paymentAnalyticsRepository.getFailedPayments();
            return AnalyticsResult.builder()
                    .entity("PAYMENT")
                    .operation("FAILED_PAYMENTS")
                    .data(data)
                    .dataDescription("Recent failed payment transactions with order and method details")
                    .recordCount(data.size())
                    .build();
        }

        if (operation.contains("SUCCESS") || operation.contains("RATE")) {
            var data = paymentAnalyticsRepository.getPaymentMethodStats();
            return AnalyticsResult.builder()
                    .entity("PAYMENT")
                    .operation("PAYMENT_SUCCESS_RATE")
                    .data(data)
                    .dataDescription("Payment success rate percentages across payment channels")
                    .recordCount(data.size())
                    .build();
        }

        // Default: payment method analysis across all transactions
        var data = paymentAnalyticsRepository.getPaymentMethodStats();
        return AnalyticsResult.builder()
                .entity("PAYMENT")
                .operation("PAYMENT_METHOD_ANALYSIS")
                .data(data)
                .dataDescription("Payment transaction metrics, volumes, and distribution broken down by payment method")
                .recordCount(data.size())
                .build();
    }
}
