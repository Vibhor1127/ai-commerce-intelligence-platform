package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "review_text")
    private String reviewText;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // MANY Reviews belong to ONE Customer.
    //
    // Example:
    //
    // Vibhor
    //     ↓
    // Review 1
    // Review 2
    //
    // Foreign Key -> customer_id
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private customers customer;

    // MANY Reviews belong to ONE Product.
    //
    // Example:
    //
    // Laptop
    //     ↓
    // ⭐⭐⭐⭐⭐
    // ⭐⭐⭐⭐
    // ⭐⭐⭐
    //
    // Foreign Key -> product_id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private products product;
}