package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User credentials for authentication")
public class LoginRequestDTO {

    @NotBlank(message = "Username cannot be blank")
    @Schema(description = "Registered username", example = "analytics_admin")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Schema(description = "Account password", example = "SecurePass123!")
    private String password;
}