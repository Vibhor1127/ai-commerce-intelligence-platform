package com.vibhor.ecommerceanalytics.DTO;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;


@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsIntent {


    private String entity;


    private String metric;


    private String operation;


    private Map<String,String> filters;


    private String timeframe;


    private Double confidence;

}