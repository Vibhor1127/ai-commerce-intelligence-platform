package com.vibhor.ecommerceanalytics.Service;


import com.fasterxml.jackson.databind.ObjectMapper;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Exception.InvalidAIResponseException;


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

        entity MUST be exactly one of:

        CUSTOMER
        PRODUCT
        REVENUE
        INVENTORY
        UNKNOWN


        metric describes WHAT is measured.

        operation describes the requested analysis type.


        filters captures extra conditions.

        timeframe captures date scope.



        NEVER force-map unsupported domains.

        Unsupported examples:

        - shipments
        - reviews
        - payments
        - employees
        - marketing


        For unsupported questions return:

        {
          "entity":"UNKNOWN",
          "metric":"UNKNOWN",
          "operation":"UNKNOWN",
          "filters":{},
          "timeframe":null,
          "confidence":0.0
        }


        IMPORTANT EVIDENCE RULE:

        Never invent:

        - percentages
        - thresholds
        - business benchmarks
        - unsupported calculations

        Only use available analytics evidence.



        USER QUESTION:

        %s


        """.formatted(question);




        String aiResponse;


        try {


            aiResponse =
                    chatClient
                            .prompt(prompt)
                            .call()
                            .content();



            String cleanedResponse =
                    aiResponse
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();



            return objectMapper.readValue(
                    cleanedResponse,
                    AnalyticsIntent.class
            );


        }
        catch(Exception e){


            throw new InvalidAIResponseException(
                    "Unable to parse AI generated analytics intent"
            );

        }

    }

}