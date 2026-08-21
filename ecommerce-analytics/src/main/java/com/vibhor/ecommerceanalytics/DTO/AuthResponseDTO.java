package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing JWT token and role")
public class AuthResponseDTO {

    @Schema(description = "Signed JSON Web Token (Bearer token)")
    private String token;

    @Schema(description = "Authenticated username")
    private String username;

    @Schema(description = "Authorization role: USER, ADMIN, or ANALYST")
    private String role;
}
