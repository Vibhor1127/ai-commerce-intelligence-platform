package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TopCustomerDTO {
    private Integer customerId;

    private String customerName;

    private BigDecimal totalSpending;
}
