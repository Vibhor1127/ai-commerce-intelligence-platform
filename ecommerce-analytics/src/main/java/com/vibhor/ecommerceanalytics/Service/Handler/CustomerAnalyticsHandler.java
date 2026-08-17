package com.vibhor.ecommerceanalytics.Service.Handler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
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
    public ValidationResult validate(AnalyticsIntent intent) {
        return ValidationResult.ok();
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
                metric.contains("spending")
                        ||
                        metric.contains("lifetime")
                        ||
                        metric.contains("churn")
                        ||
                        operation.contains("rank")
                        ||
                        operation.contains("filter");

    }

    @Override
    public Object execute(AnalyticsIntent intent) {
        String operation = intent.getOperation() == null
                ? "" : intent.getOperation().toUpperCase();

        if (operation.contains("INACTIVE")
                || operation.contains("CHURN")
                || operation.contains("RETAIN")) {
            return businessAnalyticsService.getInactiveCustomers();
        }

        if (operation.contains("LIFETIME") || operation.contains("VALUE")) {
            return businessAnalyticsService.getCustomerLifetimeValue();
        }

        // Default for CUSTOMER: top customers by spending.
        //
        // Re-coerce through Jackson before handing off to the insight
        // service. getTopCustomers() is @Cacheable -- on a cache hit,
        // depending on the cache serializer, the returned list can come
        // back as LinkedHashMap instances instead of TopCustomerDTO,
        // since generic type info doesn't always survive the cache
        // round-trip. analyzeTopCustomers() calls TopCustomerDTO-specific
        // methods (getTotalSpending()), so it needs the real type.
        // convertValue() is a no-op cost-wise when the objects are
        // already the right type, so this is safe on cache misses too.
        Object rawResult = businessAnalyticsService.getTopCustomers();

        List<TopCustomerDTO> topCustomers = objectMapper.convertValue(
                rawResult,
                new TypeReference<List<TopCustomerDTO>>() {}
        );

        return businessInsightService.analyzeTopCustomers(topCustomers);
    }
}