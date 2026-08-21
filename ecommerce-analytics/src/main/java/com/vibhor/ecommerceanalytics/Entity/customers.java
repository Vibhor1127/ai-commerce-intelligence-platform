package com.vibhor.ecommerceanalytics.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class customers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "user_id", unique = true)
    private Integer userId;

    @Column(name = "first_name")
    @NotBlank(message = "First Name is required.")
    @Size(min = 2, max = 50,
            message = "First Name should be between 2 and 50 characters.")
    private String firstName;

    @Column(name = "last_name")
    @Size(max = 50)
    private String lastName;

    @Column(name = "email", unique = true)
    @NotBlank
    @Email(message = "Please enter a valid email address.")
    private String email;

    @Column(name = "city")
    @NotBlank
    private String city;

    @Column(name = "signup_date")
    @PastOrPresent
    private LocalDate signupDate;

    @OneToMany(mappedBy = "customer")
    private List<orders> orders;

    @OneToMany(mappedBy = "customer")
    private List<reviews> reviews;

    @OneToMany(mappedBy = "customer")
    private List<Address> addresses;
}
