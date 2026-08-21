package com.vibhor.ecommerceanalytics.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAdjustRequest {

    /** Absolute new stock level (not a delta). */
    @NotNull
    @Min(0)
    private Integer stock;

    private String reason;
}
