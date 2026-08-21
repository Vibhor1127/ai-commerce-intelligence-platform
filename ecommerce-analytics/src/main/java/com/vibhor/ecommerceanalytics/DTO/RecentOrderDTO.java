package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Used both as an interface projection for analytics native queries
 * AND as a concrete DTO for admin order listing.
 * Spring Data maps native query columns by alias name to these properties.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentOrderDTO {
    private Integer orderId;
    private Integer customerId;
    private String customerName;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;
}
