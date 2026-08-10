package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Repository.BusinessAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

@Service
public class BusinessAnalyticsService {

    @Autowired
    private BusinessAnalyticsRepository businessAnalyticsRepository;

    @Cacheable("topCustomers")
    public List<TopCustomerDTO> getTopCustomers() {

        return businessAnalyticsRepository.getTopcustomers();
    }


    public List<TopProductsDTO> getTopProducts() {

        return businessAnalyticsRepository.getTopProducts();
    }


    public List<MonthlyRevenueDTO> getMonthlyRevenue() {

        return businessAnalyticsRepository.getMonthlyRevenue();
    }


    public List<CategoryRevenueDTO> getCategoryRevenue() {

        return businessAnalyticsRepository.getCategoryRevenue();
    }


    public List<CustomerLifetimeValueDTO> getCustomerLifetimeValue() {

        return businessAnalyticsRepository.getCustomerLifetimeValue();
    }


    public List<InactiveCustomerDTO> getInactiveCustomers() {

        return businessAnalyticsRepository.getInactiveCustomers();
    }


    public List<InventoryAlertDTO> getInventoryAlerts() {

        return businessAnalyticsRepository.getInventoryAlerts();
    }


    public DashboardDTO getDashboard() {

        return businessAnalyticsRepository.getDashboard();
    }
}