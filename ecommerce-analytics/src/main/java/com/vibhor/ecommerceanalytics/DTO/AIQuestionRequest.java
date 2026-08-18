package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Natural language business question payload")
public class AIQuestionRequest {

    @NotBlank(message = "Question cannot be blank")
    @Schema(description = "Business analytics question in plain English", example = "Who are our top customers by spending?")
    private String question;
}