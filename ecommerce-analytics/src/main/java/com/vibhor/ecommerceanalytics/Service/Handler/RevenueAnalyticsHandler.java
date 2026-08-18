package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Owns every question about REVENUE: overall summaries, monthly trends,
 * category breakdowns.
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
    public String description() {
        return "Analyzes revenue data including monthly revenue trends, "
             + "category-wise revenue breakdown, and overall revenue summaries";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "MONTHLY_REVENUE",
                "CATEGORY_REVENUE",
                "REVENUE_SUMMARY"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "CATEGORY_REVENUE" : intent.getOperation().toUpperCase();

        if (operation.contains("MONTH") || operation.contains("TREND") || operation.contains("GROWTH")) {
            var data = businessAnalyticsService.getMonthlyRevenue();
            return AnalyticsResult.builder()
                    .entity("REVENUE")
                    .operation("MONTHLY_REVENUE")
                    .data(data)
                    .dataDescription("Revenue aggregated by month showing trends over time")
                    .recordCount(data.size())
                    .build();
        }

        // Default: category revenue breakdown
        var data = businessAnalyticsService.getCategoryRevenue();
        return AnalyticsResult.builder()
                .entity("REVENUE")
                .operation("CATEGORY_REVENUE")
                .data(data)
                .dataDescription("Revenue breakdown by product category ranked by highest revenue")
                .recordCount(data.size())
                .build();
    }
}

