package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@ToString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "AI-generated business explanation response with verified evidence")
public class AIExplanationResponse {

    @Schema(description = "Direct answer to the business question", example = "The top customer is Vibhor Sharma who contributed ₹264,997 in total spending.")
    private String answer;

    @Schema(description = "Detailed analytical rationale behind the answer", example = "Vibhor Sharma placed 12 high-value orders in electronics and gadgets, representing 89% of overall top-tier revenue.")
    private String reason;

    @Schema(description = "Key empirical observations extracted from verified data", example = "[\"Total top customer spending is ₹297,994 across 5 customers\", \"Repeat purchase interval averages 14 days\"]")
    private List<String> observations;

    @Schema(description = "Actionable strategic business recommendations", example = "[\"Enroll top 5 spenders into an exclusive VIP loyalty tier\", \"Target them with early access to upcoming product launches\"]")
    private List<String> recommendations;

    @Schema(description = "Raw deterministic SQL query result data used as proof")
    private Object evidence;
}