package com.vibhor.ecommerceanalytics.Service;


import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;

import org.springframework.stereotype.Service;



@Service
public class IntentRouterService {


    public AIAnalyticsRequest route(
            AnalyticsIntent intent
    ) {


        if(intent == null ||
                intent.getIntent() == null) {

            throw new RuntimeException(
                    "Invalid AI intent"
            );
        }



        AIAnalyticsRequest request =
                new AIAnalyticsRequest();



        switch(intent.getIntent().toUpperCase()) {



            /*
             * CUSTOMER ANALYTICS
             */

            case "TOP_CUSTOMERS":

                request.setMetric(
                        "revenue"
                );

                request.setDimension(
                        "customer"
                );

                request.setOperation(
                        "top"
                );

                request.setLimit(
                        defaultLimit(intent.getLimit())
                );

                break;




            case "CUSTOMER_VALUE":

                request.setMetric(
                        "customer_lifetime_value"
                );

                request.setDimension(
                        "customer"
                );

                request.setOperation(
                        "top"
                );

                request.setLimit(
                        defaultLimit(intent.getLimit())
                );

                break;





            case "INACTIVE_CUSTOMERS":

                request.setMetric(
                        "customers"
                );

                request.setDimension(
                        "customer"
                );

                request.setOperation(
                        "inactive"
                );

                break;







            /*
             * PRODUCT ANALYTICS
             */

            case "TOP_PRODUCTS":


                request.setMetric(
                        "sales"
                );

                request.setDimension(
                        "product"
                );

                request.setOperation(
                        "top"
                );

                request.setLimit(
                        defaultLimit(intent.getLimit())
                );


                break;





            case "LOW_PERFORMING_PRODUCTS":


                request.setMetric(
                        "sales"
                );


                request.setDimension(
                        "product"
                );


                request.setOperation(
                        "low_performing"
                );


                request.setLimit(
                        defaultLimit(intent.getLimit())
                );


                break;







            /*
             * REVENUE ANALYTICS
             */


            case "REVENUE_SUMMARY":


                request.setMetric(
                        "revenue"
                );


                request.setDimension(
                        "category"
                );


                request.setOperation(
                        "summary"
                );


                break;






            case "REVENUE_TREND":


                request.setMetric(
                        "revenue"
                );


                request.setDimension(
                        "month"
                );


                request.setOperation(
                        "trend"
                );


                break;








            /*
             * INVENTORY ANALYTICS
             */


            case "LOW_STOCK_PRODUCTS":


                request.setMetric(
                        "inventory"
                );


                request.setDimension(
                        "inventory"
                );


                request.setOperation(
                        "alert"
                );


                break;






            case "INVENTORY_SUMMARY":


                request.setMetric(
                        "inventory"
                );


                request.setDimension(
                        "inventory"
                );


                request.setOperation(
                        "summary"
                );


                break;







            case "UNKNOWN":

                throw new RuntimeException(
                        "Unable to understand analytics request"
                );






            default:

                throw new RuntimeException(
                        "Unsupported AI intent: "
                                + intent.getIntent()
                );

        }



        return request;

    }






    private Integer defaultLimit(
            Integer limit
    ){

        return limit == null ? 10 : limit;

    }


}