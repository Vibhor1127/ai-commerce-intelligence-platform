package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class inventoryLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Integer logId;

    @Column(name = "stock_before")
    private Integer stockBefore;

    @Column(name = "stock_after")
    private Integer stockAfter;

    @Column(name = "change_type")
    private String changeType;

    @Column(name = "change_date")
    private LocalDateTime changeDate;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // MANY Inventory Logs belong to ONE Product.
    //
    // Example:
    //
    // Laptop
    //     ↓
    // Stock Added
    // Stock Reduced
    // Stock Returned
    //
    // Every stock movement is stored as a separate log.
    //
    // Foreign Key -> product_id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private products product;
}