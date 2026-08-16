package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.stereotype.Component;

/**
 * Owns every question about INVENTORY: low stock alerts, restocking,
 * overall inventory summary. Replaces the "inventory" branches of the
 * old validator/executor/router.
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
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public Object execute(AnalyticsIntent intent) {
        // Both LOW_STOCK_PRODUCTS and INVENTORY_SUMMARY mapped to alerts
        // in your original executor (INVENTORY_SUMMARY was routed but
        // never given a distinct execution path) -- keeping that behavior.
        return businessAnalyticsService.getInventoryAlerts();
    }
}
