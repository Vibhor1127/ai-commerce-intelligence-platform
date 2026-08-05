package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class orderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Double price;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // MANY OrderItems belong to ONE Order.
    //
    // Example:
    //
    // Order 101
    //      |
    //      +---- Laptop
    //      +---- Mouse
    //      +---- Keyboard
    //
    // Foreign Key -> order_id
    @ManyToOne
    @JoinColumn(name = "order_id")
    private orders order;

    // MANY OrderItems refer to ONE Product.
    //
    // Example:
    //
    // Laptop
    //     -> Order 101
    //     -> Order 105
    //     -> Order 109
    //
    // Foreign Key -> product_id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private products product;
}