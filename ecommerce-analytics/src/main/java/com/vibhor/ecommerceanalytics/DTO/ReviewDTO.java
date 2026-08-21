package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Integer reviewId;
    private Integer productId;
    private String productName;
    private Integer customerId;
    private String customerName;
    private Integer rating;
    private String reviewText;
    private LocalDate reviewDate;
}
