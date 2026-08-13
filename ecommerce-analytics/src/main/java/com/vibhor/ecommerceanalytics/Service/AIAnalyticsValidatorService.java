package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import org.springframework.stereotype.Service;


@Service
public class AIAnalyticsValidatorService {


    public AIAnalyticsRequest validate(
            AIAnalyticsRequest request) {


        if(request.getDimension() == null ||
                request.getOperation() == null) {

            throw new RuntimeException(
                    "Invalid analytics request"
            );
        }


        // Default limit
        if(request.getLimit() == null) {

            request.setLimit(10);
        }


        String dimension =
                request.getDimension().toLowerCase();


        String operation =
                request.getOperation().toLowerCase();



        boolean validRequest =

                // Customers
                (dimension.equals("customer")
                        &&
                        (operation.equals("top")
                                || operation.equals("inactive")))


                        ||

                        // Products
                        (dimension.equals("product")
                                &&
                                operation.equals("top"))


                        ||

                        // Category
                        (dimension.equals("category")
                                &&
                                (operation.equals("top")
                                        || operation.equals("trend")))


                        ||

                        // Revenue
                        (request.getMetric()
                                .equalsIgnoreCase("revenue")
                                &&
                                operation.equals("summary"));



        if(!validRequest) {

            throw new RuntimeException(
                    "Unsupported analytics request"
            );
        }


        return request;
    }
}