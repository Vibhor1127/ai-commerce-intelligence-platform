package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.Config.RedisConfig;
import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Exception.AnalyticsDataAccessException;
import com.vibhor.ecommerceanalytics.Repository.BusinessAnalyticsRepository;
import com.vibhor.ecommerceanalytics.Repository.OrderAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessAnalyticsService {

    @Autowired
    private BusinessAnalyticsRepository businessAnalyticsRepository;

    @Autowired
    private OrderAnalyticsRepository orderAnalyticsRepository;

    @Cacheable(RedisConfig.CACHE_TOP_CUSTOMERS)
    public List<TopCustomerDTO> getTopCustomers() {
        try {
            return businessAnalyticsRepository.getTopcustomers().stream()
                    .map(p -> new TopCustomerDTO(
                            p.getCustomerId(),
                            p.getCustomerName(),
                            p.getTotalSpending()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch customer analytics", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_TOP_PRODUCTS)
    public List<TopProductsDTO> getTopProducts() {
        try {
            return businessAnalyticsRepository.getTopProducts().stream()
                    .map(p -> new TopProductsDTO(
                            p.getProductId(),
                            p.getProductName(),
                            p.getQuantity(),
                            p.getRevenue()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch product analytics", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_LOW_PRODUCTS)
    public List<TopProductsDTO> getLowPerformingProducts() {
        try {
            return businessAnalyticsRepository.getLowPerformingProducts().stream()
                    .map(p -> new TopProductsDTO(
                            p.getProductId(),
                            p.getProductName(),
                            p.getQuantity(),
                            p.getRevenue()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch low performing products", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_MONTHLY_REVENUE)
    public List<MonthlyRevenueDTO> getMonthlyRevenue() {
        try {
            return businessAnalyticsRepository.getMonthlyRevenue().stream()
                    .map(p -> new MonthlyRevenueDTO(
                            p.getYear(),
                            p.getMonth(),
                            p.getRevenue()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch revenue analytics", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_CATEGORY_REVENUE)
    public List<CategoryRevenueDTO> getCategoryRevenue() {
        try {
            return businessAnalyticsRepository.getCategoryRevenue().stream()
                    .map(p -> new CategoryRevenueDTO(
                            p.getCategoryId(),
                            p.getCategoryName(),
                            p.getRevenue()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch category revenue analytics", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_LIFETIME_VALUE)
    public List<CustomerLifetimeValueDTO> getCustomerLifetimeValue() {
        try {
            return businessAnalyticsRepository.getCustomerLifetimeValue().stream()
                    .map(p -> new CustomerLifetimeValueDTO(
                            p.getCustomerId(),
                            p.getCustomerName(),
                            p.getLifetimeValue()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch customer lifetime value", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_INACTIVE_CUSTOMERS)
    public List<InactiveCustomerDTO> getInactiveCustomers() {
        try {
            return businessAnalyticsRepository.getInactiveCustomers().stream()
                    .map(p -> new InactiveCustomerDTO(
                            p.getCustomerId(),
                            p.getCustomerName(),
                            p.getLastOrderDate()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch inactive customers", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_INVENTORY_ALERTS)
    public List<InventoryAlertDTO> getInventoryAlerts() {
        try {
            return businessAnalyticsRepository.getInventoryAlerts().stream()
                    .map(p -> new InventoryAlertDTO(
                            p.getProductId(),
                            p.getProductName(),
                            p.getStock()
                    ))
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch inventory alerts", e);
        }
    }

    @Cacheable(RedisConfig.CACHE_DASHBOARD)
    public DashboardDTO getDashboard() {
        try {
            var p = businessAnalyticsRepository.getDashboard();
            if (p == null) {
                return new DashboardDTO(java.math.BigDecimal.ZERO, 0L, 0L, 0L);
            }
            return new DashboardDTO(
                    p.getTotalRevenue() != null ? p.getTotalRevenue() : java.math.BigDecimal.ZERO,
                    p.getTotalOrders() != null ? p.getTotalOrders() : 0L,
                    p.getTotalCustomers() != null ? p.getTotalCustomers() : 0L,
                    p.getTotalProducts() != null ? p.getTotalProducts() : 0L
            );
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch dashboard analytics", e);
        }
    }

    public List<RecentOrderDTO> getRecentOrders(int limit) {
        try {
            int safeLimit = Math.min(Math.max(limit, 1), 100);
            return orderAnalyticsRepository.getRecentOrders(safeLimit).stream()
                    .map(p -> RecentOrderDTO.builder()
                            .orderId(p.getOrderId())
                            .customerId(p.getCustomerId())
                            .customerName(p.getCustomerName())
                            .totalAmount(p.getTotalAmount())
                            .status(p.getStatus())
                            .orderDate(p.getOrderDate())
                            .build())
                    .toList();
        } catch (DataAccessException e) {
            throw new AnalyticsDataAccessException("Failed to fetch recent orders", e);
        }
    }

    @Caching(evict = {
            @CacheEvict(value = RedisConfig.CACHE_TOP_CUSTOMERS, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_TOP_PRODUCTS, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_LOW_PRODUCTS, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_MONTHLY_REVENUE, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_CATEGORY_REVENUE, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_LIFETIME_VALUE, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_INACTIVE_CUSTOMERS, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_INVENTORY_ALERTS, allEntries = true),
            @CacheEvict(value = RedisConfig.CACHE_DASHBOARD, allEntries = true)
    })
    public void evictAllAnalyticsCaches() {
        // Triggers cache invalidation across all analytics domains
    }
}