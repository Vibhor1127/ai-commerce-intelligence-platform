package com.vibhor.ecommerceanalytics.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIAnalyticsService {

    private final ChatClient chatClient;

    public AIAnalyticsService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public AIAnalyticsRequest understandQuestion(String question) {

        String prompt = """
                You are an e-commerce analytics intent parser.

                Convert the user's question into JSON.

                Return ONLY valid JSON.
                Do not add markdown.
                Do not add explanations.

                JSON fields:
                metric
                dimension
                operation
                period
                limit

                Allowed metrics:
                revenue
                sales
                customers
                products
                inventory
                customer_lifetime_value

                Allowed dimensions:
                customer
                product
                category
                month
                inventory

                Allowed operations:
                top
                trend
                compare
                summary
                inactive
                alert

                If the question cannot be understood, use:
                {
                  "metric": "unknown",
                  "dimension": "unknown",
                  "operation": "unknown",
                  "period": null,
                  "limit": null
                }

                User question:
                %s
                """.formatted(question);

        String aiResponse = chatClient
                .prompt(prompt)
                .call()
                .content();

        try {

            // Convert AI JSON response into our Java object
            return new ObjectMapper().readValue(
                    aiResponse,
                    AIAnalyticsRequest.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "AI returned an invalid analytics request"
            );
        }
    }
}