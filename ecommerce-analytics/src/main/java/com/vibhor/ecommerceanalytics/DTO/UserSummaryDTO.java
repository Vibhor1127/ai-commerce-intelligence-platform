package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Admin user summary for user management")
public class UserSummaryDTO {
    @Schema(description = "User ID")
    private Integer userId;

    @Schema(description = "Username")
    private String username;

    @Schema(description = "User role: USER, ADMIN, or ANALYST")
    private String role;

    @Schema(description = "Whether this user has a linked customer profile")
    private boolean linkedCustomer;

    @Schema(description = "Customer email if linked, null otherwise")
    private String customerEmail;
}
