package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing JWT token")
public class AuthResponseDTO {

    @Schema(description = "Signed JSON Web Token (Bearer token)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYy...")
    private String token;
}