package com.vibhor.ecommerceanalytics.Controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final ChatClient chatClient;

    public AIController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // Simple test to check AI connection
    @GetMapping("/test")
    public ResponseEntity<String> testAI() {

        try {
            String response = chatClient
                    .prompt("Reply with exactly: NVIDIA connection successful.")
                    .call()
                    .content();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("AI call failed: " + e.getMessage());
        }
    }
}