package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "status")
    private String status;

    @Column(name = "total_amount")
    private Double totalAmount;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // MANY Orders belong to ONE Customer.
    //
    // Example:
    // Vibhor
    //    -> Order 101
    //    -> Order 102
    //    -> Order 103
    //
    // Hibernate automatically manages customer_id.
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private customers customer;

    // ONE Order contains MANY OrderItems.
    //
    // Example:
    // Order 101
    //    -> Laptop
    //    -> Mouse
    //    -> Keyboard
    //
    // mappedBy refers to "order" object
    // inside orderItem.java
    @OneToMany(mappedBy = "order")
    private List<orderItem> OrderItems;

    // ONE Order has ONE Payment.
    //
    // Example:
    // Order 101
    //     -> Payment Success
    @OneToOne(mappedBy = "order")
    private payments payment;

    // ONE Order has ONE Shipment.
    //
    // Example:
    // Order 101
    //     -> Tracking ID
    @OneToOne(mappedBy = "order")
    private shipments shipment;
}