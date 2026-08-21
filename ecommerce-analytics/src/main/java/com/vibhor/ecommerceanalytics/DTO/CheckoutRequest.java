package com.vibhor.ecommerceanalytics.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {

    /** CARD, UPI, or COD — simulated gateway, not a real processor. */
    @NotBlank
    private String paymentMethod;

    /** Existing saved address id, or null to use inline address fields. */
    private Integer addressId;

    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private String phone;
}
