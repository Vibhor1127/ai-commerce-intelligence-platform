package com.vibhor.ecommerceanalytics.DTO;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomerResponseDTO {
    private String first_name;
    private String last_name;
    private String email;
    private String city;
}
