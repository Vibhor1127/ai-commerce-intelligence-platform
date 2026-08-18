package com.vibhor.ecommerceanalytics.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(description = "Customer details response")
public class CustomerResponseDTO {

    @Schema(description = "Customer's first name", example = "John")
    private String first_name;

    @Schema(description = "Customer's last name", example = "Doe")
    private String last_name;

    @Schema(description = "Customer's email address", example = "john.doe@example.com")
    private String email;

    @Schema(description = "Customer's city", example = "New York")
    private String city;
}
