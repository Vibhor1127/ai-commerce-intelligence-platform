package com.vibhor.ecommerceanalytics.Controller;

import com.vibhor.ecommerceanalytics.DTO.AuthResponseDTO;
import com.vibhor.ecommerceanalytics.DTO.LoginRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.RegisterRequestDTO;
import com.vibhor.ecommerceanalytics.Service.AuthenticationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;


    // Register user
    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequestDTO dto) {

        return authenticationService.register(dto);
    }


    // Login user and receive JWT
    @PostMapping("/login")
    public AuthResponseDTO login(
            @RequestBody LoginRequestDTO dto) {

        return authenticationService.login(dto);
    }
}