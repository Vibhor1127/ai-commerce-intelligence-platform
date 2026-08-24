package com.vibhor.ecommerceanalytics.Controller;


import com.vibhor.ecommerceanalytics.Service.AICacheService;
import com.vibhor.ecommerceanalytics.Service.Handler.AnalyticsCapability;
import com.vibhor.ecommerceanalytics.Service.Handler.CapabilityRegistry;
import com.vibhor.ecommerceanalytics.Service.Handler.ValidationResult;

import com.vibhor.ecommerceanalytics.DTO.AIExplanationResponse;
import com.vibhor.ecommerceanalytics.DTO.AIQuestionRequest;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsResult;

import com.vibhor.ecommerceanalytics.Service.AIAnalyticsService;
import com.vibhor.ecommerceanalytics.Service.AIExplanationService;


import com.vibhor.ecommerceanalytics.DTO.ErrorResponse;
import com.vibhor.ecommerceanalytics.DTO.ValidationErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/ai")
@Tag(
        name = "AI Analytics",
        description = "Natural language based E-Commerce business intelligence APIs"
)
public class AIController {

    private static final double MIN_CONFIDENCE_TO_EXECUTE = 0.5;

    private final AIAnalyticsService aiAnalyticsService;
    private final CapabilityRegistry capabilityRegistry;
    private final AIExplanationService explanationService;
    private final AICacheService aiCacheService;

    public AIController(
            AIAnalyticsService aiAnalyticsService,
            CapabilityRegistry capabilityRegistry,
            AIExplanationService explanationService,
            AICacheService aiCacheService
    ) {
        this.aiAnalyticsService = aiAnalyticsService;
        this.capabilityRegistry = capabilityRegistry;
        this.explanationService = explanationService;
        this.aiCacheService = aiCacheService;
    }

    @PostMapping("/ask")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Ask AI business analytics question",
            description = """
                    Accepts natural language business questions and returns structured insights backed by deterministic database verification.

                    **Example Questions**:
                    - *Who are my biggest buyers?*
                    - *Which products are selling the most?*
                    - *Which products need restocking?*
                    - *Show monthly revenue trend?*
                    - *Which payments failed?*
                    - *Show delayed shipments.*
                    """
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "AI business explanation with verified SQL data evidence",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AIExplanationResponse.class),
                            examples = @ExampleObject(
                                    value = """
                                    {
                                      "answer": "Top customers contributed ₹264,997 in total spending.",
                                      "reason": "Customer Vibhor Sharma is the highest contributor with 12 completed high-value orders.",
                                      "observations": [
                                        "Top 5 customers account for 89% of overall spending",
                                        "Average customer order value is ₹22,083"
                                      ],
                                      "recommendations": [
                                        "Create a dedicated VIP concierge tier for top spenders",
                                        "Offer personalized renewal discounts"
                                      ],
                                      "evidence": {
                                        "entity": "CUSTOMER",
                                        "operation": "TOP_CUSTOMERS",
                                        "recordCount": 5
                                      }
                                    }
                                    """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or empty question request",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ValidationErrorResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized: Missing or invalid JWT Bearer token",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = "{\"timestamp\":\"2026-08-18T22:30:00\",\"status\":401,\"message\":\"Unauthorized: Full authentication is required to access this resource\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "Unprocessable Entity: Unable to process AI response or parse query intent",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class),
                            examples = @ExampleObject(
                                    value = "{\"timestamp\":\"2026-08-18T22:30:00\",\"status\":422,\"message\":\"Unable to process AI response\"}"
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal Server Error / Analytics Database Failure",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)
                    )
            )
    })
    public AIExplanationResponse askQuestion(
            @Valid @RequestBody AIQuestionRequest request
    ) {
        // Check AI response cache first (manual StringRedisTemplate — avoids Jackson type-info issues)
        String cacheKey = normalizeQuestion(request.getQuestion());
        if (!cacheKey.isBlank()) {
            AIExplanationResponse cached = aiCacheService.get(cacheKey);
            if (cached != null) {
                return cached;
            }
        }

        AnalyticsIntent intent =
                aiAnalyticsService
                        .understandQuestion(
                                request.getQuestion()
                        );



        double confidence =
                intent.getConfidence() == null
                        ? 0.0
                        : intent.getConfidence();



        if(
                confidence < MIN_CONFIDENCE_TO_EXECUTE
                        ||
                        "UNKNOWN".equalsIgnoreCase(
                                intent.getEntity()
                        )
        ) {


            return unsupportedResponse(
                    "I'm not confident I understood that as a business analytics question. "
                            +
                            "Could you rephrase it around one of these areas?"
            );

        }




        Optional<AnalyticsCapability> capability =
                capabilityRegistry.resolve(intent);



        if(capability.isEmpty()) {


            return unsupportedResponse(
                    "I can't answer questions about \""
                            +
                            intent.getEntity()
                            +
                            "\" yet."
            );

        }




        ValidationResult validation =
                capability
                        .get()
                        .validate(intent);



        if(!validation.isValid()) {


            return unsupportedResponse(
                    validation.getMessage()
            );

        }




        AnalyticsResult analyticsResult =
                capability
                        .get()
                        .execute(intent);



        AIExplanationResponse response = explanationService
                .generateExplanation(
                        request.getQuestion(),
                        analyticsResult
                );

        // Store in cache for future identical questions
        if (response != null && !cacheKey.isBlank()) {
            aiCacheService.put(cacheKey, response);
        }

        return response;

    }






    @GetMapping("/capabilities")
    @Operation(
            summary = "Get all supported AI analytics capabilities",
            description = "Returns the dynamic manifest of all registered analytics business domains and their supported operations"
    )
    public java.util.List<java.util.Map<String, Object>> getCapabilities() {
        return capabilityRegistry.generateCapabilityManifest();
    }



    /**
     * Normalizes a question for Redis cache keying.
     * Strips punctuation, lowercases, and collapses whitespace so that
     * near-identical questions ("How many orders?" / "how many orders")
     * hit the same cache entry.
     */
    public static String normalizeQuestion(String question) {
        if (question == null) return "";
        return question.toLowerCase()
                .replaceAll("[^a-z0-9\s]", "")
                .replaceAll("\s+", " ")
                .trim();
    }

    private AIExplanationResponse unsupportedResponse(
            String reason
    ) {


        return new AIExplanationResponse(

                "I can't fully answer that yet.",

                reason,

                Collections.singletonList(
                        "Supported topics right now: "
                                +
                                capabilityRegistry
                                        .supportedEntities()
                ),

                Collections.emptyList(),

                null
        );

    }





    @GetMapping("/health")
    @Operation(
            summary = "Check AI analytics service health",
            description = "Returns the current running status of the AI Analytics backend"
    )
    public String health() {


        return "AI Analytics Platform Running";

    }

}