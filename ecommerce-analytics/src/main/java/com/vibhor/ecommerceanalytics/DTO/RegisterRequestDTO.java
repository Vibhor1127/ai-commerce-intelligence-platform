package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User registration payload")
public class RegisterRequestDTO {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Schema(description = "Unique username for the account", example = "vibhor_shops")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    @Schema(description = "Account password (min 6 characters)", example = "SecurePass123!")
    private String password;

    @Schema(description = "User authorization role (USER, ADMIN, ANALYST)", example = "USER", defaultValue = "USER")
    private String role;

    @Schema(description = "Customer first name (required if role is USER)", example = "Vibhor")
    private String firstName;

    @Schema(description = "Customer last name (required if role is USER)", example = "Srivastava")
    private String lastName;

    @Email(message = "Please enter a valid email address.")
    @Schema(description = "Customer email (required if role is USER)", example = "vibhor@gmail.com")
    private String email;

    @Schema(description = "Customer city (required if role is USER)", example = "Lucknow")
    private String city;
}
