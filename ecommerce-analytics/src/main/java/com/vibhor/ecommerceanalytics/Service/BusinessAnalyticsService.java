package com.vibhor.ecommerceanalytics.Service;


import com.vibhor.ecommerceanalytics.DTO.*;

import com.vibhor.ecommerceanalytics.Exception.AnalyticsDataAccessException;
import com.vibhor.ecommerceanalytics.Repository.BusinessAnalyticsRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;


import java.util.List;



@Service
public class BusinessAnalyticsService {


    @Autowired
    private BusinessAnalyticsRepository businessAnalyticsRepository;




    @Cacheable("topCustomers")
    public List<TopCustomerDTO> getTopCustomers() {

        try {

            return businessAnalyticsRepository.getTopcustomers();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch customer analytics",
                    e
            );

        }

    }





    public List<TopProductsDTO> getTopProducts() {

        try {

            return businessAnalyticsRepository.getTopProducts();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch product analytics",
                    e
            );

        }

    }





    public List<TopProductsDTO> getLowPerformingProducts() {

        try {

            return businessAnalyticsRepository.getLowPerformingProducts();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch low performing products",
                    e
            );

        }

    }





    public List<MonthlyRevenueDTO> getMonthlyRevenue() {

        try {

            return businessAnalyticsRepository.getMonthlyRevenue();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch revenue analytics",
                    e
            );

        }

    }





    public List<CategoryRevenueDTO> getCategoryRevenue() {

        try {

            return businessAnalyticsRepository.getCategoryRevenue();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch category revenue analytics",
                    e
            );

        }

    }





    public List<CustomerLifetimeValueDTO> getCustomerLifetimeValue() {

        try {

            return businessAnalyticsRepository.getCustomerLifetimeValue();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch customer lifetime value",
                    e
            );

        }

    }





    public List<InactiveCustomerDTO> getInactiveCustomers() {

        try {

            return businessAnalyticsRepository.getInactiveCustomers();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch inactive customers",
                    e
            );

        }

    }





    public List<InventoryAlertDTO> getInventoryAlerts() {

        try {

            return businessAnalyticsRepository.getInventoryAlerts();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch inventory alerts",
                    e
            );

        }

    }





    public DashboardDTO getDashboard() {

        try {

            return businessAnalyticsRepository.getDashboard();

        }
        catch(DataAccessException e){

            throw new AnalyticsDataAccessException(
                    "Failed to fetch dashboard analytics",
                    e
            );

        }

    }


}