package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.*;
import com.vibhor.ecommerceanalytics.Service.StoreAddressService;
import com.vibhor.ecommerceanalytics.Service.StoreCustomerService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@Tag(name = "Store Profile & Addresses", description = "Current shopper profile and saved addresses")
@SecurityRequirement(name = "Bearer Authentication")
public class StoreProfileController {

    private final StoreCustomerService storeCustomerService;
    private final StoreAddressService storeAddressService;

    public StoreProfileController(StoreCustomerService storeCustomerService, StoreAddressService storeAddressService) {
        this.storeCustomerService = storeCustomerService;
        this.storeAddressService = storeAddressService;
    }

    // ============================================================
    // Profile
    // ============================================================

    @GetMapping("/me")
    public CustomerProfileDTO me() {
        return storeCustomerService.getProfile();
    }

    @PatchMapping("/me")
    public CustomerProfileDTO updateMe(@Valid @RequestBody UpdateProfileRequestDTO dto) {
        return storeCustomerService.updateProfile(dto);
    }

    // ============================================================
    // Addresses
    // ============================================================

    @GetMapping("/addresses")
    public List<AddressResponseDTO> listAddresses() {
        return storeAddressService.listAddresses();
    }

    @PostMapping("/addresses")
    public AddressResponseDTO addAddress(@Valid @RequestBody AddressRequestDTO request) {
        return storeAddressService.addAddress(request);
    }

    @PatchMapping("/addresses/{id}")
    public AddressResponseDTO updateAddress(
            @PathVariable Integer id,
            @Valid @RequestBody AddressRequestDTO request
    ) {
        return storeAddressService.updateAddress(id, request);
    }

    @DeleteMapping("/addresses/{id}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void deleteAddress(@PathVariable Integer id) {
        storeAddressService.deleteAddress(id);
    }

    @PatchMapping("/addresses/{id}/default")
    public void setDefaultAddress(@PathVariable Integer id) {
        storeAddressService.setDefault(id);
    }
}
