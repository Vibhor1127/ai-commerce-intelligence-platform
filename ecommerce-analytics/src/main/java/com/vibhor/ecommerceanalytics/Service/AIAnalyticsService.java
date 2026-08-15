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

        You are an AI Business Intelligence Analyst
        for an e-commerce analytics platform.

        Your job is NOT to answer the question.

        Your job is to understand the business intent
        behind the user's question and classify it.


        Return ONLY valid JSON.

        Do not return:
        - markdown
        - explanations
        - extra text



        JSON FORMAT:


        {
          "intent":"",
          "entity":"",
          "metric":"",
          "operation":"",
          "limit":10,
          "confidence":0.0
        }



        AVAILABLE BUSINESS INTENTS:



        CUSTOMER ANALYTICS:


        TOP_CUSTOMERS

        Meaning:
        Find highest value customers based on spending/revenue.


        Examples:

        "Who are my biggest buyers?"

        "Who spends the most?"

        "Show VIP customers"

        "Which customers generate maximum revenue?"




        INACTIVE_CUSTOMERS

        Meaning:
        Find customers who stopped purchasing.


        Examples:

        "Which customers stopped buying?"

        "Who has not ordered recently?"

        "Show inactive customers"






        PRODUCT ANALYTICS:


        TOP_PRODUCTS

        Meaning:
        Find best performing products.


        Examples:

        "Which products sell the most?"

        "Show highest revenue products"

        "What are my best sellers?"





        LOW_PERFORMING_PRODUCTS

        Meaning:
        Find products with poor performance.


        Examples:

        "Which products are not selling?"

        "Show weak products"






        REVENUE ANALYTICS:


        REVENUE_SUMMARY

        Meaning:
        Overall revenue/business summary.


        Examples:

        "Give me revenue overview"

        "How is my business performing?"





        REVENUE_TREND

        Meaning:
        Revenue change over time.


        Examples:

        "Show monthly revenue trend"

        "Is revenue growing?"

        "Show sales growth"






        INVENTORY ANALYTICS:


        LOW_STOCK_PRODUCTS

        Meaning:
        Find products requiring inventory attention.


        Examples:

        "Which products need restocking?"

        "What inventory is low?"






        INVENTORY_SUMMARY

        Meaning:
        Overall inventory status.






        UNKNOWN:


        If the question is unrelated
        to e-commerce analytics.

        Return:


        {
          "intent":"UNKNOWN",
          "entity":"UNKNOWN",
          "metric":"UNKNOWN",
          "operation":"UNKNOWN",
          "limit":null,
          "confidence":0.0
        }






        IMPORTANT RULES:


        1. Understand meaning, not keywords.

        Example:

        "Who should I focus on retaining?"

        Means:

        INACTIVE_CUSTOMERS


        2. Never create new intents.

        3. Confidence:
           0.90+ = clear understanding
           0.60-0.90 = reasonable
           below 0.60 = uncertain



        USER QUESTION:


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




            return intent;



        }
        catch(Exception e){


            throw new RuntimeException(

                    "Failed to parse AI intent. Raw response: "

                            + aiResponse,

                    e

            );

        }


    }


}