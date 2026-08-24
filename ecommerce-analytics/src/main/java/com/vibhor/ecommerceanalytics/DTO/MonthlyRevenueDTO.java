package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class MonthlyRevenueDTO {

    private Integer year;
    private Integer month;
    private BigDecimal revenue;

    public MonthlyRevenueDTO(Integer year, Integer month, BigDecimal revenue) {
        this.year = year;
        this.month = month;
        this.revenue = revenue;
    }

    public MonthlyRevenueDTO(Number year, Number month, Number revenue) {
        this.year = year != null ? year.intValue() : null;
        this.month = month != null ? month.intValue() : null;
        this.revenue = revenue != null ? (revenue instanceof BigDecimal bd ? bd : BigDecimal.valueOf(revenue.doubleValue())) : BigDecimal.ZERO;
    }
}