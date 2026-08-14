package com.vibhor.ecommerceanalytics.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;



@Service
public class AIAnalyticsService {


    private final ChatClient chatClient;

    private final ObjectMapper objectMapper;



    public AIAnalyticsService(
            ChatClient.Builder chatClientBuilder
    ) {

        this.chatClient =
                chatClientBuilder.build();

        this.objectMapper =
                new ObjectMapper();
    }





    public AnalyticsIntent understandQuestion(
            String question
    ) {


        String prompt = """

                You are an AI Business Intelligence
                intent classifier for an e-commerce platform.

                Your task:

                Understand the user's business question
                and convert it into a structured intent.

                Return ONLY valid JSON.

                Do not add:
                - markdown
                - explanations
                - comments


                JSON FORMAT:

                {
                  "intent":"",
                  "entity":"",
                  "metric":"",
                  "limit":10
                }



                SUPPORTED INTENTS:


                Customer Analytics:

                TOP_CUSTOMERS
                CUSTOMER_VALUE
                INACTIVE_CUSTOMERS


                Product Analytics:

                TOP_PRODUCTS
                LOW_PERFORMING_PRODUCTS


                Revenue Analytics:

                REVENUE_SUMMARY
                REVENUE_TREND


                Inventory Analytics:

                INVENTORY_SUMMARY
                LOW_STOCK_PRODUCTS



                EXAMPLES:



                Question:
                Who are my biggest buyers?


                Output:

                {
                  "intent":"TOP_CUSTOMERS",
                  "entity":"CUSTOMER",
                  "metric":"TOTAL_SPENDING",
                  "limit":10
                }




                Question:
                Show customers who stopped purchasing


                Output:

                {
                  "intent":"INACTIVE_CUSTOMERS",
                  "entity":"CUSTOMER",
                  "metric":"LAST_ORDER_DATE",
                  "limit":null
                }





                Question:
                Which products generate the most revenue?


                Output:

                {
                  "intent":"TOP_PRODUCTS",
                  "entity":"PRODUCT",
                  "metric":"REVENUE",
                  "limit":10
                }





                Question:
                Which products need restocking?


                Output:

                {
                  "intent":"LOW_STOCK_PRODUCTS",
                  "entity":"INVENTORY",
                  "metric":"STOCK_LEVEL",
                  "limit":10
                }





                If the question is unrelated:

                {
                  "intent":"UNKNOWN",
                  "entity":"UNKNOWN",
                  "metric":"UNKNOWN",
                  "limit":null
                }



                User Question:

                %s


                """.formatted(question);



        String aiResponse =
                chatClient
                        .prompt(prompt)
                        .call()
                        .content();



        try {


            String cleanedResponse =
                    aiResponse
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();



            AnalyticsIntent intent =
                    objectMapper.readValue(
                            cleanedResponse,
                            AnalyticsIntent.class
                    );



            if(intent.getIntent()==null) {

                throw new RuntimeException(
                        "Intent missing from AI response"
                );
            }


            return intent;



        }
        catch(Exception e) {


            throw new RuntimeException(
                    "AI intent parsing failed. Raw response: "
                            + aiResponse,
                    e
            );

        }


    }


}