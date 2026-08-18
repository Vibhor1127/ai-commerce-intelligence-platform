package com.vibhor.ecommerceanalytics.Service.Handler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import com.vibhor.ecommerceanalytics.Service.BusinessInsightService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomerAnalyticsHandler implements AnalyticsCapability {

    private final BusinessAnalyticsService businessAnalyticsService;
    private final BusinessInsightService businessInsightService;
    private final ObjectMapper objectMapper;

    public CustomerAnalyticsHandler(
            BusinessAnalyticsService businessAnalyticsService,
            BusinessInsightService businessInsightService
    ) {
        this.businessAnalyticsService = businessAnalyticsService;
        this.businessInsightService = businessInsightService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String supportedEntity() {
        return "CUSTOMER";
    }

    @Override
    public String description() {
        return "Analyzes customer behavior including top spenders, "
             + "customer lifetime value, and inactive/churning customers";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "TOP_CUSTOMERS",
                "LIFETIME_VALUE",
                "INACTIVE_CUSTOMERS"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "TOP_CUSTOMERS" : intent.getOperation().toUpperCase();

        if (operation.contains("INACTIVE") || operation.contains("CHURN")) {
            var data = businessAnalyticsService.getInactiveCustomers();
            return AnalyticsResult.builder()
                    .entity("CUSTOMER")
                    .operation("INACTIVE_CUSTOMERS")
                    .data(data)
                    .dataDescription("Customers whose last order was more than 90 days ago")
                    .recordCount(data.size())
                    .build();
        }

        if (operation.contains("LIFETIME") || operation.contains("VALUE")) {
            var data = businessAnalyticsService.getCustomerLifetimeValue();
            return AnalyticsResult.builder()
                    .entity("CUSTOMER")
                    .operation("LIFETIME_VALUE")
                    .data(data)
                    .dataDescription("Customer lifetime value ranked by total spending")
                    .recordCount(data.size())
                    .build();
        }

        // Default: top customers by spending
        Object rawResult = businessAnalyticsService.getTopCustomers();

        List<TopCustomerDTO> topCustomers = objectMapper.convertValue(
                rawResult,
                new TypeReference<List<TopCustomerDTO>>() {}
        );

        var insightData = businessInsightService.analyzeTopCustomers(topCustomers);
        return AnalyticsResult.builder()
                .entity("CUSTOMER")
                .operation("TOP_CUSTOMERS")
                .data(insightData)
                .dataDescription("Top customers ranked by total spending with business insights")
                .recordCount(topCustomers.size())
                .build();
    }
}