package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Exception.AnalyticsDataAccessException;
import com.vibhor.ecommerceanalytics.Repository.BusinessAnalyticsRepository;
import com.vibhor.ecommerceanalytics.Repository.OrderAnalyticsRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessAnalyticsService {

    private static final String NS = "analytics";

    @Autowired
    private BusinessAnalyticsRepository businessAnalyticsRepository;

    @Autowired
    private OrderAnalyticsRepository orderAnalyticsRepository;

    @Autowired
    private JsonCacheService cache;

    public List<TopCustomerDTO> getTopCustomers() {
        List<TopCustomerDTO> cached = cache.get(NS, "topCustomers", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<TopCustomerDTO> result = businessAnalyticsRepository.getTopcustomers().stream()
                    .map(p -> new TopCustomerDTO(p.getCustomerId(), p.getCustomerName(), p.getTotalSpending()))
                    .toList();
            cache.put(NS, "topCustomers", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch customer analytics", e);
        }
    }

    public List<TopProductsDTO> getTopProducts() {
        List<TopProductsDTO> cached = cache.get(NS, "topProducts", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<TopProductsDTO> result = businessAnalyticsRepository.getTopProducts().stream()
                    .map(p -> new TopProductsDTO(p.getProductId(), p.getProductName(), p.getQuantity(), p.getRevenue()))
                    .toList();
            cache.put(NS, "topProducts", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch product analytics", e);
        }
    }

    public List<TopProductsDTO> getLowPerformingProducts() {
        List<TopProductsDTO> cached = cache.get(NS, "lowProducts", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<TopProductsDTO> result = businessAnalyticsRepository.getLowPerformingProducts().stream()
                    .map(p -> new TopProductsDTO(p.getProductId(), p.getProductName(), p.getQuantity(), p.getRevenue()))
                    .toList();
            cache.put(NS, "lowProducts", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch low performing products", e);
        }
    }

    public List<MonthlyRevenueDTO> getMonthlyRevenue() {
        List<MonthlyRevenueDTO> cached = cache.get(NS, "monthlyRevenue", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<MonthlyRevenueDTO> result = businessAnalyticsRepository.getMonthlyRevenue().stream()
                    .map(p -> new MonthlyRevenueDTO(p.getYear(), p.getMonth(), p.getRevenue()))
                    .toList();
            cache.put(NS, "monthlyRevenue", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch revenue analytics", e);
        }
    }

    public List<CategoryRevenueDTO> getCategoryRevenue() {
        List<CategoryRevenueDTO> cached = cache.get(NS, "categoryRevenue", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<CategoryRevenueDTO> result = businessAnalyticsRepository.getCategoryRevenue().stream()
                    .map(p -> new CategoryRevenueDTO(p.getCategoryId(), p.getCategoryName(), p.getRevenue()))
                    .toList();
            cache.put(NS, "categoryRevenue", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch category revenue analytics", e);
        }
    }

    public List<CustomerLifetimeValueDTO> getCustomerLifetimeValue() {
        List<CustomerLifetimeValueDTO> cached = cache.get(NS, "lifetimeValue", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<CustomerLifetimeValueDTO> result = businessAnalyticsRepository.getCustomerLifetimeValue().stream()
                    .map(p -> new CustomerLifetimeValueDTO(p.getCustomerId(), p.getCustomerName(), p.getLifetimeValue()))
                    .toList();
            cache.put(NS, "lifetimeValue", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch customer lifetime value", e);
        }
    }

    public List<InactiveCustomerDTO> getInactiveCustomers() {
        List<InactiveCustomerDTO> cached = cache.get(NS, "inactiveCustomers", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<InactiveCustomerDTO> result = businessAnalyticsRepository.getInactiveCustomers().stream()
                    .map(p -> new InactiveCustomerDTO(p.getCustomerId(), p.getCustomerName(), p.getLastOrderDate()))
                    .toList();
            cache.put(NS, "inactiveCustomers", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch inactive customers", e);
        }
    }

    public List<InventoryAlertDTO> getInventoryAlerts() {
        List<InventoryAlertDTO> cached = cache.get(NS, "inventoryAlerts", new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<InventoryAlertDTO> result = businessAnalyticsRepository.getInventoryAlerts().stream()
                    .map(p -> new InventoryAlertDTO(p.getProductId(), p.getProductName(), p.getStock()))
                    .toList();
            cache.put(NS, "inventoryAlerts", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch inventory alerts", e);
        }
    }

    public DashboardDTO getDashboard() {
        DashboardDTO cached = cache.get("dashboard", "main", DashboardDTO.class);
        if (cached != null) return cached;
        try {
            var p = businessAnalyticsRepository.getDashboard();
            DashboardDTO result;
            if (p == null) {
                result = new DashboardDTO(java.math.BigDecimal.ZERO, 0L, 0L, 0L);
            } else {
                result = new DashboardDTO(
                        p.getTotalRevenue() != null ? p.getTotalRevenue() : java.math.BigDecimal.ZERO,
                        p.getTotalOrders() != null ? p.getTotalOrders() : 0L,
                        p.getTotalCustomers() != null ? p.getTotalCustomers() : 0L,
                        p.getTotalProducts() != null ? p.getTotalProducts() : 0L
                );
            }
            cache.put("dashboard", "main", result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch dashboard analytics", e);
        }
    }

    public List<RecentOrderDTO> getRecentOrders(int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 100);
        String cacheKey = "recentOrders_" + safeLimit;
        List<RecentOrderDTO> cached = cache.get(NS, cacheKey, new TypeReference<>() {});
        if (cached != null) return cached;
        try {
            List<RecentOrderDTO> result = orderAnalyticsRepository.getRecentOrders(safeLimit).stream()
                    .map(p -> RecentOrderDTO.builder()
                            .orderId(p.getOrderId())
                            .customerId(p.getCustomerId())
                            .customerName(p.getCustomerName())
                            .totalAmount(p.getTotalAmount())
                            .status(p.getStatus())
                            .orderDate(p.getOrderDate())
                            .build())
                    .toList();
            cache.put(NS, cacheKey, result);
            return result;
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch recent orders", e);
        }
    }

    public void evictAllAnalyticsCaches() {
        cache.evictAll(NS);
        cache.evictAll("dashboard");
    }
}