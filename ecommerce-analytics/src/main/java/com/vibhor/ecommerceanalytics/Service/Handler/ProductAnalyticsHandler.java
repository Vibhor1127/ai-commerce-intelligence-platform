package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

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
    public boolean supports(AnalyticsIntent intent){


        String metric =
                intent.getMetric()==null
                        ? ""
                        : intent.getMetric()
                        .toLowerCase();


        String operation =
                intent.getOperation()==null
                        ? ""
                        : intent.getOperation()
                        .toLowerCase();



        return
                metric.contains("sales")
                        ||
                        metric.contains("performance")
                        ||
                        operation.contains("rank")
                        ||
                        operation.contains("bottom");

    }
    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public Object execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "" : intent.getOperation().toUpperCase();

        if (operation.contains("LOW") || operation.contains("WEAK") || operation.contains("POOR")) {
            return businessAnalyticsService.getLowPerformingProducts();
        }

        // Default for PRODUCT: top sellers.
        return businessAnalyticsService.getTopProducts();
    }
}