package com.vibhor.ecommerceanalytics.Controller;


import com.vibhor.ecommerceanalytics.Service.Handler.AnalyticsCapability;
import com.vibhor.ecommerceanalytics.Service.Handler.CapabilityRegistry;
import com.vibhor.ecommerceanalytics.Service.Handler.ValidationResult;

import com.vibhor.ecommerceanalytics.DTO.AIExplanationResponse;
import com.vibhor.ecommerceanalytics.DTO.AIQuestionRequest;
import com.vibhor.ecommerceanalytics.DTO.AnalyticsIntent;

import com.vibhor.ecommerceanalytics.Service.AIAnalyticsService;
import com.vibhor.ecommerceanalytics.Service.AIExplanationService;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


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




    public AIController(
            AIAnalyticsService aiAnalyticsService,
            CapabilityRegistry capabilityRegistry,
            AIExplanationService explanationService
    ) {

        this.aiAnalyticsService = aiAnalyticsService;

        this.capabilityRegistry = capabilityRegistry;

        this.explanationService = explanationService;

    }





    @PostMapping("/ask")
    @Operation(
            summary = "Ask AI business analytics question",
            description = """
                    Accepts natural language business questions.

                    Example questions:

                    - Who are my biggest buyers?
                    - Which products are selling the most?
                    - Which products need restocking?
                    - Show monthly revenue trend?


                    Processing pipeline:

                    User Question
                    ->
                    LLM Intent Classification
                    ->
                    Capability Registry
                    ->
                    SQL Analytics
                    ->
                    AI Generated Business Explanation
                    """
    )
    public AIExplanationResponse askQuestion(
            @RequestBody AIQuestionRequest request
    ) {


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




        Object analyticsData =
                capability
                        .get()
                        .execute(intent);



        return explanationService
                .generateExplanation(
                        request.getQuestion(),
                        analyticsData
                );

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