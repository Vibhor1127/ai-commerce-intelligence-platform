package com.vibhor.ecommerceanalytics.DTO;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@ToString
@NoArgsConstructor
@Getter
@Setter
public class ErrorResponse {
    private LocalDateTime timestamp;
    private  int status;
    private  String message;
}
