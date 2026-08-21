package com.vibhor.ecommerceanalytics.Service;

import com.vibhor.ecommerceanalytics.DTO.AuthResponseDTO;
import com.vibhor.ecommerceanalytics.DTO.LoginRequestDTO;
import com.vibhor.ecommerceanalytics.DTO.RegisterRequestDTO;
import com.vibhor.ecommerceanalytics.Entity.User;
import com.vibhor.ecommerceanalytics.Entity.customers;
import com.vibhor.ecommerceanalytics.Exception.UserAlreadyExistsException;
import com.vibhor.ecommerceanalytics.Repository.CustomerRepository;
import com.vibhor.ecommerceanalytics.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public String register(RegisterRequestDTO dto) {

        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException(
                    "Username '" + dto.getUsername() + "' is already registered");
        }

        User user = new User();
        user.setUsername(dto.getUsername().trim());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        String requestedRole = dto.getRole();
        if (requestedRole != null && !requestedRole.isBlank()) {
            user.setRole(requestedRole.trim().toUpperCase());
        } else {
            user.setRole("USER");
        }

        user = userRepository.save(user);

        if ("USER".equals(user.getRole())) {
            requireNonBlank(dto.getFirstName(), "First name is required for a customer account.");
            requireNonBlank(dto.getEmail(), "Email is required for a customer account.");
            requireNonBlank(dto.getCity(), "City is required for a customer account.");

            customers customer = new customers();
            customer.setUserId(user.getUserId());
            customer.setFirstName(dto.getFirstName().trim());
            customer.setLastName(dto.getLastName() == null ? null : dto.getLastName().trim());
            customer.setEmail(dto.getEmail().trim());
            customer.setCity(dto.getCity().trim());
            customer.setSignupDate(LocalDate.now());
            customerRepository.save(customer);
        }

        return "User registered successfully";
    }

    private void requireNonBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                )
        );

        User user = userRepository
                .findByUsername(dto.getUsername())
                .orElseThrow();

        String token = jwtService.generateToken(user);
        return new AuthResponseDTO(token, user.getUsername(), user.getRole());
    }
}
