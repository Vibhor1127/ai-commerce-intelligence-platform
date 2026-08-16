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
          "entity":"",
          "metric":"",
          "operation":"",
          "filters":{},
          "timeframe":null,
          "confidence":0.0
        }


        FIELD RULES:

        entity MUST be exactly one of these values (uppercase, singular).
        Never use plural or lowercase forms. Never invent a new entity value.

        CUSTOMER
        PRODUCT
        REVENUE
        INVENTORY


        metric describes WHAT is being measured, in your own words,
        as a short snake_case label.

        Examples:
        total_spending, sales_performance, churn_risk, stock_level,
        revenue_growth


        operation describes the KIND of analysis being requested,
        in your own words, as a short snake_case or UPPERCASE label.

        Examples:
        top, low_performing, inactive, trend, summary, alert


        filters is a JSON object capturing any extra conditions mentioned
        in the question (region, category, time-bounded segment, etc).
        Use {} if none are mentioned.


        timeframe captures any date/time scope mentioned
        ("last quarter", "this month"). Use null if not mentioned.



        AVAILABLE BUSINESS CAPABILITIES:



        CUSTOMER:

        Meaning:
        Anything about customers -- highest value customers, VIPs,
        customers at risk of leaving/churning, customer lifetime value.

        Examples:

        "Who are my biggest buyers?"

        "Who spends the most?"

        "Show VIP customers"

        "Which customers generate maximum revenue?"

        "Which customers stopped buying?"

        "Who has not ordered recently?"

        "Who should we focus on retaining?"

        "Which customers are worth protecting?"




        PRODUCT:

        Meaning:
        Anything about products -- best sellers, weak/low performing
        products.

        Examples:

        "Which products sell the most?"

        "Show highest revenue products"

        "What are my best sellers?"

        "Which products are not selling?"

        "Show weak products"

        "Which products are performing poorly?"




        REVENUE:

        Meaning:
        Anything about overall revenue, category revenue, or revenue
        trends over time.

        Examples:

        "Give me revenue overview"

        "How is my business performing?"

        "Show monthly revenue trend"

        "Is revenue growing?"

        "Show sales growth"

        "Why is revenue changing?"




        INVENTORY:

        Meaning:
        Anything about stock levels, restocking, inventory health.

        Examples:

        "Which products need restocking?"

        "What inventory is low?"

        "Where should I invest my inventory budget?"




        UNKNOWN:

        If the question is completely unrelated to ecommerce
        business analytics (small talk, coding help, general
        knowledge, etc), OR if it asks about a domain we do not
        support (shipments, reviews, payments, staff, marketing
        campaigns, or anything else not listed above), return:


        {
          "entity":"UNKNOWN",
          "metric":"UNKNOWN",
          "operation":"UNKNOWN",
          "filters":{},
          "timeframe":null,
          "confidence":0.0
        }




        IMPORTANT RULES:


        1. Understand meaning, not keywords.

        Example:

        "Who should I focus on retaining?"

        Means:

        entity: CUSTOMER, operation relates to churn/retention risk.


        2. Never refuse to classify a business-sounding question that
        genuinely fits CUSTOMER, PRODUCT, REVENUE, or INVENTORY. Even an
        unusual or oddly-phrased question must be mapped to your best-guess
        entity/metric/operation within those four. Lower the confidence
        score instead of refusing.

        3. Never output an entity outside CUSTOMER, PRODUCT, REVENUE,
        INVENTORY, or UNKNOWN.

        4. If the question is about something we do NOT support -- for
        example shipments, reviews, payments, staff, marketing, or
        anything else not covered by CUSTOMER, PRODUCT, REVENUE, or
        INVENTORY -- you MUST return entity "UNKNOWN". Do NOT force-map
        it onto the closest available entity just because one of the
        four sounds vaguely related. Guessing the nearest entity for a
        domain we don't support produces a confident-sounding wrong
        answer, which is worse than honestly saying we don't support it
        yet.

        5. Confidence:
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