package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCardDTO {
    private Integer productId;
    private String productName;
    private Double price;
    private Integer stock;
    private Integer categoryId;
    private String categoryName;
    private String imageUrl;
    private Double avgRating;
    private Long reviewCount;
}
