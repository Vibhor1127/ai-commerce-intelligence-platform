package com.vibhor.ecommerceanalytics.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibhor.ecommerceanalytics.DTO.AIExplanationResponse;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;



@Service
public class AIExplanationService {


    private final ChatClient chatClient;

    private final ObjectMapper objectMapper;


    public AIExplanationService(ChatClient.Builder builder) {

        this.chatClient = builder.build();

        this.objectMapper = new ObjectMapper();

        this.objectMapper.registerModule(
                new JavaTimeModule()
        );

    }





    public AIExplanationResponse generateExplanation(
            String question,
            Object analyticsData) {


        try {


            /*
             * Convert Java Object into JSON
             *
             * Before:
             * BusinessInsightData@3413f9
             *
             * After:
             * {
             *   analyticsData:[],
             *   primaryMetric:"",
             *   observation:""
             * }
             */

            String jsonData =
                    objectMapper.writeValueAsString(
                            analyticsData
                    );



            String aiResponse =
                    chatClient
                            .prompt("""

                            You are a senior Business Intelligence Analyst
                            for an e-commerce analytics platform.

                            Analyze ONLY the verified analytics data.

                            Return ONLY valid JSON.

                            Do not use markdown.
                            Do not add ```json.
                            
                            Response format:

                            {
                              "answer":"",
                              "reason":"",
                              "observations":[],
                              "recommendations":[]
                            }


                            Rules:

                            - Use only provided data.
                            - Do not invent numbers.
                            - Do not create unsupported facts.
                            - Explain business impact.
                            - Recommendations should be practical
                              business actions.


                            User Question:

                            %s


                            Verified Analytics Data:

                            %s


                            """.formatted(
                                    question,
                                    jsonData
                            ))
                            .call()
                            .content();



            /*
             * Remove accidental markdown
             */

            String cleanedResponse =
                    aiResponse
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();




            AIExplanationResponse response =
                    objectMapper.readValue(
                            cleanedResponse,
                            AIExplanationResponse.class
                    );



            /*
             * Attach original database evidence
             */

            return new AIExplanationResponse(

                    response.getAnswer(),

                    response.getReason(),

                    response.getObservations(),

                    response.getRecommendations(),

                    analyticsData
            );



        }
        catch(Exception e) {


            throw new RuntimeException(
                    "AI explanation generation failed: "
                            + e.getMessage(),
                    e
            );

        }

    }

}