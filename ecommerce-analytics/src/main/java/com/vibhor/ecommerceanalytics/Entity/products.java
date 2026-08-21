package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price")
    private Double price;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // MANY Products belong to ONE Category.
    //
    // Product ------> Category
    //
    // The category_id foreign key is automatically managed
    // by Hibernate.
    @ManyToOne
    @JoinColumn(name = "category_id")
    private categories Category;

    // One Product can appear in MANY Order Items.
    //
    // Example:
    // Laptop
    //   -> Order 101
    //   -> Order 108
    //   -> Order 205
    //
    // mappedBy = "product"
    // because orderItem.java contains:
    // private products product;
    @OneToMany(mappedBy = "product")
    private List<orderItem> OrderItems;

    // One Product can receive MANY Reviews.
    //
    // Example:
    // Laptop
    //   -> Review 1
    //   -> Review 2
    //   -> Review 3
    @OneToMany(mappedBy = "product")
    private List<reviews> Reviews;

    // One Product can generate MANY Inventory Logs.
    //
    // Example:
    // Stock Added
    // Stock Reduced
    // Stock Returned
    @OneToMany(mappedBy = "product")
    private List<inventoryLogs> InventoryLogs;
}