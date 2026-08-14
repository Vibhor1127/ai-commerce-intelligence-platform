package com.vibhor.ecommerceanalytics.Service;


import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;

import org.springframework.stereotype.Service;



@Service
public class IntentRouterService {


    public AIAnalyticsRequest route(
            AnalyticsIntent intent
    ) {


        AIAnalyticsRequest request =
                new AIAnalyticsRequest();



        switch (intent.getIntent()) {


            case "TOP_CUSTOMERS":

                request.setMetric("revenue");
                request.setDimension("customer");
                request.setOperation("top");
                request.setLimit(
                        intent.getLimit()
                );

                break;



            case "CUSTOMER_VALUE":

                request.setMetric("customer_lifetime_value");
                request.setDimension("customer");
                request.setOperation("top");
                request.setLimit(
                        intent.getLimit()
                );

                break;



            case "INACTIVE_CUSTOMERS":

                request.setMetric("customers");
                request.setDimension("customer");
                request.setOperation("inactive");

                break;



            case "TOP_PRODUCTS":

                request.setMetric("sales");
                request.setDimension("product");
                request.setOperation("top");
                request.setLimit(
                        intent.getLimit()
                );

                break;



            case "LOW_PERFORMING_PRODUCTS":

                request.setMetric("sales");
                request.setDimension("product");
                request.setOperation("summary");

                break;



            case "REVENUE_SUMMARY":

                request.setMetric("revenue");
                request.setDimension("category");
                request.setOperation("summary");

                break;



            case "REVENUE_TREND":

                request.setMetric("revenue");
                request.setDimension("month");
                request.setOperation("trend");

                break;



            case "INVENTORY_SUMMARY":

                request.setMetric("inventory");
                request.setDimension("inventory");
                request.setOperation("summary");

                break;



            case "LOW_STOCK_PRODUCTS":

                request.setMetric("inventory");
                request.setDimension("inventory");
                request.setOperation("alert");

                break;



            default:

                throw new RuntimeException(
                        "Unsupported AI intent: "
                                + intent.getIntent()
                );

        }


        return request;

    }


}