package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class shipments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipment_id")
    private Integer shipmentId;

    @Column(name = "shipment_status")
    private String shipmentStatus;

    @Column(name = "shipment_date")
    private java.time.LocalDateTime shipmentDate;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // ONE Shipment belongs to ONE Order.
    //
    // Example:
    //
    // Order 101
    //      ↓
    // Tracking ID
    //      ↓
    // Delivered
    //
    // order_id is the foreign key.
    @OneToOne
    @JoinColumn(name = "order_id")
    private orders order;
}