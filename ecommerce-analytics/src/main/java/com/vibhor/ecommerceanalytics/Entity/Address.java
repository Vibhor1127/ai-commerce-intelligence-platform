package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private customers customer;

    @Column(name = "line1")
    @NotBlank(message = "Address line 1 is required.")
    private String line1;

    @Column(name = "line2")
    private String line2;

    @Column(name = "city")
    @NotBlank
    private String city;

    @Column(name = "state")
    @NotBlank
    private String state;

    @Column(name = "pincode")
    @NotBlank
    private String pincode;

    @Column(name = "phone")
    @NotBlank(message = "A contact phone number is required for delivery.")
    private String phone;

    @Column(name = "is_default")
    private Boolean isDefault = false;
}
