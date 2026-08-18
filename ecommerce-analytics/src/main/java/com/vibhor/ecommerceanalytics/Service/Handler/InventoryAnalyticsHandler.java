package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Owns every question about INVENTORY: low stock alerts, restocking,
 * overall inventory summary.
 */
@Component
public class InventoryAnalyticsHandler implements AnalyticsCapability {

    private final BusinessAnalyticsService businessAnalyticsService;

    public InventoryAnalyticsHandler(BusinessAnalyticsService businessAnalyticsService) {
        this.businessAnalyticsService = businessAnalyticsService;
    }

    @Override
    public String supportedEntity() {
        return "INVENTORY";
    }

    @Override
    public String description() {
        return "Monitors inventory levels including low stock alerts, "
             + "products needing restocking, and inventory status overview";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "LOW_STOCK_ALERTS",
                "INVENTORY_SUMMARY"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        var data = businessAnalyticsService.getInventoryAlerts();
        return AnalyticsResult.builder()
                .entity("INVENTORY")
                .operation("LOW_STOCK_ALERTS")
                .data(data)
                .dataDescription("Products with current stock at or below 10 units needing restock")
                .recordCount(data.size())
                .build();
    }
}

