package com.vibhor.ecommerceanalytics.DTO;

import com.vibhor.ecommerceanalytics.Entity.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Order status update payload")
public class OrderStatusUpdateRequest {

    @NotNull(message = "newStatus is required")
    @Schema(description = "Target order status", example = "PROCESSING")
    private OrderStatus newStatus;

    @Schema(description = "Optional note about this status change", example = "Shipped via FedEx")
    private String note;
}
