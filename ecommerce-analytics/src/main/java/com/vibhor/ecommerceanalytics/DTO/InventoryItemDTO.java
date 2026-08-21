package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItemDTO {
    private Integer productId;
    private String productName;
    private Integer categoryId;
    private String categoryName;
    private Double price;
    private Integer stock;
    private boolean lowStock;
    private LocalDateTime lastRestockDate;
}
