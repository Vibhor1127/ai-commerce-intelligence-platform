package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Repository.CustomerSatisfactionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Composite Cross-Domain Handler:
 * Combines CUSTOMER + ORDER + REVIEW data to answer complex multi-table
 * business queries such as identifying high-spending customers who are unhappy.
 */
@Component
public class CustomerSatisfactionHandler implements AnalyticsCapability {

    private final CustomerSatisfactionRepository customerSatisfactionRepository;

    public CustomerSatisfactionHandler(CustomerSatisfactionRepository customerSatisfactionRepository) {
        this.customerSatisfactionRepository = customerSatisfactionRepository;
    }

    @Override
    public String supportedEntity() {
        return "CUSTOMER_SATISFACTION";
    }

    @Override
    public String description() {
        return "Performs cross-table analytics joining customer spending with review ratings to identify high-value dissatisfied customers at risk of churn";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "HIGH_SPEND_LOW_RATING",
                "SATISFACTION_OVERVIEW"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        var data = customerSatisfactionRepository.getHighSpendDissatisfiedCustomers();
        return AnalyticsResult.builder()
                .entity("CUSTOMER_SATISFACTION")
                .operation("HIGH_SPEND_LOW_RATING")
                .data(data)
                .dataDescription("High-spending customers with average review ratings <= 3.0 (at-risk VIP customers)")
                .recordCount(data.size())
                .build();
    }
}
