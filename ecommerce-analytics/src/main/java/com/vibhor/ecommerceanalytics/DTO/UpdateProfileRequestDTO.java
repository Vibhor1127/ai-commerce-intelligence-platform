package com.vibhor.ecommerceanalytics.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDTO {

    @NotBlank
    @Size(min = 2, max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @NotBlank
    private String city;
}
