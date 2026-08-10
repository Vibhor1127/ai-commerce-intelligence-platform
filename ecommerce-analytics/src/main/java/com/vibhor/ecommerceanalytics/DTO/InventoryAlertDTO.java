package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InventoryAlertDTO {

    private Integer productId;
    private String productName;
    private Integer stock;
}