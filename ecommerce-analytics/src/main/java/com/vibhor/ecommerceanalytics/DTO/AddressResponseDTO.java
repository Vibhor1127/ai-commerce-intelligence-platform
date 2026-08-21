package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Address response")
public class AddressResponseDTO {

    @Schema(description = "Address ID")
    private Integer addressId;

    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private String phone;

    @Schema(description = "Whether this is the default delivery address")
    private Boolean isDefault;
}
