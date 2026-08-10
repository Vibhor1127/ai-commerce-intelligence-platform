package com.vibhor.ecommerceanalytics.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    private String username;
    private String password;
    private String role;
}