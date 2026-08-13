package com.vibhor.ecommerceanalytics.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@AllArgsConstructor
public class BusinessInsightData {

    private Object analyticsData;

    private String primaryMetric;

    private String observation;

}