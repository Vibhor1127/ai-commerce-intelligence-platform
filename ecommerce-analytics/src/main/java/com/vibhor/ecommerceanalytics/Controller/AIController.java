package com.vibhor.ecommerceanalytics.Controller;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import com.vibhor.ecommerceanalytics.DTO.AIExplanationResponse;
import com.vibhor.ecommerceanalytics.DTO.AIQuestionRequest;
import com.vibhor.ecommerceanalytics.DTO.BusinessInsightData;
import com.vibhor.ecommerceanalytics.DTO.TopCustomerDTO;

import com.vibhor.ecommerceanalytics.Service.AIAnalyticsExecutorService;
import com.vibhor.ecommerceanalytics.Service.AIAnalyticsService;
import com.vibhor.ecommerceanalytics.Service.AIAnalyticsValidatorService;
import com.vibhor.ecommerceanalytics.Service.AIExplanationService;
import com.vibhor.ecommerceanalytics.Service.BusinessInsightService;


import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/ai")
public class AIController {


    private final AIAnalyticsService aiAnalyticsService;

    private final AIAnalyticsValidatorService validatorService;

    private final AIAnalyticsExecutorService executorService;

    private final AIExplanationService explanationService;

    private final BusinessInsightService businessInsightService;

    private final ObjectMapper objectMapper;



    public AIController(
            AIAnalyticsService aiAnalyticsService,
            AIAnalyticsValidatorService validatorService,
            AIAnalyticsExecutorService executorService,
            AIExplanationService explanationService,
            BusinessInsightService businessInsightService
    ) {


        this.aiAnalyticsService = aiAnalyticsService;

        this.validatorService = validatorService;

        this.executorService = executorService;

        this.explanationService = explanationService;

        this.businessInsightService = businessInsightService;

        this.objectMapper = new ObjectMapper();
    }





    @PostMapping("/ask")
    public AIExplanationResponse askQuestion(
            @RequestBody AIQuestionRequest request
    ) {



        // 1. Understand question

        AIAnalyticsRequest intent =
                aiAnalyticsService
                        .understandQuestion(
                                request.getQuestion()
                        );



        // 2. Validate intent

        AIAnalyticsRequest validatedRequest =
                validatorService
                        .validate(intent);



        // 3. Execute analytics

        Object analyticsData =
                executorService
                        .execute(validatedRequest);



        Object finalData = analyticsData;



        // 4. Business Insight Layer

        if(validatedRequest.getDimension()
                .equalsIgnoreCase("customer")
                &&
                validatedRequest.getOperation()
                        .equalsIgnoreCase("top")) {



            try {


                List<TopCustomerDTO> customers =
                        objectMapper.convertValue(
                                analyticsData,
                                new TypeReference<List<TopCustomerDTO>>() {}
                        );



                BusinessInsightData insightData =
                        businessInsightService
                                .analyzeTopCustomers(
                                        customers
                                );


                finalData = insightData;


            }
            catch(Exception e){


                throw new RuntimeException(
                        "Customer insight conversion failed: "
                                + e.getMessage()
                );

            }

        }




        // 5. AI Explanation

        return explanationService
                .generateExplanation(
                        request.getQuestion(),
                        finalData
                );

    }





    @GetMapping("/health")
    public String health(){

        return "AI Analytics Platform Running";

    }

}