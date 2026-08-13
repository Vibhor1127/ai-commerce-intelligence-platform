package com.vibhor.ecommerceanalytics.Service;


import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import org.springframework.stereotype.Service;


@Service
public class AIAnalyticsExecutorService {


    private final BusinessAnalyticsService businessAnalyticsService;


    public AIAnalyticsExecutorService(
            BusinessAnalyticsService businessAnalyticsService) {

        this.businessAnalyticsService =
                businessAnalyticsService;
    }



    public Object execute(
            AIAnalyticsRequest request) {


        String dimension =
                request.getDimension()
                        .toLowerCase();


        String operation =
                request.getOperation()
                        .toLowerCase();



        // Top customers
        if(dimension.equals("customer")
                &&
                operation.equals("top")) {


            return businessAnalyticsService
                    .getTopCustomers();
        }



        // Top products
        if(dimension.equals("product")
                &&
                operation.equals("top")) {


            return businessAnalyticsService
                    .getTopProducts();
        }



        // Category revenue
        if(dimension.equals("category")) {


            return businessAnalyticsService
                    .getCategoryRevenue();
        }



        // Inactive customers
        if(dimension.equals("customer")
                &&
                operation.equals("inactive")) {


            return businessAnalyticsService
                    .getInactiveCustomers();
        }



        // Fallback
        return "Analytics operation not implemented yet";
    }
}