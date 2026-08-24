package com.vibhor.ecommerceanalytics.Service.Handler;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.Repository.OrderAnalyticsRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class OrderAnalyticsHandler implements AnalyticsCapability {

    private final OrderAnalyticsRepository orderAnalyticsRepository;

    public OrderAnalyticsHandler(OrderAnalyticsRepository orderAnalyticsRepository) {
        this.orderAnalyticsRepository = orderAnalyticsRepository;
    }

    @Override
    public String supportedEntity() {
        return "ORDER";
    }

    @Override
    public String description() {
        return "Analyzes order metrics, recent orders, cancelled/returned orders, monthly trends, and purchase frequency";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "ORDER_TRENDS",
                "RECENT_ORDERS",
                "CUSTOMER_ORDER_FREQUENCY",
                "CANCELLED_ORDERS"
        );
    }

    @Override
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
    }

    @Override
    public AnalyticsResult execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "ORDER_TRENDS" : intent.getOperation().toUpperCase();

        if (operation.contains("CANCEL") || operation.contains("REFUND") || operation.contains("RETURN")) {
            var data = orderAnalyticsRepository.getCancelledOrders();
            return AnalyticsResult.builder()
                    .entity("ORDER")
                    .operation("CANCELLED_ORDERS")
                    .data(data)
                    .dataDescription("List of cancelled, returned, or refunded orders")
                    .recordCount(data.size())
                    .build();
        }

        if (operation.contains("RECENT") || operation.contains("LATEST")) {
            int limit = extractLimit(intent, 15);
            var data = orderAnalyticsRepository.getRecentOrders(limit);
            return AnalyticsResult.builder()
                    .entity("ORDER")
                    .operation("RECENT_ORDERS")
                    .data(data)
                    .dataDescription("Most recent orders with customer and total amount")
                    .recordCount(data.size())
                    .build();
        }

        if (operation.contains("FREQUENCY") || operation.contains("REPEAT")) {
            var data = orderAnalyticsRepository.getCustomerOrderFrequency();
            return AnalyticsResult.builder()
                    .entity("ORDER")
                    .operation("CUSTOMER_ORDER_FREQUENCY")
                    .data(data)
                    .dataDescription("Customer purchase frequency ranking with total orders and average order value")
                    .recordCount(data.size())
                    .build();
        }

        // Default for ORDER entity with a numeric limit in filters → recent orders
        Object filters = intent.getFilters();
        if (filters instanceof Map<?, ?> map && map.containsKey("limit")) {
            int limit = extractLimit(intent, 15);
            var data = orderAnalyticsRepository.getRecentOrders(limit);
            return AnalyticsResult.builder()
                    .entity("ORDER")
                    .operation("RECENT_ORDERS")
                    .data(data)
                    .dataDescription("Most recent orders with customer and total amount")
                    .recordCount(data.size())
                    .build();
        }

        // Default: ORDER_TRENDS (Order volume, completion, cancellation rates, and monthly revenue)
        var data = orderAnalyticsRepository.getOrderTrends();
        return AnalyticsResult.builder()
                .entity("ORDER")
                .operation("ORDER_TRENDS")
                .data(data)
                .dataDescription("Order volume, completion, and cancellation statistics aggregated over time")
                .recordCount(data.size())
                .build();
    }

    private int extractLimit(AnalyticsIntent intent, int fallback) {
        try {
            Object filters = intent.getFilters();
            if (filters instanceof Map<?, ?> map && map.get("limit") != null) {
                return Integer.parseInt(String.valueOf(map.get("limit")));
            }
        } catch (Exception ignored) {
            // fall through
        }
        return fallback;
    }
}
