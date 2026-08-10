package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MonthlyRevenueDTO {

    private Integer year;
    private Integer month;
    private BigDecimal revenue;
}