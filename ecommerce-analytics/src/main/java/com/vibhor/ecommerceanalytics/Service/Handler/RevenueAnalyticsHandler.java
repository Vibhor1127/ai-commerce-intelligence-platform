package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

/**
 * Owns every question about REVENUE: overall summaries, monthly trends,
 * category breakdowns. Replaces the "category"/"revenue"/"month"
 * branches scattered across the old validator/executor/router.
 */
@Component
public class RevenueAnalyticsHandler implements AnalyticsCapability {

    private final BusinessAnalyticsService businessAnalyticsService;

    public RevenueAnalyticsHandler(BusinessAnalyticsService businessAnalyticsService) {
        this.businessAnalyticsService = businessAnalyticsService;
    }

    @Override
    public String supportedEntity() {
        return "REVENUE";
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public Object execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "" : intent.getOperation().toUpperCase();

        if (operation.contains("TREND") || operation.contains("GROWTH") || operation.contains("MONTH")) {
            return businessAnalyticsService.getMonthlyRevenue();
        }

        if (operation.contains("CATEGORY")) {
            return businessAnalyticsService.getCategoryRevenue();
        }

        // Default for REVENUE: category breakdown, which is your existing
        // REVENUE_SUMMARY behavior in IntentRouterService.
        return businessAnalyticsService.getCategoryRevenue();
    }
}
