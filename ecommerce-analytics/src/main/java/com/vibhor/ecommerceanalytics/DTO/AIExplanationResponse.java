package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.util.List;
@ToString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AIExplanationResponse {


    private String answer;

    private String reason;

    private List<String> observations;

    private List<String> recommendations;

    private Object evidence;

}