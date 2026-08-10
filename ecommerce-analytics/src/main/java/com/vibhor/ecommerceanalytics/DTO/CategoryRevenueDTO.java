package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CategoryRevenueDTO {

    private Integer categoryId;
    private String categoryName;
    private BigDecimal revenue;
}