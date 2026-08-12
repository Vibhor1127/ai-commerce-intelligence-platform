package com.vibhor.ecommerceanalytics.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIAnalyticsRequest {

    private String metric;
    private String dimension;
    private String operation;
    private String period;
    private Integer limit;
}