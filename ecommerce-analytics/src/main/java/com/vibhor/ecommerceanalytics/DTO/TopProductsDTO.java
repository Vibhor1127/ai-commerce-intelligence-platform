package com.vibhor.ecommerceanalytics.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TopProductsDTO {

    private Integer productId;
    private String productName;

    @JsonProperty("quantity")
    private BigDecimal Quantity;

    @JsonProperty("revenue")
    private BigDecimal Revenue;

    @JsonProperty("Quantity")
    public BigDecimal getRawQuantity() {
        return this.Quantity;
    }

    @JsonProperty("Revenue")
    public BigDecimal getRawRevenue() {
        return this.Revenue;
    }
}