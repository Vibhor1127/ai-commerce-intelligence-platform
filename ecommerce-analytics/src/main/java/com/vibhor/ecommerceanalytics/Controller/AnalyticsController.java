package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Service.BusinessAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private BusinessAnalyticsService businessAnalyticsService;


    // ============================================================
    // TOP CUSTOMERS
    // ============================================================

    @GetMapping("/top-customers")
    public List<TopCustomerDTO> GetTopCustomers() {

        return businessAnalyticsService.getTopCustomers();
    }


    // ============================================================
    // TOP PRODUCTS
    // ============================================================

    @GetMapping("/top-products")
    public List<TopProductsDTO> GetTopProducts() {

        return businessAnalyticsService.getTopProducts();
    }


    // ============================================================
    // MONTHLY REVENUE
    // ============================================================

    @GetMapping("/monthly-revenue")
    public List<MonthlyRevenueDTO> GetMonthlyRevenue() {

        return businessAnalyticsService.getMonthlyRevenue();
    }


    // ============================================================
    // CATEGORY REVENUE
    // ============================================================

    @GetMapping("/category-revenue")
    public List<CategoryRevenueDTO> GetCategoryRevenue() {

        return businessAnalyticsService.getCategoryRevenue();
    }


    // ============================================================
    // CUSTOMER LIFETIME VALUE
    // ============================================================

    @GetMapping("/customer-lifetime-value")
    public List<CustomerLifetimeValueDTO> GetCustomerLifetimeValue() {

        return businessAnalyticsService.getCustomerLifetimeValue();
    }


    // ============================================================
    // INACTIVE CUSTOMERS
    // ============================================================

    @GetMapping("/inactive-customers")
    public List<InactiveCustomerDTO> GetInactiveCustomers() {

        return businessAnalyticsService.getInactiveCustomers();
    }


    // ============================================================
    // INVENTORY ALERTS
    // ============================================================

    @GetMapping("/inventory-alerts")
    public List<InventoryAlertDTO> GetInventoryAlerts() {

        return businessAnalyticsService.getInventoryAlerts();
    }


    // ============================================================
    // DASHBOARD
    // ============================================================

    @GetMapping("/dashboard")
    public DashboardDTO GetDashboard() {

        return businessAnalyticsService.getDashboard();
    }
}