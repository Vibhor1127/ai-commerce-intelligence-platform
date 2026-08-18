package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Customer creation and update request payload")
public class CustomerRequestDTO {

    @NotBlank(message = "First name is mandatory")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Schema(description = "Customer's first name", example = "John")
    private String firstName;

    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    @Schema(description = "Customer's last name", example = "Doe")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email must be valid")
    @Schema(description = "Customer's unique email address", example = "john.doe@example.com")
    private String email;

    @NotBlank(message = "City is mandatory")
    @Schema(description = "Customer's residence city", example = "New York")
    private String city;

    @PastOrPresent(message = "Signup date cannot be in the future")
    @Schema(description = "Customer signup date (YYYY-MM-DD)", example = "2024-01-15")
    private LocalDate signupDate;
}
