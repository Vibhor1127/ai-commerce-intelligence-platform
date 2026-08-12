package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.AIAnalyticsRequest;
import com.vibhor.ecommerceanalytics.Service.AIAnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIAnalyticsService aiAnalyticsService;

    public AIController(AIAnalyticsService aiAnalyticsService) {
        this.aiAnalyticsService = aiAnalyticsService;
    }

    @PostMapping("/ask")
    public AIAnalyticsRequest askQuestion(
            @RequestBody com.vibhor.ecommerceanalytics.DTO.AIQuestionRequest request) {

        return aiAnalyticsService.understandQuestion(
                request.getQuestion()
        );
    }
}