package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@ToString
@NoArgsConstructor
@Getter
@Setter
@Schema(description = "Standard error response payload")
public class ErrorResponse {

    @Schema(description = "Timestamp when the error occurred", example = "2026-08-18T22:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Descriptive error message", example = "Invalid request or capability unsupported")
    private String message;
}
