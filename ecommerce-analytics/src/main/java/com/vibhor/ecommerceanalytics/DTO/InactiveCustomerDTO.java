package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InactiveCustomerDTO {

    private Integer customerId;
    private String customerName;
    private LocalDateTime lastOrderDate;
}