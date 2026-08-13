package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.BusinessInsightData;
import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


@Service
public class BusinessInsightService {


    public BusinessInsightData analyzeTopCustomers(
            List<TopCustomerDTO> customers) {


        if(customers == null || customers.isEmpty()) {

            return new BusinessInsightData(
                    customers,
                    "No data available",
                    "No customer insights available"
            );
        }


        TopCustomerDTO topCustomer =
                customers.get(0);



        BigDecimal top3Revenue =
                customers.stream()
                        .limit(3)
                        .map(TopCustomerDTO::getTotalSpending)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        String metric =
                "Highest customer spending: ₹"
                        + topCustomer.getTotalSpending();



        String observation =
                "Top 3 customers contribute ₹"
                        + top3Revenue
                        + " in total spending.";



        return new BusinessInsightData(

                customers.stream()
                        .limit(5)
                        .toList(),

                metric,

                observation
        );
    }

}