package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileDTO {
    private Integer customerId;
    private String firstName;
    private String lastName;
    private String email;
    private String city;
    private LocalDate signupDate;
}
