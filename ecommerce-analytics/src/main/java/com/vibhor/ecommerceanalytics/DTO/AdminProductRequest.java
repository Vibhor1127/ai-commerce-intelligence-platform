package com.vibhor.ecommerceanalytics.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductRequest {

    @NotBlank
    private String productName;

    @NotNull
    @Positive
    private Double price;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotNull
    private Integer categoryId;

    private String imageUrl;
}
