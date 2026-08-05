package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class categories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name")
    private String categoryName;

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    // One Category contains MANY Products.
    // Example:
    // Electronics
    //     -> Laptop
    //     -> Mouse
    //     -> Keyboard
    //
    // mappedBy = "Category" because the Product entity
    // contains:
    // private categories Category;
    @OneToMany(mappedBy = "Category")
    private List<products> products;
}