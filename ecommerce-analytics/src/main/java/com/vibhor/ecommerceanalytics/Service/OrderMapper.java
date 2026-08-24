package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.OrderDTO;
import com.vibhor.ecommerceanalytics.Entity.*;

import java.util.List;
import java.util.stream.Collectors;

public final class OrderMapper {

    private OrderMapper() {}

    public static OrderDTO toDto(orders order, List<orderItem> items, payments payment, Address shipping) {
        return OrderDTO.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus() == null ? null : order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(payment == null ? null : payment.getPaymentStatus())
                .paymentMethod(payment == null ? null : payment.getPaymentMethod())
                .items(items == null ? List.of() : items.stream().map(oi ->
                        OrderDTO.OrderItemDTO.builder()
                                .productId(oi.getProduct() == null ? null : oi.getProduct().getProductId())
                                .productName(oi.getProduct() == null ? "Product" : oi.getProduct().getProductName())
                                .quantity(oi.getQuantity())
                                .price(oi.getPrice())
                                .build()
                ).collect(Collectors.toList()))
                .shippingAddress(shipping == null ? null : OrderDTO.AddressDTO.builder()
                        .addressId(shipping.getAddressId())
                        .line1(shipping.getLine1())
                        .line2(shipping.getLine2())
                        .city(shipping.getCity())
                        .state(shipping.getState())
                        .pincode(shipping.getPincode())
                        .phone(shipping.getPhone())
                        .build())
                .build();
    }

    public static OrderDTO toDto(orders order) {
        List<orderItem> items;
        try {
            items = order.getOrderItems() == null ? List.of() : order.getOrderItems();
        } catch (Exception e) {
            items = List.of();
        }

        payments payment = null;
        try {
            payment = order.getPayment();
        } catch (Exception ignored) {}

        Address shipping = null;
        try {
            shipping = order.getShippingAddress();
        } catch (Exception ignored) {}

        return toDto(order, items, payment, shipping);
    }
}
