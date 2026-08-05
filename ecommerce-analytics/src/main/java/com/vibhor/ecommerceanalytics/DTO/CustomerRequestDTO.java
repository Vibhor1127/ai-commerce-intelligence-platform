package com.vibhor.ecommerceanalytics.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor
@ToString
public class CustomerRequestDTO {


    @NotBlank
    @Size(min = 2, max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String city;

    @PastOrPresent
    private LocalDate signupDate;

}
