package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Order status transition history entry")
public class OrderStatusHistoryDTO {

    @Schema(description = "History record ID")
    private Integer historyId;

    @Schema(description = "Order ID this transition belongs to")
    private Integer orderId;

    @Schema(description = "Previous status (null if first status assignment)")
    private String fromStatus;

    @Schema(description = "New status after transition")
    private String toStatus;

    @Schema(description = "Username or system component that triggered the change")
    private String changedBy;

    @Schema(description = "Optional note about the transition")
    private String note;

    @Schema(description = "Timestamp of the transition")
    private LocalDateTime changedAt;
}
