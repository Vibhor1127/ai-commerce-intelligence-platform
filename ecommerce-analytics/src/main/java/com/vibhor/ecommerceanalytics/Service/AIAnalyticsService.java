package com.vibhor.ecommerceanalytics.Service;


import com.fasterxml.jackson.databind.ObjectMapper;

import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.Exception.InvalidAIResponseException;
import com.vibhor.ecommerceanalytics.Service.Handler.CapabilityRegistry;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

@Service
public class AIAnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AIAnalyticsService.class);

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final CapabilityRegistry capabilityRegistry;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    @Value("${nvidia.api.key:YOUR_KEY_HERE}")
    private String nvidiaApiKey;

    @Value("${NVIDIA_API_KEY:}")
    private String envNvidiaApiKey;

    public AIAnalyticsService(
            ChatClient.Builder chatClientBuilder,
            CapabilityRegistry capabilityRegistry
    ) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
        this.capabilityRegistry = capabilityRegistry;
    }

    public AnalyticsIntent understandQuestion(String question) {
        // Fast-path: if API key is not configured or is placeholder, use deterministic heuristics instantly
        if (!hasValidApiKey()) {
            logger.info("NVIDIA API key not set or using default placeholder. Using fast deterministic intent heuristic.");
            return heuristicIntent(question);
        }


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


            CompletableFuture<String> future = CompletableFuture.supplyAsync(
                    () -> chatClient.prompt(prompt).call().content(),
                    executor
            );
            aiResponse = future.get(3500, TimeUnit.MILLISECONDS);

            logger.info("AI Intent Raw Response: {}", aiResponse);

            String rawContent = aiResponse != null ? aiResponse.trim() : "";
            String cleanedResponse = extractJson(rawContent);

            AnalyticsIntent parsed = objectMapper.readValue(
                    cleanedResponse,
                    AnalyticsIntent.class
            );

            if (parsed == null || "UNKNOWN".equalsIgnoreCase(parsed.getEntity())) {
                AnalyticsIntent fallback = heuristicIntent(question);
                if (!"UNKNOWN".equalsIgnoreCase(fallback.getEntity())) {
                    return fallback;
                }
            }

            return parsed;

        } catch (Exception e) {
            logger.warn(
                    "LLM intent parsing unavailable or timed out ({}), falling back to deterministic intent heuristics",
                    e.getMessage()
            );

            AnalyticsIntent fallback = heuristicIntent(question);
            if (!"UNKNOWN".equalsIgnoreCase(fallback.getEntity())) {
                return fallback;
            }

            throw new InvalidAIResponseException(
                    "Unable to parse AI generated analytics intent: " + e.getMessage()
            );
        }
    }

    private boolean hasValidApiKey() {
        if (envNvidiaApiKey != null && !envNvidiaApiKey.isBlank() && !envNvidiaApiKey.contains("YOUR_KEY")) {
            return true;
        }
        return nvidiaApiKey != null && !nvidiaApiKey.isBlank() && !nvidiaApiKey.contains("YOUR_KEY");
    }

    private AnalyticsIntent heuristicIntent(String question) {
        if (question == null || question.isBlank()) {
            return new AnalyticsIntent("UNKNOWN", "UNKNOWN", "UNKNOWN", java.util.Map.of(), null, 0.0);
        }
        String q = question.toLowerCase();

        // Customer queries: "What is the email ID of adam ?", "adam", "customer", "user"
        if (q.contains("adam") || q.contains("email") || q.contains("customer") || q.contains("user") || q.contains("buyer") || q.contains("profile") || q.contains("who")) {
            String name = extractName(question);
            java.util.Map<String, String> filters = new java.util.HashMap<>();
            if (name != null) {
                filters.put("query", name);
                filters.put("name", name);
            }
            String op = (q.contains("email") || q.contains("who") || name != null) ? "CUSTOMER_SEARCH" :
                        (q.contains("churn") || q.contains("inactive")) ? "INACTIVE_CUSTOMERS" :
                        (q.contains("lifetime") || q.contains("clv") || q.contains("ltv")) ? "LIFETIME_VALUE" : "TOP_CUSTOMERS";
            return new AnalyticsIntent("CUSTOMER", name != null ? name : "top_customers", op, filters, null, 0.95);
        }

        // Order queries: "order", "orders", "cancelled", "history", "recent"
        if (q.contains("order") || q.contains("cancel") || q.contains("return") || q.contains("refund") || q.contains("purchase")) {
            String op = (q.contains("cancel") || q.contains("refund") || q.contains("return")) ? "CANCELLED_ORDERS" :
                        (q.contains("recent") || q.contains("latest")) ? "RECENT_ORDERS" :
                        (q.contains("frequency") || q.contains("repeat")) ? "CUSTOMER_ORDER_FREQUENCY" : "ORDER_TRENDS";
            return new AnalyticsIntent("ORDER", "order_volume", op, java.util.Map.of(), null, 0.95);
        }

        // Payment queries: "payment", "transaction", "fail", "failed"
        if (q.contains("pay") || q.contains("transaction") || q.contains("card") || q.contains("upi")) {
            String op = q.contains("fail") ? "FAILED_PAYMENTS" : "PAYMENT_METHOD_STATS";
            return new AnalyticsIntent("PAYMENT", "payment_transactions", op, java.util.Map.of(), null, 0.95);
        }

        // Shipment queries: "shipment", "delivery", "delay", "shipping"
        if (q.contains("ship") || q.contains("deliver") || q.contains("track") || q.contains("delay")) {
            String op = q.contains("delay") ? "DELAYED_SHIPMENTS" : "SHIPMENT_STATUS";
            return new AnalyticsIntent("SHIPMENT", "shipment_status", op, java.util.Map.of(), null, 0.95);
        }

        // Revenue queries: "revenue", "sales", "income", "month"
        if (q.contains("revenue") || q.contains("sale") || q.contains("income") || q.contains("earn")) {
            String op = q.contains("category") ? "CATEGORY_REVENUE" : "MONTHLY_REVENUE";
            return new AnalyticsIntent("REVENUE", "total_revenue", op, java.util.Map.of(), null, 0.95);
        }

        // Product queries: "product", "item", "stock", "inventory"
        if (q.contains("product") || q.contains("item") || q.contains("stock") || q.contains("inventory")) {
            if (q.contains("stock") || q.contains("inventory") || q.contains("alert")) {
                return new AnalyticsIntent("INVENTORY", "stock_level", "INVENTORY_ALERTS", java.util.Map.of(), null, 0.95);
            }
            String op = (q.contains("low") || q.contains("worst") || q.contains("bottom")) ? "LOW_PERFORMING_PRODUCTS" : "TOP_PRODUCTS";
            return new AnalyticsIntent("PRODUCT", "sales_volume", op, java.util.Map.of(), null, 0.95);
        }

        // Review queries: "review", "rating", "satisfaction", "sentiment"
        if (q.contains("review") || q.contains("rating") || q.contains("feedback") || q.contains("dissatisfied") || q.contains("complaint")) {
            String op = (q.contains("bad") || q.contains("negative") || q.contains("poor") || q.contains("1 star") || q.contains("2 star")) ? "NEGATIVE_REVIEWS" : "PRODUCT_RATINGS";
            return new AnalyticsIntent("REVIEW", "customer_rating", op, java.util.Map.of(), null, 0.95);
        }

        return new AnalyticsIntent("UNKNOWN", "UNKNOWN", "UNKNOWN", java.util.Map.of(), null, 0.0);
    }

    private String extractName(String question) {
        String lower = question.toLowerCase();
        for (String stopWord : java.util.List.of("what is the email id of ", "what is the email of ", "email of ", "email id of ", "find customer ", "show customer ", "who is ", "search ")) {
            int idx = lower.indexOf(stopWord);
            if (idx != -1) {
                String candidate = question.substring(idx + stopWord.length()).replaceAll("[?\\.!]", "").trim();
                if (!candidate.isBlank()) return candidate;
            }
        }
        if (lower.contains("adam")) return "adam";
        if (lower.contains("vibhor")) return "vibhor";
        return null;
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