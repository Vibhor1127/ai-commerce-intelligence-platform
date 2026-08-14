package com.vibhor.ecommerceanalytics.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsIntent {


    private String intent;


    private String entity;


    private String metric;


    private Integer limit;


}