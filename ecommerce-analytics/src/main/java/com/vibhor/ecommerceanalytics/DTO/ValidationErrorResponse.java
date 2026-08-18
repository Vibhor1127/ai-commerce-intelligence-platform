package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@AllArgsConstructor
@ToString
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "Validation failure response containing field-level error messages")
public class ValidationErrorResponse {

    @Schema(description = "Timestamp when the validation error occurred", example = "2026-08-18T22:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Map of invalid fields to their respective constraint violation messages", example = "{\"username\":\"Username cannot be blank\",\"password\":\"Password must be at least 6 characters\"}")
    private Map<String, String> errors;
}
