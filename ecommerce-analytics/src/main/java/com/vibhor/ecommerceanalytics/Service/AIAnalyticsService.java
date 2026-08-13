package com.vibhor.ecommerceanalytics.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIAnalyticsService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AIAnalyticsService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public AIAnalyticsRequest understandQuestion(String question) {

        String prompt = """
                You are an e-commerce analytics intent parser.

                Your ONLY task is to convert the user's question
                into a structured analytics request.

                Return ONLY valid JSON.
                Do not add markdown.
                Do not add explanations.
                Do not add ```json or ```.

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

                Examples:

                User:
                Who are my top customers?

                JSON:
                {
                  "metric": "revenue",
                  "dimension": "customer",
                  "operation": "top",
                  "period": null,
                  "limit": 10
                }

                User:
                Which products sell the most?

                JSON:
                {
                  "metric": "sales",
                  "dimension": "product",
                  "operation": "top",
                  "period": null,
                  "limit": 10
                }

                User:
                Which customers are inactive?

                JSON:
                {
                  "metric": "customers",
                  "dimension": "customer",
                  "operation": "inactive",
                  "period": null,
                  "limit": null
                }

                User:
                Which categories generate the most revenue?

                JSON:
                {
                  "metric": "revenue",
                  "dimension": "category",
                  "operation": "top",
                  "period": null,
                  "limit": 10
                }

                If the question cannot be understood, return:

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


        if (aiResponse == null || aiResponse.isBlank()) {

            throw new RuntimeException(
                    "AI returned an empty analytics response"
            );
        }


        try {

            // Remove accidental Markdown code fences
            String cleanedResponse = aiResponse
                    .trim()
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();


            AIAnalyticsRequest request =
                    objectMapper.readValue(
                            cleanedResponse,
                            AIAnalyticsRequest.class
                    );


            // Validate that AI actually produced an intent
            if (request.getMetric() == null
                    || request.getDimension() == null
                    || request.getOperation() == null) {

                throw new RuntimeException(
                        "AI returned incomplete analytics request"
                );
            }


            return request;


        } catch (Exception e) {

            throw new RuntimeException(
                    "AI returned invalid analytics request. "
                            + "Raw response: "
                            + aiResponse,
                    e
            );
        }
    }
}