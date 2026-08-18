package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Repository.ShipmentAnalyticsRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShipmentAnalyticsHandler implements AnalyticsCapability {

    private final ShipmentAnalyticsRepository shipmentAnalyticsRepository;

    public ShipmentAnalyticsHandler(ShipmentAnalyticsRepository shipmentAnalyticsRepository) {
        this.shipmentAnalyticsRepository = shipmentAnalyticsRepository;
    }

    @Override
    public String supportedEntity() {
        return "SHIPMENT";
    }

    @Override
    public String description() {
        return "Analyzes shipping and logistics operations including delayed shipments, tracking status, and delivery time performance";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "DELAYED_SHIPMENTS",
                "SHIPMENT_STATUS_SUMMARY",
                "AVERAGE_DELIVERY_TIME"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "DELAYED_SHIPMENTS" : intent.getOperation().toUpperCase();

        if (operation.contains("STATUS") || operation.contains("SUMMARY")) {
            var data = shipmentAnalyticsRepository.getShipmentStatusSummary();
            return AnalyticsResult.builder()
                    .entity("SHIPMENT")
                    .operation("SHIPMENT_STATUS_SUMMARY")
                    .data(data)
                    .dataDescription("Shipment breakdown by status and average delivery durations")
                    .recordCount(data.size())
                    .build();
        }

        if (operation.contains("TIME") || operation.contains("AVERAGE") || operation.contains("AVG")) {
            var data = shipmentAnalyticsRepository.getShipmentStatusSummary();
            return AnalyticsResult.builder()
                    .entity("SHIPMENT")
                    .operation("AVERAGE_DELIVERY_TIME")
                    .data(data)
                    .dataDescription("Average delivery time metrics across different shipping statuses")
                    .recordCount(data.size())
                    .build();
        }

        // Default: delayed shipments
        var data = shipmentAnalyticsRepository.getDelayedShipments();
        return AnalyticsResult.builder()
                .entity("SHIPMENT")
                .operation("DELAYED_SHIPMENTS")
                .data(data)
                .dataDescription("Delayed or prolonged in-transit shipment records")
                .recordCount(data.size())
                .build();
    }
}
