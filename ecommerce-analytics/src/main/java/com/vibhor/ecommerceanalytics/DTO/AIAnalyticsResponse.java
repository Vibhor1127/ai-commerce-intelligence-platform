package com.vibhor.ecommerceanalytics.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AIAnalyticsResponse {

    private String answer;
    private String reason;
    private Object evidence;
}