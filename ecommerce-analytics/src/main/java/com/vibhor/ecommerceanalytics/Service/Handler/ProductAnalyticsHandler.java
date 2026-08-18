package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductAnalyticsHandler implements AnalyticsCapability {

    private final BusinessAnalyticsService businessAnalyticsService;

    public ProductAnalyticsHandler(BusinessAnalyticsService businessAnalyticsService) {
        this.businessAnalyticsService = businessAnalyticsService;
    }

    @Override
    public String supportedEntity() {
        return "PRODUCT";
    }

    @Override
    public String description() {
        return "Analyzes product performance including best sellers, "
             + "low performing products, and product sales rankings";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "TOP_PRODUCTS",
                "LOW_PERFORMING_PRODUCTS"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "TOP_PRODUCTS" : intent.getOperation().toUpperCase();

        if (operation.contains("LOW") || operation.contains("WEAK")
                || operation.contains("POOR") || operation.contains("BOTTOM")) {
            var data = businessAnalyticsService.getLowPerformingProducts();
            return AnalyticsResult.builder()
                    .entity("PRODUCT")
                    .operation("LOW_PERFORMING_PRODUCTS")
                    .data(data)
                    .dataDescription("Bottom 10 products by revenue with at least 1 sale")
                    .recordCount(data.size())
                    .build();
        }

        // Default: top selling products
        var data = businessAnalyticsService.getTopProducts();
        return AnalyticsResult.builder()
                .entity("PRODUCT")
                .operation("TOP_PRODUCTS")
                .data(data)
                .dataDescription("Products ranked by total revenue and quantity sold")
                .recordCount(data.size())
                .build();
    }
}