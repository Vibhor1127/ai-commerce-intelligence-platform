package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class TopProductsDTO {
    private Integer productId;
    private String productName;
    private  Integer Quantity;
    private BigDecimal Revenue;
}
