package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class payments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "payment_status")
    private String paymentStatus;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // ONE Payment belongs to ONE Order.
    //
    // Example:
    //
    // Order 101
    //      ↓
    // Payment Success
    //
    // order_id is the foreign key.
    @OneToOne
    @JoinColumn(name = "order_id")
    private orders order;
}