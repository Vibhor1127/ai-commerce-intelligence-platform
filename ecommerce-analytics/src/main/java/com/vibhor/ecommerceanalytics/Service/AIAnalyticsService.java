package com.vibhor.ecommerceanalytics.Service;


import com.fasterxml.jackson.databind.ObjectMapper;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Exception.InvalidAIResponseException;
import com.vibhor.ecommerceanalytics.Service.Handler.CapabilityRegistry;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;



@Service
public class AIAnalyticsService {


    private static final Logger logger =
            LoggerFactory.getLogger(
                    AIAnalyticsService.class
            );


    private final ChatClient chatClient;

    private final ObjectMapper objectMapper;

    private final CapabilityRegistry capabilityRegistry;



    public AIAnalyticsService(
            ChatClient.Builder chatClientBuilder,
            CapabilityRegistry capabilityRegistry
    ) {


        this.chatClient =
                chatClientBuilder.build();


        this.objectMapper =
                new ObjectMapper();

        this.capabilityRegistry = capabilityRegistry;

    }




    public AnalyticsIntent understandQuestion(
            String question
    ) {


        // Dynamically generate entity list and operations from registry
        String entityList = capabilityRegistry.generatePromptEntityList();
        String operationsReference = capabilityRegistry.generatePromptOperationsReference();


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

        %s
        UNKNOWN


        AVAILABLE CAPABILITIES AND OPERATIONS:

        %s


        operation MUST be exactly one of the operations
        listed above for the chosen entity.

        If no specific operation matches, use the FIRST
        operation listed for that entity as default.


        metric describes WHAT is measured.

        filters captures extra conditions.

        timeframe captures date scope.
        For timeframe use formats like:
        "last_30_days", "last_90_days", "last_7_days",
        "this_month", "last_month", "this_year"
        or null if not specified.



        NEVER force-map unsupported domains.

        If the question does not match ANY of the
        available capabilities above, return:

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


        """.formatted(entityList, operationsReference, question);




        String aiResponse;


        try {


            aiResponse =
                    chatClient
                            .prompt(prompt)
                            .call()
                            .content();


            logger.info(
                    "AI Intent Raw Response: {}",
                    aiResponse
            );


            String rawContent =
                    aiResponse != null ? aiResponse.trim() : "";

            String cleanedResponse = extractJson(rawContent);

            return objectMapper.readValue(
                    cleanedResponse,
                    AnalyticsIntent.class
            );


        }
        catch(Exception e){

            logger.error(
                    "Failed to parse AI intent response",
                    e
            );

            throw new InvalidAIResponseException(
                    "Unable to parse AI generated analytics intent"
            );

        }

    }

    private String extractJson(String text) {
        if (text == null || text.isBlank()) {
            return "{}";
        }
        String stripped = text.replace("```json", "").replace("```", "").trim();
        int firstBrace = stripped.indexOf('{');
        int lastBrace = stripped.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return stripped.substring(firstBrace, lastBrace + 1);
        }
        return stripped;
    }

}