package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
@AllArgsConstructor
@ToString
@NoArgsConstructor
@Getter
@Setter
public class ValidationErrorResponse {
    private LocalDateTime timestamp;

    private int status;

    private Map<String,String> errors;
}
