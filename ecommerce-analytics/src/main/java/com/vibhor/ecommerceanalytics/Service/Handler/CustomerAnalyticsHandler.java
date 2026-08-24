package com.vibhor.ecommerceanalytics.Service.Handler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;
import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import com.vibhor.ecommerceanalytics.Service.BusinessInsightService;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CustomerAnalyticsHandler implements AnalyticsCapability {

    private final BusinessAnalyticsService businessAnalyticsService;
    private final BusinessInsightService businessInsightService;
    private final CustomerRepository customerRepository;
    private final ObjectMapper objectMapper;

    public CustomerAnalyticsHandler(
            BusinessAnalyticsService businessAnalyticsService,
            BusinessInsightService businessInsightService,
            CustomerRepository customerRepository
    ) {
        this.businessAnalyticsService = businessAnalyticsService;
        this.businessInsightService = businessInsightService;
        this.customerRepository = customerRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String supportedEntity() {
        return "CUSTOMER";
    }

    @Override
    public String description() {
        return "Analyzes customer behavior including top spenders, "
             + "customer lifetime value, inactive/churning customers, and customer profile/email lookup";
    }

    @Override
    public List<String> supportedOperations() {
        return List.of(
                "TOP_CUSTOMERS",
                "LIFETIME_VALUE",
                "INACTIVE_CUSTOMERS",
                "CUSTOMER_SEARCH",
                "CUSTOMER_DETAILS"
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

        // Customer Search / Lookup by Name / Email / Query
        if (operation.contains("SEARCH") || operation.contains("FIND") || operation.contains("LOOKUP")
                || operation.contains("EMAIL") || operation.contains("DETAIL") || operation.contains("PROFILE")) {
            String query = extractQuery(intent);
            List<customers> matching;
            if (query != null && !query.isBlank()) {
                matching = customerRepository.searchCustomers(query.trim());
            } else {
                matching = customerRepository.findAll();
            }

            List<Map<String, Object>> customerProfiles = matching.stream()
                    .map(c -> {
                        Map<String, Object> map = new LinkedHashMap<>();
                        map.put("customerId", c.getCustomerId());
                        map.put("userId", c.getUserId());
                        map.put("customerName", ((c.getFirstName() == null ? "" : c.getFirstName()) + " " + (c.getLastName() == null ? "" : c.getLastName())).trim());
                        map.put("email", c.getEmail());
                        map.put("city", c.getCity());
                        map.put("signupDate", c.getSignupDate());
                        map.put("totalOrders", c.getOrders() != null ? c.getOrders().size() : 0);
                        return map;
                    })
                    .toList();

            return AnalyticsResult.builder()
                    .entity("CUSTOMER")
                    .operation("CUSTOMER_SEARCH")
                    .data(customerProfiles)
                    .dataDescription("Customer profile and contact details matching query: " + (query != null ? query : "all"))
                    .recordCount(customerProfiles.size())
                    .build();
        }

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

    private String extractQuery(AnalyticsIntent intent) {
        if (intent.getFilters() instanceof Map<?, ?> map) {
            for (String key : List.of("query", "name", "email", "search", "customer", "customer_name", "username")) {
                if (map.containsKey(key) && map.get(key) != null) {
                    return String.valueOf(map.get(key));
                }
            }
        }
        if (intent.getMetric() != null && !intent.getMetric().equalsIgnoreCase("UNKNOWN")) {
            return intent.getMetric();
        }
        return null;
    }
}