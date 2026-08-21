package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Address create/update payload")
public class AddressRequestDTO {

    @NotBlank(message = "Address line 1 is required")
    @Schema(description = "Street address", example = "123 Main Street")
    private String line1;

    @Schema(description = "Apartment/floor/landmark (optional)", example = "Apt 4B")
    private String line2;

    @NotBlank(message = "City is required")
    @Schema(description = "City", example = "Mumbai")
    private String city;

    @NotBlank(message = "State is required")
    @Schema(description = "State", example = "Maharashtra")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Schema(description = "Postal code", example = "400001")
    private String pincode;

    @NotBlank(message = "Phone is required")
    @Schema(description = "Contact phone for delivery", example = "+91 98765 43210")
    private String phone;
}
