package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomerLifetimeValueDTO {

    private Integer customerId;
    private String customerName;
    private BigDecimal lifetimeValue;
}