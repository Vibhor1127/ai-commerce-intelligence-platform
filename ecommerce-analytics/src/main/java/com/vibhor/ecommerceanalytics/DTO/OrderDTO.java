package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Integer orderId;
    private LocalDateTime orderDate;
    private String status;
    private Double totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private List<OrderItemDTO> items;
    private AddressDTO shippingAddress;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDTO {
        private Integer productId;
        private String productName;
        private Integer quantity;
        private Double price;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AddressDTO {
        private Integer addressId;
        private String line1;
        private String line2;
        private String city;
        private String state;
        private String pincode;
        private String phone;
    }
}
